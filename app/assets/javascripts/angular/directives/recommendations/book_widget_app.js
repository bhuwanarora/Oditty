bookWidgetApp.directive('book', function () {
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    controller: function($scope){
      $scope.hover = function() {
        $scope.hovered = true
      };

      $scope.mouseout = function() {
      	$scope.hovered = false
      };      
    },
    templateUrl: "/assets/angular/widgets/base/book_widget.html"
  };
})

bookWidgetApp.directive('bookNavbar', function () {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/book_navbar.html"
  };
})

bookWidgetApp.directive('bookthumb', function () {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.triggerExpand = function() {
        if ($scope.expand == true) {
          $scope.expand = false
        }
        else{
    		  $scope.expand = true
        }
      };
    },
    templateUrl: "/assets/angular/widgets/base/book_thumb.html"
  };
})

bookWidgetApp.directive('rating', function () {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/rating.html"
  };
})

bookWidgetApp.directive('reviewWidget', function () {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/review_widget.html"
  };
})

bookWidgetApp.directive('shelf', function () {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/shelf.html"
  };
})

bookWidgetApp.directive('bookmark', function () {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/bookmark.html"
  };
})

bookWidgetApp.directive('category', function () {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.initVerticalText = function(category){
        name = category.name
        description = category.description
        $scope.nameArray = name.split('');
        $scope.descriptionArray = description.split('');
      }
    },
    templateUrl: "/assets/angular/widgets/base/category.html"
  };
})

bookWidgetApp.directive('comment', function () {
  return {
    restrict: 'E',
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
    		$scope.rated = false;
    		$scope.reviewed = true;
    	}

    	$scope.init();
    },
    templateUrl: "/assets/angular/widgets/base/comment.html"
  };
})

bookWidgetApp.directive('interact', function () {
  return {
    restrict: 'E',
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
    templateUrl: "/assets/angular/widgets/base/news_widget.html"
  };
})

bookWidgetApp.directive('summary', function () {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/summary.html"
  };
})

bookWidgetApp.directive('tags', function () {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/tags.html"
  };
})

bookWidgetApp.directive('rate', function ($rootScope, $timeout) {
  return {
    restrict: 'E',
    controller: function($scope){
    	$scope.init = function(){
			$scope.rate_ready = false;
    	}

  		$scope.toggle = function(index){
  			//TODO
  			$scope.mark_as_rated()
  		}

  		$scope.mark_as_rated = function(){
  			$scope.read = false;
  			$scope.rated = true;
        //rating dependent
        notify($rootScope, "Thanks, this will help us to recommend you better books.", $timeout)
  		}

  		$scope.init();
    },
    templateUrl: "/assets/angular/widgets/base/rate.html"
  };
})

bookWidgetApp.directive('markAsRead', function($rootScope, $timeout){
	return {
		restrict: 'E',
		controller: function($scope){
			$scope.markAsRead = function(){
				$scope.logged_in = false;
				$scope.read = true;
        notify($rootScope, "Also please rate the book. This will help us to recommend better books.", $timeout)
				//ajax call to mark the book as read
			}
		},
		templateUrl: "/assets/angular/widgets/base/mark_as_read.html"
	}
})

bookWidgetApp.directive('bookBinding', function(){
  return{
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/book_binding.html"
  }
})