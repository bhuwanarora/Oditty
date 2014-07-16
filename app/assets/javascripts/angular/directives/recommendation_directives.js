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
			    	angular.forEach(data["times"], function(value){
			    		var time_data = value[0]["data"];
			    		var name = time_data["name"]+" ("+time_data["range"]+")";
			    		var json = {"name": name};
			    		this.push(json);
			    	}, $scope.timeOptions);
			    });
			    recommendationService.get_read_times().then(function(data){
			    	$scope.readTimeOptions = _reset_json();
			    	angular.forEach(data["read_times"], function(value){
			    		var time_data = value[0]["data"];
			    		var name = time_data["name"];
			    		var json = {"name": name, "custom_option": true, "type": "readingTime"};
			    		this.push(json);
			    	}, $scope.readTimeOptions);
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

			_country_init = function(){
				return {"name": "<span class='icon-earth filter_icon green'></span>"+
						"<span>&nbsp;&nbsp;&nbsp;Filter by Region</span>"};
			}

			_time_init = function(){
				return {"name": "<span class='icon-calendar filter_icon magenta'></span>"+
						"<span>&nbsp;&nbsp;&nbsp;Filter by Era</span>"};
			}

			_read_time_init = function(){
				return {"name": "<span class='icon-clock filter_icon cyan'></span>"+
						"<span>&nbsp;&nbsp;&nbsp;Filter by Reading Time</span>"};
			}

			_init_dropdown_filters = function(){
				$scope.countrySelected = _country_init();
				$scope.timeSelected = _time_init();
				$scope.readTimeSelected = _read_time_init();
			}

			$scope.handle_left_columns = function(){
				$scope.column_heights = {"show_filters": true,
										"notifications_style" : {"height": "110px"}, 
										"friends_grid_style": {"height": "75px"}};
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
						$scope.countrySelected = _country_init();
					}
					else if(type == "timeGroup"){
						$scope.timeSelected = _time_init();
					}
					else if(type == "readingTime"){
						$scope.readTimeSelected = _read_time_init();
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
				// $('.inline_block_left').removeClass('active');
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
					angular.forEach(data.genres.data, function(value){
						this.push(value[0].data);
					}, $scope.genres);
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
					angular.forEach(data.results.data, function(value){
						var json = {"name": value[0]};
						this.push(json);
					}, $scope.authors);
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

websiteApp.directive('recommendationFooter', ['scroller', '$rootScope', 'websiteService', function(scroller, $rootScope, websiteService){
	return{
		restrict: 'E',
		controller: ['$scope', function($scope){

			$scope.toggle_bookmarked = function(event){
				if(!$scope.bookmark_selected){
					// _load_icon();
					$scope.panel_selected = 'BOOKMARK';
					$scope.bookmark_selected = true;
					$scope.read_selected = false;
					$scope.glowBookmark = false;
					// websiteService.get_books_bookmarked(0).then(function(data){
					// 	$rootScope.user.books['bookmarked'] = [];
					// 	angular.forEach(data, function(value){
					// 		var label_name = value[2];
					// 		var json = {"isbn": value[0], "id": value[1], "bookmark_status": true, "labels[label_name]['checked']": true};
					// 		this.push(json);
					// 	},  $rootScope.user.books['bookmarked']);
					// });
					// $('body').css('background-image', $scope.search_style['background-image']);
				}
				event.stopPropagation();
			}

			$scope.toggle_recommendations = function(){
				if($scope.bookmark_selected || $scope.read_selected){
					// _load_icon();
					$scope.read_selected = false;
					$scope.bookmark_selected = false;
					$scope.panel_selected = '';
					$scope.reset();
					// $('body').css('background-image', '');
				}
			}

			$scope.toggle_more_filters = function(event){
				if($scope.show_more_filters == true){
					$scope.show_more_filters = false;
					// $('.recommendation_block').css('margin-top', '40px');
					// $('.info_cards').css('margin-top', '40px');
				}
				else{
					$scope.show_more_filters = true;		
					// $('.recommendation_block').css('margin-top', '0px');
					// $('.info_cards').css('margin-top', '0px');
				}
				event.stopPropagation();
			}

			$scope.toggle_read = function(){
				if(!$scope.read_selected){
					// _load_icon();
					$scope.glowShelf = false;
					$scope.bookmark_selected = false;
					$scope.read_selected = true;		
					$scope.panel_selected = 'READ';
					websiteService.get_books_read(0).then(function(data){
						$rootScope.user.books['read'] = [];
						angular.forEach(data, function(value){
							var json = {"isbn": value[0], "id": value[1], "status": true};
							this.push(json);
						},  $rootScope.user.books['read']);
					});
					// $('body').css('background-image', 'url("assets/wood_shelf.jpg")');
				}
			}

			$scope.reset_filter =  function(event, selectedFilter, type, main_filter){
				var is_dropdown_filter = type == "timeGroup" || type == "readingTime" || type == "country";
				if(selectedFilter){
					if(is_dropdown_filter){
						var selected = {"name":"<span class='icon-loop'></span><span>&nbsp;Reset</span>"};
						$scope.advance_filter_changed(selected, type);
					}
					else{
						$scope.clear_filter(main_filter, type);
						$scope.genre = "";
					}
					event.stopPropagation();
				}
				else{
					if(is_dropdown_filter){
						//open the specific dropdown
					}
					else{
						//focus the specific input box
					}
				}
			}

			$scope.handle_notification_ticker_size = function(event){
				var increase_tab_size = event.deltaY > 0;
				if(increase_tab_size){
					$scope.column_heights = {"notifications_style": {"height": "225px"},
											"friends_grid_style": {"height": "75px"},
											"show_filters": false};
				}
				else{
					$scope.column_heights = {"notifications_style": {"height": "110px"},
											"friends_grid_style": {"height": "75px"},
											"show_filters": false};
				}
				$rootScope.ticker_popup = null;
	            event.stopPropagation();
	        }
	        
			$scope.goto_info_card = function(){
				scroller.scrollTo(0, 0, 2000);
			}

			$scope.toggle_footer = function(){
				$scope.compact_footer = true;
			}

			_init_shelf = function(){
				$scope.read_selected = false;
				$scope.bookmark_selected = false;
			}

			_add_listeners = function(){
				open_shelf_event = $scope.$on('showBookReadShelf', function(){
			    	$scope.read_selected = true;
			    	console.log("%c open_shelf_event", "color: green;");
			    	event.stopPropagation();
			    })

			}

			_init = function(){
				_init_shelf();
				if(window.innerWidth < 1000){
					$scope.compact_footer = true;
				}
				else{
					$scope.compact_footer = false;	
				}
			}

			_init();

			var open_shelf_event = "";
			var glow_bookmark_event = "";
			var glow_shelf_event = "";
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
