var Models = require('../models/models');

// middleware to use on path everytime user acces sensitiv data
// check if a token exist and is valid
const checkToken = function (req, res, next) {
    const bearerToken = req.headers.authorization;
    // console.log("bearer token:" + bearerToken);
    if (!bearerToken) {
        console.log("Unauthorized: No token provided");
        res.status(401).end();
    }
    else {
        const token = new Models.Token(null, bearerToken.split(' ')[1])
        console.log("token:" + token.getToken());
        token.verify(function (err, decoded) {
            if (err) {
                console.log("Unauthorized: Invalid token");
                res.status(401).end();
            }
            else {
                token.find(function (finderror, findresults) {
                    if (finderror) {
                        console.log("Unauthorized: Token is revoked");
                        res.status(401).end();
                    }
                    else {
                        // req.id = decoded.id;
                        const user = new Models.User(decoded.id, decoded.username);
                        user.find(function (error, results) {
                            if (error) {
                                console.log(error);
                                res.status(400).end();
                            }
                            else {
                                res.locals.decoded = decoded;
                                res.locals.results = results[0];
                                res.locals.token = token.getToken();
                                console.log("Token is valid");
                                next();
                            }
                        });
                    }
                });
            }
        });
    }
}

module.exports = checkToken;
