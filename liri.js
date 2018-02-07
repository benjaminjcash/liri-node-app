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
                short: "Search the Online Movie Database!"
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
    var twitterKeys = require('./keys.js');

    var client = new Twitter({
        consumer_key: twitterKeys.consumer_key,
        consumer_secret: twitterKeys.consumer_secret,
        access_token_key: twitterKeys.access_token_key,
        access_token_secret: twitterKeys.access_token_secret
    });

    var params = { screen_name: 'cash_bmoney' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log(error);
        } else {
            console.log(response);
        }
    });
}

//asks for user to input song title, then sends request to Spotify API and displays song data.
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
                console.log("Title: " + title);
                console.log("Artist: " + artist);
                console.log("Album: " + album);
                console.log("Preview: " + previewLink); 
            }
        })
    })
}

function searchOmdb() {
    var request = require('request');
    inquirer.prompt([
        {
            type: "input",
            name: "query",
            message: "Search Omdb:"
        }
    ]).then(function (input) {
        console.log(input.query)
    })
}




