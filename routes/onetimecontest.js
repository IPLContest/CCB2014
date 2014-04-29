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
			console.log("teamdocs.length : "+teamdocs.length);
			for(var i=0; i<teamdocs.length; i++){	
				/*console.log("teamdocs[i].players.length : "+teamdocs[i].players);
				for(var j=0; j<teamdocs[i].players.length; j++){
					allplayers.push(teamdocs[i].players[j]);
				}*/		
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
		var allQuestionsId=req.param('question_id');
		var allQuestionPoints=req.param('question_points');
		var allPlayersId=req.param('player_id');
		var allTeamsId=req.param('teamselect');
		console.log("allQuestionsId : "+allQuestionsId);
		console.log("allQuestionPoints : "+allQuestionPoints);
		console.log("allPlayersId : "+allPlayersId);
		console.log("allTeamsId "+ allTeamsId);
		
		var questionArray = allQuestionsId.toString().split(",");
		var question1 = questionArray[0];
		var question2 = questionArray[1];
		var question3 = questionArray[2];
		var question4 = questionArray[3];
		var question5 = questionArray[4];
				
		var questionPointsArray = allQuestionPoints.toString().split(",");
		var questionPoints1 = questionPointsArray[0];
		var questionPoints2 = questionPointsArray[1];
		var questionPoints3 = questionPointsArray[2];
		var questionPoints4 = questionPointsArray[3];
		var questionPoints5 = questionPointsArray[4];
		
		/*var playersIdArray = allPlayersId.toString().split(",");
		var player1 = playersIdArray[0];
		var player2 = playersIdArray[1];
		var player3 = playersIdArray[2];*/
		
		var teamIdArray = allTeamsId.toString().split(",");
		var teamId1 = teamIdArray[0];
		var teamId2 = teamIdArray[1];
		
		console.log("teamId1 : "+teamId1);
		console.log("teamId2 : "+teamId2);
		dbv.collection('users').find({"_id":"sushant.kumar3@target.com"}).toArray(function (err, docs) {
			var doclength=docs.length;
			console.log("doclength : "+doclength);
			if(doclength < 1){
				console.log("Only one user entry found");
         		dbv.collection('users').update({ _id: "sushant.kumar3@target.com"},{$push :{onetime_contest:{"orange_cap":"player1","purple_cap":"player2","max_sixes":"player3","ipl_winner":teamId1,"runner_up":teamId2,"orange_cap_points":questionPoints1,"purple_cap_points" :questionPoints2, "max_sixes_points" : questionPoints3,"ipl_winner_points" : questionPoints4,"runner_up_points" : questionPoints5,"bonus_points" : 0}}}, function(err, records){
					res.json( {
							"status" : "submitted",                            
							"statusmessage" : "Your entry has been submitted successfully."
					});

				});

			}else{
				console.log("More than one user entry found");
				dbv.collection('users').update({ _id: "sushant.kumar3@target.com"},{$set :{onetime_contest:{"orange_cap":"player1","purple_cap":"player2","max_sixes":"player3","ipl_winner":teamId1,"runner_up":teamId2,"orange_cap_points":questionPoints1,"purple_cap_points" :questionPoints2, "max_sixes_points" : questionPoints3,"ipl_winner_points" : questionPoints4,"runner_up_points" : questionPoints5,"bonus_points" : 0}}}, function(err, records){
					res.json( {
						"status" : "submitted",                            
						"statusmessage" : "Your previous entry has been updated successfully."
					});

				});

			}
		});
    };
};