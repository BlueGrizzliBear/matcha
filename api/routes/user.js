var fetch = require('cross-fetch');
var express = require('express');
var router = express.Router();
var checkToken = require('../middleware/token');
var watchedUser = require('../middleware/watch');
var Models = require('../models/models');
const connection = require('../config/db');
const websocket = require('../websockets/websocket.js');

/* GET /user - Send user profile informations */
router.get('/', checkToken, function (req, res, next) {
  res.status(200).json({
    status: "200",
    isAuth: true,
    isProfileComplete: res.locals.results.complete,
    id: res.locals.results.id,
    username: res.locals.results.username,
    email: res.locals.results.email,
    firstname: res.locals.results.firstname,
    lastname: res.locals.results.lastname,
    birth_date: res.locals.results.birth_date,
    isActivated: res.locals.results.activated,
    gender: res.locals.results.gender,
    preference: res.locals.results.preference,
    bio: res.locals.results.bio,
    position: {
      long: res.locals.results.gps_long,
      lat: res.locals.results.gps_lat
    },
    city: res.locals.results.city,
    country: res.locals.results.country,
    location_mode: res.locals.results.location_mode,
    images: {
      img0: res.locals.results.img0_path,
      img1: res.locals.results.img1_path,
      img2: res.locals.results.img2_path,
      img3: res.locals.results.img3_path,
      img4: res.locals.results.img4_path
    },
    likes: res.locals.results.likes,
    watches: res.locals.results.watches,
    fake: res.locals.results.fake
  }).end();
});

function find_complete_location(req, ret) {
  if (req.body.location_mode === true && req.body.gps_lat && req.body.gps_long) {
    // fetch city and country from gps coord
    fetch('http://api.positionstack.com/v1/reverse?access_key=' + process.env.POSITIONSTACK_API_KEY + '&query=' + encodeURI(req.body.gps_lat) + ',' + encodeURI(req.body.gps_long) + '&limit=1&output=json', {
      method: 'GET',
    })
      .then(res => {
        if (res.ok && res.status === 200) {
          res.json().then((data) => {
            if (data.data.length > 0) {
              ret(null, data.data[0].locality, data.data[0].country, null, null)
            }
            else
              ret('Fail to GET city/country from positionstack', null, null, null, null);
          })
        }
      })
      .catch(error => {
        ret(error, null, null, null, null);
      })
  }
  else if (req.body.location_mode === false && req.body.city === '' && req.body.country === '') {
    // fetch city and country and gps coord from ip adress ( req.header('x-forwarded-for'))
    console.log("fetch city and country and gps coord from ip adress")
    var ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
    console.log(ipAddress);
    fetch('http://api.ipapi.com/' + ipAddress + '?access_key=' + process.env.IPAPI_API_KEY + '&fields=country_name,city,latitude,longitude&output=json', {
      method: 'GET',
    })
      .then(res => {
        if (res.ok && res.status === 200) {
          res.json().then((data) => {
            ret(null, data.city, data.country_name, data.longitude, data.latitude);
          });
        }
      })
      .catch(error => {
        ret(error, null, null, null, null);
      })
  }
  else if (req.body.location_mode === false && req.body.city && req.body.country) {
    console.log("fetch gps coord from city and country")
    find_gps_location(req.body.city, req.body.country, (gpserr, gpsres) => {
      if (gpsres) {
        ret(null, null, null, gpsres.long, gpsres.lat)
      }
      else {
        ret(gpserr, null, null, null, null);
      }
    });
  }
  else {
    console.log("no fetching for position")
    ret(null, null, null, null, null);
  }
}

/* POST /user - Update/change user profile informations */
router.post('/', checkToken, function (req, res, next) {
  /* Update user informations */
  find_complete_location(req, (locerr, city, country, gps_long, gps_lat) => {
    if (locerr) {
      console.log(locerr);
      res.status(400).end();
    }
    else {
      if (city)
        req.body.city = city;
      if (country)
        req.body.country = country;
      if (gps_long)
        req.body.gps_long = gps_long;
      if (gps_lat)
        req.body.gps_lat = gps_lat;

      const user = new Models.User(res.locals.results.id, res.locals.results.username);
      user.update(req.body, true, (error, results) => {
        if (error) {
          console.log(error);
          res.status(400).end();
        }
        else {
          user.find((error, results) => {
            /* return user profile with new changed informations */
            res.status(200).json({
              status: "200",
              isAuth: true,
              isProfileComplete: results[0].complete,
              id: results[0].id,
              username: results[0].username,
              email: results[0].email,
              firstname: results[0].firstname,
              lastname: results[0].lastname,
              birth_date: results[0].birth_date,
              isActivated: results[0].activated,
              gender: results[0].gender,
              preference: results[0].preference,
              bio: results[0].bio,
              position: {
                long: results[0].gps_long,
                lat: results[0].gps_lat
              },
              city: results[0].city,
              country: results[0].country,
              location_mode: results[0].location_mode,
              images: {
                img0: results[0].img0_path,
                img1: results[0].img1_path,
                img2: results[0].img2_path,
                img3: results[0].img3_path,
                img4: results[0].img4_path
              },
              likes: results[0].likes,
              watches: results[0].watches,
              fake: results[0].fake
            }).end();
          });
        }
      });
    }
  });
});

/* POST /user/reset_password - Verify a generated token link to reset password */
router.post('/reset_password', checkToken, function (req, res, next) {
  const user = new Models.User(res.locals.results.id, res.locals.results.username);

  user.update({ password: req.body.password }, true, (error, results) => {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      const token = new Models.Token(res.locals.results.id, res.locals.token);
      token.delete((tokerr, tokres) => {
        if (tokerr) {
          console.log(tokerr);
          res.status(400).end();
        }
        else {
          res.status(200).end();
        }
      });
    }
  });
});


function find_gps_location(city, country, ret) {
  fetch('http://api.positionstack.com/v1/forward?access_key=' + process.env.POSITIONSTACK_API_KEY + '&query=' + encodeURI(city) + ',' + encodeURI(country) + '&limit=1&output=json', {
    method: 'GET',
  })
    .then(res => {
      if (res.ok && res.status === 200) {
        res.json().then((data) => {
          if (data.data.length > 0)
            ret(null, { lat: data.data[0].latitude, long: data.data[0].longitude })
          else
            ret("No city found", null)
        })
      }
      else
        ret("Fail to GET gps long/lat from positionstack", null)
    })
    .catch(error => {
      ret(error, null)
    })
}

function find_match_results(res, req, location) {
  const tag = new Models.Tag(res.locals.results.id);

  tag.findUserTags((tagerr, tagres) => {
    if (tagerr) {
      console.log(tagerr);
      res.status(400).end();
    }
    else {
      const match = new Models.Match(res.locals.results.id, res.locals.results.username);
      const set = {
        gender: res.locals.results.gender,
        preference: res.locals.results.preference,
        age: {
          min: req.body.agemin ? req.body.agemin : 5000,
          max: req.body.agemax ? req.body.agemax : 0
        },
        fame: {
          min: req.body.famemin ? req.body.famemin : 0,
          max: req.body.famemax ? req.body.famemax : 1
        },
        location: {
          long: location ? location.long : res.locals.results.gps_long,
          lat: location ? location.lat : res.locals.results.gps_lat
        },
        tags: req.body.tags ? req.body.tags : tagres
      }

      match.find_match(set, (usererr, userres) => {
        if (usererr) {
          console.log(usererr);
          res.status(400).end();
        }
        else {
          res.status(200).json(userres).end();
        }
      });
    }
  });
}

/* POST /user/find_match - Return a list of matching users with search criterias */
router.post('/find_match', checkToken, function (req, res, next) {
  // Search Criteria :
  // - Age
  // - Fame
  // - Geographical Location
  // - Interests tags
  var location = null

  if (req.body.city && req.body.country) {
    find_gps_location(req.body.city, req.body.country, (gpserr, gpsres) => {
      if (gpsres) {
        location = gpsres;
        find_match_results(res, req, location);
      }
      else {
        console.log(gpserr);
        res.status(400).end();
      }
    })
  }
  else {
    find_match_results(res, req, location);
  }

});

/* GET /user/username/like - Like username's profile */
router.get('/:username/like', checkToken, function (req, res, next) {
  const likedUser = new Models.User(null, req.params['username'])
  likedUser.find((err, results) => {
    if (err) {
      console.log(err);
      res.status(400).end();
    }
    else {
      const like = new Models.Like(res.locals.results.id, results[0].id);
      like.create((likeerr, likeres) => {
        if (likeerr) {
          console.log(likeerr);
          res.status(400).end();
        }
        else {
          const notification = new Models.Notification(results[0].id, 2, likeres.insertId);
          notification.create((nerr, nres) => {
            if (nerr) {
              console.log(nerr);
              res.status(400).end();
            }
            else {
              // TODO: trigger websocket event
              websocket.sendNotification(results[0].id, 2);
              res.status(200).end();
            }
          });
        }
      })
    }
  });
});

/* GET /user/username/unlike - Unlike username's profile */
router.get('/:username/unlike', checkToken, function (req, res, next) {
  const likedUser = new Models.User(null, req.params['username'])
  likedUser.find((err, results) => {
    if (err) {
      console.log(err);
      res.status(400).end();
    }
    else {
      const like = new Models.Like(res.locals.results.id, results[0].id);
      like.delete((likeerr, likeres) => {
        if (likeerr) {
          console.log(likeerr);
          res.status(400).end();
        }
        else {
          // TODO: trigger websocket event
          websocket.sendNotification(results[0].id, 4);
          res.status(200).end();
        }
      })
    }
  });
});

const fetchProfileImageURL = function (results, user, ret) {
  if (results.fake && results.img0_path === null) {
    let path = 'https://source.unsplash.com/featured/?' + (results.gender === 'Man' ? 'man' : (results.gender === 'Woman' ? 'woman' : 'nonbinary'));
    fetch(path, {
      method: 'GET',
    })
      .then(res => {
        if (!res.ok)
          throw new Error('Request: did not receive success code between 200-299.');
        // console.log(res.url)
        // console.log(user.getUsername())
        connection.query('UPDATE users SET img0_path = ? WHERE username = ?', [res.url, user.getUsername()], async (uperr, upres, fields) => {
          if (uperr) {
            console.log(uperr)
            console.log("Error in updating user image");
            ret(results.img0_path);
          }
          else {
            console.log("Je suis ici");
            ret(res.url);
          }
        });
      })
      .catch(error => {
        console.log(error);
        console.log("Fail to GET image from unsplash");
        ret(results.img0_path);
      })
  }
  else {
    ret(results.img0_path);
  }
}

/* GET /user/username - Send username profile informations */
router.get('/:username', checkToken, watchedUser, function (req, res, next) {
  const user = new Models.User(null, req.params['username']);
  user.find((error, results) => {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      /* return user profile with new changed informations */
      const like = new Models.Like(res.locals.results.id, user.getUserId());
      like.liking((likingerr, likingres) => {
        if (likingerr) {
          console.log(likingerr);
          res.status(400).end();
        }
        else {
          like.liked((likederr, likedres) => {
            if (likederr) {
              console.log(likederr);
              res.status(400).end();
            }
            else {
              const block = new Models.Block(res.locals.results.id, user.getUserId());
              block.blocked((blockerr, blockres) => {
                if (blockerr) {
                  console.log(blockerr);
                  res.status(400).end();
                }
                else {
                  if (blockres == true)
                    res.status(200).json({
                      id: results[0].id,
                      firstname: results[0].firstname,
                      lastname: results[0].lastname,
                      username: results[0].username,
                      blocked: blockres
                    }).end();
                  else {
                    websocket.sendNotification(results[0].id, 3);
                    fetchProfileImageURL(results[0], user, (imageUrl) => {
                      if (imageUrl)
                        results[0].img0_path = imageUrl;
                      res.status(200).json({
                        status: "200",
                        isProfileComplete: results[0].complete,
                        id: results[0].id,
                        username: results[0].username,
                        email: results[0].email,
                        firstname: results[0].firstname,
                        lastname: results[0].lastname,
                        birth_date: results[0].birth_date,
                        isActivated: results[0].activated,
                        gender: results[0].gender,
                        preference: results[0].preference,
                        bio: results[0].bio,
                        city: results[0].city,
                        country: results[0].country,
                        images: {
                          img0: results[0].img0_path,
                          img1: results[0].img1_path,
                          img2: results[0].img2_path,
                          img3: results[0].img3_path,
                          img4: results[0].img4_path
                        },
                        likes: results[0].likes,
                        liking: likingres,
                        liked: likedres,
                        watches: results[0].watches,
                        blocked: blockres,
                        fake: results[0].fake
                      }).end();
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  });
});

/* GET /user/username/block - Block user */
router.get('/:username/block', checkToken, function (req, res, next) {
  const blockedUser = new Models.User(null, req.params['username'])
  blockedUser.find((err, results) => {
    if (err) {
      console.log(err);
      res.status(400).end();
    }
    else {
      const block = new Models.Block(res.locals.results.id, results[0].id);
      block.create((blockerr, blockres) => {
        if (blockerr) {
          console.log(blockerr);
          res.status(400).end();
        }
        else {
          res.status(200).end();
        }
      });
    }
  });
});


/* GET /user/username/unblock - Unblock user */
router.get('/:username/unblock', checkToken, function (req, res, next) {
  const blockedUser = new Models.User(null, req.params['username'])
  blockedUser.find((err, results) => {
    if (err) {
      console.log(err);
      res.status(400).end();
    }
    else {
      const block = new Models.Block(res.locals.results.id, results[0].id);
      block.unblock((blockerr, blockres) => {
        if (blockerr) {
          console.log(blockerr);
          res.status(400).end();
        }
        else {
          res.status(200).end();
        }
      });
    }
  });
});


/* POST /user/username/report - Like username's profile */
router.post('/:username/report', checkToken, function (req, res, next) {
  const reportedUser = new Models.User(null, req.params['username'])
  reportedUser.find((err, results) => {
    if (err) {
      console.log(err);
      res.status(400).end();
    }
    else {
      const report = new Models.Report(res.locals.results.id, results[0].id, req.body.reason);
      report.create((reporterr, reportres) => {
        if (reporterr) {
          console.log(reporterr);
          res.status(400).end();
        }
        else {
          res.status(200).end();
        }
      });
    }
  });
});

module.exports = router;
