var axios   = require('axios');
var cheerio = require('cheerio');
var express = require('express');
var moment  = require('moment');
var db      = require('../models');

var router = express.Router();

router.get('/', (req, res) => {
  axios.get('https://www.macrumors.com/').then(page => {
    var $ = cheerio.load(page.data);

    $('.article').each(function() {
      var doc = {};

      var title = $('.title a', this);
      doc.title = title.text();
      doc.link = title.attr('href');

      var byline = $('.byline', this);
      doc.author = byline.find('a').text();
      var dateString = byline.text().split(' by')[0];
      doc.date = moment(dateString.replace(/P.T/, '-7:00'), 'dddd MMMM D, YYYY h:mm a Z');

      var content = $('.content .content_inner', this);
      doc.body = content.text();
      doc.img = content.find('noscript img').attr('src');

      db.Article.updateOne({
        link: $('.title a', this).attr('href')
      }, {
        title: $('.title a', this).text(),
        link: $('.title a', this).attr('href'),
        author: $('.byline a', this).text(),
        body: $('.content_inner', this).text(),
        img: $('.content noscript img').first().attr('src')
      }, {
        upsert: true
      }).exec();
    });

    db.Article.find().sort({
      date: -1
    }).exec((err, data) => {
      if (err) return res.status(500).send(err);
      res.render('articles', {
        articles: data
      });
    });
  });
});


router.get('/:id', (req, res) => {
  db.Article.findById(req.params.id).populate('comments').exec((err, article) => {
    if (err) return res.status(500).send(err);
    if (!article) return res.status(404).end();
    res.render('article', article);
  });
});


module.exports = router;
