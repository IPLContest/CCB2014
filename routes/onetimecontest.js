/*
 * GET One Time Contest page.
 */
exports.onetimecontest = function(dbv) {
  var presentDate = new Date();
  return function(req, res) {
	var responseJSON = [];
    dbv.collection('onetimecontest').find().toArray(function (err, items) {	  
		var eligibleQuestions = [];	  
		for(var i=0; i<items.length; i++){
			var startDate = new Date(items[i].q_start_date);
			var endDate = new Date(items[i].q_end_date);
			if((presentDate > startDate) && (presentDate < endDate)){			
				eligibleQuestions.push(items[i]);
			}	
		}	  
		dbv.collection('teams').find().toArray(function (err, teamdocs) {			
			var allplayers=[];	  
			for(var i=0; i<teamdocs.length; i++){			
				for(var j=0; j<teamdocs[i].players.length; j++){
					allplayers.push(teamdocs[i].players[j]);
				}		
			}
			responseJSON.push("questions",eligibleQuestions);
			responseJSON.push("allplayers",allplayers);		
			res.render('onetimecontest', {
                "status" : "success",   
            	"questions" : eligibleQuestions,
				"players":allplayers,
				"teams":teamdocs
			});
	  });	  
    });
  }
};



exports.contestSubmit = function(dbv) {
	return function(req, res) {
		var questionId=req.param('questionId');
		var questionPoints=req.param('questionPoints');
		var playerId=req.param('player_id');
		var teamId=req.param('team._id');
		dbv.collection('users').find({"_id":req.email}).toArray(function (err, docs) {
			var doclength=docs.length;
			console.log("doclength : "+doclength);
			if(doclength < 1){
				console.log("Only one user entry found");
         		dbv.collection('users').update({ _id: req.email},{$push :{onetime_contest:{"orange_cap":playerId,"purple_cap":playerId,"max_sixes":playerId,"ipl_winner":teamId,"runner_up":teamId,"orange_cap_points":questionPoints,"purple_cap_points" :0, "max_sixes_points" : 0,"ipl_winner_points" : 0,"runner_up_points" : 0,"bonus_points" : 0}}}, function(err, records){
					res.json( {
							"status" : "submitted",                            
							"statusmessage" : "Your entry has been submitted successfully."
					});

				});

			}else{
				console.log("More than one user entry found");
				dbv.collection('users').update({ _id: req.email},{$push :{onetime_contest:{"orange_cap":playerId,"purple_cap":playerId,"max_sixes":playerId,"ipl_winner":teamId,"runner_up":teamId,"orange_cap_points":questionPoints,"purple_cap_points" :0, "max_sixes_points" : 0,"ipl_winner_points" : 0,"runner_up_points" : 0,"bonus_points" : 0}}}, function(err, records){
					res.json( {
						"status" : "submitted",                            
						"statusmessage" : "Your previous entry has been updated successfully."
					});

				});

			}
		});
    };
};