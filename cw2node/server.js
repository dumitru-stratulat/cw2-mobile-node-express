//Import the express and url modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const { returnAllLessons, insertOrder, updateLesson, search } = require('./db');
const { logger} = require('./logger');
//The express module is a function. When it is executed it returns an app object
const app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//Serve up everything in public
app.use(express.static('public'));

const lessonImagesPath = path.join(__dirname, 'images');

app.use('/images', (req, res, next) => {
  const imagePath = path.join(lessonImagesPath, req.path);
  fs.stat(imagePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send('Image not found');
    }
    res.sendFile(imagePath);
  });
});
app.use(logger);

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});
app.post('/search', jsonParser, async (request, response) => {
	const { searchString } = request.body;
	const lessons = await search(searchString);
	await response.json(lessons);
});
app.get('/lessons', async (request, response) => {
	const lessons = await returnAllLessons();
	await response.json(lessons);
});
app.post('/insertOrder', jsonParser, async (request, response) => {
	const { name, phoneNr, lessonId, spaces } = request.body;
	const log = await insertOrder(name, phoneNr, lessonId, spaces);
	response.json(log);
});
app.put('/updateLessonSpace', jsonParser, async (request, response) => {
	const { lessonId, spaces } = request.body;
	const log = await updateLesson(lessonId, spaces);
	response.json(log);
});

//Start the app listening on port 8080
app.listen(8080);

//Export server for testing
module.exports = app;
