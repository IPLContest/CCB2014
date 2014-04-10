exports.allmatches = function(db) {
  return function(req, res) {
	db.collection('match').find().toArray(function (err, items) {
      res.json(items);
    })
  }
};

exports.players = function(db) {
    return function(req, res) {
        var collection = db.get('teams');
         var teamid=req.param('teamid');
        collection.find({"_id":parseInt(teamid)},{},function(e,docs){
            res.render('players', {
                "teams" : docs
            });
        });
    };
};


exports.teams = function(db) {
    return function(req, res) {
        var collection = db.get('teams');
        collection.find({},{},function(e,docs){
            res.render('teams', {
                "teams" : docs
            });
        });
    };
};

exports.matches = function(db) {
    return function(req, res) {
        var collection = db.get('match');
        collection.find({},{},function(e,docs){
            res.render('matches', {
                "match" : docs
            });
        });
    };
};


exports.searchteams = function(db) {
	return function(req, res) {

	var collection = db.get('match');
	var teamsdata = db.get('teams');
	var date=req.param('date');

//	require('date-format-lite');
//	var now = new Date() ;
//	Date.masks.default = 'MM/DD/YY';
//  	date=now.format();
//	console.log(date.toString());

	//var date1 = date.getMonth()+"/"+date.getDate()+"/"+date.getYear();

	collection.find({"date":date},{},function(e,docs){
	for (var i=0; i<docs.length; i++) {
	var doc=docs[i];
	doc.teams=[];
	var teamInfo =[];
	teamsdata.find({"_id":doc.team_1_id},{},function(e,teamdoc){
	doc.teams.push(teamdoc);
	teamsdata.find({"_id":doc.team_2_id},{},function(e,teamdoc){
	console.log("team 2");
	console.log("Pushing team2");
	doc.teams.push(teamdoc);
	console.log("Print Docs");
	console.log(docs);
	console.log("Rendering");
	res.render('searchedmatches', {
	"match" : docs,
	});

	});

	});


	}

	});
	};
};


exports.addUserMatchInfo = function(db) {
    return function(req, res) {
    console.log(req.param('matchid'));
    console.log(req.param('team'));
    console.log(req.param('player'));

    var matchid=req.param('matchid');
    var teamid=req.param('team');
    var playerid=req.param('player');
     var usercollection = db.get('users');
     usercollection.find({"_id":"A040255","contest": {$elemMatch:{"match_id":matchid}}},{},function(e,docs){
         var doclength=docs.length;
        console.log("Doc Length");
        console.log(doclength);
     if(doclength < 1){
     console.log("Doc Length less than 1");
         console.log("Doc Length more than 1");
     usercollection.update({ _id: "A040255"},{$push :{contest:{"match_id":matchid,"match_winner_entry":teamid,"mom_entry":playerid}}}, function(err, records){
           res.render('index', { err: 'Match Info is not valid' });

      });

     }else{
     console.log("Doc Length more than 1");
     usercollection.update({ _id: "A040255", "contest.match_id" :matchid },{$set :{ "contest.$.match_winner_entry": teamid,"contest.$.mom_entry":playerid}}, function(err, records){
          res.render('index', { err: 'Match Info is not valid' });

      });

     }
        });

    };
};


