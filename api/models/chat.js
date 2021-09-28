const connection = require('../config/db');
var validators = require('./validate');

/* MODELS */
class Chat {
	constructor(sender_id = null, receiver_id = null) {
		this.sender_id = sender_id;
		this.receiver_id = receiver_id;
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
			if (i == 'sender_user_id' && !Number.isInteger(set[i])) {
				error("Invalid sender_user_id format");
				return;
			}
			if (i == 'receiver_user_id' && !Number.isInteger(set[i])) {
				error("Invalid receiver_user_id format");
				return;
			}
			// if (i == 'message' && !validators.isAlphanum(set[i])) {
			// 	error("Invalid message format");
			// 	return;
			// }
			if ((i == 'read') && !validators.isBool(set[i])) {
				error("Invalid read format");
				return;
			}
		}
		error(null);
	};

	getSenderId() {
		return this.sender_id;
	};

	getReceiverId() {
		return this.receiver_id;
	};

	create(message, ret) {
		/* Validate set and insert into database */
		const set = {
			sender_user_id: this.sender_id,
			receiver_user_id: this.receiver_id,
			message: validators.escapeHTML(message)
		}
		for (let i in set) {
			if (!validators.validateKey(i, ['sender_user_id', 'receiver_user_id', 'message'])) {
				ret('Validation failed: Unauthorized key', null);
				return;
			}
		}
		this.validate(set, (verr) => {
			if (verr) {
				ret('Validation failed: ' + verr, null);
			}
			else {
				connection.query('INSERT INTO messages SET ?', [set], async (error, results, fields) => {
					if (error) {
						console.log("Error occured on message creation");
						ret(error, null);
					}
					else {
						ret(null, results);
					}
				});
			}
		});
	}

	find(ret) {
		// SELECT m.id, m.sender_user_id, u1.username AS sender, m.receiver_user_id, u2.username AS receiver, m.message, m.read, m.sent_date FROM (
		//   SELECT *, ROW_NUMBER() OVER (PARTITION BY sender_user_id + receiver_user_id ORDER BY sent_date DESC) rn
		//     FROM messages
		//     WHERE sender_user_id = 1003 OR receiver_user_id = 1) m
		//   LEFT JOIN users u1
		//     ON m.sender_user_id = u1.id
		//   LEFT JOIN users u2
		//     ON m.receiver_user_id = u2.id
		// WHERE rn = 1
		connection.query('SELECT m.id, m.sender_user_id, u1.username AS sender, m.receiver_user_id, u2.username AS receiver, m.message, m.read, m.sent_date \
FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY sender_user_id + receiver_user_id ORDER BY sent_date DESC) rn \
FROM messages WHERE sender_user_id = ? OR receiver_user_id = ?) m \
LEFT JOIN users u1 ON m.sender_user_id = u1.id \
LEFT JOIN users u2 ON m.receiver_user_id = u2.id \
WHERE rn = 1', [this.sender_id, this.sender_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding messages in messages table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results);
			}
		});
	}

	findConversation(ret) {
		// SELECT m.id, m.sender_user_id, u1.username AS sender, m.receiver_user_id, u2.username AS receiver, m.message, m.read, m.sent_date, u1.username
		// FROM messages m
		// JOIN users u1
		//   ON m.sender_user_id = u1.id
		// JOIN users u2
		//   ON m.receiver_user_id = u2.id
		// WHERE (sender_user_id = ? AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = ?)
		// ORDER BY sent_date DESC
		// LIMIT 100
		connection.query('SELECT m.id, m.sender_user_id, u1.username AS sender, m.receiver_user_id, u2.username AS receiver, m.message, m.read, m.sent_date, u1.username \
FROM messages m \
LEFT JOIN users u1 ON m.sender_user_id = u1.id \
LEFT JOIN users u2 ON m.receiver_user_id = u2.id \
WHERE (sender_user_id = ? AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = ?) \
ORDER BY sent_date DESC \
LIMIT 100', [this.sender_id, this.receiver_id, this.receiver_id, this.sender_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding messages in messages table");
				console.log(error);
				ret(error, null);
			}
			else {
				if (results.length > 0) {
					ret(null, results);
				}
				else
					ret("No results", null);
			}
		});
	}

	setMessageRead(ret) {
		connection.query('UPDATE messages SET `read` = 1 WHERE sender_user_id = ? AND receiver_user_id = ?', [this.receiver_id, this.sender_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured setting message to read in messages table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results);
			}
		});
	}

	deleteMessage(messageId, ret) {
		connection.query('DELETE FROM messages WHERE sender_user_id = ? AND receiver_user_id = ? AND id = ?', [this.sender_id, this.receiver_id, messageId], async (error, results, fields) => {
			if (error) {
				console.log("Error occured delete message in messages table");
				console.log(error);
				ret(error, null);
			}
			else {
				if (results.length > 0) {
					ret(null, results);
				}
				else
					ret("No results", null);
			}
		});
	}

	// delete(ret) {
	// 	connection.query('DELETE FROM messages WHERE (sender_user_id = ? AND receiver_user_id = ?) OR (sender_user_id = ? AND receiver_user_id = ?)', [this.sender_user_id, this.receiver_user_id, this.receiver_user_id, this.sender_user_id], async (error, results, fields) => {
	// 		if (error) {
	// 			console.log("Error occured deleting all messages in messages table");
	// 			console.log(error);
	// 			ret(error, null);
	// 		}
	// 		else {
	// 			if (results.length > 0) {
	// 				ret(null, results);
	// 			}
	// 			else
	// 				ret("No results", null);
	// 		}
	// 	});
	// }

}

module.exports = Chat;

// SELECT ANY_VALUE(t1.id), t1.sender_user_id, t1.receiver_user_id, ANY_VALUE(t1.message), ANY_VALUE(t1.read), MAX(t1.sent_date)
// FROM messages t1
// LEFT JOIN messages t2
// ON t1.sender_user_id = t2.receiver_user_id AND t1.receiver_user_id = t2.sender_user_id
// WHERE (t1.sender_user_id < t2.sender_user_id OR t2.sender_user_id IS NULL) AND (t1.sender_user_id = 1003 OR t1.receiver_user_id = 1003)
// GROUP BY t1.sender_user_id, t1.receiver_user_id
