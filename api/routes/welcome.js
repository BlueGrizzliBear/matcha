var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // // check if user is logged in, by checking cookie
  let username = req.cookies.username;
  res.json({user: username});
});

module.exports = router;
