
websiteApp.controller('websiteAppController', function($scope, $rootScope, $interval, $http, $timeout){
	$scope.bindHorizontalScroll = function(event, delta, deltaX, deltaY){
		event.preventDefault();
		if(delta > 0){
			//move backward
	        event.view.window.scrollBy(-80, 0);
		}
		else{
			//move forward
			event.view.window.scrollBy(80, 0);
			_loadRecommendations()
		}
	}

	$scope.scrollOnePage = function(event){
		event.preventDefault();
		$rootScope.$broadcast('loadBooks')
		event.view.window.scrollBy(1000, 0)
	}

	_loadRecommendations = function(){
		currentWidth = event.currentTarget.clientWidth
		lessThanOnePageLeft = event.pageX + 1575 > currentWidth
		if (lessThanOnePageLeft){
			newElementsCount = 5
			leftMargin = 40
			newElementsWidth = (275+leftMargin)*newElementsCount
			newWidth = currentWidth+newElementsWidth;
			event.currentTarget.style.width = newWidth+"px";
			$rootScope.$broadcast('loadBooks')
		}
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

	_init = function(){
		_init_analytics()
		$http.defaults.headers.post['My-Header']='value';

		// oneMin = 60000
		oneSec = 10000
		$timeout(function(){
			_recordUserBehaviour()
		}, oneSec)
	}

	_init_analytics = function(){
		$rootScope.data = []
	}

	_init()

})