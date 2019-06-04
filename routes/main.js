var express = require('express');
var db = require('../models');

var router = express.Router();

router.get('/', (req, res) => {
  var $ = cheerio.load(page.data);

  $('div.article').each((i, div) => {
    var article = new Article();

    var title = div.find('.title a');
    article.title = title.text();
    article.link = title.attr('href');

    var byline = div.find('.byline');
    article.author = byline.find('a').text();
    var dateString = byline.text().split(' by')[0];
    article.date = moment(dateString.replace(/P.T/, '-7:00'), 'dddd MMMM D, YYYY h:mm a Z');

    var content = div.find('.content .content_inner');
    article.body = content.text();
    article.img = content.find('noscript img').attr('src');

    await article.save();
  });

  db.Article.find().sort({
    date: -1
  }).exec((err, data) => {
    if (err) return res.status(500).send(err);
    res.render('articles', data);
  });
});

module.exports = router;
