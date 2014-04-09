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


