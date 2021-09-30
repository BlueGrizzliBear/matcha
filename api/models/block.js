const connection = require('../config/db');

class Block {
	constructor(blocking_user_id = null, blocked_user_id = null) {
		this.blocking_user_id = blocking_user_id;
		this.blocked_user_id = blocked_user_id;
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
			if (i == 'blocking_user_id' && !Number.isInteger(set[i])) {
				error("Invalid blocking_user_id format");
				return;
			}
			if (i == 'blocked_user_id' && !Number.isInteger(set[i])) {
				error("Invalid blocked_user_id format");
				return;
			}
		}
		return error(null);
	};

	getBlockingUserId() {
		return this.blocking_user_id;
	};

	getBlockedUserId() {
		return this.blocked_user_id;
	};

	create(ret) {
		connection.query('INSERT INTO blocklist SET ?', [{ blocking_user_id: this.blocking_user_id, blocked_user_id: this.blocked_user_id }], async (error, results, fields) => {
			if (error) {
				console.log("Error occured on blocklist creation inside model");
				ret(error, results);
			}
			else {
				// console.log("Like registered sucessfully inside model");
				ret(error, results);
			}
		});
	};

	find(ret) {
		connection.query('SELECT * FROM blocklist WHERE blocked_user_id = ?', [this.blocked_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding blocked_user_id in blocklist table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results.length);
			}
		});
	};

	blocked(ret) {
		connection.query('SELECT * FROM blocklist WHERE blocking_user_id = ? AND blocked_user_id = ?', [this.blocking_user_id, this.blocked_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding blocking_user_id and blocked_user_id in blocklist table");
				console.log(error);
				ret(error, null);
			}
			else {
				if (results.length > 0)
					ret(null, true);
				else
					ret(null, false);
			}
		});
	};

	unblock(ret) {
		connection.query('DELETE FROM blocklist WHERE blocking_user_id = ? AND blocked_user_id = ?', [this.blocking_user_id, this.blocked_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured erasing blocking_user_id in blocklist table");
				console.log(error);
				ret(error, null);
			}
			else {
				// if (results.affectedRows == 0)
				// console.log("Alredy unblocked")
				ret(null, results);
			}
		});
	};
}

module.exports = Block;
