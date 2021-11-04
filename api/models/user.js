const connection = require('../config/db');
var validators = require('./validate');
const fs = require('fs');
var bcrypt = require('bcrypt');
var fetch = require('cross-fetch');

function isProfileComplete(results) {
	if (/*results.birth_date && results.gender && */results.img0_path)
		return true;
	return false;
}

function unlinkImage(path) {
	fs.unlink(path, (err => {
		if (err) console.log(err);
		// else
		// 	console.log("\nDeleted file: " + path);
	}))
}

function populate_fake_user_gps(users) {
	users.forEach(function (user) {
		fetch('http://api.positionstack.com/v1/forward?access_key=' + process.env.POSITIONSTACK_API_KEY + '&query=' + encodeURI(user.city) + ',' + encodeURI(user.country) + '&limit=1&output=json', {
			method: 'GET',
		})
			.then(res => {
				if (res.ok && res.status === 200) {
					return res.json().then((data) => {
						console.log(data);
						connection.query('UPDATE users SET gps_lat = ?, gps_long = ? WHERE id = ?', [data.data[0].latitude, data.data[0].longitude, user.id], async (uperr, upres, fields) => {
							if (uperr) {
								console.log(uperr)
								console.log("Error in updating user image");
							}
							else {
								console.log("User update gps successfull");
							}
						});
					})
				}
				else
					console.log("Fail to GET gps long/lat from positionstack");
			})
			.catch(error => {
				console.log(error);
				console.log("Fail to GET gps long/lat from positionstack");
			})
	});
}

function caseInsensitiveEquals(a, b) {
	return typeof a === 'string' && typeof b === 'string'
		? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
		: a === b;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;	// Math.PI / 180
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2;
	return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function count_common_tags(listTags, userTagsSet) {
	let commonTagsCount = 0;
	const userTags = [];

	if (!listTags)
		return commonTagsCount;

	userTagsSet.forEach(function (tag) {
		userTags.push(tag.tag);
	});

	listTags.split(',').forEach(function (listTag) {
		userTags.forEach(function (userTag) {
			if (caseInsensitiveEquals(listTag, userTag)) {
				commonTagsCount += 1;
			}
		});
	});
	return commonTagsCount;
}

function calculate_fame(likes, watches) {
	if (watches === 0)
		return 0.5
	else {
		return likes / watches;
	}
}

function add_match_score(results, set) {
	// Calculate matching score with these citeria :
	// Distance (most important)
	// Common tags (calculate number of common tags)
	// Fame (views/likes ratio if likes != 0)
	var search = []

	results.forEach(function (item, i) {
		// console.log(set);
		// console.log(userTags);
		const proximity = getDistanceFromLatLonInKm(set.location.lat, set.location.long, item.gps_lat, item.gps_long);
		console.log("proximity");
		console.log(proximity);

		const commonTags = count_common_tags(item.tags, set.tags);
		console.log(commonTags);

		const fame = calculate_fame(item.likes, item.watches);
		console.log(fame);
		results[i].match_score =
			(1 / proximity) * 10000		/* (Distance: 10km = 1000 -> 100km = 100 -> 1000km = 10) */
			+ commonTags * 10			/* (Tags: 0 tag: 0 -> 5 tags: 50) */
			+ fame * 10					/* (Fame : no fame: 0 -> max fame: 10) */
		if (results[i].match_score > 50)
			search.push(results[i])
	});
	return search;
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
			else if (i == 'birth_date' && !validators.isDate(set[i])) {
				error("Invalid date format");
				return;
			}
			else if (i == 'gender' && !validators.isGender(set[i])) {
				error("Invalid gender format");
				return;
			}
			else if (i == 'preference' && !validators.isPreference(set[i])) {
				error("Invalid preference format");
				return;
			}
			// else if (i == 'bio' && !validators.isAlpha(set[i])) {
			// 	error("Invalid bio format");
			// 	return;
			// }
			else if (i == 'city' && !validators.isAddress(set[i])) {
				error("Invalid city format");
				return;
			}
			else if (i == 'country' && !validators.isAddress(set[i])) {
				error("Invalid country format");
				return;
			}
			else if ((i == 'gps_long' || i == 'gps_lat') && !Number.isFinite(set[i])) {
				error("Invalid location_mode format");
				return;
			}
			else if (i == 'location_mode' && !validators.isBool(set[i])) {
				error("Invalid location_mode format");
				return;
			}
			if ((i == 'activated' || i == 'complete') && !validators.isBool(set[i])) {
				error("Invalid activated/complete format");
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
				if (i == 'bio')
					set[i] = validators.escapeHTML(set[i]);
				if (!validators.validateKey(i, ['email', 'password', 'firstname', 'lastname', 'birth_date', 'gender', 'preference', 'bio', 'gps_long', 'gps_lat', 'city', 'country', 'location_mode'])) {
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
		// VALIDATE SET (age + fame + location + tags)
		const set = { username: this.username }
		this.validate(set, (verr) => {
			if (verr) {
				ret('Validation failed: ' + verr, null);
			}
			else {
				// SELECT u2.*
				// FROM (
				//   SELECT u1.*, COUNT(w.id) watches
				//   FROM (
				// 	SELECT u.*,COUNT(l.id) likes
				// 	FROM users u
				// 	LEFT JOIN likes l
				// 	ON u.id = l.liked_user_id
				// 	WHERE u.username = ?) u1
				//   LEFT JOIN watches w
				//   ON u1.id = w.watched_user_id
				//   WHERE u1.username = ?) u2
				// WHERE u2.username = ?
				connection.query('SELECT u2.* \
				FROM (\
SELECT u1.*, COUNT(w.id) watches \
FROM (\
SELECT u.*,COUNT(l.id) likes \
FROM users u \
LEFT JOIN likes l \
ON u.id = l.liked_user_id \
WHERE u.username = ?) u1 \
LEFT JOIN watches w \
ON u1.id = w.watched_user_id \
WHERE u1.username = ?) u2 \
WHERE u2.username = ?', [this.username, this.username, this.username], async (error, results, fields) => {
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
			}
		});
	};


	populate_gps_coordinates() {
		connection.query('SELECT * FROM users WHERE fake = 1 AND gps_lat IS NULL', [], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding matching users in users table");
				console.log(error);
			}
			else {
				if (results.length > 0) {
					populate_fake_user_gps(results)
				}
				else
					console.log("No users to match");
			}
		});
	}

	find_match(set, ret) {
		// this.populate_gps_coordinates()
		const preference = set.preference.split('-')
		const gender = '%' + set.gender + '%'
		// SELECT u2.*, GROUP_CONCAT(tu.tag_id) as tags_id, GROUP_CONCAT(t.tag) as tags
		// FROM (
		// SELECT u1.*, COUNT(w.id) watches
		// FROM (
		// SELECT u.*,COUNT(l.id) likes
		// FROM users u
		// LEFT JOIN likes l
		// ON u.id = l.liked_user_id
		// GROUP BY u.id
		// ) u1
		// LEFT JOIN watches w
		// ON u1.id = w.watched_user_id
		// GROUP BY u1.id
		// ) u2
		// LEFT JOIN tag_user tu
		// ON u2.id = tu.user_id
		// LEFT JOIN tags t
		// ON t.id = tu.tag_id
		// WHERE u2.gender IN ('Man', 'Woman', 'NonBinary') AND activated = 1 AND u2.preference LIKE BINARY '%Woman%' AND YEAR(u2.birth_date) BETWEEN '1980' AND '1999'
		// GROUP BY u2.id
		connection.query('\
			SELECT u2.*, GROUP_CONCAT(tu.tag_id) as tags_id, GROUP_CONCAT(t.tag) as tags \
			FROM (\
			SELECT u1.*, COUNT(w.id) watches \
			FROM (\
			SELECT u.*,COUNT(l.id) likes \
			FROM users u \
			LEFT JOIN likes l \
			ON u.id = l.liked_user_id \
			GROUP BY u.id\
			) u1 \
			LEFT JOIN watches w \
			ON u1.id = w.watched_user_id \
			GROUP BY u1.id\
			) u2 \
			LEFT JOIN tag_user tu \
			ON u2.id = tu.user_id \
			LEFT JOIN tags t \
			ON t.id = tu.tag_id \
			WHERE \
			u2.gender IN (?) AND activated = 1 AND u2.preference LIKE BINARY ? AND YEAR(u2.birth_date) BETWEEN ? AND ? \
			GROUP BY u2.id', [preference, gender, set.age.min, set.age.max], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding matching users in users table");
				console.log(error);
				ret(error, null);
			}
			else {
				if (results.length > 0) {
					results = add_match_score(results, set);
					ret(null, results);
				}
				else
					ret("No users to match", null);
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
				unlinkImage("user_images/" + newfilename);
				ret(err, null);
			}
			else {
				if (res[0][Object.keys(res[0])[0]]) {
					unlinkImage("user_images/" + res[0][Object.keys(res[0])[0]]);
				}
				connection.query('UPDATE users SET ?? = ? WHERE username = ?', [key, newfilename, this.username], async (error, results, fields) => {
					if (error) {
						console.log("Error in updating user image");
						unlinkImage("user_images/" + newfilename);
						ret(error, null);
					}
					else {
						this.profileIsComplete((picerr, picres) => {
							ret(null, (picerr === null));
						});
					}
				});
			}
		});
	}

	deleteImage(key, req, ret) {
		connection.query('SELECT ?? FROM users WHERE username = ?', [key, this.username], async (err, res, fields) => {
			if (err) {
				console.log("Error connecting with database");
				console.error(err);
				ret(err, null);
			}
			else {
				if (res[0][Object.keys(res[0])[0]]) {
					unlinkImage("user_images/" + res[0][Object.keys(res[0])[0]].substring(("http://" + req.get('host') + "/upload/").length));
					connection.query('UPDATE users SET ?? = NULL WHERE username = ?', [key, this.username], async (error, results, fields) => {
						if (error) {
							console.log("Error connecting with database");
							console.error(error);
							ret(error, null);
						}
						else {
							if (key == "img0_path") {
								this.profileIsComplete((picerr, picres) => {
									ret(null, (picerr === null));
								});
							}
							else
								ret(null, false);
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
				if (isProfileComplete(results[0])) {
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
