var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var User = require('../../models/user.model').User;

var VerifyToken = require('../auth/VerifyToken');

router.route('/:id?')
    .get(VerifyToken, function(req, res, next) {
        if (req.params.id) {
            User.findById(req.params.id, function (err, user) {
                if (err) return res.status(500).send("There was a problem finding the user.");
                if (!user) return res.status(404).send("empty");
                res.status(200).send(user.getPublicFields());
            });
        } else {
            return res.status(404).send("empty");
        }
    })


module.exports = router;