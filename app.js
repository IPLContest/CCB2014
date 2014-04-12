
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var match = require('./routes/match');
var admin = require('./routes/admin.js')
var http = require('http');
var path = require('path');

// Database

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/cpl2014');

var mongoo = require('mongoskin');
var dbv = mongoo.db("mongodb://localhost:27017/nodetest2", {native_parser:true});


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/userlist', user.userlist(dbv));
app.get('/userpoints', user.userpoints(dbv));
app.get('/userpoints-table', routes.pointstable);
app.get('/allmatches', match.allmatches(dbv));
app.get('/players', match.players(db));
app.get('/teams', match.teams(db));
app.get('/matches', match.matches(db));
app.get('/searchmatches', match.searchteams(db));
app.post('/addUserMatchInfo', match.addUserMatchInfo(db));
app.get('/admin', admin.admin(db));
app.post('/adminData', admin.adminData(db));
app.post('/adminSubmit', admin.adminSubmit(db));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
