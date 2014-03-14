recommendationApp.controller('recommendationsController', function($scope, $rootScope, $interval, 
	$http, $timeout, recommendationService, $q){
	$scope.toggle_readers = function(){
		if($rootScope.filters["readers"]){
			$rootScope.filters["readers"] = false
		}
		else{
			$rootScope.filters["readers"] = true
		}
	}


	$scope.toggle_authors = function(){
		if($rootScope.filters["authors"]){
			$rootScope.filters["authors"] = false
		}
		else{
			$rootScope.filters["authors"] = true
		}
	}


	$scope.toggle_books = function(){
		if($rootScope.filters["books"]){
			$rootScope.filters["books"] = false
		}
		else{
			$rootScope.filters["books"] = true
		}
	}

	$scope.publish = function() {
		// PubNub.ngPublish({
		// 	channel: $scope.selectedChannel,
		// 	message: $scope.newMessage
		// });
	};


	$scope.toggleBookmarked = function(){
		if($scope.bookmark_selected == true){
			$scope.bookmark_selected = false
		}
		else{
			$scope.bookmark_selected = true			
		}
	}

	$scope.toggleRead = function(){
		if($scope.read_selected == true){
			$scope.read_selected = false
		}
		else{
			$scope.read_selected = true			
		}
	}


	$scope.subscribe = function() {
		// PubNub.ngSubscribe({ channel: theChannel })
		// $rootScope.$on(PubNub.ngMsgEv(theChannel), function(event, payload) {
		// 	// payload contains message, channel, env...
		// 	console.log('got a message event:', payload);
		// })
		// $rootScope.$on(PubNub.ngPrsEv(theChannel), function(event, payload) {
		//     // payload contains message, channel, env...
		//     console.log('got a presence event:', payload);
		// })
	}


	$scope.toggleMoreFilters = function(){
		if($scope.show_more_filters == true){
			$scope.show_more_filters = false
		}
		else{
			$scope.show_more_filters = true			
		}
	}

	$scope.stopSearching = function(event){
		$rootScope.searching = false
		event.currentTarget.text = ""
	}

	$scope.getSearchResults = function(event){
        currentValue = event.currentTarget.value
        currentInput = String.fromCharCode(event.keyCode)
        backspace_or_delete_or_enter = (event.keyCode == 8) || (event.keyCode == 46) || (event.keyCode == 13)
        if(backspace_or_delete_or_enter && currentValue.length == 0){
        	$scope.stopSearching(event)
        	//NOT WORKING
        }
        else{
        	if(currentValue.length >= 2){
				var deferred = $q.defer();
				query_params = currentValue+currentInput
		        $http.get('/api/v0/search?count=5&q='+query_params).then(function(result) {
		                    return deferred.resolve(result.data); 
		                });
		        return deferred.promise;
        	}
        	else{
        		//Type atleast 3 chars to search
        	}
        }
	}

	// $scope.channels = PubNub.ngListChannels()

	_init_pubnub = function(){
		// PubNub.init({
		// 	publish_key:'pub-c-f463edad-c098-4001-a560-7d9f99bb7b16',
		// 	subscribe_key:'sub-c-69ac7454-a7ee-11e3-8477-02ee2ddab7fe'
		// 	// uuid:'an_optional_user_uuid'
		// })
	}

	_init_broadcast = function(){
	    $rootScope.$on('loadRecommendations', function(){
	    	_get_recommendations();
	    })

	    $rootScope.$on('reloadRecommendations', function(){
	    	_init_recommendations();
	    	_get_recommendations();
	    })
	}

	_init_recommendations = function(){
		$scope.recommendations = {"books": [], "readers": [], "authors": []}
	}

	_init = function(){
		//oneMin = 60000
		var oneSec = 10000

		$timeout(function(){
			_recordUserBehaviour()
		}, oneSec)

		$scope.searching = false;
		_init_recommendations();
    	_init_broadcast();
    	_get_filters();
		_init_notifications();
        _init_analytics();
        _init_shelf();
		_initialize_filters();
        _get_recommendations();
        _push_recommendations();
	}

	_init_shelf = function(){
		$scope.read_selected = false
		$scope.bookmark_selected = false
	}

	_init_notifications = function(){
		$rootScope.notification_active = false
	}

	_initialize_filters = function(){
		$scope.show_more_filters = true
		$rootScope.filters = {}
		$rootScope.filters["readers"] = false
		$rootScope.filters["books"] = true
		$rootScope.filters["authors"] = false
		$rootScope.filters["more_filters"] = []
	}

	_push_recommendations = function(){
		fiveMinute = 3000//300000
		$timeout(function(){
			var deferred = $q.defer();
	        $http.get('/api/v0/push_recommendations').then(function(result) {
	            return deferred.resolve(result.data); 
	        });
	        deferred.promise.then(function(data){
	        	$rootScope.message_type = "Notification"
	        	$rootScope.message = "We think you like Hermann Hesse, and here is his best read."
	        	$rootScope.notification_active = true
	    		$scope.recommendations["books"] = $scope.recommendations["books"].concat(data["recommendations"]["books"])
	    	})
		}, fiveMinute)
	}

	_init_analytics = function(){
		$rootScope.data = []
	}

	_recordUserBehaviour = function(){
		oneMin = 60000
		$interval(function(){
			data = $rootScope.data
			_init_analytics()
			data_json = {"data": data}
			$http.post('http://bhuwan.com:8080/api/v0/track', data_json)
		}, oneMin)
	}

    _get_recommendations = function(){
        recommendationService.get_recommendations().then(function(data){
	    	$scope.recommendations["books"] = $scope.recommendations["books"].concat(data["recommendations"]["books"])
	    })
    }

	_get_filters = function(){
    	recommendationService.get_filters().then(function(data){
    		$scope.more_filters = $scope.more_filters.concat(data["filters"])
    	})
    }


	_init()

});