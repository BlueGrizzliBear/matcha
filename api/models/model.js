const connection = require('../config/db');
var jwt = require('jsonwebtoken');

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

const isJWT = function (value) {
    if (regexMatch(value, /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/))
        return true;
    return false;
}

const isBool = function (value) {
    if (value == 1 || value == 0)
        return true;
    return false;
}

/* MODELS */
class User {
    constructor(user_id = null, username = null) {
        this.user_id = user_id;
        this.username = username;
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
            if (i == 'activated' && !isBool(set[i])) {
                error("Invalid activated format");
                return;
            }
        }
        error(null);
    };

    getUserId() {
        return this.user_id;
    };

    getUsername() {
        return this.username;
    };

    create(set, ret) {
        /* Validate set and insert into database */
        let el = this;
        this.validate(set, function (error) {
            if (error) {
                ret('Validation failed: ' + error, null);
            }
            else {
                connection.query('INSERT INTO users SET ?', [set], function (error, results, fields) {
                    if (error) {
                        console.log("Error occured on users creation");
                        ret(error, null);
                    }
                    else {
                        el.user_id = results.insertId;
                        el.username = set['username'];
                        console.log("User registered sucessfully inside model");
                        ret(null, results);
                    }
                });
            }
        });
    };

    update(set, ret) {
        /* Validate set and insert into database */
        let el = this;
        this.validate(set, function (error) {
            if (error) {
                ret('Validation failed: ' + error, null);
            }
            else {
                connection.query('UPDATE users SET ? WHERE username = ?', [set, el.username], function (error, results, fields) {
                    if (error) {
                        console.log("Error occured on updating user database");
                        ret(error, null);
                    }
                    else {
                        console.log("User updated successfully");
                        ret(null, results);
                    }
                });
            }
        });
    };

    find(ret) {
        let el = this;
        connection.query('SELECT * FROM users WHERE username = ?', [this.username], async function (error, results, fields) {
            if (error) {
                console.log("Error occured finding user in users table");
                console.log(error);
                ret(error, null);
            }
            else {
                if (results.length > 0) {
                    el.user_id = results[0].id;
                    ret(null, results);
                }
                else
                    ret("No results", null);
            }
        });
    };
}

class Token {
    constructor(user_id = null, token = null) {
        this.token = token;
        this.user_id = user_id;
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

    getToken() {
        return this.token;
    };

    getUserId() {
        return this.user_id;
    };

    verify(ret) {
        let el = this;
        jwt.verify(this.token, process.env.SECRET, function (err, decoded) {
            if (err) {
                console.log("Token is not valid")
                ret(error, null);
            }
            else {
                el.user_id = decoded.id;
                ret(null, decoded);
            }
        });
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

    generate(set, expireTime, ret) {
        this.token = jwt.sign(set, process.env.SECRET_LINK, {
            expiresIn: expireTime
        });
        this.create({ user_id: this.user_id, token: this.token }, function (error, results) {
            if (error) {
                console.log("Error occured on token creation inside model");
                ret(error, results);
            }
            else {
                console.log("Token registered sucessfully inside model");
                ret(error, results);
            }
        });
        return this.token;
    };

    find(ret) {
        connection.query('SELECT * FROM tokens WHERE user_id = ? AND token = ?', [this.user_id, this.token], async function (error, results, fields) {
            if (error) {
                console.log("Error occured finding token in tokens table");
                console.log(error);
                ret(error, null);
            }
            else {
                if (results.length > 0)
                    ret(null, results);
                else
                    ret("No results", null);
            }
        });
    };

    delete(ret) {
        connection.query('DELETE FROM tokens WHERE user_id = ? AND token = ?', [this.user_id, this.token], async function (error, results, fields) {
            if (error) {
                console.log("Error occured erasing token in tokens table");
                console.log(error);
                ret(error, null);
            }
            else
                ret(null, results);
        });
    };
}

module.exports = { User, Token };






// const user = new Model(users);