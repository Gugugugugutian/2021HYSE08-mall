var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '线上商城系统-后端服务器' });
});

module.exports = router;
