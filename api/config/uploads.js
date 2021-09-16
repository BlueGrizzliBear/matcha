const multer = require('multer');
var path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'user_images/');
	},
	filename: (req, file, cb) => {
		// console.log("req.results.id: " + req.results.id);
		const uniqueSuffix = req.results.id.toString() + Date.now() + '-' + Math.round(Math.random() * 1E9);
		// console.log(uniqueSuffix);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	}
});

const whitelist = [
	'image/png',
	'image/jpeg',
	'image/jpg'
];

const uploads = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (!whitelist.includes(file.mimetype)) {
			return cb(new Error('file is not allowed'));
		}
		cb(null, true);
	}
});

module.exports = uploads;
