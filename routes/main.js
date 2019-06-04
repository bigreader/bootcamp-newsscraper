var express = require('express');
var db = require('../models');

var router = express.Router();

function handle(res, view, obj = {}) {
  return function (err, data) {
    if (err) return res.status(500).send(err);
    obj.data = data;
    res.render(view, obj);
  }
}
/*
router.get('/all', function (req, res) {
  db.Character.find(handle(res, 'chars'));
});

router.get('/:ident', function (req, res) {
  db.Character.findOne({
    route: req.params.ident
  }, handle(res, 'char-overview'));
});
*/
module.exports = router;
