websiteApp.controller('recommendationsController', ['$scope', '$rootScope', '$timeout', 'recommendationService', '$route', '$routeParams', '$interval', 'widgetService', 'scroller', 'appSocket', function($scope, $rootScope, $timeout, recommendationService, $route, $routeParams, $interval, widgetService, scroller, appSocket){

	$scope.toggle_bookmarked = function(event){
		if(!$scope.bookmark_selected){
			// _load_icon();
			$scope.panel_selected = 'BOOKMARK';
			$scope.bookmark_selected = true;
			$scope.read_selected = false;
			$scope.glowBookmark = false;
			// $('body').css('background-image', $scope.search_style['background-image']);
		}
		event.stopPropagation();
	}

	$scope.toggle_recommendations = function(){
		if($scope.bookmark_selected || $scope.read_selected){
			// _load_icon();
			$scope.read_selected = false;
			$scope.bookmark_selected = false;
			$scope.panel_selected = '';
			$scope.reset();
			// $('body').css('background-image', '');
		}
	}

	$scope.handle_height_of_popup = function(event){
		if(event.deltaY > 0){
			$scope.ticker_popup_style = {"height": "62vh"};
		}
		else{
			$scope.ticker_popup_style = {"height": "42vh"};		
		}
		event.stopPropagation();
	}

	$scope.handle_friends_grid_size = function(){
		if(event.deltaY > 0){
			$scope.column_heights = {"notifications_style" : {"height": "110px"}, 
									"friends_grid_style": {"max-height": "90px", "overflow": "auto"},
									"show_filters": false};
		}
		else{
			$scope.column_heights = {"notifications_style" : {"height": "110px"}, 
									"friends_grid_style": {"height": "30px"},
									"show_filters": false};
		}
		event.stopPropagation();
	}

	$scope.reset = function(){
		_init_recommendations();
    	_get_recommendations();
    	// $scope.$emit('moveRight');
	}

	$scope.toggle_read = function(){
		if(!$scope.read_selected){
			// _load_icon();
			$scope.glowShelf = false;
			$scope.bookmark_selected = false;
			$scope.read_selected = true;		
			$scope.panel_selected = 'READ';
			// $('body').css('background-image', 'url("assets/wood_shelf.jpg")');
		}
	}

	$scope.toggle_more_filters = function(event){
		if($scope.show_more_filters == true){
			$scope.show_more_filters = false;
			// $('.recommendation_block').css('margin-top', '40px');
			// $('.info_cards').css('margin-top', '40px');
		}
		else{
			$scope.show_more_filters = true;		
			// $('.recommendation_block').css('margin-top', '0px');
			// $('.info_cards').css('margin-top', '0px');
		}
		event.stopPropagation();
	}

	$scope.stopSearching = function(event){
		$rootScope.searching = false;
		event.currentTarget.text = "";
	}

	$scope.hide_popups = function(){
		$rootScope.hide_options = true;
		$rootScope.focused_book = null;
		$rootScope.ticker_popup = null;
 		// $scope.show_more_filters = false;
	}

	_load_icon = function(){
		$scope.drop_icon = true;
		$timeout(function(){
			$scope.drop_icon = false;
		}, 1000);
	}

	_add_listeners = function(){
	    load_recommendations_event = $scope.$on('loadRecommendations', function(){
	    	console.debug("%cloadRecommendations", "color: purple;");
	    	$rootScope.filters["reset"] = false;
	    	if($rootScope.filters["reset_count"] == undefined){
	    		console.debug("%c reset count", "color: purple");
	    		$rootScope.filters["reset_count"] = 0;
	    	}
	    	else{
	    		console.debug("%c increase count", "color: purple");
	    		$rootScope.filters["reset_count"] = $rootScope.filters["reset_count"]+1;
	    	}
	    	console.log("%c load_recommendations_event", "color: green;");
	    	_get_recommendations();
	    	// event.stopPropagation();
	    });

	    reload_recommendations_event = $scope.$on('reloadRecommendations', function(){
	    	console.debug("%creloadRecommendations", "color: orange;");
	    	console.debug("%c reset count", "color: purple");
	    	$rootScope.filters["reset"] = true;
	    	$rootScope.filters["reset_count"] = 0;
	    	$scope.reset();
	    	console.log("%c reload_recommendations_event", "color: green;");
	    	// event.stopPropagation();
	    });

	    open_shelf_event = $scope.$on('showBookReadShelf', function(){
	    	$scope.read_selected = true;
	    	console.log("%c open_shelf_event", "color: green;");
	    	event.stopPropagation();
	    })

	    glow_shelf_event = $scope.$on('glowShelf', function(){
	    	$scope.glowShelf = true;
	    	console.log("%c glow_shelf_event", "color: green;");
	    	event.stopPropagation();
	    });

	    glow_bookmark_event = $scope.$on('glowBookmark', function(){
	    	$scope.glowBookmark = true;
	    	console.log("%c glow_bookmark_event", "color: green;");
	    	event.stopPropagation();
	    });
	}

	_init_recommendations = function(){
		$scope.recommendations = {"books": [], "readers": [], "authors": []};
	}

	_bind_destroy = function(){
		$scope.$on('$destroy', function(){
			$timeout.cancel(push_books_timer_event);
			$timeout.cancel(user_behaviour_timer_event);
		});
	}

	_init_shelf = function(){
		$scope.read_selected = false;
		$scope.bookmark_selected = false;
	}

	_init_notifications = function(){
		$rootScope.notification_active = false;
	}

	_initialize_filters = function(){
		$scope.show_more_filters = true;
		$rootScope.filters = {};
        $rootScope.filters["more_filters"] = [];
        $rootScope.filters["other_filters"] = {};
        if($routeParams.type == "books"){
        	$rootScope.filters["filter_type"] = "BOOK";
        }
        else if($routeParams.type == "authors"){
        	$rootScope.filters["filter_type"] = "AUTHOR";
        }
        else if($routeParams.type == "readers"){
        	$rootScope.filters["filter_type"] = "READER";
        }
        else if($routeParams.title){
			$scope.$routeParams.type = 'books';
        	$rootScope.filters["reset"] = true;
        	$rootScope.filters["filter_type"] = "BOOK";
        	$rootScope.filters.other_filters["title"] = $scope.$routeParams.title;
			$rootScope.filters.other_filters["author_name"] = $scope.$routeParams.author;
        }
        else{
			$rootScope.filters["filter_type"] = "BOOK";
			$scope.show_notifications = true;
        }
        if($routeParams.filter_id){
        	$scope.show_more_filters = true;
        }
	}

	_update_recommendations = function(data){
		if($rootScope.filters["filter_type"] == "BOOK"){
			var message = "INFO- "+data.recommendations.books.length+" books found.";
			var timeout_event = notify($rootScope, message, $timeout);
			$scope.$on('destroy', function(){
				$timeout.cancel(timeout_event);
			});

			if($rootScope.loading){
				var max_limit = 30;
				if(data.recommendations.books.length == 0){
					var message = "ALERT- Reset the filters couldn't find more books."
					var timeout_event = notify($rootScope, message, $timeout);
					$scope.$on('destroy', function(){
						$timeout.cancel(timeout_event);
					});
				}
				else{
					if($scope.recommendations.books.length >= max_limit){
						$scope.recommendations.books = [$scope.recommendations.books[max_limit-2], $scope.recommendations.books[max_limit-1]];
						var timeout_event = $timeout(function(){
							scroller.scrollTo(screen.width/2, 0, 3000);
						}, 1000);
						$scope.$on('destroy', function(){
							$timeout.cancel(timeout_event);
						});
					}
					if($rootScope.filters.other_filters["title"]){
						$scope.bookmark_selected  = false;
						$scope.read_selected = false;
						// $scope.$emit('moveRight');
						$rootScope.hide_options = true;
						$scope.recommendations.books = data["recommendations"]["books"];
						$rootScope.focused_book = $scope.recommendations.books[0];
						$rootScope.focused_book.tweets = [];
					}
					else{
		    			$scope.recommendations.books = $scope.recommendations.books.concat(data["recommendations"]["books"]);
					}
				}
		    	$rootScope.loading = false;
			}
    	}
    	else if($rootScope.filters["filter_type"] == "AUTHOR"){
    		if($scope.recommendations.authors.length >= 30){
				$scope.recommendations.authors = data["recommendations"]["authors"];
			}
			else{
    			$scope.recommendations.authors = $scope.recommendations.authors.concat(data["recommendations"]["authors"]);
			}
    	}
    	else if($rootScope.filters["filter_type"] == "READER"){
    		if($scope.recommendations.readers.length >= 30){
				$scope.recommendations.readers = data["recommendations"]["readers"];
			}
			else{
    			$scope.recommendations.readers = $scope.recommendations.readers.concat(data["recommendations"]["readers"]);
			}
    	}
    	else{
    		if($scope.recommendations.books.length >= 30){
				$scope.recommendations.books = data["recommendations"]["books"];
			}
			else{
    			$scope.recommendations.books = $scope.recommendations.books.concat(data["recommendations"]["books"]);
			}
    	}
	}

	_push_recommendations = function(){
		var fiveMinute = 3000;//300000
		push_books_timer_event = $timeout(function(){
			recommendationService.push_recommendations().then(function(data){
	        	$rootScope.message_type = "Notification";
	        	$rootScope.message = "We think you like Hermann Hesse, and here is his best read.";
	        	_update_recommendations(data);
			});
		}, fiveMinute);
	}

	_init_analytics = function(){
		$rootScope.data = [];
	}

	_recordUserBehaviour = function(){
		var oneMin = 600000000;
		$interval(function(){
			var data = $rootScope.data;
			_init_analytics();
			var data_json = {"data": data};
			// $http.post('/api/v0/track', data_json);
		}, oneMin);
	}

    _get_recommendations = function(){
    	$rootScope.loading = true;
        recommendationService.get_recommendations().then(function(data){
        	_update_recommendations(data);
	    });
    }

	_get_filters = function(){
    	recommendationService.get_filters().then(function(data){
    		$scope.more_filters = $scope.more_filters.concat(data["filters"]);
    	});
    }

    _handle_focused_book = function(){
    	$rootScope.focused_book = $scope.recommendations.books.first;
    }

    _get_friends = function(){
    	widgetService.get_friends($scope.$routeParams.id).then(function(data){
    		$rootScope.user.friends = data.friends;
    	});
    }

    _get_labels = function(){
      recommendationService.get_labels().then(function(data){
        console.debug("%c labels", "color: green");
        $rootScope.labels = data["labels"];
      });
    }

    _handle_socket = function(){
    	appSocket.forward('push:notification', $scope);
    	$scope.$on('socket:push:notification', function(ev, data){
          	$scope.notifications.push({"message": data.notification});
        });
    }


	_init = function(){
		//oneMin = 60000
		$scope.$routeParams = $routeParams;
		// console.debug("%crouteparams "+$routeParams+" ", "color: yellow");
		// $scope.$emit('reloadRecommendations');

		var oneSec = 10000;
		$scope.drop_icon = false;
		$rootScope.show_book = false;

		user_behaviour_timer_event = $timeout(function(){
			_recordUserBehaviour();
		}, oneSec);

		$scope.searching = false;
    	_get_filters();
    	_get_labels();
		_initialize_filters();
		_init_recommendations();
		if($scope.$routeParams.title){
			_get_recommendations();
		}
    	_add_listeners();
		_init_notifications();
        _init_analytics();
        _init_shelf();
        // _get_recommendations();
        // _push_recommendations();
        _bind_destroy();
        // _handle_focused_book();
        _get_friends();
        _handle_socket();
    	// $scope.$emit('moveRight');    
	}

	var push_books_timer_event = "";
	var load_recommendations_event = "";
	var reload_recommendations_event = "";
	var user_behaviour_timer_event = "";
	var open_shelf_event = "";
	_init();

}]);