recommendationApp.controller('recommendationsController', function($scope, $rootScope, $interval, 
	$http, $timeout, recommendationService, $q){

	$scope.toggleBookmarked = function(){
		if($scope.bookmark_selected == true){
			$scope.bookmark_selected = false;
			$scope.panel_selected = '';
		}
		else{
			$scope.panel_selected = 'BOOKMARK';
			$scope.bookmark_selected = true;
			$scope.read_selected = false;
			$scope.glowBookmark = false;
		}
	}

	$scope.reset = function(){
		_init_recommendations();
	}

	$scope.toggleRead = function(){
		if($scope.read_selected == true){
			$scope.read_selected = false;
			$scope.panel_selected = '';
		}
		else{
			$scope.glowShelf = false;
			$scope.bookmark_selected = false;
			$scope.read_selected = true;		
			$scope.panel_selected = 'READ';
		}
	}

	$scope.toggle_more_filters = function(){
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
	}

	$scope.stopSearching = function(event){
		$rootScope.searching = false;
		event.currentTarget.text = "";
	}


	_add_listeners = function(){
	    load_recommendations_event = $scope.$on('loadRecommendations', function(){
	    	_get_recommendations();
	    	event.stopPropagation();
	    });

	    reload_recommendations_event = $scope.$on('reloadRecommendations', function(){
	    	_init_recommendations();
	    	_get_recommendations();
	    	event.stopPropagation();
	    });

	    remove_book_from_shelf_event = $scope.$on('removeBookFromShelf', function(event, data){
	    	var book = {title: data['title'], author_name: data['author_name'], book_cover_url: data['book_cover_url']};
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
	}

	$scope.test_scope = function(){
		_init_recommendations()
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
		$rootScope.filters["readers"] = false;
		$rootScope.filters["books"] = true;
		$rootScope.filters["authors"] = false;
		$rootScope.filters["more_filters"] = [];
	}

	_push_recommendations = function(){
		fiveMinute = 3000;//300000
		push_books_timer_event = $timeout(function(){
			var deferred = $q.defer();
	        $http.get('/api/v0/push_recommendations').then(function(result) {
	            return deferred.resolve(result.data); 
	        });
	        deferred.promise.then(function(data){
	        	$rootScope.message_type = "Notification";
	        	$rootScope.message = "We think you like Hermann Hesse, and here is his best read.";
	        	// $rootScope.notification_active = true;
	    		$scope.recommendations.books = $scope.recommendations.books.concat(data["recommendations"]["books"]);
	    	})
		}, fiveMinute);
	}

	_init_analytics = function(){
		$rootScope.data = [];
	}

	_recordUserBehaviour = function(){
		oneMin = 600000000;
		$interval(function(){
			data = $rootScope.data;
			_init_analytics();
			data_json = {"data": data};
			// $http.post('/api/v0/track', data_json);
		}, oneMin);
	}

    _get_recommendations = function(){
        recommendationService.get_recommendations().then(function(data){
	    	$scope.recommendations.books = $scope.recommendations.books.concat(data["recommendations"]["books"]);
	    });
    }

	_get_filters = function(){
    	recommendationService.get_filters().then(function(data){
    		$scope.more_filters = $scope.more_filters.concat(data["filters"]);
    	});
    }

	_init = function(){
		//oneMin = 60000
		var oneSec = 10000;
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
        _push_recommendations();
        _bind_destroy();
	}

	var push_books_timer_event = "";
	var load_recommendations_event = "";
	var reload_recommendations_event = "";
	var user_behaviour_timer_event = "";
	var remove_book_from_shelf_event = ""
	var open_shelf_event = "";
	var add_book_to_shelf_event = ""
	_init();

});