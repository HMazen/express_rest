var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');

var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();
var Song = require('./models/Song');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/', function(req, res){
		res.json({message: 'Welcome!'});
});

router.route('/music')
	// post requests to /api/music
	.post(function(req, res) {
		var song = new Song();
		song.title = req.body.title;
		song.artist = req.body.artist;

		song.save(function(err) {
			if(err)
				res.json({error: 'Song was not saved'});
			res.json({message: 'Song added!'});
		});
	})
	// get requests to /api/music
	.get(function(req, res) {
		Song.find(function(err, songs) {
			if(err)
				res.json({error: 'An error occured'});
			res.json({data: songs});
		});
	});

router.route('/music/:id')
	// get single item
	.get(function(req, res){
		Song.findById(req.params.id, function(err, song) {
			if(err)
				res.json({error: 'Could not fetch song'});
			res.json({data: song});
		});
	})
	// update single item
	.put(function(req, res) {
		Song.findById(req.params.id, function(err, song) {
			if(err)
				res.json({error: 'Could not fetch item'});
			song.title = req.body.title;
			song.artist = req.body.artist;

			song.save(function(err) {
				if(err)
					res.json({error: 'Could not update item'});
				res.json({message: 'Song description updated!'});
			});
		});
	})
	// delete item
	.delete(function(req, res) {
		Song.remove({
			_id: req.params.id
		}, function(err, song) {
			if(err)
				res.json({error: 'Song could not be removed'});
			res.json({message: 'Song successfully removed!'});
		});
	});

// use router to handle all api requests
app.use('/api', router);

// db connection
mongoose.connect('mongodb://localhost/resources');
mongoose.connection.once('open', function() {


	app.listen(port, function(){
		console.log('Listening on port ' + port);
	});


});