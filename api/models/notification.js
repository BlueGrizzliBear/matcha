const connection = require('../config/db');
var validators = require('./validate');

/* MODELS */
class Notification {
	constructor(user_id = null, type = null, notification_id = null) {
		this.user_id = user_id;
		this.type = type;
		this.notification_id = notification_id;
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
			if (i == 'user_id' && !Number.isInteger(set[i])) {
				error("Invalid user_id format");
				return;
			}
			if (i == 'type' && !Number.isInteger(set[i])) {
				error("Invalid type format");
				return;
			}
			if ((i == 'message_id' || i == 'like_id' || i == 'watch_id') && !Number.isInteger(set[i])) {
				error("Invalid message/like/watch_id format");
				return;
			}
			if ((i == 'read') && !validators.isBool(set[i])) {
				error("Invalid read format");
				return;
			}
		}
		error(null);
	};

	getUserId() {
		return this.user_id;
	};

	getType() {
		return this.type;
	};

	getNotificationId() {
		return this.notification_id;
	};

	create(ret) {
		/* Validate set and insert into database */
		const set = {
			user_id: this.user_id,
		}
		if (this.type === 1)
			set.message_id = this.notification_id;
		else if (this.type === 2)
			set.like_id = this.notification_id;
		else if (this.type === 3)
			set.watch_id = this.notification_id;
		for (let i in set) {
			if (!validators.validateKey(i, ['user_id', 'type', 'message_id', 'like_id', 'watch_id'])) {
				ret('Validation failed: Unauthorized key', null);
				return;
			}
		}
		this.validate(set, (verr) => {
			if (verr) {
				ret('Validation failed: ' + verr, null);
			}
			else {
				console.log("values validation!")
				connection.query('INSERT INTO notifications SET ?', [set], async (error, results, fields) => {
					if (error) {
						console.log("Error occured on notification creation");
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
		// SELECT n.*, u.username AS sender, m.message \
		// FROM notifications n \
		// LEFT JOIN (\
		// SELECT * , ROW_NUMBER() OVER (PARTITION BY sender_user_id ORDER BY sent_date DESC) rn \
		// FROM messages\
		// ) m \
		// ON (n.message_id IS NOT NULL AND n.message_id = m.id) \
		// LEFT JOIN likes l \
		// ON (n.like_id IS NOT NULL AND n.like_id = l.id) \
		// LEFT JOIN watches w \
		// ON (n.watch_id IS NOT NULL AND n.watch_id = w.id) \
		// LEFT JOIN users u \
		// ON (m.sender_user_id = u.id OR l.liking_user_id = u.id OR w.watching_user_id = u.id) \
		// WHERE (rn = 1 OR rn IS NULL) AND user_id = ? \
		// LIMIT 100
		connection.query('SELECT n.*, u.username AS sender, m.message \
FROM notifications n \
LEFT JOIN (\
SELECT * , ROW_NUMBER() OVER (PARTITION BY sender_user_id ORDER BY sent_date DESC) rn \
FROM messages\
) m \
ON (n.message_id IS NOT NULL AND n.message_id = m.id) \
LEFT JOIN likes l \
ON (n.like_id IS NOT NULL AND n.like_id = l.id) \
LEFT JOIN watches w \
ON (n.watch_id IS NOT NULL AND n.watch_id = w.id) \
LEFT JOIN users u \
ON (m.sender_user_id = u.id OR l.liking_user_id = u.id OR w.watching_user_id = u.id) \
WHERE (rn = 1 OR rn IS NULL) AND user_id = ? \
LIMIT 100', [this.user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding notifications in table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results);
			}
		});
	}

	setNotificationRead(ret) {
		connection.query('UPDATE notifications SET `read` = 1 WHERE user_id = ?', [this.user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured setting user notifications to read in notifications table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results);
			}
		});
	}

}

module.exports = Notification;
