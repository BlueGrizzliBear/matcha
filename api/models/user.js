const connection = require('../config/db');
var validators = require('./validate');

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
			if (i == 'email' && !validators.isEmail(set[i])) {
				error("Invalid email format");
				return;
			}
			if (i == 'username' && !validators.isAlphanum(set[i])) {
				error("Invalid username format");
				return;
			}
			if ((i == 'firstname' || i == 'lastname') && !validators.isAlpha(set[i])) {
				error("Invalid firstname/lastname format");
				return;
			}
			if (i == 'password' && !validators.isValidPassword(set[i])) {
				error("Invalid password format");
				return;
			}
			if (i == 'activated' && !validators.isBool(set[i])) {
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

	profileIsComplete(ret) {
		connection.query('SELECT * FROM users WHERE id = ? AND username = ?', [this.user_id, this.username], async function (error, results, fields) {
			if (error) {
				console.log(error);
				ret(error, null);
			}
			else {
				if (results.length > 0) {
					if (/*results[0].birth_date && results[0].gender && results[0].bio && */results[0].profile) {
						if (results[0].complete == false) {
							connection.query('UPDATE users SET complete = true WHERE id = ? AND username = ?', [id, username], async function (error, results, fields) {
								if (error) {
									console.log(error);
									ret(error, null);
								}
							})
						}
						ret(null, results);
						return;
					}
					else {
						if (results[0].complete == true) {
							connection.query('UPDATE users SET complete = false WHERE id = ? AND username = ?', [id, username], async function (error, results, fields) {
								if (error)
									console.log(error);
							})
						}
					}
				}
				ret(error, null);
			}
		});
	}
}

module.exports = User;
