var jwt = require('jsonwebtoken');
const connection = require('./connection');

// middleware to use on path everytime user acces sensitiv data
// check if a token exist and is valid
const checkToken = function (req, res, next) {
    const bearerToken = req.headers.authorization;
    console.log("bearer token:" + bearerToken);
    if (!bearerToken) {
        console.log("Unauthorized: No token provided");
        res.status(401).end();
    }
    else {
        const token = bearerToken.split(' ')[1]
        console.log("token:" + token);
        if (token) {
            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                console.log(err);
                if (err) {
                    console.log("Unauthorized: Invalid token");
                    res.status(401).end();
                }
                else {
                    req.id = decoded.id;
                    // verifier le format des elements decodés
                    connection.query('SELECT * FROM users WHERE id = ? AND email = ? ', [decoded.id, decoded.email], async function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            res.status(400).end();
                        }
                        else {
                            console.log(results)
                            if (!results[0]) {
                                console.log("Unauthorized: Invalid token");
                                res.status(401).end();
                            }
                            else {
                                res.locals.decoded = decoded;
                                res.locals.results = results[0];
                                console.log("Token is valid");
                                next();
                            }
                        }
                    });
                }
            });
        }
        else {
            console.log("Unauthorized: No token provided");
            res.status(401).end();
        }
    }
}

module.exports = checkToken;
