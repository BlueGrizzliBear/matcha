var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // check if there is a msg query
  let bad_auth = req.query.msg ? true : false;

  // if there exists, send the error.
  if (bad_auth) {
    res.status(403).end();
  }
  else {
    // else just render the login
    res.status(200).end();
  }
  //   res.send("Login page");
});

module.exports = router;
