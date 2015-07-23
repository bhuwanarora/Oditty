homeApp.directive('socialFeed', ["$rootScope", "userService", "$timeout", function($rootScope, userService, $timeout){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            $scope.get_feed = function(){
                if(!$scope.info.feed_loading){
                    $scope.info.feed_loading = true;
                    if(angular.isDefined($scope.social_feed)){
                        var skip = $scope.social_feed.length;
                    }
                    else{
                        var skip = 0;
                        $scope.social_feed = [];
                    }
                    userService.get_social_feed(skip).then(function(data){
                        $scope.info.feed_loading = false;
                        $scope.social_feed = $scope.social_feed.concat(data);
                    });
                }
            }

            var _init = function(){
                var room_timeout = $timeout(function(){
                    $scope.get_feed();
                }, 100);
                $scope.$on('destroy', function(){
                    $timeout.cancel(room_timeout);
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/social_feed.html'
    };
}]);

homeApp.directive('suggestCommunities', ["$rootScope", "userService", "$timeout", function($rootScope, userService, $timeout){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                $scope.info.loading = true;
                var room_timeout = $timeout(function(){
                    userService.suggest_communities().then(function(data){
                        $scope.info.loading = false;
                        $scope.suggest_communities = [];
                        $scope.show_suggestions = true;
                        angular.forEach(data, function(value, index){
                            value.span = {"col": 1, "row": 1};
                            this.push(value);
                        }, $scope.suggest_communities);
                    });
                }, 100);
                $scope.$on('destroy', function(){
                    $timeout.cancel(room_timeout);
                });
            }

            $scope.goto_room = function(id){
                window.location.href = "/room?p="+id;
            }

            $scope.toggle_suggestions = function(){
                $scope.show_suggestions = !$scope.show_suggestions;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/community_suggestions.html'
    };
}]);


homeApp.directive('suggestFriends', ["$rootScope", "userService", "$timeout", function($rootScope, userService, $timeout){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                var friend_timeout = $timeout(function(){
                    userService.suggest_friends().then(function(data){
                        $scope.suggest_friends = data;
                        $scope.show_suggestions = true;
                    });
                }, 100);

                $scope.$on('destroy', function(){
                    $timeout.cancel(friend_timeout);
                });
            }

            $scope.remove_suggestion = function(friend){
                var index = $scope.suggest_friends.indexOf(friend);
                $scope.suggest_friends.splice(index, 1);
            }

            $scope.follow_user = function(id){
                userService.follow(id, true);
                angular.forEach($scope.suggest_friends, function(value, index){
                    if(value.id == id){
                        $scope.suggest_friends.splice(index, 1);
                    }
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/friend_suggestions.html'
    };
}]);


homeApp.directive('trending', ["$rootScope", "userService", "$timeout", function($rootScope, userService, $timeout){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                var room_timeout = $timeout(function(){
                    userService.suggest_communities().then(function(data){
                        $scope.suggest_communities = data;
                    });
                }, 100);

                $scope.$on('destroy', function(){
                    $timeout.cancel(room_timeout);
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/trending.html'
    };
}]);

homeApp.directive('bookEmbed', ["$rootScope", "google_public_key", function($rootScope, google_public_key){
    return{
        restrict: 'A',
        scope: {book: '=', info: '='},
        link: function($scope, $element, google_public_key){

            $scope.alert_not_found = function(){
                $scope.info.loading = false;
                $scope.info.book_not_found = true;
            }

            var load_book = function(){
                if($scope.book.isbn == null){
                    $scope.alert_not_found();
                }
                else{
                    var isbn = $scope.book.isbn.split(',');
                    var isbn_string = "ISBN:"
                    $scope.info.book_not_found = false;
                    var viewer = new google.books.DefaultViewer($element.find('div')[0]);
                    viewer.load(isbn_string.concat(isbn[1]), $scope.alert_not_found);
                    $scope.info.loading = false;
                }
            }


            var _init = (function () {
                $scope.info.loading = true;
                var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);

                if(angular.isUndefined($scope.book)){
                    $scope.book = $rootScope.active_book;
                }
                $scope.book_loading = true;
                
                google.load("books", "0", {callback: load_book});
            }());
        }
    };
}]);

homeApp.directive('recommend', ["$rootScope", "userService", "sharedService", function($rootScope, userService, sharedService){
    return{
        restrict: 'E',
        scope: {user: '=', book: '='},
        controller: ['$scope', function($scope){
            $scope.recommend_friend = function(){
                var friends_id = $scope.user.id;
                var book_id = $scope.book.id || $rootScope.active_book.id || $rootScope.active_book.book_id;
                $scope.recommending = true;
                userService.recommend(friends_id, book_id).then(function(){
                    $scope.recommending = false;
                    $scope.recommended = true;
                });
            }

            var _init = function(){
                $scope.recommending = false;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/recommend.html'
    }
}]);

homeApp.directive('basicBook', ["$rootScope", "bookService", function($rootScope, bookService){
    return {
        restrict: 'E',
        scope : {book: '='},
        controller: ["$scope", function($scope){

            var _init = function(){
                bookService.get_primary_info($scope.book.id).then(function(data){
                    $scope.book = angular.extend($scope.book, data);
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/basic_book.html'
    };
}]);

homeApp.directive('bookInfo', ["$rootScope", "bookService", 'sharedService', function($rootScope, bookService, sharedService){
    return {
        restrict: 'E',
        scope : {book: '=', info: '='},
        controller: ["$scope", function($scope){
            $scope.show_book_dialog = function(book, event){
                sharedService.show_book_dialog($rootScope, $scope, book, event);
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

homeApp.directive('bookmark', ["$rootScope", 'feedService', '$timeout', '$mdSidenav', function($rootScope, feedService, $timeout, $mdSidenav){
    return {
        restrict: 'E',
        scope : {bookmarkId: '=', bookmarkType: '=', shelves: '=', custom: '=', count: '=', info: '='},
        controller: ["$scope", function($scope){

            var _unauthenticated_user = function(){
                return ((getCookie("logged") == "") || (getCookie("logged") == null));
            }

            $scope.show_shelves = function(){
                if(_unauthenticated_user()){
                    $mdSidenav('signup').toggle();
                }
                else{
                    $scope.shelves_loading = true;
                    feedService.get_bookmarks($scope.bookmarkId).then(function(data){
                        $rootScope.shelves = data;
                        $scope.shelves_loading = false;
                        $mdSidenav('right_bookmark').toggle();
                    });
                    $rootScope.bookmark_object = {"id": $scope.bookmarkId, "type": $scope.bookmarkType};
                }
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
                        // $speechSynthetis.speak("You are at ReadersDoor. How can I help you?", 'en-UK');
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
        if(angular.isDefined($rootScope.user)){
            $scope.selectedDay = $rootScope.user.selectedDay;
        }
        if(angular.isDefined($rootScope.user)){
            $scope.selectedMonth = $rootScope.user.selectedMonth;
        }
        if(angular.isDefined($rootScope.user)){
            $scope.selectedYear = $rootScope.user.selectedYear;
        }
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