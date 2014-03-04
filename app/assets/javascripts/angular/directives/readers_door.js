readersDoor.directive('book', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    link: function(scope){
    	bindExpand(scope, $rootScope)
    },
    controller: function($scope, recommendationService){
      $scope.hover = function() {
      	recommendationService.triggerHover();
      };

      $scope.mouseout = function() {
      	recommendationService.triggerMouseOut();
      };      
    },
    templateUrl: "/assets/angular/widgets/base/book_widget.html"
  };
})

readersDoor.directive('bookNavbar', function ($rootScope) {
  return {
    restrict: 'E',
    link: function(scope) {
      bindHover(scope, $rootScope)
    },
    templateUrl: "/assets/angular/widgets/base/book_navbar.html"
  };
})

readersDoor.directive('bookthumb', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'bookthumb': '=data' },
    link: function(scope) {
      bindHover(scope, $rootScope)
    },
    controller: function($scope, recommendationService){
      $scope.expand = function() {
		recommendationService.triggerExpand();
      };
    },
    templateUrl: "/assets/angular/widgets/base/book_thumb.html"
  };
})

readersDoor.directive('rating', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'rating': '=data' },
    link: function(scope) {
      bindHover(scope, $rootScope)
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

readersDoor.directive('category', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'category': '=data' },
    link: function(scope) {
    	bindHover(scope, $rootScope)
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

readersDoor.directive('interact', function () {
  return {
    restrict: 'E',
    scope: { 'status': '=data' },
    controller: function($scope){
    	$scope.setStatus = function(status){
    		if(status == 0){
    			$scope.logged_in = true;
    		}
    		else if(status == 1){
    			$scope.read = true;
    		}
    		else if(status == 2){
    			$scope.rated = true;
    		}
    		else if(status == 3){
    			$scope.reviewed = true;	
    		}
    	}
    },
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

readersDoor.directive('summary', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'summary': '=data' },
    link: function(scope) {
      bindExpand(scope, $rootScope)
    },
    templateUrl: "/assets/angular/widgets/base/summary.html"
  };
})

readersDoor.directive('tags', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'tags': '=data' },
    link: function(scope) {
      bindHover(scope, $rootScope)
    },
    templateUrl: "/assets/angular/widgets/base/tags.html"
  };
})

readersDoor.directive('rate', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'rate': '=data' },
    link: function(scope){
    	bindExpand(scope, $rootScope)
    },
    templateUrl: "/assets/angular/widgets/base/rate.html"
  };
})

readersDoor.directive('markAsRead', function($rootScope){
	return {
		restrict: 'E',
		link: function($scope){
			bindExpand($scope, $rootScope)
		},
		controller: function($scope, recommendationService){
			$scope.expand = false;
			$scope.markAsRead = function(){
				$scope.logged_in = false
				$scope.read = true
				//ajax call to mark the book as read
			}
		},
		templateUrl: "/assets/angular/widgets/base/mark_as_read.html"
	}
})

function bindHover(scope, $rootScope){
	$rootScope.$on('triggerHover', function(){
  		scope.hovered = true
  	})

  	$rootScope.$on('triggerMouseOut', function(){
  		scope.hovered = false
  	})	
}

function bindExpand(scope, $rootScope){
	$rootScope.$on('triggerExpand', function(){
		if(scope.expand == true){
			scope.expand = false
		}
		else{
			scope.expand = true
		}
	})
}