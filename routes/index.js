/*
 * GET home page.
 */

var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';
var nodemailer = require("nodemailer");
var verfiyUrl = 'http://iplcontest2014-geeks2014.rhcloud.com/verifyUser';

exports.index = function(db) {
    return function(req, res) {
                
         if(req.email!= null){
            var collection = db.get('users');
           
            collection.find({"_id" : req.email},function(errData,rec){
                if(rec !=null && rec.length > 0){
                  //  res.render('home', { "record": rec[0]});
                     res.statusCode = 302;
                     res.setHeader("Location", '/home');
                     res.end();
                }else{
				    res.render('index', {arr1: []});    
                }
            });
        }else{
		    var collection = db.get('users');
		    collection.count({},function(errData,rec){
				var arr1 = [];
				while(rec != 0){
					arr1.push(rec%10);
					rec=parseInt(rec/10);
				}
				res.render('index', {arr1: arr1.reverse()});          

			});
        }
    };
};

exports.signup = function(db) {
    return function(req, res) {
		res.render('signup', { title: 'Hello, World!' });
	};
};
exports.pointstable = function(req, res){
  res.render('pointstable', { title: 'IPL-2014 score board..!!' });
};

exports.home = function(db) {
    return function(req, res) {
                 
         console.log("****Intercepted LAN ID*********:" + req.email);

        if(req.email!= null){
            var collection = db.get('users');
           
            collection.find({"_id" : req.email},function(errData,rec){
                if(rec !=null && rec.length > 0){
                  //  res.render('home', { "record": rec[0]});
                    res.render('home');   
                }else{
                }
            });
        }else{
		    var collection = db.get('users');
		    collection.count({},function(errData,rec){
				var arr1 = [];
				while(rec != 0){
					arr1.push(rec%10);
					rec=parseInt(rec/10);
				}
				res.render('index', {arr1: arr1.reverse()});          

			});
        }
    };
};

exports.fetchMatches =function(db,request) {
    return function(req, res) {
	
		
            var collection = db.get('match');
            var teamsdata = db.get('teams');
           
            require('date-format-lite');
            var now = calcTime('+5.5'); ;
            Date.masks.default = 'MM/DD/YY';
            date=now.format();
            console.log("***Today's date:"+date);  

            collection.find({"date":date},{},function(e,docs){

            if(docs.length > 0) {
            
                res.json({
                    "status" : "success",   
                    "match" : docs
                });                    
				

        }else {
             res.json({
                            "status" : "nomatch",   
                            "statusmessage" : "There are no matches today. Check back with us tomorrow."
            });
        }
		});
	
	};
};


function calcTime(offset) {

    // create Date object for current location
    d = new Date();
    
    // convert to msec
    // add local time zone offset 
    // get UTC time in msec
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    
    // create new Date object for different city
    // using supplied offset
    nd = new Date(utc + (3600000*offset));
   
    return nd;

}

function calcTimeFromDate(dt, offset) {

    // create Date object for current location
  // d = new Date();
    
    // convert to msec
    // add local time zone offset 
    // get UTC time in msec
    utc = dt.getTime() + (dt.getTimezoneOffset() * 60000);
    
    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));
     console.log("new date:"+nd);
    return nd;

}



exports.fetchMatchDetails =function(db,request) {
    return function(req, res) {
		           var collection = db.get('match');
                    var teamsdata = db.get('teams');
                    var match_id=req.param('match_id');
                    var moment = require('moment');
					console.log(match_id);   

                    require('date-format-lite');
                   
                    var currentTime=new Date() ;;
                    console.log("Current Server Time:" + currentTime);
                    
                    collection.find({"match_id":match_id},{},function(e,docs){
      
                    if(docs.length > 0) {

                     console.log(docs.length + " matches found");      

                      for (var i=0; i<docs.length; i++) {
                        var doc = docs[i];
                        doc.teams=[];                      
                        var matchtime = calcTimeFromDate(new Date(doc.dateTime),'-9.5');                                                  
                        console.log("Match Time in Server Timezone:" + matchtime);     

                        var current_time_in_ms = currentTime.getTime();
                        var match_time_in_ms = matchtime.getTime();
                        var one_hour=1000*60*60;

                        // Calculate the difference in milliseconds
                        var difference_ms = match_time_in_ms - current_time_in_ms;    

                        console.log("Difference between current time and match time :" + difference_ms);    
                        console.log("Difference between current time and match time in HOURS:" + (difference_ms/one_hour));                      
                   
                        if(difference_ms > 0){
                          doc.disable="N";
                        }else{
                          doc.disable="Y";
                        }

                        teamsdata.find({"_id":{$in :[doc.team_1_id,doc.team_2_id]}},{},function(e,teamdoc){
                        doc.teams.push(teamdoc[0]);
                        doc.teams.push(teamdoc[1]);
                       
                        console.log(docs);
                        res.render('matchinfo', {
                            "status" : "success",   
                            "match" : docs
                        });

                    });
				}				

        }else {
             res.render('home', {
                            "status" : "nomatch",   
                            "statusmessage" : "There are no matches today. Check back with us tomorrow."
            });
        }
		
		});
	};
};
exports.register = function(db,request) {
    return function(req, res) {
        var emailId = req.param('emailId');
		if(emailId != null){
            console.log("Email ID:" + emailId);
			var pass = req.param('pass');
			var firstname = req.param('firstname');
			var lastname = req.param('lastname');
			var lanId = req.param('lanId');
			var collection = db.get('users');
			var document = {"_id" : emailId, "password" : pass ,"first_name" : firstname ,"last_name" :lastname,"lanId" :lanId,"userActiveFlag" : 'N'};
			console.log("Inserting --" + document);
			collection.find({"_id" : emailId},function(errData,rec){
				console.log(rec);
				if(rec ==null || rec.length == 0){
					collection.insert(document, {safe: true}, function(err, records){
					  console.log("Record added as "+records);
					  
						var cipher = crypto.createCipher(algorithm, key);  
						var encrypted = cipher.update(emailId, 'utf8', 'hex') + cipher.final('hex');
		
						var smtpTransport = nodemailer.createTransport("SMTP",{
							service: "Gmail",
							auth: {
								user: "everestpremierleague@gmail.com",
								pass: "epl@target"
							}
						});
						smtpTransport.sendMail({
						   from: "everestpremierleague@gmail.com", // sender address
						   to: emailId, // comma separated list of receivers
						   subject: "Verify Email Address : Everest Premier League 2.0", // Subject line
						   text: "Kindly verify your email address by clicking " + verfiyUrl +"?email=" +encrypted // plaintext body
						}, function(error, response){
						   if(error){
							   console.log(error);
						   }else{
							   console.log("Message sent: " + response.message);
						   }
						});
					});
					res.render('signup', { err: 'please verify email address' });
				}else{
					res.render('signup', { err: 'Email id already exist' });
				}
			});
			
		}else{
			console.log("error ");
			res.render('signup', { err: 'Email id is not valid' });
		}
  };
};

exports.login = function(db,request) {
    return function(req, res) {
        var email =req.param("email");
        var pass = req.param("pass");
        var collection = db.get('users');

        
        collection.find({"_id" : email,"password" : pass},function(errData,rec){
            if(rec !=null && rec.length > 0){
                console.log("*** User Found ****");
                if(rec[0].userActiveFlag == 'N'){
                    res.render('index', { err: 'Email id is not validated' });
                }else{
                    console.log("*** Redirecting to home ****");
                    var cipher = crypto.createCipher(algorithm, key);  
                    var encrypted = cipher.update(email, 'utf8', 'hex') + cipher.final('hex');
                     res.cookie('email',encrypted,{httpOnly: true });
                     res.statusCode = 302;
                     res.setHeader("Location", '/home');
                     res.end();
                   // res.render('home', { record: rec[0] });
                }
            }else{
                res.render('index', { err: 'Email id or password is not valid' });
            }
        });
    };
};

exports.verifyUser = function(db,request) {
    return function(req, res) {
        console.log("sadasdsa");
        var decipher = crypto.createDecipher(algorithm, key);
        var encyemail = req.param('email');
        console.log(encyemail);
        if(encyemail != null){
            var decrypted = decipher.update(encyemail, 'hex', 'utf8') + decipher.final('utf8');
            console.log(decrypted);
            var collection = db.get('users');
            collection.update({"_id" : decrypted},{$set :{"userActiveFlag": "Y"}}, function(err, records){
                if(err){
                    console.log(err);
                     res.statusCode = 302;
                     res.setHeader("Location", '/');
                     res.end();
                }
            });
             console.log("*** Redirecting to home ****");
			 res.cookie('email',encyemail,{httpOnly: true });
			 res.statusCode = 302;
			 res.setHeader("Location", '/home');
			 res.end();
        }
    };
};

exports.matchstats = function(db,request) {
    return function(req, res) {
        res.render('matchstats');
    };
};

exports.userstats = function(db,request) {
    return function(req, res) {
        res.render('userstats');
    };
};

exports.rules = function(db,request) {
    return function(req, res) {
        res.render('rules');
    };
};

exports.signout = function(db,request) {
    return function(req, res) {
		res.cookie('email','akdhhjhdjh',{maxAge : 0,httpOnly: true });
        res.statusCode = 302;
		 res.setHeader("Location", '/');
		 res.end();
    };
};

exports.feedback = function(db,request) {
    return function(req, res) {
           res.render('feedback');
    };
};

exports.feedbacksubmit = function(db) {
    return function(req, res) {
        var userId = req.email;
        var comments = req.param("comments");
        var collection = db.get('feedback');

         var document = {"userId":userId, "comments" : comments};

         collection.insert(document, {safe: true}, function(err, records){
                console.log("Feedback submitte "+records);


                var smtpTransport = nodemailer.createTransport("SMTP",{
                            service: "Gmail",
                            auth: {
                                user: "everestpremierleague@gmail.com",
                                pass: "epl@target"
                            }
                        });
                        smtpTransport.sendMail({
                           from: req.email, // sender address
                           to: "everestpremierleague@gmail.com", // comma separated list of receivers
                           subject: "Issue posted by " + req.email, // Subject line
                           text:  comments// plaintext body
                        }, function(error, response){
                           if(error){
                               console.log(error);
                           }else{
                               console.log("Issue posted and mail has been sent to EPL team: " + response.message);
                           }
                        });

                res.render('feedback');

            });
           
    };
};
