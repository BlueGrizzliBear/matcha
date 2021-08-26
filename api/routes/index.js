var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // // check if user is logged in, by checking cookie
  let username = req.cookies.username;

  // // send json format
  if (username)
    res.json({user: username});
  else
    res.json({user: null});
    // res.send("Index page");
});

module.exports = router;
