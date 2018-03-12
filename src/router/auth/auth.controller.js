var async = require('async');
var express = require('express');
var router = express.Router();

var config = require('../../config/index.config');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var User = require('../../models/user.model').User;

var VerifyToken = require('./VerifyToken');
var AuthValidator = require('../../middleware/auth.validator')
var jwt = require('jsonwebtoken');



router.route('/login')
    .post(AuthValidator, function (req, res) {
        if (req.body.email && req.body.password){
            async.waterfall([
                function (callback) {
                    User.findOne({ email: req.body.email }).exec(callback);
                },
                function (user, callback) {
                    if (!user) {
                        user = new User({
                            email: req.body.email,
                            password: req.body.password
                        });
                        //сохраняем нового пользователя 
                        user.save(function (err, user, affected) {
                            callback(err, user);
                        });
                    } else {
                        if (user.checkPassword(req.body.password)) {
                            callback(null, user);
                        } else {
                            if (!req.errors) req.errors = [];
                            req.errors.push({
                                field: 'password',
                                message: 'Wrong email or password'
                            })
                            //ошибка пароль не верен
                            res.status(403).send(req.errors);
                        }
                    }
                }
                ],
                    function (err, user) {
                        if (err) {
                            return next(err);
                        }
            
                        var token = jwt.sign({ id: user._id }, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        res.status(200).json([{"token": token}]);
                    }
            );
        } else {
            if (!req.errors) req.errors = [];
            req.errors.push({
                field: 'password',
                message: 'Wrong email or password'
            })

            res.status(422).send(req.errors)
        }
});

router.route('/me')
    .get(VerifyToken, function(req, res, next) {
        User.findById(req.user_id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            res.status(200).send(user.getPublicFields());
        });
    })
    .patch(VerifyToken, function(req, res, next) {
        User.findById(req.user_id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");

            if (req.body.phone) user.phone = req.body.phone;
            if (req.body.name) user.name = req.body.name;
            if (req.body.email) user.email = req.body.email;
            
            user.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(403).send(err);
                } else {
                    console.log("User #" + user._id.toString() + " is updated!");
                    res.status(200)
                        .send(user.getPublicFields());
                }
            })
        });
    })

module.exports = router;