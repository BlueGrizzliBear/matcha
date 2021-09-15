const connection = require('../config/db');

/* Utils validation function */
const regexMatch = function (value, regex) {
    if (value.match(regex))
        return true;
    return false;
}

const isAlphanum = function (value) {
    if (regexMatch(value, /^[a-zA-Z0-9]+$/))
        return true;
    return false;
}

const isAlpha = function (value) {
    if (regexMatch(value, /^[a-zA-Z]+$/))
        return true;
    return false;
}

const isNum = function (value) {
    if (regexMatch(value, /^[0-9]+$/))
        return true;
    return false;
}

const isEmail = function (value) {
    if (regexMatch(value, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
        return true;
    return false;
}

const isValidPassword = function (value) {
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
    // if (regexMatch(value, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
    //     return true;
    // return false;
    return true;
}

const isToken = function (value) {
    if (regexMatch(value, /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/))
        return true;
    return false;
}

/* MODELS */
class User {
    constructor() {
    };

    validate(set, error) {
        if (!set) {
            error("Empty values send");
            return;
        }
        for (let i in set) {
            if (!set[i]) {
                error(i + " is empty");
                return;
            }
            if (i == 'email' && !isEmail(set[i])) {
                error("Invalid email format");
                return;
            }
            if (i == 'username' && !isAlphanum(set[i])) {
                error("Invalid username format");
                return;
            }
            if ((i == 'firstname' || i == 'lastname') && !isAlpha(set[i])) {
                error("Invalid firstname/lastname format");
                return;
            }
            if (i == 'password' && !isValidPassword(set[i])) {
                error("Invalid password format");
                return;
            }
        }
        error(null);
    };

    create(set, ret) {
        /* Validate set and insert into database */
        this.validate(set, function (error) {
            if (error) {
                ret('Validation failed: ' + error, null);
            }
            else {
                console.log('before query here');
                connection.query('INSERT INTO users SET ?', [set], function (error, results, fields) {
                    if (error) {
                        console.log("Error occured on users creation");
                        ret(error, results);
                    }
                    else {
                        console.log("User registered sucessfully inside model");
                        ret(error, results);
                    }
                });
            }
        });
    };

    update(set, ret) {
        /* Validate set and insert into database */
        this.validate(set, function (error) {
            if (error) {
                ret('Validation failed: ' + error, null);
            }
            else {
                console.log('before query here');
                connection.query('INSERT INTO users SET ?', [set], function (error, results, fields) {
                    if (error) {
                        console.log("Error occured on users creation");
                        ret(error, results);
                    }
                    else {
                        console.log("User registered sucessfully inside model");
                        ret(error, results);
                    }
                });
            }
        });
    };
}

class Token {
    constructor() {
    };

    validate(set, error) {
        if (!set) {
            error("Empty values send");
            return;
        }
        for (let i in set) {
            if (!set[i]) {
                error(i + " is empty");
                return;
            }
            if (i == 'user_id' && !Number.isInteger(set[i])) {
                error("Invalid user_id format");
                return;
            }
            if (i == 'token' && !isJWT(set[i])) {
                error("Invalid token format");
                return;
            }
        }
        return error(null);
    };

    create(set, ret) {
        /* Validate set and insert into database */
        this.validate(set, function (error) {
            if (error) {
                ret('Validation failed: ' + error, null);
            }
            else {
                connection.query('INSERT INTO tokens SET ?', [set], function (error, results, fields) {
                    if (error) {
                        console.log("Error occured on token creation inside model");
                        ret(error, results);
                    }
                    else {
                        console.log("Token registered sucessfully inside model");
                        ret(error, results);
                    }
                });
            }
        });
    };

    generate(set, expireTime) {
        const token = jwt.sign(set, process.env.SECRET_LINK, {
            expiresIn: expireTime
        });
        return token;
    };
}

module.exports = { User, Token };






// const user = new Model(users);