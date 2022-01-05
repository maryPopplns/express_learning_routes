var path = require('path');
var https = require('https');
var express = require('express');
var url = require('url');
// allows access to process.env
require('dotenv').config();

var app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
});

app.get(/^\/(\d{5})$/, function (req, res, next) {
  let ZIPCODE = req.url.slice(1);
  const options = {
    hostname: 'api.openweathermap.org',
    path: `/data/2.5/weather?q=${ZIPCODE}&appid=${process.env.API_KEY}`,
    method: 'GET',
  };

  const REQUEST = https.request(options, (res1) => {
    res1.on('data', (d) => {
      const PARSED = JSON.parse(d);
      const FAHRENHEIT = ((PARSED.main.temp - 273.15) * (9 / 5) + 32).toFixed(
        2
      );
      const CELSIUS = (PARSED.main.temp - 273.15).toFixed(2);
      res.json({ ZIPCODE, FAHRENHEIT, CELSIUS });
    });
  });

  REQUEST.on('error', (error) => {
    console.error(error);
  });

  REQUEST.end();
});

app.use(function (req, res) {
  res.status(404).render('404');
});

app.listen(3000);
