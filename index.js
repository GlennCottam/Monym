console.log("Server Spooling Up\nImporting: Express");
const Express = require('express');
const app = Express();
console.log("Importing: Cors");
const cors = require('cors');
console.log("Importing: Request");
const request = require('request');
console.log("Importing: fs");
const fs = require('fs');
const port = 6969;

const config = JSON.parse(fs.readFileSync('config/config.json'));
console.log("Config File loaded");

app.use(cors());
app.set('view engine', 'ejs');
app.use(Express.static('public'));

// WebServer
app.get('/', async function(req, res)
{
    console.log("Grabbing Info From Sonarr");
    var info = await sonarr("/system/status");

    console.log("Grabbing Download Queue From Sonarr");
    var queue = await sonarr("/queue");
    
    console.log("Grabbing Series From Sonarr");
    var series = await sonarr("/series");

    var message = "hello world";
    res.render('index', {message: message, info: info, queue: queue, series});
    console.log("GET Request for '/'");
});

console.log("Starting WebServer");

app.listen(port, function()
{
    console.log("Server Ready");
});

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
