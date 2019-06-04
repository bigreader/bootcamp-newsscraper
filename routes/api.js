var express = require('express');
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

router.get('/articles/:article', function (req, res) {
  db.Article.findById(req.params.article).populate('comments').exec((err, article) => {
    if (err) return res.status(500).json({ error: err });
    if (!article) return res.status(404).end();
    res.json(article);
  });
});


router.get('/articles/:article/comments', function (req, res) {
  db.Article.findById(req.params.article).populate('comments').exec((err, article) => {
    if (err) return res.status(500).json({ error: err });
    if (!article) return res.status(404).end();
    res.json(article.comments);
  });
});

router.post('/articles/:article/comments', function (req, res) {
  db.Comment.create(req.body, handle(res, 201));

  db.Article.findById(req.params.article, (err, article) => {
    if (err) return res.status(500).json({error: err});
    if (!article) return res.status(404).end();

    var comment = new db.Comment(req.body);
    comment.save((err, data) => {
      res.status(201).json(comment);
    });
    article.comments.push(comment._id);
    article.save();
  });

});

router.put('/articles/:article/comments/:comment', function (req, res) {
  db.Comment.updateOne({ _id: req.params.id }, req.body, handle(res));
});

router.delete('/articles/:article/comments/:comment', function (req, res) {
  db.Comment.deleteOne({ _id: req.params.id }, handle(res));
});

module.exports = router;
