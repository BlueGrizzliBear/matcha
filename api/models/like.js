const connection = require('../config/db');

class Like {
	constructor(liking_user_id = null, liked_user_id = null) {
		this.liking_user_id = liking_user_id;
		this.liked_user_id = liked_user_id;
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
			if (i == 'liking_user_id' && !Number.isInteger(set[i])) {
				error("Invalid liking_user_id format");
				return;
			}
			if (i == 'liked_user_id' && !Number.isInteger(set[i])) {
				error("Invalid liked_user_id format");
				return;
			}
		}
		return error(null);
	};

	getLikingUserId() {
		return this.liking_user_id;
	};

	getLikedUserId() {
		return this.liked_user_id;
	};

	create(set, ret) {
		/* Validate set and insert into database */
		this.validate(set, (error) => {
			if (error) {
				ret('Validation failed: ' + error, null);
			}
			else {
				connection.query('INSERT INTO likes SET ?', [set], async (error, results, fields) => {
					if (error) {
						console.log("Error occured on like creation inside model");
						ret(error, results);
					}
					else {
						// console.log("Like registered sucessfully inside model");
						ret(error, results);
					}
				});
			}
		});
	};

	find(ret) {
		connection.query('SELECT * FROM likes WHERE liked_user_id = ?', [this.liked_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding liked_user_id in tokens table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(results.length, null);
			}
		});
	};

	delete(ret) {
		connection.query('DELETE FROM likes WHERE liking_user_id = ? AND liked_user_id = ?', [this.liking_user_id, this.liked_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured erasing liking_user_id in tokens table");
				console.log(error);
				ret(error, null);
			}
			else
				ret(null, results);
		});
	};
}

module.exports = Like;
