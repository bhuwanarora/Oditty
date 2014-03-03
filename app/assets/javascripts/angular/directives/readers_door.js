var bindings = {}

readersDoor.directive('book', function () {
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    controller: function($scope){
      var entities = $scope.entities = [];
 
      $scope.hover = function() {
        angular.forEach(entities, function(entity) {
          entity.hovered = true;
        });
      };

      $scope.mouseout = function() {
        angular.forEach(entities, function(entity) {
          entity.hovered = false;
        });
      };      

      this.addEntity = function(entity) {
        if (entities.length === 0) {
          entity.hovered = false;
        }
        entities.push(entity);
      };
    },
    templateUrl: "/assets/angular/widgets/base/book_widget.html"
  };
})

readersDoor.directive('bookNavbar', function () {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/book_navbar.html"
  };
})

readersDoor.directive('bookthumb', function () {
  return {
    require: '^book',
    restrict: 'E',
    scope: { 'bookthumb': '=data' },
    link: function(scope, element, attrs, bookCtrl) {
      bookCtrl.addEntity(scope);
    },
    controller: function($scope){
      book = $scope.$parent
      book_widget = book.$parent
      var entities = $scope.entities = [book, book_widget];
 
      $scope.expand = function() {
        angular.forEach(entities, function(entity) {
          if(entity.expand == true){
          	entity.expand = false;
          }
          else{
          	entity.expand = true;
          }
        });
      };

      this.addEntity = function(entity) {
        if (entities.length === 0) {
          entity.expand = false;
        }
        entities.push(entity);
      };
    },
    templateUrl: "/assets/angular/widgets/base/book_thumb.html"
  };
})

readersDoor.directive('rating', function () {
  return {
    require: '^book',
    restrict: 'E',
    scope: { 'rating': '=data' },
    link: function(scope, element, attrs, bookCtrl) {
      bookCtrl.addEntity(scope);
    },
    templateUrl: "/assets/angular/widgets/base/rating.html"
  };
})

readersDoor.directive('reviewWidget', function () {
  return {
    restrict: 'E',
    scope: { 'reviewWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/review_widget.html"
  };
})

readersDoor.directive('shelf', function () {
  return {
    restrict: 'E',
    scope: { 'shelf': '=data' },
    templateUrl: "/assets/angular/widgets/base/shelf.html"
  };
})

readersDoor.directive('bookmark', function () {
  return {
    restrict: 'E',
    scope: { 'bookmark': '=data' },
    templateUrl: "/assets/angular/widgets/base/bookmark.html"
  };
})

readersDoor.directive('category', function () {
  return {
  	require: '^book',
    restrict: 'E',
    scope: { 'category': '=data' },
    link: function(scope, element, attrs, bookCtrl) {
      bookCtrl.addEntity(scope);
    },
    controller: function($scope){
    	$scope.getCharArray = function(name){
    		$scope.charArray = name.split('');
    	}
    },
    templateUrl: "/assets/angular/widgets/base/category.html"
  };
})

readersDoor.directive('comment', function () {
  return {
    restrict: 'E',
    scope: { 'comment': '=data' },
    templateUrl: "/assets/angular/widgets/base/comment.html"
  };
})

readersDoor.directive('interactWidget', function () {
  return {
    restrict: 'E',
    scope: { 'interactWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/interact_widget.html"
  };
})

readersDoor.directive('newsWidget', function () {
  return {
    restrict: 'E',
    scope: { 'newsWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/news_widget.html"
  };
})

readersDoor.directive('summary', function () {
  return {
  	require: '^bookthumb',
    restrict: 'E',
    scope: { 'summary': '=data' },
    link: function(scope, element, attrs, bookthumbCtrl) {
      bookthumbCtrl.addEntity(scope);
    },
    templateUrl: "/assets/angular/widgets/base/summary.html"
  };
})

readersDoor.directive('tags', function () {
  return {
    require: '^book',
    restrict: 'E',
    scope: { 'tags': '=data' },
    link: function(scope, element, attrs, bookCtrl) {
      bookCtrl.addEntity(scope);
    },
    templateUrl: "/assets/angular/widgets/base/tags.html"
  };
})

readersDoor.directive('rate', function () {
  return {
    restrict: 'E',
    scope: { 'rate': '=data' },
    templateUrl: "/assets/angular/widgets/base/rate.html"
  };
})