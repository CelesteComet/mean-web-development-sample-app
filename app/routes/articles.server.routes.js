var users = require('../../app/controllers/user.server.controller')
    articles = require('../../app/controllers/articles.server.controllers');

module.exports = function(app) {
  app.route('/api/articles')
     .get(articles.list)
     .post(users.requiresLogin, articles.create);

  app.route('/api/articles/:articleId')
     .get(articles.read)
     .put(users.requireLogin, articles.hasAuthorization, articles.update)
     .delete(users.requireLogin, articles.hasAuthorization, articles.delete);

  app.param('articleId', articles.articleById);
}