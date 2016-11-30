var express = require('express');
var router = express.Router();
var fs = require('fs');
var Converter = require('csvtojson').Converter;
var converter = new Converter({});

//Get home page
router.get('/', function (req, res, next) {
	var resData = {date: getFormattedDate(), name: "Justin"};
	getBills(res, resData);
});

var getBills = function (resObject, resData) {
	var stream = fs.createReadStream("./data/bills.csv");
	stream.pipe(converter);

	converter.on("end_parsed", function (jsonArray) {
		//Append bill data to resData, then render home page
		resData.bills = formatData(jsonArray);
		console.log(resData);
		resObject.render('home', resData);
	});
}

var getFormattedDate = function() {
	var date = new Date();
	return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
}

Date.prototype.monthDays = function() {
	var d = new Date(this.getFullYear(), this.getMonth()+1, 0);
	return d.getDate();
}

var formatData = function(json) {
	var date = new Date();
	var formattedData = {};
	formattedData.thisWeek = [];
	formattedData.nextWeek = [];

	var daysInThisMonth = date.monthDays();

	for (var i = 0; i < json.length; i++) {
		if (((date.getDate() + 7) - daysInThisMonth) <= 0){

			if ((date.getDate() <= json[i].dueDate) && ((date.getDate() + 7) > json[i].dueDate)) {
				formattedData.thisWeek.push(json[i]);
			}

			if (((date.getDate() + 7) <= json[i].dueDate) && ((date.getDate() + 14) > json[i].dueDate)) {
				formattedData.nextWeek.push(json[i]);
			}

		} else {

			if ((date.getDate() <= json[i].dueDate) || (((date.getDate() + 7) - daysInThisMonth) > json[i].dueDate)) {
				formattedData.thisWeek.push(json[i]);
			}

			if ((((date.getDate() + 7) - daysInThisMonth) <= json[i].dueDate) && (((date.getDate() + 14) - daysInThisMonth) > json[i].dueDate)) {
				formattedData.nextWeek.push(json[i]);
			}
		}
	}

	return formattedData;
}

module.exports = router;