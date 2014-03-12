recommendationApp.directive('moreFilters', function($rootScope){
	return{
		restrict: 'E',
		controller: function($scope){
			_init = function(){
				$scope.active_book_filter = true
				$scope.active_author_filter = false
				$scope.active_reader_filter = false
			}

			$scope.toggle_active_filter = function(){
				elementText = event.currentTarget.innerText
				isBook = elementText == "BOOK"
				isAuthor = elementText == "AUTHOR"
				isReader = elementText == "READER"
				if(isBook){
					$scope.active_book_filter = true
					$scope.active_author_filter = false
					$scope.active_reader_filter = false
					$rootScope.filters["filter_type"] = "BOOK"
				}
				else if(isAuthor){
					$scope.active_book_filter = false
					$scope.active_author_filter = true
					$scope.active_reader_filter = false
					$rootScope.filters["filter_type"] = "AUTHOR"
				}
				else if(isReader){
					$scope.active_book_filter = false
					$scope.active_author_filter = false
					$scope.active_reader_filter = true
					$rootScope.filters["filter_type"] = "READER"
				}
			}

			_init()
		},
		templateUrl: "/assets/angular/widgets/partials/more_filters.html"
	}	
})

recommendationApp.directive('filter', function($rootScope, $timeout){
	return{
		restrict: 'E',
		scope: { 'filter': '=data' },
		controller: function($scope){
			$scope.toggle_filter = function(){
				_toggle_filters("more_filters", $scope, $rootScope, $timeout)
			}

			_init = function(){
				_initialise_filters("more_filters", $scope, $rootScope)
			}

			_init()
		},
		templateUrl: "/assets/angular/widgets/partials/filter.html"
	}
})

recommendationApp.directive('typeFilter', function($rootScope, $timeout){
	return{
		restrict: 'E',
		scope: { 'type_filter': '=data' },
		controller: function($scope){
			$scope.toggle_filter = function(){
				_toggle_filters("type_filters", $scope, $rootScope, $timeout)
			}

			_init = function(){
				_initialise_filters("type_filters", $scope, $rootScope)
			}

			_init()
		}
	}
})


function _initialise_filters(type, $scope, $rootScope){
	if($scope.filter){
		filter_id = $scope.filter["id"]
		index = $rootScope.filters[type].indexOf(filter_id)
		already_selected = index != -1
		if (!already_selected){
			if($scope.filter["priority"] == 100){
				$scope.active = true
				$rootScope.filters[type].push(filter_id)
			}
			else{
				$scope.active = false
			}
		}
		else{
			if($rootScope.filters[type][filter_id]){
				$scope.active = true
			}
			else{
				$scope.active = false
				$rootScope.filters[type].splice(index, 1)
			}
		}
	}
}

function _toggle_filters(type, $scope, $rootScope, $timeout){
	filter_id = $scope.filter["id"]
		filter_name = $scope.filter["name"]
		index = $rootScope.filters[type].indexOf(filter_id)
		
		if($scope.active == true){
			$scope.active = false
			if(index != -1){
				$rootScope.filters[type].splice(index, 1)
			}
			message = "SUCCESS-"+filter_name+" removed from filters."
		}
		else{
			$scope.active = true
			if(index == -1){
				$rootScope.filters[type].push(filter_id)
			}
			message = "SUCCESS-"+filter_name+" added to filters."
		}
		notify($rootScope, message, $timeout)
		$rootScope.$broadcast('reloadRecommendations');
}