var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var upload = require('../../middleware/upload');

var Item = require('../../models/item.model').Item;
var User = require('../../models/user.model').User;

var VerifyToken = require('../auth/VerifyToken');




router.route('/item')
.get(VerifyToken, function (req, res, next) {
    var findConfig = { find: {}, sort: {by: 'created_at', type: -1} };
    var sortConfig = {}

    if (req.query.title) findConfig.find.title = { $regex: '(?i)' + req.query.title };
    if (req.query.user_id) findConfig.find.user_id = req.query.user_id;
    if (req.query.order_by === 'price') findConfig.sort.by = 'price'
    if (req.query.order_type === 'asc') findConfig.sort.type = 1

    sortConfig[findConfig.sort.by] = findConfig.sort.type;
    console.log(sortConfig)

    Item.find(findConfig.find).sort(sortConfig).then(function (items) {
        if (!items) return res.status(404).send("empty");

        next(items)
    }).catch(function(e) {
        return res.status(500).send("There was a problem finding the item." + e);
    })
}, function(items, req, res, next) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        if (!users) return res.status(404).send("empty");
        var result = []

        items.forEach(i => {
            i = i.getPublicFields()
            users.forEach(u => {
                u = u.getPublicFields()
                if (i.user_id === u.id) {
                    i.user = u
                    result.push(i)
                }
            })
        });
        res.status(200).send(result);
    });
})

router.route('/item/:id/image')
    .put(VerifyToken, upload.any(), function (req, res, next) {
        Item.findById(req.params.id, function (err, item) {
            if (err) return res.status(500).send("There was a problem finding the item.");
            if (!item) return res.status(404).send("empty");

            if (req.files[0]) item.image = 'http://localhost:3000/upload/' + req.files[0].filename;

            item.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(403).send(err);
                } else {
                    console.log("Item image #" + item._id.toString() + " is added!");
                    next(item.getPublicFields())
                }
            });
        })
    }, function(item, req, res, next) {
        User.findById(item.user_id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("empty");
            res.status(200).send({
                ...item,
                user: user.getPublicFields()
            });
        });
    })
    .delete(VerifyToken, function (req, res, next) {
        Item.findById(req.params.id, function (err, item) {
            if (err) return res.status(500).send("There was a problem finding the item.");
            if (!item) return res.status(404).send("empty");

            if (item.image) item.image = '';

            item.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(403).send(err);
                } else {
                    console.log("Item image #" + item._id.toString() + " is added!");
                    res.status(204).send('empty')
                }
            });

        })
    })

router.route('/item/:id')
    .get(VerifyToken, function (req, res, next) {
        Item.findById(req.params.id, function(err, item) {
            if (err) return res.status(500).send("There was a problem finding the item.");
            if (!item) return res.status(404).send("empty");
            next(item.getPublicFields())
        })
    }, function(item, req, res, next) {
        User.findById(item.user_id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("empty");
            res.status(200).send({ 
                ...item, 
                user: user.getPublicFields()
            });
        });
    })
    .patch(VerifyToken, function (req, res, next) {
        Item.findById(req.params.id, function (err, item) {
            if (err) return res.status(500).send("There was a problem finding the item.");
            if (!item) return res.status(404).send("empty");

            if (req.body.title) item.title = req.body.title;
            if (req.body.price) item.price = req.body.price;
            item.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(403).send(err);
                } else {
                    console.log("Item #" + item._id.toString() + " is added!");
                    next(item.getPublicFields())
                }
            });
            
        })
    }, function (item, req, res, next) {
        User.findById(item.user_id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("empty");
            res.status(200).send({
                ...item,
                user: user.getPublicFields()
            });
        });
    })
    .delete(VerifyToken, function (req, res, next) {
        Item.findByIdAndRemove(req.params.id, function(err, item) {
            if (err) return res.status(500).send("There was a problem finding the item.");
            if (!item) return res.status(404).send("empty");

            res.status(204).send('empty')
        })
    })



router.route('/items')
    .post(VerifyToken, function(req, res, next) {
        if (req.body.title && req.body.price) {
            var doc = new Item({
                title: req.body.title,
                price: req.body.price,
                user_id: req.user_id
            })
            doc.save(function (err) {
                if (err) {
                    console.error(err);
                    res.status(403).send(err);
                } else {
                    console.log("Item #" + doc._id.toString() + " is added!");
                    next(doc.getPublicFields());
                }
            });
        }
    }, function(item, req, res, next) {
        User.findById(item.user_id, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("empty");
            res.status(200).send({
                ...item,
                user: user.getPublicFields()
            });
        });
    });

module.exports = router;