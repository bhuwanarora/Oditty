websiteApp.controller('recommendationsController', ['$scope', '$rootScope', '$timeout', 'recommendationService', '$route', '$routeParams', '$interval', 'widgetService', 'scroller', 'websiteService', 'sharedService', '$cookieStore', 'RecommendationUIConstants', '$location', function($scope, $rootScope, $timeout, recommendationService, $route, $routeParams, $interval, widgetService, scroller, websiteService, sharedService, $cookieStore, RecommendationUIConstants, $location){

	$scope.handle_height_of_popup = function(event, scroll_down){
		var event_defined = angular.isDefined(event);
		if(event_defined){
			var increase_tab_size = event.deltaY > 0;
		}
		else{
			var increase_tab_size = scroll_down;
		}
		if(increase_tab_size){
			$scope.ticker_popup_style = {"height": RecommendationUIConstants.TickerPopupMaxHeight};
		}
		if(event_defined){
			event.stopPropagation();
		}
	}

	$scope.show_settings_popup = function(event){
		if(angular.isUndefined($rootScope.user.settings_popup)){
			$rootScope.user.settings_popup = true;
		}
		else{
			$rootScope.user.settings_popup = !$rootScope.user.settings_popup;
		}
		event.stopPropagation();
	}

	$scope.logout = function(){
		sharedService.logout();
	}

	$scope.show_interaction_box = function(){
		$rootScope.user.interact = true; 
		delete $rootScope.focused_book;
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
			$scope.column_heights = {"notifications_style" : 
			{"max-height": RecommendationUIConstants.NotificationsMinHeight}, 
			"friends_grid_style": 
			{"max-height": RecommendationUIConstants.FriendsGridMaxHeight, 
			"overflow": "auto"},
			"show_filters": false};
		}
		// else{
		// 	$scope.column_heights = {"notifications_style" : {"max-height": "110px"}, 
		// 							"friends_grid_style": {"height": "75px"},
		// 							"show_filters": false};
		// }
		if(event_defined){
			event.stopPropagation();
		}
	}

	$scope.reset = function(){
		$scope.panel_selected = "";
		$scope.bookmark_selected = false;
		$scope.read_selected = false;
		_init_recommendations();
    	_get_recommendations();
	}

	$scope.stopSearching = function(event){
		$rootScope.searching = false;
		event.currentTarget.text = "";
	}

	$scope.hide_popups = function(){
		delete $rootScope.focused_book;
		delete $rootScope.ticker_popup;
 		// $scope.show_more_filters = false;
	}

	$scope.get_notifications = function(){
		$scope.$emit('getNotifications');
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
		    	console.debug("%c loadRecommendations", "color: purple;");
		    	$rootScope.filters["reset"] = false;
		    	if(angular.isUndefined($rootScope.filters["reset_count"])){
		    		console.debug("%c reset count", "color: purple");
		    		$rootScope.filters["reset_count"] = 0;
		    	}
		    	else{
		    		console.debug("%c increase count", "color: purple");
		    		$rootScope.filters["reset_count"] = $rootScope.filters["reset_count"] + 1;
		    	}
		    	
		    	console.log("%c load_recommendations_event", "color: green;");
		    	_get_recommendations();
		    	// event.stopPropagation();
	    	}
	    	else if($scope.bookmark_selected){
	    		websiteService.get_books_bookmarked($rootScope.user.books.bookmarked.length)
	    			.then(function(data){
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
        $scope.panel_selected = RecommendationUIConstants.BookmarkPanel;
	}

	_initialize_filters = function(){
		// $scope.show_more_filters = true;
		$rootScope.filters = {};
        $rootScope.filters["more_filters"] = [];
        $rootScope.filters["other_filters"] = {};
        if($routeParams.type == "books"){
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.BookTab;
        	var on_specific_list_page = angular.isDefined($routeParams.filter_id);
        	var on_grids_page = angular.isDefined($routeParams.grid_id);
        	var on_trending_page = angular.isDefined($routeParams.trend_id);
        	if(on_specific_list_page){
        		if($cookieStore.get('tab') == RecommendationUIConstants.BookmarkPanel){
        			_show_bookmark_tab();
        			$rootScope.filters["label_id"] = $routeParams.filter_id;
        			$rootScope.main_header = $routeParams.name;
        		}
        		else{
        			$rootScope.filters["filter_id"] = $routeParams.filter_id;
        			$rootScope.main_header = $routeParams.name;
        		}
        	}
        	else if(on_trending_page){
        		$rootScope.filters["reset"] = true;
	    		$rootScope.filters["reset_count"] = 0;
        		$rootScope.filters["trend_id"] = $routeParams.trend_id;
        		$rootScope.main_header = $routeParams.name;
        	}
        	else if(on_grids_page){
        		$rootScope.filters["filter_id"] = $routeParams.grid_id;
        		$rootScope.main_header = $routeParams.name;
        	}
        	else{
        		delete $rootScope.main_header;
        	}
        }
        else if($routeParams.type == "authors"){
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.AuthorTab;
        }
        else if($routeParams.type == "readers"){
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.ReaderTab;
        }
        else if($routeParams.book_id){
        	$scope.$routeParams.type = 'books';
        	$rootScope.filters["reset"] = true;
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.BookTab;
        	$rootScope.filters.other_filters["id"] = $scope.$routeParams.book_id;
        }
        else if($routeParams.title){
			$scope.$routeParams.type = 'books';
        	$rootScope.filters["reset"] = true;
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.BookTab;
        	$rootScope.filters.other_filters["title"] = $scope.$routeParams.title;
        	$rootScope.main_header = $scope.$routeParams.title;
			var show_all = angular.isDefined($scope.$routeParams.status);
			if(show_all){
				$rootScope.filters.other_filters["show_all"] = $scope.$routeParams.status;
				$rootScope.filters["reset"] = true;
	    		$rootScope.filters["reset_count"] = 0;
			}
        }
        else{
			$rootScope.filters["filter_type"] = RecommendationUIConstants.BookTab;
			$scope.show_notifications = true;
        }
        // if($routeParams.filter_id){
        // 	$scope.show_more_filters = true;
        // }
	}

	_update_recommendations = function(data){
		if($rootScope.filters["filter_type"] == RecommendationUIConstants.BookTab){
			if(data.recommendations.books.length > 0){
				var message = "INFO- "+data.recommendations.books.length+" books found.";
			}
			else if(data.recommendations.books.length == 0){
				var message = "INFO- "+data.recommendations.books.length+" book found.";	
			}
			var timeout_event = notify($rootScope, message, $timeout);
			$scope.$on('destroy', function(){
				$timeout.cancel(timeout_event);
			});

			if($rootScope.loading){
				var max_limit = 10;
				if(data.recommendations.books.length == 0){
					var message = RecommendationUIConstants.ZeroBooksFound;
					var timeout_event = notify($rootScope, message, $timeout);
					$scope.$on('destroy', function(){
						$timeout.cancel(timeout_event);
					});
				}
				else{
					delete $rootScope.focused_book;
					if($scope.recommendations.books.length >= max_limit){
						$scope.recommendations.books = [$scope.recommendations.books[max_limit-2], $scope.recommendations.books[max_limit-1]];
						var timeout_event = $timeout(function(){
							scroller.scrollTo(window_width/4, 0, 2000);
						}, 200);
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
    	else if($rootScope.filters["filter_type"] == RecommendationUIConstants.AuthorTab){
    		if($scope.recommendations.authors.length >= max_limit){
				$scope.recommendations.authors = data["recommendations"]["authors"];
			}
			else{
    			$scope.recommendations.authors = $scope.recommendations.authors.concat(data["recommendations"]["authors"]);
			}
    	}
    	else if($rootScope.filters["filter_type"] == RecommendationUIConstants.ReaderTab){
    		if($scope.recommendations.readers.length >= max_limit){
				$scope.recommendations.readers = data["recommendations"]["readers"];
			}
			else{
    			$scope.recommendations.readers = $scope.recommendations.readers.concat(data["recommendations"]["readers"]);
			}
    	}
    	else{
    		if($scope.recommendations.books.length >= max_limit){
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
				var json = {"isbn": value[0], "id": value[1], "external_thumb": value[2]};
				this.push(json);
			},  $rootScope.user.books['bookmarked']);
			var width = window_width/$rootScope.user.books['bookmarked'].length;
			$scope.block_style = {"width": width+"px"};
		}
		else{
			angular.forEach(data, function(value){
				var json = {"isbn": value[0], "id": value[1], "external_thumb": value[2]};
				this.push(json);
			},  $scope.recommendations.books);
			var width = window_width/($scope.recommendations.books.length + 6);
			$scope.block_style = {"width": width+"px"};
		}
	}

	_get_grids = function(){
		recommendationService.get_grid_books().then(function(data){
			var book_grid = [];
			var grid_name = ""
			for(var i=0; i < data.length; i++){
				var new_grid = grid_name != data[i][0];
				if(new_grid){
					var not_first_iteration = grid_name != "";
					if(not_first_iteration){
						if(book_grid.length > 4){
							var grid = {"grid_text": grid_name, 
										"grid_books": book_grid, 
										"is_grid": true, 
										"id": grid_id};
							var index = $scope.recommendations.books.length - 2;
							$scope.recommendations.books.splice(index, 0, grid);
						}
						book_grid = [];
					}
					grid_name = data[i][0];
					grid_id = data[i][3];
				}
				var json = {"isbn": data[i][1], "id": data[i][2], "external_thumb": data[i][4]};
				book_grid.push(json);
			}
			if(book_grid.length > 4){
				var grid = {"grid_text": grid_name, 
							"grid_books": book_grid, 
							"is_grid": true, 
							"id": grid_id};
				var index = $scope.recommendations.books.length - 2;
				$scope.recommendations.books.splice(index, 0, grid);
			}
		});
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
	    var not_specific_book_page = angular.isUndefined($rootScope.filters.other_filters["title"]) && angular.isUndefined($rootScope.filters.other_filters["id"]);
	    var enough_books_on_page = $scope.recommendations.books.length > 4;
	    if(not_specific_book_page && enough_books_on_page){
	    	_get_grids();
	    }
    }

    _handle_focused_book = function(){
    	$rootScope.focused_book = $scope.recommendations.books.first;
    }

    _get_friends = function(){
    	widgetService.get_friends($scope.$routeParams.id).then(function(data){
    		$rootScope.user.friends = [];
    		angular.forEach(data, function(value){
    			if(value[2] == null){
    				thumb = "/assets/profile_pic.jpeg"
    			}
    			else{
    				thumb = value[2];
    			}
    			
    			var json = {"id": value[0], 
			    			"name": value[1], 
			    			"thumb": thumb, 
			    			"init_book_read_count": value[3],
			    			"total_count": value[4],
			    			"book_read_count": value[5],
			    			"bookmark_count": value[6],
			    			"fav_categories": value[7].join(", ")};
    			this.push(json);
    		}, $rootScope.user.friends);
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

    _init_user = function(){
    	if(angular.isUndefined($rootScope.user) || angular.isUndefined($rootScope.user.id)){
    		sharedService.is_logged_in($scope);
    	}
    }

	_init = function(){
		//oneMin = 60000
		if($rootScope.user.logged){
			$scope.grid_view = false;
			$scope.$routeParams = $routeParams;
			$rootScope.user.settings_popup = false;
			// console.debug("%crouteparams "+$routeParams+" ", "color: yellow");
			// $scope.$emit('reloadRecommendations');

			var oneSec = 10000;
			$scope.drop_icon = false;
			// $rootScope.show_book = false;
			$rootScope.user.interact = false;

			user_behaviour_timer_event = $timeout(function(){
				_recordUserBehaviour();
			}, oneSec);

			$scope.searching = false;
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
	        // _push_recommendations();
	        _bind_destroy();
	        _init_user();
	        // _handle_focused_book();
	        _get_friends();
	        $scope.$emit('getNotifications');
		}
		else{
			$rootScope.user = {'books': {'bookmarked':[], 'read': []},
						'authors': {'bookmarked': [], 'follow': []},
						'readers': {'follow': []},
						'logged': false};
        	$location.path("/search");
		}
	}

	var push_books_timer_event = "";
	var load_recommendations_event = "";
	var reload_recommendations_event = "";
	var user_behaviour_timer_event = "";
	
	_init();

}]);