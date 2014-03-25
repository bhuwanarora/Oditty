recommendationApp.directive('moreFilters', function($rootScope, $timeout){
	return{
		restrict: 'E',
		controller: function($scope, recommendationService){
			_init = function(){
				$scope.active_book_filter = true;
				$scope.active_author_filter = false;
				$scope.active_reader_filter = false;
			}

			$scope.toggle_active_filter = function(){
				var elementText = event.currentTarget.innerText.trim();
				var isBook = elementText == "BOOK";
				var isAuthor = elementText == "AUTHOR";
				var isReader = elementText == "READER";
				if(isBook){
					$scope.active_book_filter = true;
					$scope.active_author_filter = false;
					$scope.active_reader_filter = false;
					$rootScope.filters["filter_type"] = "BOOK";
				}
				else if(isAuthor){
					$scope.active_book_filter = false;
					$scope.active_author_filter = true;
					$scope.active_reader_filter = false;
					$rootScope.filters["filter_type"] = "AUTHOR";
				}
				else if(isReader){
					$scope.active_book_filter = false;
					$scope.active_author_filter = false;
					$scope.active_reader_filter = true;
					$rootScope.filters["filter_type"] = "READER";
				}
			}

			$scope.show_country_options = function(filter){
				var params = $scope.country+String.fromCharCode(event.keyCode);
				var filter = "q="+params+"&filter="+filter;
				recommendationService.get_countries(filter).then(function(data){
			    	$scope.countries = data["countries"];
			    });
			}

			$scope.show_genre_options = function(filter){
				var params = $scope.genre+String.fromCharCode(event.keyCode);
				var filter = "q="+params+"&filter="+filter;
				recommendationService.get_genres(filter).then(function(data){
			    	$scope.genres = data["genres"];
			    });
			}

			$scope.on_genre_selection = function(){
				var filter_name = $scope.genre;
				$rootScope.filters["genre_filter"] = filter_name;
				message = "SUCCESS-'"+filter_name+"' added to filters.";
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$emit('reloadRecommendations');


				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
			}

			$scope.on_country_selection = function(){
				var filter_name = $scope.country;
				$rootScope.filters["country_filter"] = filter_name;
				message = "SUCCESS-'"+filter_name+"' added to filters.";
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$emit('reloadRecommendations');

				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
			}

			_init();
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
				_toggle_filters("more_filters", $scope, $rootScope, $timeout);
			}

			_init = function(){
				_initialise_filters("more_filters", $scope, $rootScope);
			}

			_init();
		},
		templateUrl: "/assets/angular/widgets/partials/filter.html"
	}
})


function _initialise_filters(type, $scope, $rootScope){
	if($scope.filter){
		var filter_id = $scope.filter["id"];
		var index = $rootScope.filters[type].indexOf(filter_id);
		var already_selected = index != -1;
		if (!already_selected){
			if($scope.filter["priority"] == 100){
				$scope.active = true;
				$rootScope.filters[type].push(filter_id);
			}
			else{
				$scope.active = false;
			}
		}
		else{
			if($rootScope.filters[type][filter_id]){
				$scope.active = true;
			}
			else{
				$scope.active = false;
				$rootScope.filters[type].splice(index, 1);
			}
		}
	}
}

function _toggle_filters(type, $scope, $rootScope, $timeout){
	var filter_id = $scope.filter["id"];
	var filter_name = $scope.filter["name"];
	var index = $rootScope.filters[type].indexOf(filter_id);
	
	if($scope.active == true){
		$scope.active = false;
		if(index != -1){
			$rootScope.filters[type].splice(index, 1);
		}
		var message = "SUCCESS-'"+filter_name+"' removed from filters.";
	}
	else{
		$scope.active = true;
		if(index == -1){
			$rootScope.filters[type].push(filter_id);
		}
		var message = "SUCCESS-'"+filter_name+"' added to filters.";
	}
	var timeout_event = notify($rootScope, message, $timeout);
	$scope.$emit('reloadRecommendations');

	$scope.$on('destroy', function(){
		$timeout.cancel(timeout_event);
	})
}