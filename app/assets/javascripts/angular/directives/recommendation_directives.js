websiteApp.directive('moreFilters', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'E',
		controller: ['$scope', 'recommendationService', 'websiteService',
			function($scope, recommendationService, websiteService){
			_init = function(){
				console.debug("%c init moreFilters ", "color: purple");
				// $scope.$on('initPage', function(event, type){
				// 	_reload_page(type=="BOOK", type=="AUTHOR", type=="READER");
				// });
				// $scope.active_book_filter = true;
				// $scope.active_author_filter = false;
				// $scope.active_reader_filter = false;
				$scope.show_menu = false;
				$scope.countryOptions = [];
				$scope.$on('filterChange', function(scope, selected, type){
					
					if(type == "country"){
						$scope.countrySelected = selected;
					}
					else if(type == "timeGroup"){
						$scope.timeSelected = selected;
					}
					else if(type == "readingTime"){
						$scope.readTimeSelected = selected;
					}
					$scope.advance_filter_changed(selected, type)
				});
				recommendationService.get_countries().then(function(data){
			    	$scope.countryOptions = _reset_json();
			    	$scope.countryOptions = $scope.countryOptions.concat(data["countries"]);
			    });
			    recommendationService.get_time_groups().then(function(data){
			    	$scope.timeOptions = _reset_json();
			    	for(var i=0; i < data["times"].length; i++){
			    		var time_data = data.times[i][0]["data"];
			    		var name = time_data["name"]+" ("+time_data["range"]+")";
			    		var json = {"name": name};
			    		$scope.timeOptions = $scope.timeOptions.concat([json]);
			    	}
			    	// $scope.timeOptions = $scope.timeOptions.concat(data["times"]);
			    });
			    recommendationService.get_read_times().then(function(data){
			    	$scope.readTimeOptions = _reset_json();
			    	for(var i=0; i < data["read_times"].length; i++){
			    		var time_data = data.read_times[i][0]["data"];
			    		var name = time_data["name"];
			    		var json = {"name": name, "custom_option": true, "type": "readingTime"};
			    		$scope.readTimeOptions = $scope.readTimeOptions.concat([json]);
			    	}
			    });
			    _init_dropdown_filters();
			    _collapse_dropdown_menu();
			}

			_reset_json = function(){
				return [{"name": "<span class='icon-loop'></span><span>&nbsp;Reset</span>"}];
			}

			_collapse_dropdown_menu = function(){
				$scope.filter_expanded = true;
				var timeout_event = $timeout(function(){
					$scope.filter_expanded = false;
				}, 3000);
			}

			_init_dropdown_filters = function(){
				$scope.countrySelected = {"name": "<span class='icon-earth'></span><span>&nbsp;Filter by Region</span>"};
				$scope.timeSelected = {"name": "<span class='icon-calendar'></span><span>&nbsp;Filter by Era</span>"};
				$scope.readTimeSelected = {"name": "<span class='icon-clock'></span><span>&nbsp;Filter by Reading Time</span>"};
			}

			$scope.handle_left_columns = function(){
				$scope.column_heights = {"show_filters": true,
										"notifications_style" : {"height": "110px"}, 
										"friends_grid_style": {"height": "30px"}};
			}

			$scope.clear_filter = function(main_filter, type){
				$rootScope.filters["other_filters"][type] = null;
				var message = "SUCCESS-"+type+" filter removed";
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
				$scope.$emit('reloadRecommendations');
			}

			$scope.advance_filter_changed = function(selected, type){
				if(selected.name == "<span class='icon-loop'></span><span>&nbsp;Reset</span>"){
					var message = "SUCCESS-"+type+" filter has been reset."
					delete $rootScope.filters.other_filters[type];
					if(type == "country"){
						$scope.countrySelected = {"name": "<span class='icon-earth'></span><span>&nbsp;Filter by Region</span>"};
					}
					else if(type == "timeGroup"){
						$scope.timeSelected = {"name": "<span class='icon-calendar'></span><span>&nbsp;Filter by Era</span>"};
					}
					else if(type == "readingTime"){
						$scope.readTimeSelected = {"name": "<span class='icon-clock'></span><span>&nbsp;Filter by Reading Time</span>"};
					}
				}
				else{
					var message = "SUCCESS-"+selected.name+" added to filters."
					$rootScope.filters.other_filters[type] = selected.name;
				}
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
				});
				$scope.$emit('reloadRecommendations');
				// debugger
				// $('.position_dropdown').removeClass('active');
			}

			$scope.reset_filters = function(){
				_init_dropdown_filters();
				$scope.$broadcast('resetFilter');
				$rootScope.filters.more_filters = [];
				$rootScope.filters.other_filters = {};
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
					$scope.genres = [];
					for(var i=0; i<data.genres.data.length; i++){
						$scope.genres.push(data.genres.data[i][0].data);
					}
			    });
			}

			$scope.on_genre_selection = function(genre){
				$scope.genre = genre;
				$rootScope.filters["other_filters"]["genre"] = genre;
				var message = "SUCCESS-'"+genre+"' added to filters.";
				var timeout_event = notify($rootScope, message, $timeout);
				$scope.$emit('reloadRecommendations');


				$scope.$on('destroy', function(){
					$timeout.cancel(timeout_event);
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
					$scope.authors = [];
					for(var i=0; i<data.results.data.length; i++){
						var json = {"name":data.results.data[i][0]};
						$scope.authors.push(json);
					}
			    });
			}

			$scope.on_author_selection = function(author){
				$scope.author = author;
				$rootScope.filters["other_filters"]["author"] = author;
				var message = "SUCCESS-'"+author+"' added to filters.";
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
		templateUrl: '/assets/angular/widgets/partials/notification_link.html'
	}
});

websiteApp.directive('tickerPopup', function(){
	return{
		restrict: 'E',
		templateUrl: '/assets/angular/widgets/partials/ticker_popup.html'
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
						if($rootScope.filters[type].indexOf(filter_id) == -1){
							$rootScope.filters[type].push(filter_id);
							var message = "SUCCESS-'"+filter_name+"' added to filters.";
							var timeout_event = notify($rootScope, message, $timeout);
							$scope.$on('destroy', function(){
								$timeout.cancel(timeout_event);
							});
						}
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
				console.debug("%c filters : "+$scope.filter.name, "color:green");
				$scope.$routeParams = $routeParams;
				_initialise_filters("more_filters");
				_add_listeners();
			}

			_init();
		}],
		templateUrl: "/assets/angular/widgets/partials/filter.html"
	}
}]);

websiteApp.directive('mainHeader', [function(){
	return{
		restrict: 'E',
		templateUrl: "/assets/angular/widgets/partials/main_header.html"
	}
}]);

websiteApp.directive('recommendationFooter', ['scroller', function(scroller){
	return{
		restrict: 'E',
		controller: ['$scope', function($scope){
			if(window.innerWidth < 1000){
				$scope.compact_footer = true;
			}
			else{
				$scope.compact_footer = false;	
			}

			$scope.reset_filter =  function(selectedFilter, type, main_filter){
				var selected = {"name":"<span class='icon-loop'></span><span>&nbsp;Reset</span>"};
				if(selectedFilter){
					if(main_filter){
						$scope.clear_filter(main_filter, type);
						$scope.genre = "";
					}
					else{
						$scope.advance_filter_changed(selected, type);
					}
				}
				event.stopPropagation();
			}

			$scope.handle_notification_ticker_size = function(event){
				var increase_tab_size = event.deltaY > 0;
				if(increase_tab_size){
					$scope.column_heights = {"notifications_style": {"height": "225px"},
											"friends_grid_style": {"height": "30px"},
											"show_filters": false};
				}
				else{
					$scope.column_heights = {"notifications_style": {"height": "110px"},
											"friends_grid_style": {"height": "30px"},
											"show_filters": false};
				}
	            event.stopPropagation();
	        }
	        
			$scope.goto_info_card = function(){
				scroller.scrollTo(0, 0, 2000);
			}

			$scope.toggle_footer = function(){
				$scope.compact_footer = true;
			}
		}],
		templateUrl: "/assets/angular/widgets/partials/recommendation_footer.html"
	}
}]);

websiteApp.directive('calendar', function(){
	return{
		restrict: 'E',
		scope : {},
		controller: ['$scope', function($scope){
			$scope.date_check = function(){
				var month = $scope.months.indexOf($scope.selectedMonth) + 1;
				var no_days = new Date($scope.selectedYear, month, 0).getDate();
				$scope.days = new Array(no_days)
							.join()
							.split(',')
							.map(function(item, index){return ++index;});
			}

			_init =function(){
				$scope.days = new Array(31)
							.join()
							.split(',')
							.map(function(item, index){return ++index;});
				$scope.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				$scope.years = [];
				var currentYear = new Date().getFullYear();
				for(var i=currentYear; i>1904; i--){
					$scope.years.push(i);
				}
			}

			_init();
		}],
		templateUrl: '/assets/angular/widgets/partials/calendar.html'
	}
});
