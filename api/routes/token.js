var jwt = require('jsonwebtoken');

const issueUserToken = function (results) {
  var user = {
    id: results.id,
    username: results.username,
    email: results.email,
    firstname: results.firstname,
    lastname: results.lastname,
    isActivated: results.activated,
    gender: results.gendfer,
    preference: results.preference,
    bio: results.bio,
    profile_path: 'upload/' + results.profile_path,
    img1_path: 'upload/' + results.img1_path,
    img2_path: 'upload/' + results.img2_path,
    img3_path: 'upload/' + results.img3_path,
    img4_path: 'upload/' + results.img4_path
  };
  const token = jwt.sign(user, process.env.SECRET, {
    expiresIn: '1h'
  });
  user.token = token;
  user.status = "200";
  return user;
}

module.exports = issueUserToken;
