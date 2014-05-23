websiteApp.controller('recommendationsController', function($scope, $rootScope, $timeout, recommendationService, $route, $routeParams, $interval, widgetService){

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

	$scope.reset = function(){
		_init_recommendations();
    	_get_recommendations();
    	$scope.$emit('moveRight');
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
		$rootScope.focused_book = null;
		$scope.show_more_filters = false;
	}

	_load_icon = function(){
		$scope.drop_icon = true;
		$timeout(function(){
			$scope.drop_icon = false;
		}, 1000);
	}


	_add_listeners = function(){
	    load_recommendations_event = $scope.$on('loadRecommendations', function(){
	    	_get_recommendations();
	    	// event.stopPropagation();
	    });

	    reload_recommendations_event = $scope.$on('reloadRecommendations', function(){
	    	$scope.reset();
	    	event.stopPropagation();
	    });

	    open_shelf_event = $scope.$on('showBookReadShelf', function(){
	    	$scope.read_selected = true;
	    	event.stopPropagation();
	    })

	    glow_shelf_event = $scope.$on('glowShelf', function(){
	    	$scope.glowShelf = true;
	    	event.stopPropagation();
	    });

	    glow_bookmark_event = $scope.$on('glowBookmark', function(){
	    	$scope.glowBookmark = true;
	    	event.stopPropagation();
	    });
	}

	_init_recommendations = function(){
		$scope.recommendations = {"books": [], "readers": [], "authors": []};
		// $rootScope.filters = {"filter_ids": []};
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
		$scope.show_more_filters = false;
		$rootScope.filters = {};
        $rootScope.filters["more_filters"] = [];
        if($routeParams.type == "books"){
        	$rootScope.filters["filter_type"] = "BOOK";
        }
        else if($routeParams.type == "authors"){
        	$rootScope.filters["filter_type"] = "AUTHOR";
        }
        else if($routeParams.type == "readers"){
        	$rootScope.filters["filter_type"] = "READER";
        }
        else{
			$rootScope.filters["filter_type"] = "BOOK";
			$scope.show_notifications = true;
        }
        if($routeParams.filter_id){
        	$scope.show_more_filters = true;
        }
		// $rootScope.filters = {"filter_ids": []};
		// $rootScope.filters["more_filters"] = "BOOK";
	}

	_update_recommendations = function(data){
		if($rootScope.filters["filter_type"] == "BOOK"){
			if($scope.recommendations.books.length >= 30){
				$scope.recommendations.books = data["recommendations"]["books"];
			}
			else{
    			$scope.recommendations.books = $scope.recommendations.books.concat(data["recommendations"]["books"]);
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

	_init = function(){
		//oneMin = 60000
		$scope.$routeParams = $routeParams;
		// $scope.$emit('reloadRecommendations');

		var oneSec = 10000;
		$scope.drop_icon = false;
		$rootScope.show_book = false;

		user_behaviour_timer_event = $timeout(function(){
			_recordUserBehaviour();
		}, oneSec);

		$scope.searching = false;
		_init_recommendations();
    	_add_listeners();
    	_get_filters();
		_init_notifications();
        _init_analytics();
        _init_shelf();
		_initialize_filters();
        _get_recommendations();
        // _push_recommendations();
        _bind_destroy();
        _handle_focused_book();
        _get_friends();
    	$scope.$emit('moveRight');    
	}

	var push_books_timer_event = "";
	var load_recommendations_event = "";
	var reload_recommendations_event = "";
	var user_behaviour_timer_event = "";
	var open_shelf_event = "";
	_init();

});