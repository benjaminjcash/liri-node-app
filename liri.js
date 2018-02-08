var fs = require('fs');
var inquirer = require('inquirer');

inquirer.prompt([
    {
        type: "list",
        name: "initial",
        message: "What do you want Liri to do?",
        choices: [
            {   
                name: "my-tweets",
                value: "twitter",
                short: "Here are your latest tweets!"
            },
            {
                name: "spotify-this-song",
                value: "spotify",
                short: "Search Spotify!"
            },
            {
                name: "movie-this",
                value: "omdb",
                short: "Search the Open Movie Database!"
            },
            {
                name: "do-what-it-says",
                value: "random",
                short: "I hope you like suprises!"
            }
        ]
    }
]).then(function(input) {
    switch (input.initial) {
        case "twitter":
            getTweets();
            break
        case "spotify":
            searchSpotify();
            break
        case "omdb":
            searchOmdb();
            break
        case "random":
            break
    }
})

//sends request to Twitter API and returns latest tweets.
function getTweets() {
    var Twitter = require('twitter');
    // var twitterKeys = require('./keys.js');

    var client = new Twitter({
        consumer_key: 'vcAItYM6mje0GMbUQdYkKTLCf',
        consumer_secret: 'ZzJ10y9kSrnsmNB6GrqeCl00Zz4RbjWPrDPk1Lx3EnFCXquGJT',
        access_token_key: '960337225828392960-aBPkL8YJvbBOA4VdKWTkTPjM4UXN9oB',
        access_token_secret: 'YJTANCCO2pZLAhI3yyim0g59eDNLS8HHvTBqNQvalQUgW'
    });

    var params = { screen_name: 'cash_bmoney' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("~Siri~ Here are your latest Tweets!")
            for(let i=0; i<tweets.length; i++) {
                console.log("...")
                console.log(tweets[i].text);
            }
        }
    });
}

//asks for user to input song information, then sends request to Spotify API and displays song data.
function searchSpotify() {
    var Spotify = require('node-spotify-api');
    inquirer.prompt([
        {
            type: "input",
            name: "query",
            message: "Search Spotify:"
        }
    ]).then(function(input) {
        var query = input.query;
        if (input.query == "") {
            query = "The Sign Ace of Base"
        }
        var spotify = new Spotify({
            id: '6a64f24b939b40a7aa70bd260e2d2c53',
            secret: 'c0a8a40a74944b1c942614bcda20e6ff'
        });
        spotify.search({ type: "track", query: query }, function (error, data) {
            if(error) {
                console.log(error)
            } else {
                var title = data.tracks.items[0].name;
                var artist = data.tracks.items[0].artists[0].name;
                var album = data.tracks.items[0].album.name;
                var previewLink = data.tracks.items[0].preview_url;
                if(!previewLink) {
                    previewLink = "No preview available :("
                }
                console.log("~Siri~ Here is some information about " + title + ".")
                console.log("...");
                console.log("Title: " + title);
                console.log("Artist: " + artist);
                console.log("Album: " + album);
                console.log("Preview: " + previewLink); 
                console.log("...");
            }
        })
    })
}

//asks for user to input movie information, then sends request to omdb and displays movie data.
function searchOmdb() {
    var request = require('request');
    inquirer.prompt([
        {
            type: "input",
            name: "query",
            message: "Search Imdb:"
        }
    ]).then(function (input) {
        var query = input.query
        if(query == "") {
            query = "Mr. Nobody"
        }
        var queryURL = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";
        request(queryURL, function(error, response, body) {
            if(error) {
                console.log(error)
            }            
            var title = JSON.parse(body).Title;
            var year = JSON.parse(body).Year;
            var imdbRating = JSON.parse(body).Ratings[0].Value;
            var rottenRating = JSON.parse(body).Ratings[1].Value;
            var country = JSON.parse(body).Country;
            var language = JSON.parse(body).Language;
            var plot = JSON.parse(body).Plot;
            var actors = JSON.parse(body).Actors;

            console.log("~Siri~ Here is some information about " + title + "")
            console.log("...");
            console.log("Title: " + title);
            console.log("Year: " + year);
            console.log("imdb Rating: " + imdbRating);
            console.log("Rotten Tomatoes Rating: " + rottenRating);
            console.log("Country: " + country);
            console.log("Language: " + language);
            console.log("Plot: " + plot);
            console.log("Actors: " + actors);
            console.log("...");
        })
    })
}




