var mongoose = require('mongoose')
    Article = mongoose.model('Article');

var getErrorMessage = function(err) {
  if(err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        return err.errors[errName].message;
      } else {
        return 'Unknown Server Error';
      }
    }
  }
}

exports.articleByID = function(req, res, next, id) {
  Article.findBy(id).populate('creator', 'email').exec(function(err, article) {
    if(err) {
      return next(err);
    }

    if(!article) {
      return next(new Error('Failed to load article' + id));
    }

    req.article = article;
    next();
  })
}

exports.create = function(req, res, next) {
  var article = new Article(req.body);
  article.creator = req.user;

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      })
    } else {
      res.json(article);
    }
  })
}

exports.read = function(req, res, next) {
  res.json(req.article);
}

exports.update = function(req, res, next) {
  var article = req.article;
  article.title = req.body.title;
  article.content = req.body.content;
  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      })
    } else {
      res.json(article);
    }
  })
}

exports.delete = function(req, res, next) {
  var article = req.article;

  article.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      })
    } else {
      res.json(article);
    }
  })
}

exports.list = function(req, res, next) {
  Article.find().sort('-created').populate('creator', 'email').exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      })
    } else {
      res.json(articles);
    }
  })
}

exports.hasAuthorization = function(req, res, next) {
  if(req.article.creator.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorizated'
    })
  }
  next();
}