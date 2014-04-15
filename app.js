
/**
 * Module dependencies.
 */

var express = require('express');
var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';

var routes = require('./routes');
var user = require('./routes/user');
var match = require('./routes/match');
var admin = require('./routes/admin.js')
var http = require('http');
var path = require('path');
var request = require("request");

// Database

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/cpl2014');

var mongoo = require('mongoskin');
var dbv = mongoo.db("mongodb://localhost:27017/cpl2014", {native_parser:true});



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
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));


 // Handle 500
  app.use(function(error, req, res, next) {
      res.status(500);
     res.render('500', {title:'500: Internal Server Error', error: error});
  });


/*Intercept every request, get lanId from cookie and set it in the request */
app.use(function(req, res, next) {
   var cookies = {};
       req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
       var parts = cookie.split('=');
       cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
       console.log( cookies[ parts[ 0 ].trim() ])
    }

    );

if(cookies['lanId'] != null){
  var decipher = crypto.createDecipher(algorithm, key);
  var decrypted = decipher.update(cookies['lanId'], 'hex', 'utf8') + decipher.final('utf8');
  req.lanId = decrypted;
  console.log("User Id: "+decrypted);
  
   var collection = db.get('users');          
   collection.find({"_id" : req.lanId},function(errData,rec){
		if(!errData){
			res.locals.record = rec[0];
			 if(!(rec !=null && rec.length > 0)){
				 res.render('index', { title: 'Hello, World!' });
			 }
			 next(); 
		}else{
			 res.render('500', {title:'500: Internal Server Error', error: errData});
		}
	});
  
} else {
   req.lanId = null; 
    next(); 
}

});

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index(db));
app.get('/signup', routes.signup(db));
app.get('/home', routes.home(db));
app.post('/register', routes.register(db,request));
app.post('/login', routes.login(db,request));
app.get('/verifyUser', routes.verifyUser(db,request));
app.get('/matchstats', routes.matchstats(db));
app.get('/userstats', routes.userstats(db));
app.get('/rules', routes.rules());

app.get('/userlist', user.userlist(dbv));
app.get('/userpoints', user.userpoints(dbv));
app.get('/userpoints-table', routes.pointstable);
app.get('/allmatches', match.allmatches(dbv));
app.get('/players', match.players(db));
app.get('/teams', match.teams(db));
app.get('/matches', match.matches(db));
app.get('/searchmatches', match.searchteams(db));
app.post('/addUserMatchInfo', match.addUserMatchInfo(db));
app.get('/multimatches', match.multimatches);
app.get('/searchteams1', match.searchteams1);
app.get('/admin', admin.admin(db));
app.post('/adminData', admin.adminData(db));
app.post('/adminSubmit', admin.adminSubmit(db));
app.get('/signout', routes.signout());
app.get('/fetchMatches', routes.fetchMatches(db,request));
app.get('/fetchMatchDetails', routes.fetchMatchDetails(db,request));
app.get('/feedback', routes.feedback(db,request));
app.post('/feedbacksubmit', routes.feedbacksubmit(db));

app.get('*', function(req, res){
  res.render('404', 404);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
