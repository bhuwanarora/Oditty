bookWidgetApp.directive('book', function (bookWidgetService) {
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    controller: function($scope){
      $scope.hover = function() {
        $scope.hovered = true;
      };

      $scope.mouseout = function() {
      	$scope.hovered = false;
      };

      _init = function(){
        var book_id = $scope.book.id;
        bookWidgetService.populate_tooltips(book_id).then(function(data){
          $scope.book.title = data.title;
          $scope.book.author_name = data.author_name;
          $scope.book.users = data.users;
          $scope.book.summary = data.summary;
          $scope.book.users_count = data.users_count;
        });
      }

      _init();

    },
    templateUrl: "/assets/angular/widgets/base/book_widget.html"
  };
})

bookWidgetApp.directive('bookNavbar', function ($rootScope, $timeout) {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.show_book = function(page){
        zoomin_book($scope, $timeout, $rootScope, page);
      }
    },
    templateUrl: "/assets/angular/widgets/base/book_navbar.html"
  };
})

bookWidgetApp.directive('bookthumb', function ($timeout, $rootScope) {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.trigger_expand = function() {
        if ($scope.expand == true) {
          $scope.expand = false;
        }
        else{
    		  $scope.expand = true;
        }
      };

      $scope.show_book = function(page){
        zoomin_book($scope, $timeout, $rootScope, page);
      }

      $scope.show_share_options = function(){
        $scope.show_share_menu = true;
      }

      $scope.hide_share_options = function(){
        $scope.show_share_menu = false;
      }

      _init = function(){
        $scope.zoomin_book = false;
        $scope.expand = false;
        $scope.show_share_menu = false;
      }

      _init();
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

bookWidgetApp.directive('bookmark', function () {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.toggle_bookmarked = function(){
        var bookmark_status = $scope.book.bookmark_status;
        if(bookmark_status == 1){
          $scope.book.bookmark_status = 0;
          _remove_book_from_shelf();
        }
        else{
          $scope.book.bookmark_status = 1;
          _add_book_to_shelf();
        }
      }

      _remove_book_from_shelf = function(){
        $scope.$emit('removeBookFromShelf', $scope.book);
      }

      _add_book_to_shelf = function(){
        $scope.$emit('addBookToShelf', $scope.book);
      }
    },
    templateUrl: "/assets/angular/widgets/base/bookmark.html"
  };
})

bookWidgetApp.directive('category', function () {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.initVerticalText = function(category){
        var name = category.name;
        var description = category.description;
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
    	_init = function(){
    		$scope.comment_ready = false;
    	}

    	$scope.toggleCommentBoxState = function(){
    		if($scope.comment_ready == true){
    			$scope.comment_ready = false;
    		}
    		else{
    			$scope.comment_ready = true;
    		}
    	}

    	$scope.postReview = function(){
    		$scope.reviewed = true;
    	}

    	_init();
    },
    templateUrl: "/assets/angular/widgets/base/comment.html"
  };
})

bookWidgetApp.directive('interact', function () {
  return {
    restrict: 'E',
    controller: function($scope){
      _init = function(){
        $scope.logged_in = true;
        $scope.read = false;
        $scope.rated = false;
        $scope.reviewed = false;
      }

    	$scope.setStatus = function(status){
    		if(status == 0){
    			$scope.logged_in = true;
    		}
    		else if(status == 1){
          $scope.logged_in = true;
    			$scope.read = true;
    		}
    		else if(status == 2){
          $scope.logged_in = true;
          $scope.read = true;
    			$scope.rated = true;
    		}
    		else if(status == 3){
          $scope.logged_in = true;
          $scope.read = true;
          $scope.rated = true;
    			$scope.reviewed = true;	
    		}
    	}

      _init();
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

bookWidgetApp.directive('bookTags', function($rootScope, $timeout) {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.show_book = function(page){
        zoomin_book($scope, $timeout, $rootScope, page);
      }
    },
    templateUrl: "/assets/angular/widgets/base/book_tags.html"
  };
})

bookWidgetApp.directive('rate', function ($rootScope, $timeout) {
  return {
    restrict: 'E',
    controller: function($scope){
    	_init = function(){
			  $scope.rate_ready = false;
        $scope.init_rate_description();
      }

      $scope.show_rating_description = function(){
        rating_value = event.currentTarget.value;
        if(rating_value == "1"){
          $scope.rating_description = "Left reading in between.";
        }
        else if (rating_value == "2") {
          $scope.rating_description = "Ordinary read.";
        } 
        else if (rating_value == "3") {
          $scope.rating_description = "A nice read.";
        } 
        else if (rating_value == "4") {
          $scope.rating_description = "Loved it.";
        } 
        else{
          $scope.rating_description = "In the best books I've read.";
        }
      }

      $scope.init_rate_description = function(){
        $scope.rating_description = "";
      }

  		$scope.toggle = function(index){
  			//TODO
  			$scope.mark_as_rated();
  		}

  		$scope.mark_as_rated = function(){
  			$scope.rated = true;
        //rating dependent
        var timeout_event = notify($rootScope, "THANKS-This will help us to recommend you better books.", $timeout);

        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event)
        })
  		}

  		_init();
    },
    templateUrl: "/assets/angular/widgets/base/rate.html"
  };
})

bookWidgetApp.directive('markAsRead', function($rootScope, $timeout){
	return {
		restrict: 'E',
		controller: function($scope){
			$scope.markAsRead = function(){
				$scope.read = true;
        var timeout_event = notify($rootScope, "ADVISE-Also please rate the book. This will help us to recommend better books.", $timeout)

        $rootScope.$broadcast('glowShelf');

        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
          $timeout.cancel(glow_event);
        });
        //ajax call to mark the book as read
      }

      // _init = function(){
      //   $scope.$on('glowIcon', function(){
      //   });
      // }

      _init();
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

function zoomin_book($scope, $timeout, $rootScope, page){
  $rootScope.initPage = page;
  $('.stamp_read').hide();
  $scope.zoomin_book = true;
  var posX = event.currentTarget.offsetParent.offsetLeft + event.currentTarget.offsetWidth;
  var screenX = event.screenX;
  var scrollWidth = event.currentTarget.offsetParent.offsetParent.scrollWidth;
  $scope.$emit('expandBook', $scope.book.id, posX, screenX, scrollWidth);
  var zoomout_event = $timeout(function(){
    $scope.zoomin_book = false;
  }, 3000);

  $scope.$on('destroy', function(){
    $timeout.cancel(zoomout_event);
  });
}