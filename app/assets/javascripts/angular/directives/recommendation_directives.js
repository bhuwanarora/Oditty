recommendationApp.directive('moreFilters', function(){
	return{
		restrict: 'E',
		controller: function($scope){
			$scope.test = {time: 1970}
			$scope.slider_options = {
				from: 1900,
				to: 2000,
				step: 10,
				smooth: false
			}
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
				filter_id = $scope.filter["id"]
				filter_name = $scope.filter["name"]
				index = $rootScope.filters["more_filters"].indexOf(filter_id)
				
				if($scope.active == true){
					$scope.active = false
					if(index != -1){
						$rootScope.filters["more_filters"].splice(index, 1)
					}
					message = filter_name+" removed from filters."
				}
				else{
					$scope.active = true
					if(index == -1){
						$rootScope.filters["more_filters"].push(filter_id)
					}
					message = filter_name+" added to filters."
				}
				notify($rootScope, message, $timeout)
				$rootScope.$broadcast('reloadRecommendations');
			}

			_init = function(){
				if($scope.filter){
					filter_id = $scope.filter["id"]
					index = $rootScope.filters["more_filters"].indexOf(filter_id)
					initialised = index != -1

					if (!initialised){
						if($scope.filter && $scope.filter["priority"] == 100){
							$scope.active = true
							$rootScope.filters["more_filters"].push(filter_id)
						}
						else{
							if($scope.filter){
								$scope.active = false
							}
						}
					}
					else{
						if($rootScope.filters["more_filters"][filter_id]){
							$scope.active = true
						}
						else{
							$scope.active = false
							$rootScope.filters["more_filters"].splice(index, 1)
						}
					}
				}
			}

			_init()
		},
		templateUrl: "/assets/angular/widgets/partials/filter.html"
	}
})