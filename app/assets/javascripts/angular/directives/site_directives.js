homeApp.directive('bookInfo', ["$rootScope", "bookService", '$mdDialog', function($rootScope, bookService, $mdDialog){
    return {
        restrict: 'E',
        scope : {book: '=', info: '='},
        controller: ["$scope", function($scope){
            $scope.show_book_dialog = function(book, event){
                $rootScope.active_book = book;
                $rootScope.active_book.show_info_only = true;
                $mdDialog.show({
                    templateUrl: '/assets/angular/html/news/book.html',
                    scope: $scope,
                    preserveScope: true,
                    targetEvent: event,
                    clickOutsideToClose: true
                });
                event.stopPropagation();
            }

            var _init = function(){
                if(angular.isUndefined($scope.book.description)){
                    $scope.book_loading = true;
                    bookService.get_basic_book_details($scope.book.id).then(function(data){
                        $scope.book = angular.extend($scope.book, data);
                        $scope.book_loading = false;
                    });
                }
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/book_info.html'
    };
}]);

homeApp.directive('bookmark', ["$rootScope", 'feedService', '$timeout', function($rootScope, feedService, $timeout){
    return {
        restrict: 'E',
        scope : {data: '=', shelves: '=', custom: '=', count: '='},
        controller: ["$scope", function($scope){
            $scope.show_shelves = function(){
                if(angular.isUndefined($scope.shelves)){
                    feedService.get_bookmarks($scope.data.id).then(function(data){
                        $scope.shelves = data;
                    });
                }
                $scope.show_shelf = !$scope.show_shelf;
            }


        }],
        templateUrl: '/assets/angular/html/shared/bookmark.html'
    };
}]);


homeApp.directive('communityFeed', ["$rootScope", 'userService', '$timeout', function($rootScope, userService, $timeout){
    return {
        restrict: 'E',
        scope : {communityFeed: '='},
        controller: ["$scope", function($scope){
            $scope.toggle_expand = function(){
                $scope.communityFeed.expand = !$scope.communityFeed.expand;
            }

            var _init = function(){
                $scope.communityFeed.expand = false;
            }

            $scope.goto_news_page = function(id, community_id){
                userService.news_visited(id);
                deleteCookie("active_community");
                if(angular.isDefined(community_id)){
                    setCookie("active_community", community_id, 1)
                }
                window.location.href = "/news?q="+id;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/_community_feed.html'
    };
}]);


homeApp.directive('setFocus', ["$timeout", "$parse", "$rootScope", function($timeout, $parse, $rootScope){
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.setFocus);
            scope.$watch(model, function(value) {
                if(value == true) { 
                    $timeout(function() {
              	         if($rootScope.keyCode){
                	       element[0].value = String.fromCharCode($rootScope.keyCode);
              	         }
                        element[0].focus();
                        // $speechSynthetis.speak("You are at Reader's Door. How can I help you?", 'en-UK');
                    });
                }
            });
        }
    };
}]);

homeApp.directive('rdSticky', ["$timeout", "$parse", "$rootScope", "$document", function($timeout, $parse, $rootScope, $document){
    return {
        link: function(scope, element, attrs) {
            var elem = element[0];
            var position = elem.scrollTop;
            $document.bind('scroll', function(){
                console.log(" new scrollTop ", elem.offsetTop);
                // if(elem.scrollTop <= position){
                //     scope.$apply(attrs.checkScrollUp);
                // }
                // position = elem.scrollTop;
            });
        }
    };
}]);

homeApp.directive('compile', ["$compile", function($compile){
	return ['scope', 'element', 'attrs', function(scope, element, attrs){
				var ensureCompileRunsOnce = scope.$watch(function(scope){
	            	// watch the 'compile' expression for changes
	            	return scope.$eval(attrs.compile);
	            },
	            function(value){
	              	// when the 'compile' expression changes
	              	// assign it into the current DOM
	              	element.html(value);

	              	// compile the new DOM and link it to the current
	              	// scope.
	              	// NOTE: we only compile .childNodes so that
	              	// we don't get into infinite loop compiling ourselves
	              	$compile(element.contents())(scope);
	                
	              	// Use Angular's un-watch feature to ensure compilation only happens once.
	              	ensureCompileRunsOnce();
	            });
			}]
}]);

homeApp.directive('checkScrollBottom', function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs){
            var elem = element[0];
            element.bind('scroll', function(){
            	var buffer = 1400;
                if((elem.scrollTop + elem.offsetHeight + buffer) > elem.scrollHeight){
                    scope.$apply(attrs.checkScrollBottom);
                }
            });
        }
    };
});

homeApp.directive('checkScrollUp', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var elem = element[0];
            var position = elem.scrollTop;
            element.bind('scroll', function(){
                if(elem.scrollTop <= position){
                	scope.$apply(attrs.checkScrollUp);
                }
                position = elem.scrollTop;
            });
        }
    };
});

homeApp.directive('checkScrollDown', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var elem = element[0];
            var position = elem.scrollTop;
            element.bind('scroll', function(){
                if(elem.scrollTop > position){
                	scope.$apply(attrs.checkScrollDown);
                }
                position = elem.scrollTop;
            });
        }
    };
});

homeApp.directive('focusOut',function(){
	return function postLink(scope, element, attrs) {
        element.bind('blur', function () {
            scope.$apply(attrs.focusOut);
        });
	};
});

homeApp.directive('calendar', ["$rootScope", function($rootScope){
  return{
    restrict: 'E',
    scope : {saveDate: '&'},
    controller: ["$scope", function($scope){
      $scope.date_check = function(){
        var month = $scope.months.indexOf($scope.selectedMonth) + 1;
        var no_days = new Date($scope.selectedYear, month, 0).getDate();
        $scope.days = new Array(no_days)
              .join()
              .split(',')
              .map(function(item, index){return ++index;});
      }

      $scope.save_date = function(selectedYear, selectedMonth, selectedDay){
        $rootScope.user.selectedDay = selectedDay;
        $rootScope.user.selectedMonth = selectedMonth;
        $rootScope.user.selectedYear = selectedYear;
        $scope.saveDate();
      }

      _init =function(){
        $scope.days = new Array(31)
              .join()
              .split(',')
              .map(function(item, index){return ++index;});
        $scope.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        $scope.years = [];
        $scope.selectedDay = $rootScope.user.selectedDay;
        $scope.selectedMonth = $rootScope.user.selectedMonth;
        $scope.selectedYear = $rootScope.user.selectedYear;
        
        var currentYear = new Date().getFullYear();
        for(var i=currentYear; i>1904; i--){
          $scope.years.push(i);
        }
      }

      _init();
    }],
    templateUrl: '/assets/angular/html/shared/calendar.html'
  }
}]);

 //   homeApp.directive('rate', ["$rootScope", "$timeout", function($rootScope, $timeout){
//   	return{
//     	restrict: 'E',
//     	scope: {'rate_object': '=data'},
//     	controller: ["$scope", function($scope){
//       		$scope.show_if_rated = function(index){
//         		$scope.temp_rating = $scope.rate_object.user_rating;
//         		$scope.rate_object.user_rating = parseInt(index) + 1;
//         		$scope.ready_to_rate = true;
//       		}

//       		$scope.reset_rating = function(){
//         		$scope.ready_to_rate = false;
//         		$scope.rate_object.user_rating = $scope.temp_rating;
//       		}

//       		_add_notification = function(){
//         		var name = $rootScope.user.email;
//         		if(angular.isDefined($rootScope.user.name)){
//           			name = $rootScope.user.name;
//         		}

//         		var message = "<span>gave "+$scope.rate_object.user_rating+"/10 stars to&nbsp;</span><span class='site_color'>"+$scope.rate_object.title+"</span>";
//         		var notification = {
//           			"thumb":$rootScope.user.thumb,
//           			"message":message,
//           			"timestamp":new Date().getTime(),
//           			"book":{
//             			"id":$scope.rate_object.id,
//             			"title":$scope.rate_object.title,
//             			"author_name":$scope.rate_object.author_name,
//             			"isbn":$scope.rate_object.isbn
//           			},
//           			"user":{
//             		"id":$rootScope.user.id,
//             		"name":name
//           		}
//         	}
//         	$scope.$emit('addToNotifications', notification);
//       	}

//       	_gamify = function(){
//         	if(!$scope.rate_object.rated){
//           		$scope.$emit('gamifyCount', 10, true);
//         	}
//       	}

//       	$scope.mark_as_rated = function(index, event){
//         	_gamify();
//         	$scope.rate_object.rated = true;
//         	$scope.rate_object.user_rating = parseInt(index) + 1;
//         	$scope.temp_rating = parseInt(index) + 1;
//         	var timeout_event = notify($rootScope, "SUCCESS-Thanks, This will help us to recommend you better books.", $timeout);

//         	$scope.$on('destroy', function(){
//           		$timeout.cancel(timeout_event);
//         	});
//         	var params = {"id":$scope.rate_object.id, "data":$scope.rate_object.user_rating};

//         	//ONLY FOR BOOKS
//         	if(angular.isUndefined($scope.rate_object.status) || !$scope.rate_object.status){
//           		sharedService.mark_as_read($scope, $scope.rate_object, event);
//         	}
//         	widgetService.rate_this_book(params);
//         	_add_notification();
//         	event.stopPropagation();
//       	}

//       	$scope.is_active = function(index){
//         	var is_active = false;
//         	if($scope.rate_object){
//           	var rating = parseInt(index) + 1;
//           	if(rating <= $scope.rate_object.user_rating){
//             	is_active = true;
//           	}
//         }
//         return is_active;
//      }

//     }],
//     templateUrl: '/assets/angular/views/shared/rate.html'
//   	}
// }]);