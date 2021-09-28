var express = require('express');
var router = express.Router();
var checkToken = require('../middleware/token');
var Models = require('../models/models');

/* GET /tag - Show user tags list */
router.get('/', checkToken, function (req, res, next) {
	const tag = new Models.Tag(res.locals.results.id);

	tag.findUserTags((error, results) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		else {
			res.status(200).json(results).end();
		}
	});
});

/* POST /tag - Set user tag */
router.post('/', checkToken, function (req, res, next) {
	const tag = new Models.Tag(res.locals.results.id, req.body.tag);
	tag.create((error, results) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		else {
			res.status(200).end();
		}
	});
});


/* DELETE /tag - Delete user tag */
router.delete('/', checkToken, function (req, res, next) {
	const tag = new Models.Tag(res.locals.results.id, req.body.tag);
	tag.deleteUserTag((error, results) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		else {
			res.status(200).end();
		}
	});
});

/* GET /tag/:a - Send all tags begining with the asked letter */
router.get('/search/:letter', checkToken, function (req, res, next) {
	const tag = new Models.Tag();

	tag.findTags(req.params['letter'], (error, results) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		else {
			res.status(200).json(results).end();
		}
	});
});


/* GET /user/username/tag - Show username's profile tags */
router.get('/user/:user_id', checkToken, function (req, res, next) {
	const tag = new Models.Tag(parseInt(req.params['user_id']));

	tag.findUserTags((error, results) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		else {
			res.status(200).json(results).end();
		}
	});
});


module.exports = router;
