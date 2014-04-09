exports.matchesinorder = function(db) {
  return function(req, res) {
	db.collection('match').find().toArray(function (err, items) {
      res.json(items);
    })
  }
};
