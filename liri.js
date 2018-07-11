require("dotenv").config();

// variables
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var userInput = process.argv[2];
var nodeArguments = process.argv;


var twitClient = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

switch (userInput) {
    case "my-tweets": {
        tweet();
        break;
    }
    case "spotify-this-song": {
        var songName = "";
        for (var i = 3; i < nodeArguments.length; i++) {
            if (i > 3 && i < nodeArguments.length) {
                songName = songName + "+" + nodeArguments[i];
            }
            else {
                songName += nodeArguments[i];
            }
        }
        if (songName == "") {
            songName = "Despacito"
            spotifySong(songName);
        } else {
            spotifySong(songName);
        }
        break;
    }
    case "movie-this": {
        var movieName = "";
        for (var i = 3; i < nodeArguments.length; i++) {
            if (i > 3 && i < nodeArguments.length) {
                movieName = movieName + "+" + nodeArguments[i];
            }
            else {
                movieName += nodeArguments[i];
            }
        }
        if (movieName == "") {
            movieName = "Avatar"
            filmName(movieName);
        } else {
            filmName(movieName);
        }
        break;
    }
    case 'do-what-it-says': {
        fs.readFile("random.txt", "utf8", function (error, data) {

            if (error) {
                return console.log(error);
            }
            console.log(data);
            var dataArr = data.split(",");

            console.log(dataArr);

            var action = dataArr[0];
            var movieSong = dataArr[1];  

            console.log(action);
            console.log(movieSong);

            switch (action) {
                case "my-tweets": {
                    tweet();
                    break;
                }
                case "spotify-this-song": {
                    spotifySong(dataArr[1]);
                    break;
                }
                case "movie-this": {
                    movie(dataArr[1]);
                    break;
                }
            }
        });
        break;
    }
        function filmName(filmName) {
            var queryUrl = "http://www.omdbapi.com/?t=" + movieName +
                "&y=&plot=short&apikey=trilogy";
            request(queryUrl, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    console.log("Rotten Tomatoes: " +
                        JSON.parse(body).Ratings[1].Value);
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Language: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Actors: " + JSON.parse(body).Actors);
                }
            });
        }

        function spotifySong(song) {

            spotify.search({ type: 'track', query: songName },
                function (error, song) {
                    console.log(error);
                    if (!error) {
                        console.log(song.tracks.items[0].artists[0].name);
                        console.log(song.tracks.items[0].name);
                        console.log(song.tracks.items[0].preview_url);
                        console.log(song.tracks.items[0].album.name);

                    }
                });
        }

        function tweet() {
            twitClient.get('statuses/user_timeline', {
                screen_name:
                    'joens16', count: 20
            }, function (error, tweets, response) {

                for (i = 0; i < tweets.length; i++) {
                    console.log('================')
                    console.log('')
                    console.log('')
                    console.log(tweets[i].text);
                    console.log('')
                    console.log('')
                    console.log('================')
                }
            });
        }
}