const connection = require('../config/db');
var validators = require('./validate');
var fetch = require('cross-fetch');
fdewdew
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
	var p = 0.017453292519943295;				// Math.PI / 180
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2;
	return 12742 * Math.asin(Math.sqrt(a));		// 2 * R; R = 6371 km
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
	let score = 1 - ((watches - likes) * 0.1)
	return score < 0 ? 0 : score;
}

function add_match_score(results, set, userId) {
	/*
	Calculate matching score with these citerias (from most to least important) :
	1 - GPS Distance
	2 - Number of common tags
	3 - Fame (likes/views ratio)
	*/
	var search = []

	results.forEach(function (item, i) {
		results[i].proximity = getDistanceFromLatLonInKm(set.location.lat, set.location.long, item.gps_lat, item.gps_long);
		results[i].common_tags = count_common_tags(item.tags, set.tags);
		results[i].fame = calculate_fame(item.likes, item.watches);
		results[i].match_score =
			(1 / results[i].proximity) * 10000	/* (Distance: 10km = 1000 -> 100km = 100 -> 1000km = 10) */
			+ results[i].common_tags * 10		/* (Tags: 0 tag: 0 -> 5 tags: 50) */
			+ results[i].fame * 10				/* (Fame : no fame: 0 -> max fame: 10) */
		if (results[i].id !== userId && results[i].fame <= set.fame.max && results[i].fame >= set.fame.min)
			search.push(results[i])
	});
	return search;
}

/* MODELS */
class Match {
	constructor(user_id = null, username = null) {
		this.user_id = user_id;
		this.username = username;
	};

	validate(set, error) {
		if (!Number.isInteger(set.age.min) || !Number.isInteger(set.age.max)
			|| set.age.max < 0 || set.age.max > set.age.min) {
			error("Invalid age format");
			return;
		}
		if (!Number.isFinite(set.fame.min) || !Number.isFinite(set.fame.max)
			|| set.fame.max < 0.0 || set.fame.max > 1.0
			|| set.fame.min > 1.0 || set.fame.min < 0.0
			|| set.fame.max < set.fame.min) {
			error("Invalid fame format");
			return;
		}
		if (!Number.isFinite(set.location.lat) || !Number.isFinite(set.location.long)
			|| set.location.lat < -90.0 || set.location.lat > 90.0
			|| set.location.lat < -180.0 || set.location.lat > 180.0) {
			error("Invalid gps lat/long format");
			return;
		}
		if (!validators.isTagArray(set.tags)) {
			error("Invalid tags format");
			return;
		}
		error(null);
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
		/* Function to call if fake users don't have gps coordinates
		(fetch gps coordinates from an api corresponding from the city
			and country of the fake user) */
		// this.populate_gps_coordinates()

		/* Validate set and insert into database */
		this.validate(set, (err) => {
			if (err) {
				ret('Validation failed: ' + err, null);
			}
			else {
				const preference = set.preference.split('-')
				const gender = '%' + set.gender + '%'
				connection.query('\
					SELECT u.id, u.username, u.firstname, u.lastname, u.birth_date, u.gender, u.preference, u.city, u.country, u.gps_lat, u.gps_long, u.bio, u.complete, u.img0_path, u.img1_path, u.img2_path, u.img3_path, u.img4_path, COUNT(w.id) watches, COUNT(l.id) likes, GROUP_CONCAT(tu.tag_id) as tags_id, GROUP_CONCAT(t.tag) as tags \
					FROM users u \
					LEFT JOIN watches w \
						ON u.id = w.watched_user_id \
					LEFT JOIN likes l \
						ON u.id = l.liked_user_id \
					LEFT JOIN tag_user tu \
						ON u.id = tu.user_id \
					LEFT JOIN tags t \
						ON t.id = tu.tag_id \
					WHERE u.gender IN (?) AND u.complete = 1 AND u.preference LIKE BINARY ? AND YEAR(u.birth_date) BETWEEN ? AND ? \
					GROUP BY u.id',
					[preference, gender, set.age.max, set.age.min],
					async (error, results, fields) => {
						if (error) {
							console.log("Error occured finding matching users in users table");
							console.log(error);
							ret(error, null);
						}
						else {
							if (results.length > 0) {
								results = add_match_score(results, set, this.user_id);
								ret(null, results);
							}
							else {
								ret("No users to match", null);
							}
						}
					});
			}
		});
	};
}

module.exports = Match;
