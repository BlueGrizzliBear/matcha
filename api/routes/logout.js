var express = require('express');
var router = express.Router();
var TokenDB = require('./query');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (TokenDB.deleteTokenDB(user.id, user.token)) {
    console.log("error occured erasing token in tokens table");
    res.status(400).end();
  }
  console.log("Logout successfull");
  res.status(200).end();
});

module.exports = router;
