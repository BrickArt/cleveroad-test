const express = require('express');
const router = express.Router();

const Tmp = require("../models/template.model").Template;

router.route('/')
    .get(function(req, res, next) {
        res.status(200).sendFile("../../public/index")
    })

router.route('/templates/:id?')
    .get(function(req, res, next){
        if(!req.params.id){
            Tmp.find().then(doc => {
                var tmp = []
                // console.log(doc)
                doc.forEach(o => {
                    return tmp.push(o.getPublicFields())
                })
                res.status(200).send(tmp);
            }).catch(e => {
                res.status(500).send(e);
            })
        } else {
            Tmp.find({id: req.params.id})
              .then(doc => {
                  var tmp = [];
                  doc.forEach(o => {
                    return tmp.push(o.getPublicFields());
                  });
                res.status(200).send(tmp);
              })
              .catch(e => {
                res.status(500).send(e);
              });
        }
    })
    .post(function(req, res, next) {
        if (req.body) {
            var data = new Tmp(req.body);
            data.save(function (err) {
                if (err) {
                    console.error(err)
                    res.status(403).send(err);
                } else {
                    console.log('Template is added #' + data._id.toString())
                    res
                      .status(200)
                      .send(data.getPublicFields());
                }
            })
        }
    })
    .put(function(req, res, next) {
        if (req.params.id && req.body) {
            Tmp.findOne({id: req.params.id}).then(doc => {
                if (req.body.name) doc.name = req.body.name;
                if (req.body.template) doc.template = req.body.template;
                if (req.body.modified) doc.modified = req.body.modified;

                doc.save(function(err) {
                  if (err) {
                    console.error(err);
                    res.status(403).send(err);
                  } else {
                    console.log("Template #" + doc._id.toString() + " is updated!");
                    res
                      .status(200)
                      .send(doc.getPublicFields());
                  }
                });
            })
        } else {
            console.log('Updating data error!')
            res.status(403).send("Updating data error!");
        }
    })

module.exports = router;