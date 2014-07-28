
websiteApp.controller('recommendationsController', ['$scope', '$rootScope', '$timeout', 'recommendationService', '$route', '$routeParams', '$interval', 'widgetService', 'scroller', 'websiteService', function($scope, $rootScope, $timeout, recommendationService, $route, $routeParams, $interval, widgetService, scroller, websiteService){

	$scope.handle_height_of_popup = function(event){
		if(event.deltaY > 0){
			$scope.ticker_popup_style = {"height": "62vh"};
		}
		else{
			$scope.ticker_popup_style = {"height": "42vh"};		
		}
		event.stopPropagation();
	}

	$scope.handle_friends_grid_size = function(event, scroll_down){
		var event_defined = angular.isDefined(event);
		if(event_defined){
			var increase_tab_size = event.deltaY > 0;
		}
		else{
			var increase_tab_size = scroll_down;
		}
		if(increase_tab_size){
			$scope.column_heights = {"notifications_style" : {"max-height": "110px"}, 
									"friends_grid_style": {"max-height": "120px", "overflow": "auto"},
									"show_filters": false};
		}
		else{
			$scope.column_heights = {"notifications_style" : {"max-height": "110px"}, 
									"friends_grid_style": {"height": "75px"},
									"show_filters": false};
		}
		if(event_defined){
			event.stopPropagation();
		}
	}

	$scope.reset = function(){
		_init_recommendations();
    	_get_recommendations();
    	// $scope.$emit('moveRight');
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
	    	if(!$scope.read_selected && !$scope.bookmark_selected){
		    	console.debug("%cloadRecommendations", "color: purple;");
		    	$rootScope.filters["reset"] = false;
		    	if(angular.isUndefined($rootScope.filters["reset_count"])){
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
	    	}
	    	else if($scope.bookmark_selected){
	    		websiteService.get_books_bookmarked($rootScope.user.books.bookmarked.length).then(function(data){
					angular.forEach(data, function(data){
						var labels = [];
						angular.forEach($rootScope.labels, function(value){
							if(data[2].indexOf(value.name) >= 0){
								var json = {"name": value.name, "checked": true};
							}
							else{
								var json = {"name": value.name, "checked": false};
							}
							labels.push(json);	
						}, labels);
						var json = {"isbn": data[0], 
									"id": data[1], 
									"bookmark_status": true, 
									"labels": labels};
						this.push(json);
					},  $rootScope.user.books['bookmarked']);
				});
	    	}
	    	else if($scope.read_selected){
	    		websiteService.get_books_read($rootScope.user.books.read.length).then(function(data){
	    			angular.forEach(data, function(value){
						var json = {"isbn": value[0], "id": value[1], "status": true};
						this.push(json);
					},  $rootScope.user.books.read);
	    		});
	    	}
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

	_show_bookmark_tab = function(){
		$scope.bookmark_selected  = true;
        $scope.panel_selected = 'BOOKMARK';
	}

	_initialize_filters = function(){
		// $scope.show_more_filters = true;
		$rootScope.filters = {};
        $rootScope.filters["more_filters"] = [];
        $rootScope.filters["other_filters"] = {};
        if($routeParams.type == "books"){
        	$rootScope.filters["filter_type"] = "BOOK";
        	var specific_list = angular.isDefined($routeParams.filter_id);
        	var trends = angular.isDefined($routeParams.trend_id);
        	if(specific_list){
        		_show_bookmark_tab();
        		$rootScope.filters["filter_id"] = $routeParams.filter_id;
        	}
        	else if(trends){
        		$rootScope.filters["reset"] = true;
	    		$rootScope.filters["reset_count"] = 0;
        		$rootScope.filters["trend_id"] = $routeParams.trend_id;
        		$rootScope.main_header = $routeParams.name;
        	}
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
        	$rootScope.main_header = $scope.$routeParams.title;
			$rootScope.filters.other_filters["author_name"] = $scope.$routeParams.author;
			var id_defined = angular.isDefined($scope.$routeParams.book_id);
			var show_all = angular.isDefined($scope.$routeParams.status);
			if(show_all){
				$rootScope.filters.other_filters["show_all"] = $scope.$routeParams.status;
				$rootScope.filters["reset"] = true;
	    		$rootScope.filters["reset_count"] = 0;
			}
			if(id_defined){
				$rootScope.filters.other_filters["id"] = $scope.$routeParams.book_id;
			}
        }
        else{
			$rootScope.filters["filter_type"] = "BOOK";
			$scope.show_notifications = true;
        }
        // if($routeParams.filter_id){
        // 	$scope.show_more_filters = true;
        // }
	}

	_update_recommendations = function(data){
		if($rootScope.filters["filter_type"] == "BOOK"){
			if(data.recommendations.books.length > 0){
				var message = "INFO- "+data.recommendations.books.length+" books found.";
			}
			else{
				var message = "INFO- "+data.recommendations.books.length+" book found.";	
			}
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
					$rootScope.focused_book = null;
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
						// $scope.recommendations.books = data["recommendations"]["books"];
						_set_books(data["recommendations"]["books"]);
						// $rootScope.focused_book = $scope.recommendations.books[0];
						// $rootScope.focused_book.tweets = [];
					}
					else{
		    			// $scope.recommendations.books = $scope.recommendations.books.concat(data["recommendations"]["books"]);
		    			_set_books(data["recommendations"]["books"]);
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

    			_set_books(data["recommendations"]["books"]);
				// $scope.recommendations.books = data["recommendations"]["books"];
			}
			else{
    			// $scope.recommendations.books = $scope.recommendations.books.concat(data["recommendations"]["books"]);
    			_set_books(data["recommendations"]["books"]);
			}
    	}
	}
	_set_books = function(data){
		if($scope.bookmark_selected){
			$rootScope.user.books['bookmarked'] = [];
			angular.forEach(data, function(value){
				var json = {"isbn": value[0], "id": value[1]};
				this.push(json);
			},  $rootScope.user.books['bookmarked']);
			var width = screen.width/$rootScope.user.books['bookmarked'].length;
			$scope.block_style = {"width": width+"px"};
		}
		else{
			angular.forEach(data, function(value){
				var json = {"isbn": value[0], "id": value[1]};
				this.push(json);
			},  $scope.recommendations.books);
			var width = screen.width/($scope.recommendations.books.length + 4);
			$scope.block_style = {"width": width+"px"};
		}
	}

	_push_recommendations = function(){
		var fiveMinute = 3000;//300000
		push_books_timer_event = $timeout(function(){
			recommendationService.push_recommendations().then(function(data){
				var grid = {"grid_text": "Books becoming movies", 
				"grid_books": data, "is_grid": true};
				$scope.recommendations.books.splice(3, 0, grid);
				var message = "INFO-Checkout Books becoming movies...";
				notify($rootScope, message, $timeout);
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
    	$rootScope.labels = [];
      	recommendationService.get_labels().then(function(data){
        	console.debug("%c labels"+data, "color: green");
        	if(angular.isArray(data) && data.length > 0){
	        	angular.forEach(data, function(value){
	        		if(value[0]!=null){
	        			this.push({"name": value[0].replace("\"", ""), "id": value[1]});
	        		}
	        	}, $rootScope.labels);
        	}
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
		// if($scope.$routeParams.title){
		// 	_get_recommendations();
		// }
    	_add_listeners();
        _init_analytics();
        // _init_shelf();
        var timeout_event = $timeout(function(){
        	_get_recommendations();
        }, 1000);

        $scope.$on('destroy', function(){
        	$timeout.cancel(timeout_event);
        });
        _push_recommendations();
        _bind_destroy();
        // _handle_focused_book();
        _get_friends();
    	// $scope.$emit('moveRight');    
	}

	var push_books_timer_event = "";
	var load_recommendations_event = "";
	var reload_recommendations_event = "";
	var user_behaviour_timer_event = "";
	
	_init();

}]);