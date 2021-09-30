const connection = require('../config/db');
var validators = require('./validate');

class Tag {
	constructor(user_id = null, tag = null) {
		this.user_id = user_id;
		this.tag = tag;
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
			if (i == 'tag' && !(typeof set[i] === 'string') && !validators.isAlphanum(set[i])) {
				error("Invalid tag format");
				return;
			}
		}
		return error(null);
	};

	getUserId() {
		return this.user_id;
	};

	getTag() {
		return this.tag;
	};

	create(ret) {
		const set = { user_id: this.user_id, tag: this.tag }
		this.validate(set, (verr) => {
			if (verr) {
				ret('Validation failed: ' + verr, null);
			}
			else {
				connection.query('SELECT * FROM tags WHERE tag = ?', [this.tag], async (sterr, stres, fields) => {
					if (sterr) {
						console.log("Error occured on finding tag inside tags table");
						ret(sterr, stres);
					}
					else {
						if (stres.length > 0) {
							connection.query('INSERT INTO tag_user SET tag_id = ?, user_id = ?', [stres[0].id, this.user_id], async (error, results, fields) => {
								if (error) {
									console.log("Error occured on tag creation inside tag_user table");
									ret(error, results);
								}
								else {
									ret(error, results);
								}
							});
						}
						else {
							connection.query('INSERT INTO tags SET tag = ?', [this.tag], async (tagerr, tagres, fields) => {
								if (tagerr) {
									console.log("Error occured on tag creation inside tags table");
									ret(tagerr, tagres);
								}
								else {
									connection.query('INSERT INTO tag_user SET tag_id = ?, user_id = ?', [tagres.insertId, this.user_id], async (error, results, fields) => {
										if (error) {
											console.log("Error occured on tag creation inside tag_user table");
											ret(error, results);
										}
										else {
											ret(error, results);
										}
									});
								}
							});
						}
					}
				});
			}
		});
	};

	findTags(letter, ret) {
		connection.query('SELECT tag FROM tags WHERE tag LIKE ? ORDER BY tag', [letter + '%'], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding tags in tag table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results);
			}
		});
	};

	findUserTags(ret) {
		connection.query('SELECT t.tag \
FROM tag_user tu \
LEFT JOIN tags t \
ON t.id = tu.tag_id \
WHERE user_id = ? \
ORDER BY t.tag', [this.user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding user tags in tag table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results);
			}
		});
	};

	deleteUserTag(ret) {
		connection.query('SELECT t.id, COUNT(tu.id) used \
FROM tags t \
LEFT JOIN tag_user tu \
ON tu.tag_id = t.id \
WHERE t.tag = ?', [this.tag], async (tagerr, tagres, fields) => {
			if (tagerr) {
				console.log("Error occured finding tag in tag table");
				console.log(tagerr);
				ret(tagerr, null);
			}
			else {
				connection.query('DELETE FROM tag_user WHERE user_id = ? AND tag_id = ?', [this.user_id, tagres[0].id], async (error, results, fields) => {
					if (error) {
						console.log("Error occured erasing tag in tag_user table");
						console.log(error);
						ret(error, null);
					}
					else {
						if (tagres[0].used == 1) {
							connection.query('DELETE FROM tags WHERE id = ?', [tagres[0].id], async (error, results, fields) => {
								if (error) {
									console.log("Error occured erasing tag in tags table");
									console.log(error);
									ret(error, null);
								}
								else {
									ret(null, results);
								}
							});
						}
						else {
							ret(null, results);
						}
					}
				});
			}
		});
	}

}

module.exports = Tag;
