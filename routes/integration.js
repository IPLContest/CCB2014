exports.fbPost = function(req, res){



var request = require('request');

request.get( {
url: 'https://graph.facebook.com/425010217636327/feed?method=POST&message=Great%20test%20from%20cpl 2014***&format=json&suppress_http_code=1&access_token=CAACEdEose0cBAM1iBoqxZBeJKZB2C7CtN6YP4sKlr3rxAekRShZA7kWZC0mMASTdiSFGciI9j0NyZBqmamZBKC8ZBIDA7rG4tKJhvGZBoHGR8krUzq1qH99j5Shq9KZBPynGBVpEAw28NjEElm3Nj8pmrD2jPK1dJ6ZC19rY3az63PS6xphJSX3QmSAOu5ZCiLBM00ZD'
},
function (err, res1, body) {
if(err)
console.log(err) 
console.log(body);
res.write("got output");
});

};