/*
 * GET One Time Contest page.
 */

exports.onetimecontest = function(db) {
    return function(req, res) {
        var contestCollection = db.get('onetimecontest');
		var teams = db.get('teams');
		console.log("got the collection : "+contestCollection);
		require('date-format-lite');
		var now = new Date() ;
		teams.find({},{},function(e,teamDocs){
			for (var i=0; i<teamDocs.length; i++) {
				var teamDoc = teamDocs[i];
				teamDoc.players=[];
				teamDoc.questions=[];
				console.log("teamDoc.players : "+teamDoc.players);
				teamDoc.players.push(teamDoc.players);
				contestCollection.find({},{},function(e,contestDocs){
					console.log("contestDocs : "+contestDocs);
					for (var i=0; i<contestDocs.length; i++) {
						var question = contestDocs[i];
						var start = new Date(question.startDate);
						var end = new Date(question.endDate);
						console.log("now.getTime() : "+now);
						console.log("start.getTime() : "+start);
						console.log("end.getTime() : "+end);
						
						if(now > start && now < end) {
							console.log("inside if");
							teamDoc.questions.push(question);
							res.render('onetimecontest', {
							"onetimecontest" : teamDocs
							});
						}
					}
				});
					
			}
		})
		
    };
};