var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // clear the cookie
  res.clearCookie("username");
  // redirect to login
  res.status(200).end();
});

module.exports = router;
