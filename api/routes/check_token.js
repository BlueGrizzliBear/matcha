var express = require('express');
var router = express.Router();

// check if a token exist and is valid
const withAuth = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  }
  else {
    token = token.split(' ')[1];
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.id = decoded.id;
        next();
      }
    });
  }
}

/* GET home page. */
router.get('/', withAuth, function (req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
