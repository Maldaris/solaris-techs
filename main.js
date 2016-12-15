var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var fs = require('fs');
var path = require('path');
var database = require('./db/connect').applicationConnection;

var DefaultsModel = database.model('DefaultModel');
DefaultsModel.findOne({}, function(err, result){
  if(err) throw err;
  if(result === null){
    (new DefaultsModel()).save(function(err){
      if(err) throw err;
    });
  }
});

var app = express();

var config = fs.readFileSync(path.join(__dirname,'/config/development.json'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ 'extended' : true }));
app.use('/public', express.static('public'));

var loadSecret = function(path) {
  try{
    return require('fs').readFileSync(path).toString();
  } catch (e){
  return "GENERATE-A-SESSION-KEY";
  }
};

app.use(session({
  secret: loadSecret(__dirname + '.sessionKey'),
  resave: false,
  saveUninitialized: true,
}));

require('./routeLoader').init(app, database, '/routes');
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(80);
