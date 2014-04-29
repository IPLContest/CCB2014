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
		var formdata=req.param('contestselect');	
		
		var questionMap = {
			'q1': 'orange_cap',
			'q2': 'purple_cap',
			'q3': 'max_sixes',
			'q4': 'ipl_winner',
			'q5': 'runner_up'			
		};		
		var userpredictions = formdata.toString().split(",");
		var predictedArray = [];
		for(i=0; i<userpredictions.length; i++){
			if(userpredictions[i].indexOf("|") > -1){
				predictedArray.push(userpredictions[i]);
			}
		}
		dbv.collection('users').find({"_id":"pkulkarni2@sapient.com"}).toArray(function (err, docs) {
			var doclength=docs.length;
			console.log("doclength : "+doclength);						
			if(doclength > 0){
				if (docs[0].onetime_contest === undefined){					
					var jsonString = '';
					var obj = {};
					var contest = {};
					for(i=0; i<predictedArray.length; i++){
						var dimArray = predictedArray[i].split("|")
						var q = questionMap[dimArray[1]];
						var v = dimArray[0];						
						obj[q] = v;						
						contest['onetime_contest'] = obj;						
					}
					dbv.collection('users').update({ _id: "pkulkarni2@sapient.com"},{$push :contest}, function(err, records){
						console.log("No of records pushed :"+records);
						res.json( {
								"status" : "submitted",                            
								"statusmessage" : "Your entry has been submitted successfully."
						});

					});					
								
				} else {	
					for(i=0; i<predictedArray.length; i++){
						var dimArray = predictedArray[i].split("|")
						var q = dimArray[1];
						var v = dimArray[0];						
						if(q === 'q1'){
							dbv.collection('users').update({'_id': "pkulkarni2@sapient.com"},{$set :{ "onetime_contest.0.orange_cap": v}}, function(err, records){
								console.log("No of records set :"+records);
								console.log("No of records set :"+err);						
							});
						} else if(q === 'q2'){
							dbv.collection('users').update({'_id': "pkulkarni2@sapient.com"},{$set :{ "onetime_contest.0.purple_cap": v}}, function(err, records){
								console.log("No of records set :"+records);
								console.log("No of records set :"+err);						
							});
						}else if(q === 'q3'){
							dbv.collection('users').update({'_id': "pkulkarni2@sapient.com"},{$set :{ "onetime_contest.0.max_sixes": v}}, function(err, records){
								console.log("No of records set :"+records);
								console.log("No of records set :"+err);						
							});
						}else if(q === 'q4'){
							dbv.collection('users').update({'_id': "pkulkarni2@sapient.com"},{$set :{ "onetime_contest.0.ipl_winner": v}}, function(err, records){
								console.log("No of records set :"+records);
								console.log("No of records set :"+err);						
							});
						}else if(q === 'q5'){
							dbv.collection('users').update({'_id': "pkulkarni2@sapient.com"},{$set :{ "onetime_contest.0.runner_up": v}}, function(err, records){
								console.log("Inside Q5 :"+q);
								console.log("No of records set :"+records);
								console.log("No of records set :"+err);						
							});
						}
						
					}
													
				}
			}
		});
    };
};