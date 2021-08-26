var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // get the data
  let { username, password } = req.body;

  // fake test data (need to be connected to database)
  let userdetails = {
    username: "Bob",
    password: "123456",
  };

  // check user and password are in database
  if ( username === userdetails["username"] && password === userdetails["password"] ) {
    // saving the data to the cookies and redirect
    res.cookie("username", username).status(200).end();
  }
  else {
    // redirect with a fail msg
    res.status(403).end();
  }
});

module.exports = router;
