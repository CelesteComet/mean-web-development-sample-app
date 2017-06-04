exports.render = function(req, res, next) {
  
  res.render('index', {
    title: 'Hello World',
    user: JSON.stringify(req.user)
  });

}