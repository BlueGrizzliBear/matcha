
const connection = require('../config/db');
var jwt = require('jsonwebtoken');
var validators = require('./validate');

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
			if (i == 'token' && !validators.isJWT(set[i])) {
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
				ret(err, null);
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

module.exports = Token;
