const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();
const apiKey = "199c9473"
const movies = [
    "Grave of the Fireflies",
    "My Neighbor Totoro",
    "Princess Mononoke",
    "Howl's Moving Castle",
    "From Up on Poppy Hill"
 ];
const fields = [
  "Title","Released", "Runtime","Actors", "Plot", "Poster", "Metascore", "imdbRating"
];

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));
//Parsed Json body in JavaScript object umwandeln, damit es in req.body verfügbar ist
app.use(bodyParser.json());

//Gibt Json Array mit Filmen aus movie-model.js zurück, 
// Object.values() gibt alle Werte eines Objekts zurück, in diesem Fall die Filme
app.get('/movies', function (req, res) {
  const movies = Object.values(movieModel);
  const promises = movies.map(function(movie) {
    //die Poster werden von der OMDB API geholt, da sie nicht in movie-model.js enthalten sind
    return fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        movie.Poster = data.Poster || "N/A";
        return movie;
      });
  });
  Promise.all(promises)
    .then(moviesWithPosters => {
      res.json(moviesWithPosters);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Configure a 'get' endpoint for a specific movie
//Holt Filmdaten von movie-model.js anhand der imdbID, die in der URL übergeben wird, 
// und ergänzt sie um das Poster von der OMDB API, bevor sie als JSON zurückgegeben werden
app.get('/movies/:imdbID', function (req, res) {
  const movie = movieModel[req.params.imdbID];
  if (movie) {
    fetch(`http://www.omdbapi.com/?i=${req.params.imdbID}&apikey=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        movie.Poster = data.Poster || "N/A";
        res.json(movie);
      })
      .catch(error => {
        console.error(error);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(404);
  }
})

/* Task 3.1 and 3.2.
   - Add a new PUT endpoint
   - Check whether the movie sent by the client already exists 
     and continue as described in the assignment */

app.put('/movies/:imdbID', function (req, res) {
  const imdbID = req.params.imdbID;
  let movie = req.body;
  if (movieModel[imdbID]) {
    // Update existing
    movieModel[imdbID] = movie;
    res.sendStatus(200);
  } else {
    // Create new
    movieModel[imdbID] = movie;
    res.status(201).json(movie);
  }
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

