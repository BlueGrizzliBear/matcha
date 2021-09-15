var express = require('express');
var router = express.Router();
var checkToken = require('./middleware/middleware');
var Models = require('../models/model');

/* GET home page. */
router.get('/', checkToken, function (req, res, next) {
  const token = new Models.Token(res.locals.results.id, res.locals.token);
  token.delete(function (error, results) {
    if (error) {
      console.log("error occured erasing token in tokens table");
      res.status(400).end();
    }
    else {
      console.log("Logout successfull");
      res.status(200).end();
    }
  });
});

module.exports = router;
