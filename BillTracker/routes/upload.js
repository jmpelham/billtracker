var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './data/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

var fileFilter = function (req, file, cb) {
	if (file.original.split('.').pop() === 'csv') {
		cb(null, true);
	} else {
		cb(null, false);
		console.log('Invalid file type.');
	}
};

var upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/', upload.single('csvFile'), function(req, res, next) {
	res.redirect("/home");
});

module.exports = router;