
websiteApp.controller('websiteAppController', function($scope, $rootScope, $interval, $http, 
	$timeout, $q, $window, websiteService){
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
		input_aimed_for_searching = event.currentTarget == event.srcElement
		if(input_aimed_for_searching){
			$rootScope.searching = true
			$rootScope.keyCode = event.keyCode
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

	$scope.showFeebackForm = function(){
		// console.log("showFeebackForm")
	}

	_bind_feedback_form = function(){
		$window.onmouseleave = function(){
			console.log('move');
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
		$scope.more_filters = []
		$rootScope.searching = false;
		$scope.test = {time: 1970}

		
		_bind_feedback_form()
		// $http.defaults.headers.post['My-Header'] = 'value';
	}

	_init()

})