/************************ hover binded *************************** */
//BOOK NAV BAR --discussions, reviews, readers
readersDoor.directive('bookNavbar', function ($rootScope) {
  return {
    restrict: 'E',
    templateUrl: "/assets/angular/widgets/base/book_navbar.html"
  };
})

//BOOK THUMB --image, summary
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

//CATEGORY --the left most vertical bar stating must read, similar read etc
readersDoor.directive('category', function ($rootScope) {
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

//TAGS --philosophy, fiction etc
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

/*************************** hover binded ****************************/




/*************************** expansion binded ****************************/
readersDoor.directive('book', function ($rootScope) {
  return {
    restrict: 'E',
    priority: 1,
    scope: { 'book': '=data' },
    link: function(scope){
      bindExpand(scope, $rootScope)
    },
    controller: function($scope, recommendationService){
      $scope.hover = function() {
        $scope.hovered = true
        recommendationService.triggerHover();
      };

      $scope.mouseout = function() {
        $scope.hovered = false
        recommendationService.triggerMouseOut();
      };    

      $scope.test = true;
    },
    templateUrl: "/assets/angular/widgets/base/book_widget.html"
  };
})

//SUMMARY
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

//RATE interactive rating
readersDoor.directive('rate', function ($rootScope) {
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

//mark as read
readersDoor.directive('markAsRead', function($rootScope){
  return {
    restrict: 'E',
    link: function($scope){
      bindExpand($scope, $rootScope)
    },
    controller: function($scope, recommendationService){
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


//COMMENT comment on this book
readersDoor.directive('comment', function ($rootScope) {
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

/*************************** expansion binded ****************************/


//SHELF book shelf for boomarked and read books
readersDoor.directive('shelf', function () {
  return {
    restrict: 'E',
    scope: { 'shelf': '=data' },
    templateUrl: "/assets/angular/widgets/base/shelf.html"
  };
})

//BOOKMARK bookmark this book the blue tag
readersDoor.directive('bookmark', function () {
  return {
    restrict: 'E',
    scope: { 'bookmark': '=data' },
    templateUrl: "/assets/angular/widgets/base/bookmark.html"
  };
})

//INTERACT have read, rate, comment
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

//NEWS
readersDoor.directive('newsWidget', function () {
  return {
    restrict: 'E',
    scope: { 'newsWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/news_widget.html"
  };
})


//RATING --readonly rating
readersDoor.directive('rating', function ($rootScope) {
  return {
    restrict: 'E',
    scope: { 'rating': '=data' },
    templateUrl: "/assets/angular/widgets/base/rating.html"
  };
})


/*************************** binding functions ****************************/

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

/* ************************** binding functions ************************/