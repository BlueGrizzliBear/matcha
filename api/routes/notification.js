var express = require('express');
var router = express.Router();
var checkToken = require('../middleware/token');
var Models = require('../models/models');

/* GET /notification - Retrieve user notifications */
router.get('/', checkToken, function (req, res, next) {
	const notification = new Models.Notification(res.locals.results.id);

	notification.find((error, results) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		else {
			res.status(200).json(results).end();
		}
	})
});

/* GET /notification/read - Set user notifications to read */
router.get('/read', checkToken, function (req, res, next) {
	const notification = new Models.Notification(res.locals.results.id);

	notification.setNotificationRead((error, results) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		else {

			res.status(200).json(results).end();
		}
	})
});

module.exports = router;
