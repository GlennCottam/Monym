/*
    Monym Service
    Author:     Glenn Cottam
    Licence:    MIT
    Comments:   Main process for Monym, uses ejs to 
                compile the html templates.

*/

console.log("Server Spooling Up\nImporting: Express");
const Express = require('express');
const app = Express();
console.log("Importing: Cors");
const cors = require('cors');
console.log("Importing: Request");
const request = require('request');
console.log("Importing: fs");
const fs = require('fs');
console.log("Loading Config File");
const config = JSON.parse(fs.readFileSync('config/config.json'));
const port = config.client.port;

// Application Configuration
app.use(cors());
app.set('view engine', 'ejs');
app.use(Express.static('public'));

// Global Variables for Sonarr Information
var sonarr_info = {};
var sonarr_series = {};
var radarr_info = {};
var radarr_movies = {};

var endpoints = 
{
    "sonarr": {
        "info": "/system/status",
        "series": "/series"
    },
    "radarr": {
        "info": "/system/status",
        "movies": "/movie"
    }
}


// Automated gathering of data. Performes every few seconds to prevent overloading of system.
setInterval(async function()
{
    console.log("Pulling Data");
    await pullData();
    console.log("Data Successfully Pulled")
}, 100000);

// Function that pulls data from various sources.
async function pullData()
{
    console.log("Grabbing Info From Sonarr");
    // sonarr_info = await sonarr(endpoints.sonarr.info);
    sonarr_info = await sonarr(endpoints.sonarr.info);
    
    console.log("Grabbing Series From Sonarr");
    sonarr_series = await sonarr(endpoints.sonarr.series);

    console.log("Grabbing Info From Radarr");
    radarr_info = await radarr(endpoints.radarr.info);

    console.log("Grabbing Movies From Radarr");
    radarr_movies = await radarr(endpoints.radarr.movies);
}


// Main Web Server (limits API access with EJS)
app.get('/', async function(req, res)
{
    res.render('index', {config, sonarr_info, sonarr_series, radarr_movies, radarr_info});
});

// Starts HTTP server, pulls data.
app.listen(port, async function()
{
    await pullData();
    console.log("Server Ready");
});

// Main function to pull data from Sonarr. Configured with the main configuration file.
async function sonarr(endpoint)
{
    var url = config.sonarr.url + ":" + config.sonarr.port + "/api" + endpoint + "?apikey=" + config.sonarr.api_key;

    return new Promise(async resolve =>
    {
        await request(url, {json: true}, (err, res, body) =>
        {
            if(err) throw err;
            resolve(body);
        });
    });
}

async function radarr(endpoint)
{
    var url = config.radarr.url + ":" + config.radarr.port + "/api" + endpoint + "?apikey=" + config.radarr.api_key;

    return new Promise(async resolve =>
    {
        await request(url, {json: true}, (err, res, body) =>
        {
            if(err) throw err;
            resolve(body);
        });
    });
}


module.exports.config = config;