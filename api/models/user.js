const connection = require('../config/db');
var validators = require('./validate');
const fs = require('fs');
var bcrypt = require('bcrypt');
var Like = require('./like');

function profileCompleteCondition(results) {
	if (/*results.birth_date && results.gender && */results.img0_path)
		return true;
	return false;
}

function deleteImage(path) {
	fs.unlink(path, (err => {
		if (err) console.log(err);
		// else
		// 	console.log("\nDeleted file: " + path);
	}))
}

/* MODELS */
class User {
	constructor(user_id = null, username = null) {
		this.user_id = user_id;
		this.username = username;
	};

	async validate(set, error) {
		if (!set) {
			error("Empty values send");
			return;
		}
		for (let i in set) {
			if (set[i] === '') {
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
			else if (i == 'password') {
				const saltRounds = 10;
				const password = set[i];
				set[i] = await bcrypt.hash(password, saltRounds);
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
		for (let i in set) {
			if (!validators.validateKey(i, ['username', 'email', 'password', 'firstname', 'lastname'])) {
				ret('Validation failed: Unauthorized key', null);
				return;
			}
		}
		this.validate(set, (verr) => {
			if (verr) {
				ret('Validation failed: ' + verr, null);
			}
			else {

				connection.query('INSERT INTO users SET ?', [set], async (error, results, fields) => {
					if (error) {
						console.log("Error occured on users creation");
						ret(error, null);
					}
					else {
						this.user_id = results.insertId;
						this.username = set['username'];
						console.log("User registered sucessfully inside model");
						ret(null, results);
					}
				});
			}
		});
	};

	update(set, keyValidation, ret) {
		/* Validate set and insert into database */
		if (keyValidation == true) {
			for (let i in set) {
				if (!validators.validateKey(i, ['email', 'password', 'firstname', 'lastname', 'birth_date', 'gender', 'preference', 'bio'])) {
					ret('Validation failed: Unauthorized key', null);
					return;
				}
			}
		}
		this.validate(set, (err) => {
			if (err) {
				ret('Validation failed: ' + err, null);
			}
			else {
				// si email change => desactiver profile et renvoyer un lien verification par email
				// si password change => reset tous les token sauf celui sur lequel connecté
				connection.query('UPDATE users SET ? WHERE username = ?', [set, this.username], async (error, results, fields) => {
					if (error) {
						console.log("Error occured on updating user database");
						ret(error, null);
					}
					else {
						this.profileIsComplete((picerr, picres) => {
							ret(null, results);
						});
					}
				});
			}
		});
	};

	find(ret) {
		connection.query('SELECT * FROM users WHERE username = ?', [this.username], async (error, results, fields) => {
			// connection.query('SELECT *
			// 						FROM users
			// 						JOIN likes ON likes.liked_user_id = users.id
			// 						JOIN watches ON watches.watched_user_id = user.id
			// 						WHERE username = ?', [this.username], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding user in users table");
				console.log(error);
				ret(error, null);
			}
			else {
				if (results.length > 0) {
					this.user_id = results[0].id;
					ret(null, results);
				}
				else
					ret("No results", null);
			}
		});
	};

	findKey(key, ret) {
		connection.query('SELECT ?? FROM users WHERE username = ?', [key, this.username], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding user in users table");
				console.log(error);
				ret(error, null);
			}
			else {
				if (results.length > 0) {
					this.user_id = results[0].id;
					ret(null, results);
				}
				else
					ret("No results", null);
			}
		});
	};

	updateImage(key, newfilename, ret) {
		this.findKey(key, (err, res) => {
			if (err) {
				console.log("Error on finding user image");
				deleteImage("user_images/" + newfilename);
				ret(err, null);
			}
			else {
				if (res[0][Object.keys(res[0])[0]]) {
					deleteImage("user_images/" + res[0][Object.keys(res[0])[0]]);
				}
				connection.query('UPDATE users SET ?? = ? WHERE username = ?', [key, newfilename, this.username], async (error, results, fields) => {
					if (error) {
						console.log("Error in updating user image");
						deleteImage("user_images/" + newfilename);
						ret(error, null);
					}
					else {
						this.profileIsComplete((picerr, picres) => {
							ret(null, results);
						});
					}
				});
			}
		});
	}

	deleteImage(key, ret) {
		connection.query('SELECT ?? FROM users WHERE username = ?', [key, this.username], async (err, res, fields) => {
			if (err) {
				console.log("Error connecting with database");
				console.error(err);
				ret(err, null);
			}
			else {
				if (res[0][Object.keys(res[0])[0]]) {
					deleteImage("user_images/" + res[0][Object.keys(res[0])[0]]);
					connection.query('UPDATE users SET ?? = NULL WHERE username = ?', [key, this.username], async (error, results, fields) => {
						if (error) {
							console.log("Error connecting with database");
							console.error(error);
							ret(error, null);
						}
						else {
							if (key == "img0_path") {
								this.profileIsComplete((picerr, picres) => {
									ret(null, results);
								});
							}
							ret(null, results);
						}
					});
				}
				else
					ret("Already deleted from database", null);
			}
		});
	}

	profileIsComplete(ret) {
		this.find((error, results) => {
			if (error) {
				console.log(error);
				ret(error, null);
			}
			else if (results.length > 0) {
				if (profileCompleteCondition(results[0])) {
					if (results[0].complete == false) {
						this.update({ complete: 1 }, false, (err, res) => {
							if (err) {
								console.log(error);
								ret(err, null);
							}
							else
								ret(null, "Profile is complete");
						});
					}
					else
						ret(null, "Profile is already complete");
				}
				else {
					if (results[0].complete == true) {
						this.update({ complete: 0 }, false, (err, res) => {
							if (err) {
								console.log(err);
								ret(err, null);
							}
							else
								ret("Incomplete profile", null);
						});
					}
					else
						ret("Profile is still incomplete", null);
				}
			}
			else
				ret("No user found", null);
		});
	}
}

module.exports = User;
