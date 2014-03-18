
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
			_loadRecommendations();
		}
	}

	$scope.scrollOnePageRight = function(event){
		event.preventDefault();
		//TODO put a better condition instead of two parent elements
		clientWidth = event.currentTarget.parentElement.parentElement.clientWidth;
		lessThanOnePageLeft = event.pageX + 1000 > clientWidth;
		if(lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations');
		}
		event.view.window.scrollBy(1000, 0);
	}

	$scope.scrollOnePageLeft = function(event){
		event.preventDefault();
		event.view.window.scrollBy(-1000, 0);
	}


	$scope.showFeebackForm = function(){
		// console.log("showFeebackForm")
	}


	$scope.search = function(){
		input_aimed_for_searching = event.currentTarget == event.srcElement;
		if(input_aimed_for_searching){
			$rootScope.searching = true;
			$rootScope.keyCode = event.keyCode;
		}
	}

	_bind_feedback_form = function(){
		$window.onmouseleave = function(){
			console.log('move');
		}
	}

	_loadRecommendations = function(){
		currentWidth = event.currentTarget.clientWidth;
		lessThanOnePageLeft = event.pageX + 1575 > currentWidth;
		if (lessThanOnePageLeft){
			newElementsCount = 5;
			leftMargin = 40;
			newElementsWidth = (275+leftMargin)*newElementsCount;
			newWidth = currentWidth+newElementsWidth;
			event.currentTarget.style.width = newWidth+"px";
			$rootScope.$broadcast('loadRecommendations');
		}
	}

	_get_book_details = function(data){
    	filter = "id="+data;
    	websiteService.get_book_details(filter).then(function(data){
			$scope.detailed_book["book"] = data;
    	});
    }

	_bind_emit = function(){
		show_book_event = $scope.$on('expandBook', function(event, data){
	    	$scope.show_book = true;
	    	_get_book_details(data);
	    });
	}


	_init = function(){
		$scope.more_filters = [];
		$scope.test = {time: 1970};
		$scope.detailed_book = {};

		_bind_emit();
		_bind_feedback_form();
		// $http.defaults.headers.post['My-Header'] = 'value';
	}

	_init();

});