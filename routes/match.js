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


exports.multimatches = function(req,res) {
    var step    = require("step");
   
  step(
        function one()
        {
            console.log("one");

           // if (true)
            //    return res.send("one");

            this();
        },
        function two()
        {
            console.log("two");
           //return res.send("two");
      res.render('searchedmatches', {
    "status" : "fail",
    "statusmessage":"No Matches Found today",
    });
           
        }
    );

};


exports.searchteams1 = function(req,res) {
    // Database
var async = require("node-async");
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/cpl2014');
var collection = db.get('match');
var teamsdata = db.get('teams');
 console.log("Search teamsinvoked");

   

    require('date-format-lite');
    var now = new Date() ;
    Date.masks.default = 'MM/DD/YY';
    date=now.format();
    console.log(date.toString());
   var alldocs;
 
       collection.find({"date":date},{},function(e,docs){

            async.each(items,
  // 2nd parameter is the function that each item is passed into
  function(doc, callback){
    // Call an asynchronous function (often a save() to MongoDB)
  //  item.someAsyncCall(function (){
      // Async call is done, alert via callback
      console.log(doc.team_1_id);
      callback();
   // });
  },
  // 3rd parameter is the function call when everything is done
  function(err){
    // All tasks are done now
  //  doSomethingOnceAllAreDone();
    console.log("done everything");
  }
);

});





        /* console.log("docs size");
         console.log(docs.length);
         //console.log(docs);
        c=docs.length;
        for (var i=0; i<docs.length; i++) {
            console.log("=================================");
        console.log("Iterating the match");
        var doc=docs[i];
        doc.teams=[];
        var teamInfo =[];
        //console.log(doc);
        teamsdata.find({"_id":{$in :[doc.team_1_id,doc.team_2_id]}},{},function(e,teamdoc){
        console.log("Fetching the team info");
        console.log(teamdoc);
        doc.teams.push(teamdoc);
        console.log("Print Docs====");
        count++;
        console.log(count);
      if(count == docs.length){
             console.log("calling two()");
            console.log(docs);
            this(docs);

     }
        
    });

   }


    });
              
        

     
          
        },
        function two(alldocs)
        {
            console.log("Done fetching the matchinfo");
             res.render('searchedmatches', {
                "status" :"success",   
               "match" : alldocs,
            });
           
        }
    );*/

};

exports.searchteams = function(db) {
	return function(req, res) {

	var collection = db.get('match');
	var teamsdata = db.get('teams');
	var date=req.param('date');

	require('date-format-lite');
	var now = new Date() ;
	Date.masks.default = 'MM/DD/YY';
  	date=now.format();
	console.log(date.toString());

	//var date1 = date.getMonth()+"/"+date.getDate()+"/"+date.getYear();

	collection.find({"date":date},{},function(e,docs){
      
    if(docs.length > 0) {   
        var count = 0;
    	for (var i=0; i<docs.length; i++) {
    	var doc=docs[i];
    	doc.teams=[];
    	var teamInfo =[];

        teamsdata.find({"_id":{$in :[doc.team_1_id,doc.team_2_id]}},{},function(e,teamdoc){
       

    	//teamsdata.find({"_id":doc.team_1_id},{},function(e,teamdoc){
    	//doc.teams.push(teamdoc);
    	//teamsdata.find({"_id":doc.team_2_id},{},function(e,teamdoc){
            count++;

    	doc.teams.push(teamdoc);
    	console.log("Print Docs");
    	console.log(doc);
      //  docs[i] = doc;
    	console.log("Rendering");
        if(count == docs.length-1) {
        	res.render('searchedmatches', {
                "status" : "success",   
            	"match" : docs,
        	});
        }

	});

	//});


	}

} else {
    console.log("No matches found");
   res.render('searchedmatches', {
    "status" : "fail",
    "statusmessage":"No Matches Found today",
    });
}

	});
	};
};


exports.addUserMatchInfo = function(db) {
    return function(req, res) {
    console.log(req.param('matchid'));
    console.log(req.param('team'));
    console.log(req.param('player'));

    var matchid=req.param('matchid');
    var teamid=req.param('team');
    var playerid=req.param('player');
     var usercollection = db.get('users');
     usercollection.find({"_id":req.email,"contest": {$elemMatch:{"match_id":matchid}}},{},function(e,docs){
         var doclength=docs.length;
        console.log("Doc Length");
        console.log(doclength);
     if(doclength < 1){
     console.log("Doc Length less than 1");
         console.log("Doc Length more than 1");


     usercollection.update({ _id: req.email},{$push :{contest:{"match_id":matchid,"match_winner_entry":teamid,"mom_entry":playerid,"match_points" :0,
"mom_points" : 0,"bonus_points" : 0}}}, function(err, records){
           res.json( {
                            "status" : "submitted",                            
                             "statusmessage" : "Your entry has been submitted successfully."
                        });

      });

     }else{
     console.log("Doc Length more than 1");
     usercollection.update({ _id: req.email, "contest.match_id" :matchid },{$set :{ "contest.$.match_winner_entry": teamid,"contest.$.mom_entry":playerid}}, function(err, records){
          res.json( {
                            "status" : "submitted",                            
                             "statusmessage" : "Your previous entry has been updated successfully."
                        });

      });

     }
        });

    };
};


