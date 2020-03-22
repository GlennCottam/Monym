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

var sonarr_info = {};
var sonarr_series = {};

setInterval(async function()
{
    console.log("Pulling Data");
    await pullData();
    console.log("Data Successfully Pulled")
}, 100000);


async function pullData()
{
    console.log("Grabbing Info From Sonarr");
    sonarr_info = await sonarr("/system/status");
    
    console.log("Grabbing Series From Sonarr");
    sonarr_series = await sonarr("/series");
}


// WebServer
app.get('/', async function(req, res)
{
    res.render('index', {config, info: sonarr_info, series: sonarr_series});
    console.log("GET Request for '/'");
});

console.log("Starting WebServer");

app.listen(port, async function()
{
    await pullData();
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
