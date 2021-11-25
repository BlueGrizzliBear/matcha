var express = require('express');
var router = express.Router();
var checkToken = require('../middleware/token');
var Models = require('../models/models');

/* GET /logout - Logout the users and remove token from database */
router.get('/', checkToken, function (req, res, next) {
  const token = new Models.Token(res.locals.results.id, res.locals.token);
  console.log("token model created");
  token.delete(function (error, results) {
    if (error) {
      console.log("error occured erasing token in tokens table");
      res.status(400).end();
    }
    else {
      const user = new Models.User(null, res.locals.results.username)
      user.updateLastConnected();
      console.log("Logout successfull");
      res.status(200).end();
    }
  });
});

module.exports = router;
