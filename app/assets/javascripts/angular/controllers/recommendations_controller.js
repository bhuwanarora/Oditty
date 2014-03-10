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

	// $scope.channels = PubNub.ngListChannels()

	_init_pubnub = function(){
		// PubNub.init({
		// 	publish_key:'pub-c-f463edad-c098-4001-a560-7d9f99bb7b16',
		// 	subscribe_key:'sub-c-69ac7454-a7ee-11e3-8477-02ee2ddab7fe'
		// 	// uuid:'an_optional_user_uuid'
		// })
	}

	_init = function(){
		//oneMin = 60000
		var oneSec = 10000
		$scope.recommendations = []

	    $rootScope.$on('loadRecommendations', function(){
	    	_get_recommendations();
	    })

		$timeout(function(){
			_recordUserBehaviour()
		}, oneSec)


		_init_notifications();
        _init_analytics();
		_initialize_filters();
        _get_recommendations();
        _push_recommendations();
	}

	_init_notifications = function(){
		$rootScope.notification_active = false
	}

	_initialize_filters = function(){
		$rootScope.filters = {}
		$rootScope.filters["readers"] = false
		$rootScope.filters["books"] = true
		$rootScope.filters["authors"] = false
	}

	_push_recommendations = function(){
		fiveMinute = 3000//300000
		$timeout(function(){
			var deferred = $q.defer();
	        $http.get('/api/v0/push_recommendations').then(function(result) {
	            return deferred.resolve(result.data); 
	        });
	        deferred.promise.then(function(data){
	        	$rootScope.message = "We think you like Hermann Hesse, and here is it's best read."
	        	$rootScope.notification_active = true
	    		$scope.recommendations = $scope.recommendations.concat(data["recommendations"])
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
        recommendationService.getRecommendations().then(function(data){
	    	$scope.recommendations = $scope.recommendations.concat(data["recommendations"])
	    })
    }

	_init()

});