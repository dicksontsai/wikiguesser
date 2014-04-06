var mongoose = require('mongoose');
module.exports = mongoose.model('GuessingRound', {
	hint1: String,
	hint2: String,
	hint3: String,
	article: String
});

