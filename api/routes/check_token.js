var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// middleware to use on path everytime user acces sensitiv data
// check if a token exist and is valid
const withAuth = function (req, res, next) {
  console.log("Check auth is checking");
  const bearerToken = req.headers.authorization;
  console.log("bearer token:" + bearerToken);
  if (!bearerToken) {
    console.log("Unauthorized: No token provided");
    res.status(401).send('Unauthorized: No token provided');
  }
  else {
    const token = bearerToken.split(' ')[1]
    console.log("token:" + token);
    if (token) {
      // console.log("split token:" + token);
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          console.log("Unauthorized: Invalid token");
          res.status(401).send('Unauthorized: Invalid token');
        } else {
          req.id = decoded.id;
          console.log("next");
          next();
        }
      });
    }
    else {
      console.log("null token");
      res.status(401).send('Unauthorized: No token provided');
    }
  }
}

/* GET home page. */
router.post('/', withAuth, function (req, res, next) {
  res.status(200).send("ok");
});

module.exports = router;
