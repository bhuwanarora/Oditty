websiteApp.controller('recommendationsController', ['$scope', '$rootScope', '$timeout', 'recommendationService', '$route', '$routeParams', '$interval', 'widgetService', 'scroller', 'websiteService', 'sharedService', '$cookieStore', 'RecommendationUIConstants', '$location', 'IntroConstants', 'WebsiteUIConstants', function($scope, $rootScope, $timeout, recommendationService, $route, $routeParams, $interval, widgetService, scroller, websiteService, sharedService, $cookieStore, RecommendationUIConstants, $location, IntroConstants, WebsiteUIConstants){

	// $scope.add_as_friend = function(user_id, event){
	// 	params = {"id": user_id};
	// 	websiteService.add_as_friend(params);
	// }

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

	$scope.show_all_friends = function(){
		$scope._get_friends(30);
	}

	$scope._set_likes = function(array, data){
		angular.forEach(data[0], function(value, index){
			this.push({"id": data[1][index], "name": value, "icon": data[2][index]});
		}, array);
	}

	$scope._set_influential_books = function(array, data){
		angular.forEach(data[4], function(value, index){
			this.push({"isbn": data[3][index], 
					"id": value, 
					"title": data[5][index], 
					"author_name":data[6][index]});
		}, array);
	}

	$scope._get_user_profile_info = function(user_id){
		var _get_user_profile_info = function(user){
			if(angular.isUndefined(user.detailed_info)){
				websiteService.get_detailed_info(user_id).then(function(data){
					user.detailed_info = true;
					user.likes = [];
					user.influential_books = [];
					$scope._set_likes(user.likes, data);
					$scope._set_influential_books(user.influential_books, data);
				});
			}
		}

		if(user_id == $rootScope.user.id){
			_get_user_profile_info($rootScope.user);
			$scope.fetch_new_feed();
		}
		else{
			_get_user_profile_info($rootScope.reader);
			$scope.fetch_new_feed($rootScope.reader.id);
		}
	}

	$scope.toggle_profile = function(user_id, event, delta){
		var _hide_profile = function(){
			$scope.hide_popups();
			$rootScope.user.show_profile = false;
		}

		var _show_profile = function(){
			$scope.hide_popups();
			$rootScope.user.show_profile = true;
			$scope._get_user_profile_info(user_id);
			// sharedService.get_books_bookmarked($scope);
			// $scope._get_friends(2);
		}
		

		if(angular.isUndefined($rootScope.user.show_profile) || !$rootScope.user.show_profile){
			_show_profile();
		}
		else{
			_hide_profile();
		}

		if(angular.isDefined(event)){
			event.preventDefault();
			event.stopPropagation();
		}
	}

	$scope.get_news_feed = function(user_id){
      	$scope.expand_left_panel();
		$rootScope.user.collapsed_column = false; 
		$rootScope.user.collapsed_left_column = false;
      	$scope.fetch_new_feed(user_id);
	}

	$scope.show_friends_list = function(){
	   	$scope.expand_left_panel();
		$rootScope.user.collapsed_friends = false; 
	   	$rootScope.user.collapsed_left_column = false;
	   	$scope._get_friends(20);
	}

	$scope.fetch_new_feed = function(user_id){
      	var init_notification = true;
      	var trending = false;
		$scope.$emit('getNotifications', trending, user_id, init_notification);
	}

	$scope.collapse_left_panel = function(){
		$rootScope.popups.left_panel_width = {'width': WebsiteUIConstants.LeftPanelMinWidth};
	}

	$scope.expand_left_panel = function(){
		$scope.hide_popups();
		$rootScope.user.interact = false;
		$rootScope.popups.left_panel_width = {'width': '34%'};
	}

	$scope.toggle_settings_popup = function(event){
		var _show_settings_popup = function(){
			$scope.hide_popups();
			$rootScope.user.interact = false;
			$rootScope.popups.settings_popup = true;
		}

		if(angular.isUndefined($rootScope.popups.settings_popup)){
			_show_settings_popup();
		}
		else{
			if(!$rootScope.popups.settings_popup){
				_show_settings_popup();
			}
			else{
				$rootScope.popups.settings_popup = false;
			}
		}

		event.stopPropagation();
	}

	$scope.logout = function(){
		sharedService.logout();
	}

	$scope.show_interaction_box = function(user_id){
		$scope.hide_popups();
		$rootScope.user.interact = true;
		var show_trending = false;
		var init_notification = true;
		$scope.$emit('getNotifications', show_trending, user_id, init_notification);
	}

	$scope.show_trending_options = function(event){
		$scope.hide_popups();
		$rootScope.user.interact = true;
		var show_trending = true;
		$scope.$emit('getNotifications', show_trending, $rootScope.user.id);
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
			$scope.column_heights = {"notifications_style" : 
			{"max-height": RecommendationUIConstants.NotificationsMinHeight}, 
			"friends_grid_style": 
			{"max-height": RecommendationUIConstants.FriendsGridMaxHeight, 
			"overflow": "auto"},
			"show_filters": false};
		}
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
		delete $rootScope.ticker_popup;
		if(!$rootScope.user.interact){
			delete $rootScope.focused_book;
		}
		
		$rootScope.user.collapsed_column = true;
		$rootScope.user.collapsed_filters = true;
		$rootScope.user.collapsed_friends = true;
		$rootScope.user.collapsed_trends = true;
		$rootScope.user.collapsed_lists = true;
		$rootScope.user.collapsed_left_column = true;
		$rootScope.popups = {};
		$rootScope.popups.left_panel_width = {'width': WebsiteUIConstants.LeftPanelMinWidth};
	}

	_load_icon = function(){
		$scope.drop_icon = true;
		$timeout(function(){
			$scope.drop_icon = false;
		}, 1000);
	}

	_add_listeners = function(){
	    load_recommendations_event = $scope.$on('loadRecommendations', function(){
	    	var _set_recommendations = function(){
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
	    	}

	    	var _set_books_bookmarked = function(){
	    		websiteService.get_books_bookmarked($rootScope.user.books.bookmarked.length)
	    			.then(function(data){
	    			var timer = 500;
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
						timer = timer + 500;
						var timeout_event = $timeout(function(){
							$rootScope.user.books['bookmarked'].push(json);
						}, timer);
						$scope._destroy_event(timeout_event);
						// this.push(json);
					});
				});
	    	}

	    	var _set_books_read = function(){
	    		websiteService.get_books_read($rootScope.user.books.read.length).then(function(data){
	    			angular.forEach(data, function(value){
						var json = {"isbn": value[0], "id": value[1], "status": true};
						this.push(json);
					},  $rootScope.user.books.read);
	    		});
	    	}

	    	
	    	if(!$scope.read_selected && !$scope.bookmark_selected){
		    	_set_recommendations();
	    	}
	    	else if($scope.bookmark_selected){
	    		_set_books_bookmarked();	
	    	}
	    	else if($scope.read_selected){
	    		_set_books_read();
	    	}
	    });

	    reload_recommendations_event = $scope.$on('reloadRecommendations', function(event){
	    	console.debug("%creloadRecommendations", "color: orange;");
	    	console.debug("%c reset count", "color: purple");
	    	$rootScope.filters["reset"] = true;
	    	$rootScope.filters["reset_count"] = 0;
	    	$scope.reset();
	    	console.log("%c reload_recommendations_event", "color: green;");
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

	$scope._show_bookmark_tab = function(){
		$scope.bookmark_selected  = true;
        $scope.panel_selected = RecommendationUIConstants.BookmarkPanel;
	}


	$scope._initialize_filters = function(){
		var _collapse_every_left_panel = function(){
			$rootScope.user.collapsed_filters = true;
    		$rootScope.user.collapsed_friends = true;
    		$rootScope.user.collapsed_trends = true;
    		$rootScope.user.collapsed_lists = true;
    		$rootScope.user.collapsed_column = true;
    		$rootScope.user.show_profile = false;
    		$rootScope.user.collapsed_left_column = true;
		}

		var _handle_specific_list_page = function(){
			$rootScope.filters["filter_id"] = $routeParams.filter_id;
			$rootScope.main_header = $routeParams.name;
			$rootScope.user.main_header = {"color": "white", "text-shadow": "none"};
			$rootScope.user.main_header_background = {"background-color": "#918fb5"};
		}

		var _handle_specific_shelf_page = function(){
    		// $scope.expand_left_panel();
			$rootScope.filters["label_id"] = $routeParams.label_id;
			$rootScope.main_header = $routeParams.name;
			_collapse_every_left_panel();
			$rootScope.user.main_header = {"color": "white", "text-shadow": "none"};
    		$rootScope.user.main_header_background = {"background-color": "#E2B503"};
    		// $rootScope.user.collapsed_filters = false;
		}

		var _handle_grids_page = function(){
    		// $scope.expand_left_panel();
    		$rootScope.filters["filter_id"] = $routeParams.grid_id;
    		$rootScope.main_header = $routeParams.name;
    		_collapse_every_left_panel();
    		$rootScope.user.main_header = {"color": "white", "text-shadow": "none"};
    		$rootScope.user.main_header_background = {"background-color": "#918fb5"};
    		// $rootScope.user.collapsed_lists = false;
		}

		var _handle_trending_page = function(){
			var _get_link = function(trend){
				return "#user/"+$rootScope.user.id+"/trending/books/id/"+trend.id+"/name/"+trend.name;
			}

			var _set_nav_links = function(index){
				if(index == 0){
					$rootScope.prev_link = _get_link($rootScope.trending_feed[$rootScope.trending_feed.length - 1]);
					$rootScope.next_link = _get_link($rootScope.trending_feed[index + 1]);
				}
				else if(index == $rootScope.trending_feed.length - 1){
					$rootScope.prev_link = _get_link($rootScope.trending_feed[index - 1]);
					$rootScope.next_link = _get_link($rootScope.trending_feed[0]);
				}
				else{
					$rootScope.prev_link = _get_link($rootScope.trending_feed[index - 1]);
					$rootScope.next_link = _get_link($rootScope.trending_feed[index + 1]);
				}
			}

    		// $scope.expand_left_panel();
    		$rootScope.filters["reset"] = true;
    		$rootScope.filters["reset_count"] = 0;
    		$rootScope.filters["trend_id"] = $routeParams.trend_id;
    		$rootScope.main_header = $routeParams.name;
    		var trend_index = 0;
    		if(angular.isDefined($rootScope.trending_feed)){
    			angular.forEach($rootScope.trending_feed, function(trend, index){
    				if(trend["id"] == $routeParams.trend_id){
    					$rootScope.main_topic = trend;
    					trend_index = index;
    				}
    			});
    		}
    		_set_nav_links(trend_index);
    		_collapse_every_left_panel();
    		$rootScope.user.main_header = {"color": "white", "text-shadow": "none"};
    		$rootScope.user.main_header_background = {"background-color": "#dd4b39"};
    		// $rootScope.user.collapsed_trends = false;
		}
		
        var _handle_recommendations_page = function(){
        	delete $rootScope.user.main_header;
        	delete $rootScope.user.main_header_background;
    		delete $rootScope.main_header;
    		delete $rootScope.main_topic;
    		delete $rootScope.filters.filter_id;
    		delete $rootScope.filters.trend_id;
    		delete $rootScope.filters.label_id;
        }

        var _handle_specific_book_page = function(){
        	$rootScope.user.main_header = {"color": "white", "text-shadow": "none"};
        	$rootScope.user.main_header_background = {"background-color": "#427fed"};
        	$scope.$routeParams.type = 'books';
        	$rootScope.filters["reset"] = true;
        	$rootScope.filters["reset_count"] = 0;
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.BookTab;
        	$rootScope.main_header = "Back to recommendations";
        	$rootScope.filters.other_filters["id"] = $scope.$routeParams.book_id;
        }

        var _handle_specific_title_page = function(){
        	$rootScope.user.main_header = {"color": "white", "text-shadow": "none"};
        	$rootScope.user.main_header_background = {"background-color": "#427fed"};
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
        
		$rootScope.filters = {};
        $rootScope.filters["more_filters"] = [];
        $rootScope.filters["other_filters"] = {};
        if($routeParams.type == "books"){
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.BookTab;
        	var on_specific_list_page = angular.isDefined($routeParams.filter_id);
        	var on_specific_shelf = angular.isDefined($routeParams.label_id);
        	var on_grids_page = angular.isDefined($routeParams.grid_id);
        	var on_trending_page = angular.isDefined($routeParams.trend_id);
        	if(on_specific_list_page){
        		_handle_specific_list_page();
        	}
        	else if(on_specific_shelf){
        		_handle_specific_shelf_page();
        	}
        	else if(on_trending_page){
        		_handle_trending_page();
        	}
        	else if(on_grids_page){
        		_handle_grids_page();
        	}
        	else{
        		_handle_recommendations_page();
        	}
        }
        else if($routeParams.type == "authors"){
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.AuthorTab;
        }
        else if($routeParams.type == "readers"){
        	$rootScope.filters["filter_type"] = RecommendationUIConstants.ReaderTab;
        }
        else if($routeParams.book_id){
        	_handle_specific_book_page();
        }
        else if($routeParams.title){
        	_handle_specific_title_page();
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
			var _push_notification = function(){
				if(data.recommendations.books.length > 1){
					var message = "INFO- "+data.recommendations.books.length+" books found. Scroll to see more books.";
				}
				else if(data.recommendations.books.length >= 0){
					var message = "INFO- "+data.recommendations.books.length+" book found.";	
				}
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
			};

			var _zero_notification = function(){
				var message = RecommendationUIConstants.ZeroBooksFound;
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
			};

			var _max_limit_reached = function(max_limit){
				$scope.recommendations.books = [$scope.recommendations.books[max_limit-2], $scope.recommendations.books[max_limit-1]];
				var timeout_event = $timeout(function(){
					scroller.scrollTo(window_width/4, 0, 200);
				}, 200);
				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
			};

			var _on_title_search = function(){
				$scope.bookmark_selected  = false;
				$scope.read_selected = false;
				$rootScope.hide_options = true;
				$scope._set_books(data["recommendations"]["books"]);
			}

			_push_notification();
			if($rootScope.user.loading){
				var max_limit = 20;
				if(data.recommendations.books.length == 0){
					_zero_notification();
				}
				else{
					$scope.hide_popups();
					$rootScope.user.interact = false;
					var max_limit_reached = $scope.recommendations.books.length >= max_limit;
					var on_title_search = angular.isDefined($rootScope.filters.other_filters["id"] || $rootScope.filters.other_filters["title"]);

					if(max_limit_reached){
						_max_limit_reached(max_limit);
					}
					
					if(on_title_search){
						_on_title_search();
					}
					else{
		    			$scope._set_books(data["recommendations"]["books"]);
					}
				}
		    	$rootScope.user.loading = false;
			}
    	}
    	else{
    		if($rootScope.user.loading){
	    		if($scope.recommendations.books.length >= max_limit){
	    			$scope._set_books(data["recommendations"]["books"]);
				}
				else{
	    			$scope._set_books(data["recommendations"]["books"]);
				}
    			$rootScope.user.loading = false;
    		}
    	}

    	if(angular.isDefined($rootScope.user)){
    		$rootScope.user.faded_wrapper = {"opacity": "0.5"};
    	}
    	else{
    		$rootScope.user = {"faded_wrapper": {"opacity": "0.5"}};
    	}
	}

	$scope._destroy_event = function(timeout_event){
		$scope.$on('destroy', function(){
			$timeout.cancel(timeout_event);
		});
	}
	
	$scope._set_books = function(data){
		var _get_json = function(value){
			return {"isbn": value[0], "id": value[1], "external_thumb": value[2]};
		}
		
		var _bookmarked_books = function(){
			$rootScope.user.books['bookmarked'] = [];
			var timer = 200;
			angular.forEach(data, function(value){
				timer = timer + 200;
				var timeout_event = $timeout(function(){
					$rootScope.user.books['bookmarked'].push(_get_json(value));
				}, timer);
				$scope._destroy_event(timeout_event);
			});
			var width = window_width/$rootScope.user.books['bookmarked'].length;
			$scope.block_style = {"width": width+"px"};
		};

		var _is_undefined = function(value){
			return angular.isUndefined(value) || (value == null) || value
  == "";
		}

		var _recommended_books = function(){
			var group_of_three = [];
			var book_array = [];
			var timer = 200;

			angular.forEach(data, function(value){
				var json = {"isbn": value[0], "id": value[1], "external_thumb": value[2]};
				var data_missing = _is_undefined(value[0]);

				if(data_missing){
					json = angular.extend(json, {"no_thumb": true});
					if(group_of_three.length == 3){
						// this.push({"book_array": group_of_three, "is_book_array": true});
						timer = timer + 200;
						var timeout_event = $timeout(function(){
							$scope.recommendations.books.push({"book_array": group_of_three, "is_book_array": true});
						}, timer);
						$scope._destroy_event(timeout_event);
						group_of_three = [];
					}
					group_of_three.push(json);
				}
				else{
					timer = timer + 200;
					$timeout(function(){
						$scope.recommendations.books.push(json);
					}, timer);
					$scope._destroy_event(timeout_event);
				}
			});
			if(group_of_three.length != 0){
				$scope.recommendations.books.push({"book_array": group_of_three, "is_book_array": true});
			}
			var width = window_width/($scope.recommendations.books.length + 6);
			$scope.block_style = {"width": width+"px"};
		};
		
		if($scope.bookmark_selected){
			_bookmarked_books();
		}
		else{
			_recommended_books();
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
				var message = "INFO-Check out Books becoming movies...";
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
    	$rootScope.user.loading = true;
        recommendationService.get_recommendations().then(function(data){
        	_update_recommendations(data);
	    });
	    var not_specific_book_page = angular.isUndefined($rootScope.filters.other_filters["title"]) && angular.isUndefined($rootScope.filters.other_filters["id"]);
	    var enough_books_on_page = $scope.recommendations.books.length >= 4;
	    console.debug("_get_grids ", not_specific_book_page, enough_books_on_page);
	    if(not_specific_book_page && enough_books_on_page){
	    	// _get_grids();
	    }
    }

    $scope._handle_focused_book = function(){
		var _get_json = function(value){
			return {"isbn": value[0], "id": value[1], "external_thumb": value[2]};
		}

    	if(angular.isDefined($scope.recommendations.books.is_book_array) && $scope.recommendations.books.is_book_array){
    		if($scope.recommendations.books.book_array.length == 1){
    			$rootScope.focused_book = _get_json($scope.recommendations.books.first);
    		}
    	}
    	else{
    		$rootScope.focused_book = _get_json($scope.recommendations.books.first);	
    	}
    }

    $scope.get_notifications = function(user_id, event){
    	if($rootScope.user.show_profile){
    		var trending = false;
  			$scope.$emit('getNotifications', trending, user_id);
  			// event.stopPropagation();
    	}
	}

    $scope._get_friends = function(count){
    	var _set_friends_for = function(user_array, data){
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
			    			"fav_categories": value[7]};
    			this.push(json);
    		}, user_array);
    	}

    	if(angular.isUndefined($rootScope.reader)){
    		sharedService.set_friends();
    	}
    	else{
    		var length = angular.isDefined($rootScope.reader.friends) ? $rootScope.reader.friends.length : 0;
    		if(angular.isUndefined($rootScope.reader.friends) || !$rootScope.reader.all_friends_shown){
	    		widgetService.get_friends($rootScope.reader.id, count, length).then(function(data){
	    			if(count > data.length){
		    			$rootScope.reader.all_friends_shown = true;
		    		}
		    		if(angular.isUndefined($rootScope.reader.friends)){
		    			$rootScope.reader.friends = [];
		    		}
		    		_set_friends_for($rootScope.reader.friends, data);
		    	});
    		}
    	}
    }

    $scope._init_user = function(){
    	if(angular.isUndefined($rootScope.user) || angular.isUndefined($rootScope.user.id)){
    		sharedService.is_logged_in($scope);
    	}
    }

    $scope._init_reader = function(){
    	sharedService.get_user($scope.$routeParams.id);
    }

    $scope._basic_init = function(){
		$scope.grid_view = false;
		$rootScope.popups = {"settings_popup": false, "show_notifications_popup": false};
		var oneSec = 10000;
		$scope.drop_icon = false;
		// $rootScope.show_book = false;
		$rootScope.user = angular.extend($rootScope.user, {"collapsed_trends": true, "collapsed_friends": true, 
							"collapsed_filters": true, "collapsed_lists": true,
							'collapsed_column': true,
							'collapsed_left_column': true,
							"locked": false,
							"interact": false});

		user_behaviour_timer_event = $timeout(function(){
			_recordUserBehaviour();
		}, oneSec);
		$scope.searching = false;
    	
		_add_listeners();
		_init_analytics();
		_bind_destroy();
		$scope.cover_image = {'background-image': 'url("'+$cookieStore.get('coverImage')+'")'};
		$scope._init_user();
    }

	_init = function(){
		//oneMin = 60000
		if($rootScope.user.logged){
			$scope._basic_init();
			$scope.$routeParams = $routeParams;
			delete $rootScope.reader;
			if($scope.$routeParams.type == "profile"){
				$rootScope.user.show_profile = false;
				var reader_id = $scope.$routeParams.id;
				$rootScope.reader = {};
				$rootScope.reader.id = reader_id;
				$scope.toggle_profile(reader_id);
				$scope._init_reader();
				sharedService.set_labels(reader_id);
				$scope.placeholder = "Write on timeline...";
				$rootScope.user.main_header = {"color": "white", "text-shadow": "none"};
    			$rootScope.user.main_header_background = {"background-color": "#65b045"};
			}
			else{
				_init_recommendations();
				sharedService.set_labels();
				$scope._initialize_filters();

		        // $scope._handle_focused_book();
		        // $scope.get_notifications();

				$scope.placeholder = WebsiteUIConstants.Share;
			}
		}
		else{
			$rootScope.user = {'books': {'bookmarked':[], 'read': []},
						'authors': {'bookmarked': [], 'follow': []},
						'readers': {'follow': []},
						'logged': false};
        	// $location.path("/search");
		}
	}

   	$scope.getting_started_tour_options = {
        steps:[
	        {
	            element: '#shelves',
	            intro: IntroConstants.Shelves,
	            position: 'right'
	        },
	        {
	            element: '#friendsList',
	            intro: IntroConstants.Friends,
	            position: 'right'
	        },
	        {
	            element: '#newsFeed',
	            intro: IntroConstants.NewsFeed,
	            position: 'right'
	        },
	        {
	            element: '#listopia',
	            intro: IntroConstants.Listopia,
	            position: 'right'
	        },
	        {
	            element: '#trendingList',
	            intro: IntroConstants.Trending,
	            position: 'right'
	        },
	        {
	            element: '#share',
	            intro: IntroConstants.Share,
	            position: 'bottom'
	        },
	        {
	            element: '#recommendationFooter',
	            intro: IntroConstants.ShelvesTab,
	            position: 'bottom'
	        }
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc: true,
        nextLabel: '<strong>Next</strong>',
        prevLabel: '<span>Previous</span>',
        skipLabel: 'Exit',
        doneLabel: '<strong>Thanks</strong>'
    };

    $scope.should_auto_start = function() {
        return false;
    }

	var push_books_timer_event = "";
	var load_recommendations_event = "";
	var reload_recommendations_event = "";
	var user_behaviour_timer_event = "";
	
	_init();

}]);