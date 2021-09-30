const connection = require('../config/db');

class Report {
	constructor(reporting_user_id = null, reported_user_id = null, reason = null) {
		this.reporting_user_id = reporting_user_id;
		this.reported_user_id = reported_user_id;
		this.reason = reason
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
			if (i == 'reporting_user_id' && !Number.isInteger(set[i])) {
				error("Invalid reporting_user_id format");
				return;
			}
			if (i == 'reported_user_id' && !Number.isInteger(set[i])) {
				error("Invalid reported_user_id format");
				return;
			}
			if (i == 'reason' && !(typeof set[i] === 'string')) {
				error("Invalid report reason format");
				return;
			}
		}
		return error(null);
	};

	getReportingUserId() {
		return this.reporting_user_id;
	};

	getReportedUserId() {
		return this.reported_user_id;
	};

	create(ret) {
		const set = {
			reporting_user_id: this.reporting_user_id,
			reported_user_id: this.reported_user_id,
			reason: this.reason
		}
		this.validate(set, (verr) => {
			if (verr) {
				ret('Validation failed: ' + verr, null);
			}
			else {
				set.reason = validators.escapeHTML(this.reason);
				connection.query('INSERT INTO reports SET ?', [set], async (error, results, fields) => {
					if (error) {
						console.log("Error occured on reports creation inside model");
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
		connection.query('SELECT * FROM reports WHERE reported_user_id = ?', [this.reported_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding reported_user_id in reports table");
				console.log(error);
				ret(error, null);
			}
			else {
				ret(null, results.length);
			}
		});
	};

	reported(ret) {
		connection.query('SELECT * FROM reports WHERE reporting_user_id = ? AND reported_user_id = ?', [this.reporting_user_id, this.reported_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured finding reporting_user_id and reported_user_id in reports table");
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

	unreport(ret) {
		connection.query('DELETE FROM reports WHERE reporting_user_id = ? AND reported_user_id = ?', [this.reporting_user_id, this.reported_user_id], async (error, results, fields) => {
			if (error) {
				console.log("Error occured erasing reporting_user_id in reports table");
				console.log(error);
				ret(error, null);
			}
			else {
				// if (results.affectedRows == 0)
				// console.log("Alredy unreported")
				ret(null, results);
			}
		});
	};
}

module.exports = Report;
