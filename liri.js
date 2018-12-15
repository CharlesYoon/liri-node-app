require('dotenv').config();

var keys = require('./keys.js');
console.log(keys.spotify);
console.log(keys.omdb);

var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require('fs');

var arg1 = JSON.stringify(process.argv[2]);
var arg2 = JSON.stringify(process.argv[3]);

function run(command, paramenter){
    switch(command){
        case "concert-this":
            axios.get("https://rest.bandsintown.com/artists/" + paramenter + "/events?app_id=codingbootcamp")
            .then(
                function(response){
                    let data = response.data;
                    if (data == null){
                        console.log("Sorry your requested band is not playing");
                    }else{
                        for (var i = 0; i < data.length; i++){
                        console.log(data.lineup[0]);
                        console.log(data[i].venue.name, data[i].venue.city);
                        console.log(data[i].venue.region);
                        console.log(moment(data[i].datetime).format("MM/DD/YYYY"));
                        }
                    }
                }
            )
            break;
        case "spotify-this-song":
            var spotify = new Spotify(keys.spotify);
            spotify
                .search({ type: 'track', query: `${paramenter}`, limit: 1 })
                .then(function(response){
                    console.log(response.tracks.items[0].album.artists[0].name);
                    console.log(response.tracks.items[0].album.name);
                    console.log(response.tracks.items[0].album.external_urls.spotify);
                })
            break;
        case "movie-this":
            axios.get("http://www.omdbapi.com/?t="+ paramenter +"&apikey="+ keys.omdb)
                .then(
                    function(response){
                        console.log(response.data.Title);
                        console.log(response.data.Year);
                        console.log(response.data.tomatoUserRating);
                        console.log(response.data.imbdRating);
                        console.log(response.data.Country);
                        console.log(response.data.Language);
                        console.log(response.data.Plot);
                        console.log(response.data.Actors);
                    }
                )
            break;
        case "do-what-it-says":
            if (!fs.exists){
                console.log("We don't have a file on deck.");
                break;
            }
            var data = fs.readFile();
            var arguments = data.splice(",");
            //rerun the function with spotify instead of do-what-it-says
            //kind of like recursion but not really
            run(arguments[0], arguments[1]);
            break;
    }
}

run(arg1, arg2);

