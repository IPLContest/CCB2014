
/*
 * GET userlist page.
 */

exports.userlist = function(dbv) {
  return function(req, res) {
    dbv.collection('users').find().toArray(function (err, items) {
	  console.log(items);
      res.json(items);
    })
  }
};


exports.userpoints = function(dbv) {
  return function(req, res) {
   dbv.collection('users').aggregate(
		{"$unwind": "$contest" } ,
		{ $group:
			{
			"_id": '$_id',
			"f_name" : {$first : '$first_name'},
			"l_name" : {$first : '$last_name'},
			"t_mom_points": { $sum: '$contest.mom_points' },
			"t_bonus_points": { $sum: '$contest.bonus_points' },
			"t_match_points": { $sum: '$contest.match_points' }
			}
		},
		{
		$project :
			{
			'first_name':'$f_name',
			'last_name':'$l_name',
			'totalPoints' : { $add : [ '$t_mom_points', '$t_bonus_points', '$t_match_points' ] },
			}
		},
		{
		$sort :
			{
			totalPoints : -1
			}
		},
		function (err, items) {
			if (err) return handleError(err);
			console.log(req.headers.accept);
			console.log(items.slice(0,5));
			if(req.headers.accept == "application/json"){
				res.json(items.slice(0,5));
			}else{
			console.log("****** from user.js****");
				console.log(res.locals.record);
				res.render('userstats', {
                "status" : "success",   
            	"points" : items
				});
			}
		}
	)
  }
};

exports.mypoints = function(dbv) {
  return function(req, res) {
   dbv.collection('users').aggregate(
   		{"$match": {"_id":req.email} } ,
		{"$unwind": "$contest" } ,
		{ $group:
			{
			"_id": '$_id',
			"f_name" : {$first : '$first_name'},
			"l_name" : {$first : '$last_name'},
			"t_mom_points": { $sum: '$contest.mom_points' },
			"t_bonus_points": { $sum: '$contest.bonus_points' },
			"t_match_points": { $sum: '$contest.match_points' }
			}
		},
		{
		$project :
			{
			'first_name':'$f_name',
			'last_name':'$l_name',
			'totalPoints' : { $add : [ '$t_mom_points', '$t_bonus_points', '$t_match_points' ] },
			}
		},
		{
		$sort :
			{
			totalPoints : -1
			}
		},
		function (err, items) {
			if (err) return handleError(err);
			console.log(req.headers.accept);
			console.log(items.slice(0,5));			
			res.json(items.slice(0,5));
			
		}	
	)
  }
}



exports.myDashboardUserData = function(dbv) {
	var collection = dbv.get('users');
	
	/*var matchCall = function callDatabase(ele,callback){
		 console.log('start of callDatabase ');
		 var matchCollection = dbv.get('match');
		 var teamsCollection = dbv.get('teams');
		 console.log("matchID : "+ele.match_id);
		     matchCollection.find({"match_id":ele.match_id},{},function(e,matchdoc){
			 console.log("matchdoc : "+matchdoc);
			 teamsCollection.find({"_id":matchdoc.team_1_id},{},function(e,team1doc){
				console.log("teamdoc : "+team1doc);
			 });
			 teamsCollection.find({"_id":matchdoc.team_2_id},{},function(e,team2doc){
				console.log("teamdoc : "+team2doc);
			 });
		});
		 console.log('End of callDatabase ');
	};*/
	  return function(req, res) {
		  var matchCollection = dbv.get('match');
			var teamsCollection = dbv.get('teams');
		   collection.find({"_id":req.email},{},function(e,docs){   
			 var jsonResult = "[";
	    	  for ( var i = 0; i < docs.length; i++) {
	    		  var doc=docs[0];
	    		  var contList = docs[i].contest;
	    		  console.log("Contest List:" + contList);
	    		  if(contList != undefined && contList.length > 0) {
	    		  async.forEachSeries(contList, processEachTask, afterAllTasks);
	    		  var count = 1;
	    		  function processEachTask(task, callback) {
	    			  var matchCollection = dbv.get('match');
	    			    var matchId = task.match_id;
	    			    jsonResult = jsonResult+"{ \n";
	    			      matchCollection.findOne({"match_id":matchId},{},function(e,matchdoc){
	    			    	 console.log("matchdoc : "+matchdoc);
	    			    	 var matchWinner = matchdoc.match_winner;
	    			    	 var matchMOM = matchdoc.man_of_the_match;
	    			    	 console.log("Actual winner team : "+matchWinner + " MOM : "+matchMOM);
	    			    	 teamsCollection.findOne({"_id":matchdoc.team_1_id},{},function(e,team1doc){
	    							console.log("teamdoc : "+team1doc.team_abbr);
	    							
	    							 teamsCollection.findOne({"_id":matchdoc.team_2_id},{},function(e,team2doc){
	 	    						  jsonResult = jsonResult+" \"match\" : \""+team1doc.team_abbr+" Vs "+team2doc.team_abbr+"\",";
	 	    						   teamsCollection.findOne({"_id":task.match_winner_entry},{},function(e,teamPredicted){
	 	    							 jsonResult = jsonResult + "\"predictTeam\" : \""+teamPredicted.team_abbr+"\",";
	 	    							 
	 	    							  console.log("mom_entry : "+task.mom_entry);
	 	    							  teamsCollection.find({"players":{ "$elemMatch" : {"player_id" : task.mom_entry} } },{},function(e,momPlayer){
	 	    								  var playersList = momPlayer[0].players;
	 	    								  for ( var k = 0; k < playersList.length; k++) {
	 	    									// console (k +" :"+playersList[k].player_id)
	 	    									  if(playersList[k].player_id == task.mom_entry) {
	 	    										 jsonResult = jsonResult + "\"predictMoM\" : \""+playersList[k].name+"\",";
	 	    									  }
	 	    								  }
	 	    								  
	 	    								
	 	    								if(matchWinner != null || matchWinner != "")  {
	 	    								 teamsCollection.findOne({"_id":matchWinner},{},function(e,teamWinner){
	 	    								 	console.log("Winner Team: "+ teamWinner);
	 	    								 	if(teamWinner != null) {
	 		 	    							jsonResult = jsonResult + "\"winnerTeam\" : \""+teamWinner.team_abbr+"\",";
	 		 	    							  teamsCollection.find({"players":{ "$elemMatch" : {"player_id" : matchMOM} } },{},function(e,momPlayer){
	 		 	    								  var playersList = momPlayer[0].players;
	 		 	    								  for ( var k = 0; k < playersList.length; k++) {
	 		 	    									// console (k +" :"+playersList[k].player_id)
	 		 	    									  if(playersList[k].player_id == matchMOM) {
	 		 	    										jsonResult = jsonResult + "\"winnerMoM\" : \""+playersList[k].name+"\"\n ,";
	 		 	    										
	 		 	    									  }
	 		 	    								  }
	 		 	    								 jsonResult = jsonResult+" \"matchPoints\" : \""+task.match_points+"\" , \n  \"momPoints\" : \""+task.mom_points+"\",\n";
	 		 	    								jsonResult = jsonResult + "\"bonusPoints\" : \""+task.bonus_points+"\"}";
	 		 	    								  if(contList.length != count) {
			 	    											console.log("last element : "+count);
			 	    											jsonResult = jsonResult+",";
			 	    									}
	 		 	    								 count++;
	 		 	    								 callback();
	 		 	    							 });

	 		 	    							} else {

	 		 	    								jsonResult = jsonResult + "\"winnerTeam\" : \""+"Not Available"+"\",";
	 		 	    								jsonResult = jsonResult + "\"winnerMoM\" : \""+"Not Available"+"\"\n, ";
	 		 	    								jsonResult = jsonResult+" \"matchPoints\" : \""+"0"+"\" , \n  \"momPoints\" : \""+"0"+"\",\n";
	 		 	    								jsonResult = jsonResult + "\"bonusPoints\" : \""+"0"+"\"}";
	 		 	    								 if(contList.length != count) {
			 	    											console.log("last element : "+count);
			 	    											jsonResult = jsonResult+",";
			 	    									}
	 		 	    								 count++;
	 		 	    								 callback();
	 		 	    							}
	 		 	    						   });
											}
	 	    								  
	 	    							 });
	 	    						   });
	 	    							console.log("teamdoc : "+team2doc.team_abbr);
	 	    							
	 	    						 });
	    						 });
	    					    
	    			    	 
	    			    });
	    			  // 
	    			    /*common.findOne('tasks', {'taskId':parseInt(task)}, function(err,res) {
	    			      tArr.push(res); // NOTE: Assuming order does not matter here
	    			      console.log(res);
	    			      callback(err);
	    			    });*/
	    		 }

	    		} else {

	    			jsonResult = "[]";

	    			 res.render('dashboard', {
    		                     "dashboard" : JSON.parse(jsonResult)
    		                 });

	    		}

    			  function afterAllTasks(err) {
    				  if (err) {
    					  console.log("Error!!");
    		            } else {
    		            	jsonResult = jsonResult + "]";
    		            	console.log(jsonResult);
    		            	 res.render('dashboard', {
    		                     "dashboard" : JSON.parse(jsonResult)
    		                 });
    		            }
    			   
    			  }
	    	    	
		      }
			  
	    	//  res.json(docs)
	    	 
	    	
	  });
		  
	  }
	};
