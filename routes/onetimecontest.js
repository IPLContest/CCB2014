/*
 * GET One Time Contest page.
 */

exports.onetimecontest = function(db) {
    return function(req, res) {
        var contestCollection = db.get('onetimecontest');
		var teamCollection = db.get('teams');
		var now = new Date() ;
		var teamInfo = [];
		var playerInfo = [];
		var contestQuestions = [];
		teamCollection.find({},{},function(e,docs){
			for (var i=0; i<docs.length; i++) {
				var team = docs[i];
				teamInfo.push(team);
				console.log("team : "+team);
				for (var j in team.players) {
					var player = team.players[j];
					playerInfo.push(player);
					contestCollection.find({},{},function(e,contestDocs){
						for (var k=0; k<contestDocs.length; k++) {
							var question = contestDocs[k];
							contestQuestions.push(question);
							res.render('onetimecontest', {
								players : JSON.stringify(playerInfo),
								questions : JSON.stringify(contestQuestions),
								teams : JSON.stringify(teamInfo)
							});
						}
						
					});
				}
			}
		});
	};
};