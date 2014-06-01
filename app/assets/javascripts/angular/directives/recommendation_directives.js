websiteApp.directive('moreFilters', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'E',
		controller: ['$scope', 'recommendationService', 'websiteService', 
			function($scope, recommendationService, websiteService){
			_init = function(){
				// $scope.$on('initPage', function(event, type){
				// 	_reload_page(type=="BOOK", type=="AUTHOR", type=="READER");
				// });
				// $scope.active_book_filter = true;
				// $scope.active_author_filter = false;
				// $scope.active_reader_filter = false;
				$scope.show_menu = false;
				$scope.countryOptions = [];

				recommendationService.get_countries().then(function(data){
			    	$scope.countryOptions = [{"name": "Reset"}];
			    	$scope.countryOptions = $scope.countryOptions.concat(data["countries"]);
			    });
			    recommendationService.get_time_groups().then(function(data){
			    	$scope.timeOptions = [{"name": "Reset"}];
			    	$scope.timeOptions = $scope.timeOptions.concat(data["times"]);
			    });
			    recommendationService.get_read_times().then(function(data){
			    	$scope.readTimeOptions = [{"name": "Reset"}];
			    	$scope.readTimeOptions = $scope.readTimeOptions.concat(data["read_times"]);
			    });
			    _init_dropdown_filters();
			    _collapse_dropdown_menu();
			}

			_collapse_dropdown_menu = function(){
				$scope.filter_expanded = true;
				var timeout_event = $timeout(function(){
					$scope.filter_expanded = false;
				}, 3000);
			}

			_init_dropdown_filters = function(){
				$scope.countrySelected = {"name": "Filter books by Region"};
				$scope.timeSelected = {"name": "Filter books by Era"};
				$scope.readTimeSelected = {"name": "Filter books by Reading Time"};
			}

			$scope.advance_filter_changed = function(selected){
				var message = "SUCCESS-"+selected.name+" added to filters."
				notify($rootScope, message, $timeout);
				// $scope.$emit('reloadRecommendations');
				// debugger
				// $('.position_dropdown').removeClass('active');
			}

			$scope.reset_filters = function(){
				_init_dropdown_filters();
				$scope.$broadcast('resetFilter');
				$rootScope.filters.more_filters = [];
				$scope.$emit('reloadRecommendations');
				var message = "SUCCESS-All filters removed.<br/> You can add filters to look for particular books.";
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
			}

			$scope.stop_click_propagation = function(event){
				event.stopPropagation();
			}

			_reload_page = function(isBook, isAuthor, isReader){
				// if(isBook){
				// 	$scope.active_book_filter = true;
				// 	$scope.active_author_filter = false;
				// 	$scope.active_reader_filter = false;
				// 	$rootScope.filters["filter_type"] = "BOOK";
				// }
				// else if(isAuthor){
				// 	$scope.active_book_filter = false;
				// 	$scope.active_author_filter = true;
				// 	$scope.active_reader_filter = false;
				// 	$rootScope.filters["filter_type"] = "AUTHOR";
				// }
				// else if(isReader){
				// 	$scope.active_book_filter = false;
				// 	$scope.active_author_filter = false;
				// 	$scope.active_reader_filter = true;
				// 	$rootScope.filters["filter_type"] = "READER";
				// }
				// $scope.$emit('reloadRecommendations');
				// $scope.$emit('moveRight');
			}

			// $scope.toggle_active_filter = function(){
			// 	var elementText = event.currentTarget.innerText.trim();
			// 	var isBook = elementText == "BOOK" || event.currentTarget.className.indexOf("main_book_icon")!=-1;
			// 	var isAuthor = elementText == "AUTHOR" || event.currentTarget.className.indexOf("main_author_icon")!=-1;
			// 	var isReader = elementText == "READER" || event.currentTarget.className.indexOf("main_reader_icon")!=-1;
			// 	$scope.show_menu = false;
			// 	// _reload_page(isBook, isAuthor, isReader);
			// }

			$scope.show_genre_options = function(filter, genre){
				if(genre){
					var params = genre+String.fromCharCode(event.keyCode);
				}
				else{
					var params = String.fromCharCode(event.keyCode);
				}
				var filter = "q="+params+"&filter="+filter;
				recommendationService.get_genres(filter).then(function(data){
			    	$scope.genres = data["genres"];
			    });
			}

			$scope.show_author_options = function(filter, author){
				if(author){
					var params = author+String.fromCharCode(event.keyCode);
				}
				else{
					var params = String.fromCharCode(event.keyCode);
				}
				websiteService.search(params, "AUTHOR", 3).then(function(data){
			    	$scope.authors = data["results"];
			    });
			}

			$scope.on_author_selection = function(){
				var filter_name = $scope.author;
				$rootScope.filters["author_filter"] = filter_name;
				var message = "SUCCESS-'"+filter_name+"' added to filters.";
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$emit('reloadRecommendations');


				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
			}

			$scope.toggle_menu = function(){
				if($scope.show_menu){
					$scope.show_menu = false;
					$scope.filter_expanded = false;
				}
				else{
					$scope.show_menu = true;
					$scope.filter_expanded = true;
				}
			}

			_init();
		}],
		templateUrl: "/assets/angular/widgets/partials/more_filters.html"
	}
}]);

websiteApp.directive('notificationLink', function(){
	return{
		restrict: 'E',
		templateUrl: 'assets/angular/widgets/partials/notification_link.html'
	}
});

websiteApp.directive('filter', ['$rootScope', '$timeout', '$routeParams', function($rootScope, $timeout, $routeParams){
	return{
		restrict: 'E',
		scope: { 'filter': '=data' },
		controller: ['$scope', function($scope){
			// $scope.toggle_filter = function(){
			// 	type = "more_filters";
			// 	var filter_id = $scope.filter["id"];
			// 	var filter_name = $scope.filter["name"];
			// 	var index = $rootScope.filters[type].indexOf(filter_id);
				
			// 	if($scope.active == true){
			// 		$scope.active = false;
			// 		if(index != -1){
			// 			$rootScope.filters[type].splice(index, 1);
			// 		}
			// 		var message = "SUCCESS-'"+filter_name+"' removed from filters.";
			// 	}
			// 	else{
			// 		$scope.active = true;
			// 		if(index == -1){
			// 			$rootScope.filters[type].push(filter_id);
			// 		}
			// 		var message = "SUCCESS-'"+filter_name+"' added to filters.";
			// 	}
			// 	$scope.$emit('reloadRecommendations');
			// 	var timeout_event = notify($rootScope, message, $timeout);

			// 	$scope.$on('destroy', function(){
			// 		$timeout.cancel(timeout_event);
			// 	})
			// }

			_initialise_filters = function(type){
				if($scope.filter){
					var filter_id = $scope.filter.id;
					var filter_name = $scope.filter.name;
					if(filter_id == parseInt($scope.$routeParams.filter_id)){
						$scope.active = true;
						$rootScope.filters[type].push(filter_id);
						var message = "SUCCESS-'"+filter_name+"' added to filters.";
						var timeout_event = notify($rootScope, message, $timeout);
						$scope.$on('destroy', function(){
							$timeout.cancel(timeout_event);
						});
					}
					else{
						$scope.active = false;
					}
					// var index = $rootScope.filters[type].indexOf(filter_id);
					// var already_selected = index != -1;
					// if (!already_selected){
					// 	if($scope.filter["priority"] == 100){
					// 		$scope.active = true;
					// 		$rootScope.filters[type].push(filter_id);
					// 	}
					// 	else{
					// 		$scope.active = false;
					// 	}
					// }
					// else{
					// 	if($rootScope.filters[type][filter_id]){
					// 		$scope.active = true;
					// 	}
					// 	else{
					// 		$scope.active = false;
					// 		$rootScope.filters[type].splice(index, 1);
					// 	}
					// }
				}
			}

			_add_listeners = function(){
				$scope.$on('resetFilter', function(){
					if($scope.active){
						$scope.active = false;
					}
				});
			}

			_init = function(){
				$scope.$routeParams = $routeParams;
				_initialise_filters("more_filters");
				_add_listeners();
			}

			_init();
		}],
		templateUrl: "/assets/angular/widgets/partials/filter.html"
	}
}]);


websiteApp.directive('recommendationFooter', function(){
	return{
		restrict: 'E',
		controller: ['$scope', function($scope){
			if(window.innerWidth < 1000){
				$scope.compact_footer = true;
			}
			else{
				$scope.compact_footer = false;	
			}

			$scope.toggle_footer = function(){
				$scope.compact_footer = true;
			}
		}],
		templateUrl: "/assets/angular/widgets/partials/recommendation_footer.html"
	}
});