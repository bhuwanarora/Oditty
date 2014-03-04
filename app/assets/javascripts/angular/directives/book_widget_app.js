bookWidgetApp.directive('book', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    link: function(scope){
    	bindExpand(scope, $rootScope)
    },
    controller: function($scope, bookWidgetAppService){
      $scope.hover = function() {
      	bookWidgetAppService.triggerHover();
      };

      $scope.mouseout = function() {
      	bookWidgetAppService.triggerMouseOut();
      };      
    },
    templateUrl: "/assets/angular/widgets/base/book_widget.html"
  };
})

bookWidgetApp.directive('bookNavbar', function ($rootScope) {
  return {
    restrict: 'E',
    link: function(scope) {
      bindHover(scope, $rootScope)
    },
    templateUrl: "/assets/angular/widgets/base/book_navbar.html"
  };
})

bookWidgetApp.directive('bookthumb', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'bookthumb': '=data' },
    link: function(scope) {
      bindHover(scope, $rootScope)
    },
    controller: function($scope, bookWidgetAppService){
      $scope.expand = function() {
		bookWidgetAppService.triggerExpand();
      };
    },
    templateUrl: "/assets/angular/widgets/base/book_thumb.html"
  };
})

bookWidgetApp.directive('rating', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'rating': '=data' },
    link: function(scope) {
      bindHover(scope, $rootScope)
    },
    templateUrl: "/assets/angular/widgets/base/rating.html"
  };
})

bookWidgetApp.directive('reviewWidget', function () {
  return {
    restrict: 'E',
    scope: { 'reviewWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/review_widget.html"
  };
})

bookWidgetApp.directive('shelf', function () {
  return {
    restrict: 'E',
    scope: { 'shelf': '=data' },
    templateUrl: "/assets/angular/widgets/base/shelf.html"
  };
})

bookWidgetApp.directive('bookmark', function () {
  return {
    restrict: 'E',
    scope: { 'bookmark': '=data' },
    templateUrl: "/assets/angular/widgets/base/bookmark.html"
  };
})

bookWidgetApp.directive('category', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'category': '=data' },
    link: function(scope) {
    	bindHover(scope, $rootScope)
    	bindExpand(scope, $rootScope)
    },
    controller: function($scope){
    	$scope.getCharArray = function(name){
    		$scope.charArray = name.split('');
    	}
    },
    templateUrl: "/assets/angular/widgets/base/category.html"
  };
})

bookWidgetApp.directive('comment', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'comment': '=data' },
    link: function(scope){
    	bindExpand(scope, $rootScope);
    },
    controller: function($scope){
    	$scope.init = function(){
    		$scope.comment_ready = false
    	}

    	$scope.toggleCommentBoxState = function(){
    		if($scope.comment_ready == true){
    			$scope.comment_ready = false
    		}
    		else{
    			$scope.comment_ready = true	
    		}
    	}

    	$scope.postReview = function(){
    		$scope.$parent.rated = false;
    		$scope.$parent.reviewed = true;
    	}

    	$scope.init();
    },
    templateUrl: "/assets/angular/widgets/base/comment.html"
  };
})

bookWidgetApp.directive('interact', function () {
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

bookWidgetApp.directive('newsWidget', function () {
  return {
    restrict: 'E',
    scope: { 'newsWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/news_widget.html"
  };
})

bookWidgetApp.directive('summary', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'summary': '=data' },
    link: function(scope) {
      bindExpand(scope, $rootScope)
    },
    templateUrl: "/assets/angular/widgets/base/summary.html"
  };
})

bookWidgetApp.directive('tags', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'tags': '=data' },
    link: function(scope) {
      bindHover(scope, $rootScope)
    },
    templateUrl: "/assets/angular/widgets/base/tags.html"
  };
})

bookWidgetApp.directive('rate', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'rate': '=data' },
    link: function(scope){
    	bindExpand(scope, $rootScope)
    },
    controller: function($scope){
    	$scope.init = function(){
			$scope.rate_ready = false;
    	}

		$scope.toggle = function(index){
			//TODO
			$scope.mark_as_rated()
		}

		$scope.mark_as_rated = function(){
			$scope.$parent.read = false;
			$scope.$parent.rated = true;
		}

		$scope.init();
    },
    templateUrl: "/assets/angular/widgets/base/rate.html"
  };
})

bookWidgetApp.directive('markAsRead', function($rootScope){
	return {
		restrict: 'E',
		link: function(scope){
			bindExpand(scope, $rootScope)
		},
		controller: function($scope, bookWidgetAppService){
			$scope.init = function(){
				$scope.expand = false;
			}

			$scope.markAsRead = function(){
				$scope.logged_in = false;
				$scope.read = true;
				//ajax call to mark the book as read
			}

			$scope.init();
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