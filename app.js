
/**
 * Module dependencies.
 */

var express = require('express');
var step = require('step');
var routes = require('./routes');
var user = require('./routes/user');
var match = require('./routes/match');
var integration = require('./routes/integration');
var http = require('http');
var path = require('path');


// Database

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/cpl2014');


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

app.use(function(err, req, res, next) {
	console.log("Error occured *****");
  res.render('searchedmatches', {
    "status" : "fail",
    "statusmessage":"No Matches Found today",
    });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/userlist', user.userlist(db));
app.get('/userpoints', user.userpoints(db));
app.get('/userpoints-table', routes.pointstable);
app.get('/allmatches', match.allmatches(db));
app.get('/players', match.players(db));
app.get('/teams', match.teams(db));
app.get('/matches', match.matches(db));
app.get('/searchmatches', match.searchteams(db));
app.post('/addUserMatchInfo', match.addUserMatchInfo(db));
app.get('/multimatches', match.multimatches);
app.get('/searchteams1', match.searchteams1);
app.get('/fbPost', integration.fbPost);

app.get('*', function(req, res){
  res.send('what???', 404);
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
