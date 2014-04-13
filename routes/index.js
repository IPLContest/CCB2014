/*
 * GET home page.
 */

var crypto = require('crypto');
var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';
var nodemailer = require("nodemailer");
var verfiyUrl = 'http://localhost:3000/verifyUser';

exports.index = function(db) {
    return function(req, res) {
         var cookies = {};
         req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
            var parts = cookie.split('=');
            cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
        });
        
        if(cookies['lanId'] != null){
            var collection = db.get('users');
            var decipher = crypto.createDecipher(algorithm, key);
            var decrypted = decipher.update(cookies['lanId'], 'hex', 'utf8') + decipher.final('utf8');

            collection.find({"_id" : decrypted},function(errData,rec){
                if(rec !=null && rec.length > 0){
                    res.render('home', { "record": rec[0]});
                }else{
                }
            });
        }else{
            res.render('index', { title: 'Hello, World!' });
        }
    };
};
exports.pointstable = function(req, res){
  res.render('pointstable', { title: 'IPL-2014 score board..!!' });
};

exports.home = function(db) {
    return function(req, res) {
                 
         console.log("****Intercepted LAN ID*********:" + req.lanId);

        if(req.lanId != null){
            var collection = db.get('users');
          
            collection.find({"_id" : req.lanId},function(errData,rec){
                if(rec !=null && rec.length > 0){

                     console.log("Found user");

                    var collection = db.get('match');
                    var teamsdata = db.get('teams');
                    var date=req.param('date');

                    require('date-format-lite');
                    var now = new Date() ;
                    Date.masks.default = 'MM/DD/YY';
                    date=now.format();
                    console.log(date.toString());  


                    collection.find({"date":date},{},function(e,docs){
      
                    if(docs.length > 0) {

                     console.log(docs.length + " matches found");      

                      for (var i=0; i<docs.length; i++) {
                        doc = docs[i];
                        doc.teams=[];
                        var teamInfo =[];

                        teamsdata.find({"_id":{$in :[doc.team_1_id,doc.team_2_id]}},{},function(e,teamdoc){
       
                        doc.teams.push(teamdoc[0]);
                        doc.teams.push(teamdoc[1]);
                        console.log("Print Docs");
                        console.log(docs);
                        res.render('home', {
                            "status" : "success",   
                            "match" : docs,
                            "record" : rec[0]
                        });
      

                    });

            }


        }else {
             res.render('home', {
                            "status" : "nomatch",   
                            "record" : rec[0],
                            "statusmessage" : "There are no matches today. Check back with us tomorrow."
            });
        }

    });




                  //  res.render('home', { "record": rec[0]});
                }else{
                }
            });
        }else{
            res.render('index', { title: 'Hello, World!' });
        }
    };
};

exports.register = function(db,request) {
    return function(req, res) {
        var lanId = req.param('name');
        request.get("http://localhost:8080/omt/secure/public/checkLanIdExist.do?lanId="+lanId, function (err, res1, body) {
            if (!err) {
                var resultsObj = JSON.parse(body);
                if(resultsObj.responseType.responseCode == 0){
                    var name = lanId;
                    var pass = req.param('pass');
                    var firstName = resultsObj.responseType.firstName;
                    var lastName = resultsObj.responseType.lastName;
                    var emailId = resultsObj.responseType.emailId;
                    
                    var collection = db.get('users');
                    var document = {"_id":name, "pass" : pass ,"firstName" : firstName ,"lastName" :lastName,"emailId" :emailId,"userActiveFlag" : 'N'};
                    
                    collection.find({"_id" : name},function(errData,rec){
                        console.log(rec);
                        if(rec ==null || rec.length == 0){
                            collection.insert(document, {safe: true}, function(err, records){
                              console.log("Record added as "+records);
                              
                                var cipher = crypto.createCipher(algorithm, key);  
                                var encrypted = cipher.update(name, 'utf8', 'hex') + cipher.final('hex');
                
                                var smtpTransport = nodemailer.createTransport("SMTP",{
                                   service: "localhost"
                                });
                                smtpTransport.sendMail({
                                   from: "mayur.vaid@target.com", // sender address
                                   to: "mayur.vaid@target.com", // comma separated list of receivers
                                   subject: "Verify Email Address", // Subject line
                                   text: verfiyUrl +"?lanId=" +encrypted // plaintext body
                                }, function(error, response){
                                   if(error){
                                       console.log(error);
                                   }else{
                                       console.log("Message sent: " + response.message);
                                   }
                                });
                            });
                            res.render('index', { err: 'please verify email address' });
                        }else{
                            res.render('index', { err: 'Lan id already exist' });
                        }
                    });
                    
                }else{
                    console.log("error ");
                    res.render('index', { err: 'Lan id is not valid' });
                }
            }else{
             console.log("err"+err);
            res.render('index', { err: 'Invalid Data' });
            }
        });
  };
};

exports.login = function(db,request) {
    return function(req, res) {
        var name =req.param("name");
        var pass = req.param("pass");
        var collection = db.get('users');

        console.log("User Id" + name);
        console.log("User Password" + pass);
        
        collection.find({"_id" : name,"password" : pass},function(errData,rec){
            if(rec !=null && rec.length > 0){
                console.log("*** User Found ****");
                if(rec[0].userActiveFlag == 'N'){
                    res.render('index', { err: 'Lan id is not validated' });
                }else{
                    console.log("*** Redirecting to home ****");
                    var cipher = crypto.createCipher(algorithm, key);  
                    var encrypted = cipher.update(name, 'utf8', 'hex') + cipher.final('hex');
                     res.cookie('lanId',encrypted,{httpOnly: true });
                     res.statusCode = 302;
                     res.setHeader("Location", '/home');
                     res.end();
                   // res.render('home', { record: rec[0] });
                }
            }else{
                res.render('index', { err: 'Lan id or password is not valid' });
            }
        });
    };
};

exports.verifyUser = function(db,request) {
    return function(req, res) {
        console.log("sadasdsa");
        var decipher = crypto.createDecipher(algorithm, key);
        var encyLanId = req.param('lanId');
        console.log(encyLanId);
        if(encyLanId != null){
            var decrypted = decipher.update(encyLanId, 'hex', 'utf8') + decipher.final('utf8');
            console.log(decrypted);
            var collection = db.get('users');
            collection.update({"_id" : decrypted},{$set :{"userActiveFlag": "Y"}}, function(err, records){
                console.log(records.lanId);
                if(err){
                    console.log(err);
                    res.render('index', { err: 'Lan id is not valid' });
                }
            });
            res.render('home', { title: 'Hello, World!' });
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
