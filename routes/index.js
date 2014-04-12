/*
 * GET home page.
 */

exports.index = function(req, res){
	var step = require('step');
	step(
        function one()
        {
            console.log("one");

            if (true)
                return res.send("one");

            this();
        },
        function two()
        {
            console.log("two");

            res.send("two");
        }
    );
  res.render('index', { title: 'Express' });
};

exports.pointstable = function(req, res){
  res.render('pointstable', { title: 'IPL-2014 score board..!!' });
};
