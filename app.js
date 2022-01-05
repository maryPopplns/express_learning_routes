var path = require('path');
var express = require('express');

var app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index');
});

app.use(function (req, res) {
  res.status(404).render('404');
});
app.listen(3000);
