console.log("Server Spooling Up\nImporting: Express");
const Express = require('express');
const app = Express();
console.log("Importing: Cors");
const cors = require('cors');
console.log("Importing: Request");
const request = require('request');
const port = 6969;

app.use(cors());
app.set('view engine', 'ejs');
app.use(Express.static('public'));

// WebServer
app.get('/', async function(req, res)
{
    var info = await sonarr("/system/status");
    var queue = await sonarr("/queue");
    var message = "hello world";
    res.render('index', {message: message, info: info, queue: queue});
    console.log("GET Request for '/'");
});


// API
app.get('/api', function(req, res)
{

});

console.log("Starting WebServer");

app.listen(port, function()
{
    console.log("Server Ready");
});

async function sonarr(endpoint)
{
    var sonarrURL = "http://unraid.mackwnox.ca:8989/api";
    var apiKey = "0e03e7edf2264fc8b942716ca675ca07";
    var url = sonarrURL + endpoint + "?apikey=" + apiKey;

    return new Promise(async resolve =>
    {
        await request(url, {json: true}, (err, res, body) =>
        {
            if(err) throw err;
            resolve(body);
        });
    });
}