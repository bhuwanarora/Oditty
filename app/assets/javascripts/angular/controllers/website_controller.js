
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

	$scope.scrollOnePageRight = function(event){
		event.preventDefault();
		//TODO put a better condition instead of two parent elements
		clientWidth = event.currentTarget.parentElement.parentElement.clientWidth
		lessThanOnePageLeft = event.pageX + 1000 > clientWidth
		if(lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations')
		}
		event.view.window.scrollBy(1000, 0)
	}

	$scope.scrollOnePageLeft = function(event){
		event.preventDefault();
		event.view.window.scrollBy(-1000, 0)
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
			$rootScope.$broadcast('loadRecommendations')
		}
	}

	_init = function(){
		_init_analytics()
		$http.defaults.headers.post['My-Header']='value';
	}

	_init_analytics = function(){
		$rootScope.data = []
	}

	_init()

})