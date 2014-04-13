
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
			res.render('userstats', {
                "status" : "success",   
            	"points" : items,
        	});
		}
	)
  }
};