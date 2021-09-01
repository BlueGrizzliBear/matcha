var express = require('express');
var router = express.Router();

// const tokenList = {};

/* POST token */
router.get('/', function (req, res, next) {
  // // refresh the damn token
  // const postData = req.body
  // // if refresh token exists
  // if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
  //   const id = postData.id;
  //   const token = jwt.sign({ id }, process.env.SECRET, {
  //     expiresIn: 300
  //   });
  //   // update the token in the list
  //   tokenList[postData.refreshToken].token = token
  //   res.status(200)
  //     .json({
  //       status: "200",
  //       success: "login successful",
  //       token: token,
  //       refreshToken: refreshToken,
  //       id: results[0].id,
  //     });
  // } else {
  //   res.status(404).send('Invalid request')
  // }
});

module.exports = router;
