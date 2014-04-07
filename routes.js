var GuessingRound = require('./models/models');
var spawn = require('child_process').spawn;

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

module.exports = function(app) {
	// API ---------------
	// Create a new round
	app.get('/api/start', function (req, res) {
		var article = spawn('python', ['random_article.py']);
		var result_word = '';
		article.stdout.on('data', function (data) {
			result_word += data.toString();
		});
		article.on('close', function (code) {
			var sentences = spawn('python', ['article_sentences.py', result_word]);
			var result_sentences = '';
			sentences.stdout.on('data', function (tata) {
				result_sentences += tata.toString();
			});
			sentences.on('close', function (code) {
				try {
					var data = JSON.parse(result_sentences);
					console.log(data);
					// Data should be a JSON object
					GuessingRound.create({
						hint1: data['hint1'],
						hint2: data['hint2'],
						hint3: data['hint3'],
						article: data['article'],
						category: data['category']
					}, function(err, guessing) {
						if (err) {
							res.send(err);
						}
						res.json(guessing);
					});
				} catch (e) {
					alert("Something went wrong with the question. Please try again.")
					console.log("Something went wrong: " + e);
					res.render('index-heroku.jade');
				}
			});
		});
	});

	// Submit a guess. attempt is indexed by 1
	app.post('/api/play', function (req, res) {
		console.log(req.body);
		var attempts = req.body.attempts;
		var guess = req.body.guess;
		var current = GuessingRound.findById(req.body.id, function (err, guessing) {
			var answer = guessing['article'].toUpperCase();
			if (err) {
				res.send(err);
			}
			if (guess.toUpperCase() === answer || answer.startsWith(guess.toUpperCase()) && answer.slice(-1) == ")") {
				res.render("finished.jade", {"positivemessage": "Congratulations, you won! View the article you conquered:", "article": guessing['article']});
				guessing.remove();
			} else if (attempts > 3) {
				res.render("finished.jade", {"negativemessage": "Unfortunately, you ran out of guesses. Here is the answer:", "article": guessing["article"]});
				guessing.remove();
			} else {
				//res.render('hint' + attempts + ".jade", guessing)
				res.render('hint' + attempts + "-heroku.jade", guessing);
			}
		})

	});

	// Application ----------------
	app.get('*', function (req, res) {
		//res.render('index.jade');
		res.render('index-heroku.jade');
	});
};
