angular.module('articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Authentication', 'Articles', function($scope, $routeParams, $location, Authentication, Articles) {
  $scope.authentication = Authentication;
  $scope.hello = "HELLO";
  $scope.create = function() {
    
    var article = new Articles({
      title: this.title,
      content: this.content
    });

    // CREATE
    article.$save(function(response) {
      $location.path('articles/' + response._id);
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    })


  }
  // READ
  $scope.find = function() {
    console.log("FIND HAPPENNING")
    $scope.articles = Articles.query();
    debugger;
  }

  $scope.findOne = function() {
    console.log("find one happening")
    $scope.article = Articles.get({
      articleId: $routeParams.articleId
    })
  }

  // UPDATE
  $scope.update = function() {
    $scope.article.$update(function() {
      $location.path('articles/' + $scope.article._id)  
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    })
  }

  // DELETE
  $scope.delete = function(article) {
    if(article) {
      article.$remove(function() {
        for (var i in $scope.articles) {
          if ($scope.artciles[i] === article) {
            $scope.artciles.splice(i,1);
          }
        }
      })
    } else {
      $scope.article.$remove(function() {
        $location.path('articles');
      })
    }
  }
}])