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
				"players":allplayers
				});
	  })	  
    })
  }
};