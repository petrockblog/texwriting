var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var https = require('https');
var http = require('http');
var fs = require('fs');
var config = require('config')

var mongoose = require('mongoose');
var db = mongoose.connect(db.production);
require('./models/statistics_model.js');

var app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

require('./writer_routes')(app);

var options = {
  ca:   fs.readFileSync('sub.class1.server.ca.pem'),
  key:  fs.readFileSync('texwriting.key'),
  cert: fs.readFileSync('texwriting.crt')
};

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);
