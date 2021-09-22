const connection = require('../config/db');

class Watch {
	constructor(watching_user_id = null, watched_user_id = null) {
		this.watching_user_id = watching_user_id;
		this.watched_user_id = watched_user_id;
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
			if (i == 'watching_user_id' && !Number.isInteger(set[i])) {
				error("Invalid watching_user_id format");
				return;
			}
			if (i == 'watched_user_id' && !Number.isInteger(set[i])) {
				error("Invalid watched_user_id format");
				return;
			}
		}
		return error(null);
	};

	getWatchingUserId() {
		return this.watching_user_id;
	};

	getWatchedUserId() {
		return this.watched_user_id;
	};

	create(ret) {
		connection.query('INSERT INTO watches SET ?', [{ watching_user_id: this.watching_user_id, watched_user_id: this.watched_user_id }], async (error, results, fields) => {
			if (error) {
				console.log("Error occured on watch creation inside model");
				ret(error, results);
			}
			else {
				// console.log("Watch registered sucessfully inside model");
				ret(error, results);
			}
		});
	};

	find(ret) {
		connection.query('SELECT * FROM watches WHERE watched_user_id = ?', [this.watched_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding watched_user_id in tokens table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results.length);
			}
		});
	};

	delete(ret) {
		connection.query('DELETE FROM watches WHERE watching_user_id = ? AND watched_user_id = ?', [this.watching_user_id, this.watched_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured erasing watching_user_id in tokens table");
				console.log(error);
				ret(error, null);
			}
			else
				ret(null, results);
		});
	};
}

module.exports = Watch;
