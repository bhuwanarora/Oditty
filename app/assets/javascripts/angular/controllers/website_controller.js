
websiteApp.controller('websiteAppController', function($scope, $rootScope, $interval, $http, $timeout, $q){
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

	$scope.search = function(){
		$rootScope.searching = true
		$rootScope.keyCode = event.keyCode
	}

	$scope.stopSearching = function(event){
		$rootScope.searching = false
		event.currentTarget.text = ""
	}

	$scope.getSearchResults = function(event){
        currentValue = event.currentTarget.value
        currentInput = String.fromCharCode(event.keyCode)
		console.log(event.keyCode,currentValue.length)
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

	_loadRecommendations = function(){
		currentWidth = event.currentTarget.clientWidth
		lessThanOnePageLeft = event.pageX + 1575 > currentWidth
		if (lessThanOnePageLeft){
			newElementsCount = 5
			leftMargin = 40
			newElementsWidth = (275+leftMargin)*newElementsCount
			newWidth = currentWidth+newElementsWidth;
			event.currentTarget.style.width = newWidth+"px";
			$rootScope.$broadcast('loadRecommendations');
		}
	}

	_init = function(){
		_init_analytics();
		$rootScope.searching = false;
		$http.defaults.headers.post['My-Header']='value';
	}

	_init_analytics = function(){
		$rootScope.data = []
	}

	_init()

})