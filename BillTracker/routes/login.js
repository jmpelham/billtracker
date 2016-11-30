var express = require('express');
var router = express.Router();
var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy;

router.post('/', function(req, res) {
	res.redirect('home');
});

passport.use(new LocalStrategy(
	function(usename, password, done) {
		User.findOne({ username: username }, function (err,user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, { message: 'Incorrect username.'});
			}
			if (!user.validPassword(password)) {
				return done(null, false, { message: 'Incorrect password.'});
			}
			return done(null, user);
		});
	}
));

module.exports = router;