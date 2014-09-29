websiteApp.controller('recommendationsController', ['$scope', '$rootScope', '$timeout', 'recommendationService', '$route', '$routeParams', '$interval', 'widgetService', 'scroller', 'websiteService', 'sharedService', '$cookieStore', 'RecommendationUIConstants', '$location', 'IntroConstants', 'WebsiteUIConstants', function($scope, $rootScope, $timeout, recommendationService, $route, $routeParams, $interval, widgetService, scroller, websiteService, sharedService, $cookieStore, RecommendationUIConstants, $location, IntroConstants, WebsiteUIConstants){

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
			$scope._fetch_trending_options();
		}
		else{
			_get_user_profile_info($rootScope.reader);
			$scope.fetch_new_feed($rootScope.reader.id);
			// $scope.fetch_new_feed();
		}
	}

	$scope.toggle_profile = function(user_id, event, delta){
		_hide_profile = function(){
			$rootScope.user.show_profile = false;
			delete $rootScope.ticker_popup;
		}

		_show_profile = function(){
			$rootScope.user.show_profile = true;
			$scope._get_user_profile_info(user_id);
			delete $rootScope.focused_book;
			delete $rootScope.ticker_popup;
		}
		
		if(angular.isDefined(delta)){
			if(delta > 0){
				_show_profile();	
			}
			else{
				_hide_profile();
			}
		}
		else{
			if(angular.isUndefined($rootScope.user.show_profile) || !$rootScope.user.show_profile){
				_show_profile();
			}
			else{
				_hide_profile();
			}
		}

		if(angular.isDefined(event)){
			event.preventDefault();
			event.stopPropagation();
		}
	}

	$scope.get_news_feed = function(user_id){
		$rootScope.user.collapsed_column = false; 
		$rootScope.user.collapsed_left_column = false;
      	$rootScope.user.collapsed_filters = true; 
      	$rootScope.user.collapsed_trends = true;
      	$rootScope.user.collapsed_lists = true;
      	$rootScope.user.collapsed_friends = true;
      	$scope.expand_left_panel();
      	$scope.fetch_new_feed(user_id);
	}

	$scope.show_friends_list = function(){
		$rootScope.user.collapsed_friends = false; 
	   	$rootScope.user.collapsed_left_column = false;
	   	$rootScope.user.collapsed_column = true; 
	   	$rootScope.user.collapsed_lists = true;
	   	$rootScope.user.collapsed_filters = true;
	   	$rootScope.user.collapsed_trends = true;
	   	$scope.expand_left_panel();
	   	$scope._get_friends();
	}

	$scope.fetch_new_feed = function(user_id){
      	var init_notification = true;
      	var trending = false;
		$scope.$emit('getNotifications', trending, user_id, init_notification);
	}

	$scope.collapse_left_panel = function(){
		$rootScope.popups.left_panel_width = {'width': '15%'};
	}

	$scope.expand_left_panel = function(){
		$rootScope.popups.left_panel_width = {'width': '34%'};
	}

	$scope.toggle_settings_popup = function(event){
		var _show_settings_popup = function(){
			$rootScope.popups = {};
			delete $rootScope.focused_book;
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

	$scope._expanded_notifications = function(){
		$rootScope.user.interact = true;
		delete $rootScope.focused_book;
		delete $rootScope.ticker_popup;
		$rootScope.user.collapsed_column = true; 
		$rootScope.user.collapsed_trends = true; 
		$rootScope.user.collapsed_left_column = true;
		$rootScope.popups.left_panel_width = {'width': '15%'};
	}

	$scope.show_interaction_box = function(user_id){
		$scope._expanded_notifications();
		var show_trending = false;
		var init_notification = true;
		$scope.$emit('getNotifications', show_trending, user_id, init_notification);
	}

	$scope.show_trending_options = function(){
		$scope._expanded_notifications();
		$scope._fetch_trending_options();
	}

	$scope._fetch_trending_options = function(){
		var show_trending = true;
		$scope.$emit('getNotifications', show_trending, $rootScope.user.id);	
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
		delete $rootScope.focused_book;
		delete $rootScope.ticker_popup;
		$rootScope.user.collapsed_column = true;
		$rootScope.user.collapsed_filters = true;
		$rootScope.user.collapsed_friends = true;
		$rootScope.user.collapsed_trends = true;
		$rootScope.user.collapsed_lists = true;
		$rootScope.user.collapsed_left_column = true;
		$rootScope.popups = {};
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
		// $scope.show_more_filters = true;
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
    			$rootScope.filters["filter_id"] = $routeParams.filter_id;
    			$rootScope.main_header = $routeParams.name;
        	}
        	else if(on_specific_shelf){
    			// $scope._show_bookmark_tab();
    			$rootScope.filters["label_id"] = $routeParams.label_id;
    			$rootScope.main_header = $routeParams.name;
        		$rootScope.user.collapsed_filters = false;
        		$rootScope.user.collapsed_friends = true;
        		$rootScope.user.collapsed_trends = true;
        		$rootScope.user.collapsed_lists = true;
        		$rootScope.user.collapsed_column = true;
        		$scope.expand_left_panel();
        		$rootScope.user.collapsed_left_column = false;
        	}
        	else if(on_trending_page){
        		$rootScope.filters["reset"] = true;
	    		$rootScope.filters["reset_count"] = 0;
        		$rootScope.filters["trend_id"] = $routeParams.trend_id;
        		$rootScope.main_header = $routeParams.name;
        		$rootScope.user.collapsed_filters = true;
        		$rootScope.user.collapsed_friends = true;
        		$rootScope.user.collapsed_trends = false;
        		$rootScope.user.collapsed_lists = true;
        		$rootScope.user.collapsed_column = true;
        		$scope.expand_left_panel();
        		$rootScope.user.show_profile = false;
        		$rootScope.user.collapsed_left_column = false;
        	}
        	else if(on_grids_page){
        		$rootScope.filters["filter_id"] = $routeParams.grid_id;
        		$rootScope.main_header = $routeParams.name;
        		$rootScope.user.collapsed_filters = true;
        		$rootScope.user.collapsed_friends = true;
        		$rootScope.user.collapsed_trends = true;
        		$rootScope.user.collapsed_lists = false;
        		$rootScope.user.collapsed_column = true;
        		$scope.expand_left_panel();
        		$rootScope.user.collapsed_left_column = false;
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
    	$rootScope.loading = true;
        recommendationService.get_recommendations().then(function(data){
        	_update_recommendations(data);
	    });
	    var not_specific_book_page = angular.isUndefined($rootScope.filters.other_filters["title"]) && angular.isUndefined($rootScope.filters.other_filters["id"]);
	    var enough_books_on_page = $scope.recommendations.books.length >= 4;
	    console.debug("_get_grids ", not_specific_book_page, enough_books_on_page);
	    if(not_specific_book_page && enough_books_on_page){
	    	_get_grids();
	    }
    }

    _handle_focused_book = function(){
    	$rootScope.focused_book = $scope.recommendations.books.first;
    }

    $scope._get_friends = function(){
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
			    			"fav_categories": value[7].join(", ")};
    			this.push(json);
    		}, user_array);

    	}

    	if(angular.isUndefined($rootScope.reader)){
    		if(angular.isUndefined($rootScope.user.friends) || $rootScope.user.friends.length == 0){
		    	widgetService.get_friends($rootScope.user.id).then(function(data){
		    		$rootScope.user.friends = [];
		    		_set_friends_for($rootScope.user.friends, data);
		    	});
    		}
    	}
    	else{
    		if(angular.isUndefined($rootScope.reader.friends) || $rootScope.reader.friends.length == 0){
	    		widgetService.get_friends($rootScope.reader.id).then(function(data){
		    		$rootScope.reader.friends = [];
		    		_set_friends_for($rootScope.reader.friends, data);
		    	});
    		}
    	}
    }

    $scope._get_labels = function(user_id){
      	recommendationService.get_labels(user_id).then(function(data){
    		$rootScope.labels = [];
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
				var reader_id = $scope.$routeParams.id;
				$rootScope.reader = {};
				$rootScope.reader.id = reader_id;
				$scope.toggle_profile(reader_id);
				$rootScope.user.show_profile = true;
				$scope._init_reader();
				$scope._get_labels(reader_id);
				$scope.placeholder = "Write on timeline...";
			}
			else{
				_init_recommendations();
				$scope._get_labels();
				$scope._initialize_filters();

		        // _handle_focused_book();
		        // $scope.get_notifications();

				$scope.placeholder = WebsiteUIConstants.Share;
			}
		}
		else{
			$rootScope.user = {'books': {'bookmarked':[], 'read': []},
						'authors': {'bookmarked': [], 'follow': []},
						'readers': {'follow': []},
						'logged': false};
        	$location.path("/search");
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
	            element: '#editProfile',
	            intro: IntroConstants.Profile,
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