var jwt = require('jsonwebtoken');

const issueUserToken = function (results) {
  var user = {
    id: results.id,
    username: results.username,
    email: results.email,
    firstname: results.firstname,
    lastname: results.lastname
  };
  const token = jwt.sign(user, process.env.SECRET, {
    expiresIn: '1h'
  });
  user.token = token;
  user.status = "200";
  return user;
}

module.exports = issueUserToken;
