exports.admin = function(db) {
    return function(req, res) {
		var collection = db.get('match');
		var teamsdata = db.get('teams');
		collection.find({},{},function(e,docs){
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
						res.render('admin', {
							"match" : docs,
						});
					});
				});
			}
		});
	};
};

exports.adminData = function(db) {
	return function(req, res) {
		var collection = db.get('match');
		var teamsdata = db.get('teams');
		var match_id=req.param('match_id');
		collection.find({"_id":match_id},{},function(e,docs){
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
						res.render('adminData', {
							"match" : docs,
						});
					});
				});
			}
		});
	};
};

exports.adminSubmit = function(db) {
    return function(req, res) {
		console.log(req.param('match_id'));
		console.log(req.param('team'));
		console.log(req.param('player'));

		var matchid=req.param('match_id');
		var teamid=req.param('team');
		var playerid=req.param('player');
		var matchUpdate = db.get('match');
		var usercollection = db.get('users');
		matchUpdate.find({"_id": matchid},{},function(e,docs){
			var doclength=docs.length;
			console.log("Doc Length");
			console.log(doclength);
			if(doclength == 1){
				console.log("Doc Length less than 1");
				matchUpdate.update({ _id: matchid},{$set :{"match_winner":teamid,"man_of_the_match":playerid}}, function(err, records){
					res.render('adminSubmit', {"match" : docs,});
				});
			}else{
				console.log("Doc Length more than 1");
				matchUpdate.update({ _id: matchid},{$set :{"match_winner":teamid,"man_of_the_match":playerid}}, function(err, records){
					res.render('adminSubmit', { err: 'Match Info is not valid' });
				});
			}
        });
		
		usercollection.find({"contest": {$elemMatch:{"match_id":matchid}}},{},function(e,docs){
			var doclength=docs.length;
			if(doclength < 1){
				console.log('None of the players contested for the match :'+matchid);
			}else{
				//console.log("Doc Length more than 1");
				console.log("Docs...");
				//Logic to update points
				for(i=0; i< doclength; i++) {
					  //do what you gotta do
					  console.log('Team id - '+teamid+' Player id :'+playerid);
					  
					  var contestLength = docs[i].contest.length;
					  for(j=0; j< contestLength; j++) {
							if(matchid==docs[i].contest[j].match_id && docs[i].contest[j].match_winner_entry==teamid && docs[i].contest[j].mom_entry==playerid){
								console.log('Both team and mom matched for the user - '+docs[i].first_name);								
								usercollection.update({ 'contest.match_id': matchid},{$set :{ "contest.$.match_points": 10,"contest.$.mom_points":10,"contest.$.bonus_points":10}}, function(err, records){
									res.render('index', { err: 'Match Info is not valid' });
								});
							} else if(matchid==docs[i].contest[j].match_id && docs[i].contest[j].match_winner_entry==teamid && docs[i].contest[j].mom_entry!=playerid){
								console.log('Only team matched for the user - '+docs[i].first_name);
								usercollection.update({ 'contest.match_id': matchid},{$set :{ "contest.$.match_points": 10,"contest.$.mom_points":0,"contest.$.bonus_points":0}}, function(err, records){
									res.render('index', { err: 'Match Info is not valid' });
								});
							}else if(matchid==docs[i].contest[j].match_id && docs[i].contest[j].match_winner_entry!=teamid && docs[i].contest[j].mom_entry==playerid){
								console.log('Only mom matched for the user - '+docs[i].first_name);
								usercollection.update({ 'contest.match_id': matchid},{$set :{ "contest.$.match_points": 0,"contest.$.mom_points":10,"contest.$.bonus_points":0}}, function(err, records){
									res.render('index', { err: 'Match Info is not valid' });
								});
							}
					  }
					 
				}
			}
        });

    };
};