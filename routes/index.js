/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.pointstable = function(req, res){
  res.render('pointstable', { title: 'IPL-2014 score board..!!' });
};
