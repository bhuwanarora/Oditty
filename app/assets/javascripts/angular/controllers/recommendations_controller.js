recommendationApp.controller('recommendationsController', function($scope, $rootScope, $interval, $http, $timeout, recommendationService){
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

	_init = function(){
		$scope.recommendations = []
	    $rootScope.$on('loadRecommendations', function(){
	    	_get_recommendations();
	    })
		//oneMin = 60000
		oneSec = 10000
		$timeout(function(){
			_recordUserBehaviour()
		}, oneSec)
		_initialize_filters()
        _get_recommendations();
	}

	_initialize_filters = function(){
		$rootScope.filters = {}
		$rootScope.filters["readers"] = false
		$rootScope.filters["books"] = true
		$rootScope.filters["authors"] = false
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