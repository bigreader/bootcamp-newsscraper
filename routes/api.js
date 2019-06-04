var axios   = require('axios');
var cheerio = require('cheerio');
var express = require('express');
var moment  = require('moment');
var db      = require('../models');

var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

function handle(res, status) {
  return function (err, data) {
    if (err) return res.status(500).json(err);
    if (status) res.status(status);
    res.json(data);
  }
}

router.get('/articles', function (req, res) {
  db.Article.find().sort({
    date: -1
  }).exec(handle(res));
});


router.get('/comments', function (req, res) {
  db.Comment.find(handle(res));
});

router.post('/comments', function (req, res) {
  db.Comment.create(req.body, handle(res, 201));
});

router.put('/comments/:id', function (req, res) {
  db.Comment.updateOne({ _id: req.params.id }, req.body, handle(res));
});

router.delete('/comments/:id', function (req, res) {
  db.Comment.deleteOne({ _id: req.params.id }, handle(res));
});

module.exports = router;
