websiteApp.directive('moreFilters', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'E',
		controller: ['$scope', 'recommendationService', 'websiteService', 'RecommendationUIConstants',
			function($scope, recommendationService, websiteService, RecommendationUIConstants){
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
				$scope.show_lists = false;
				$scope.handle_left_columns();
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
			    	$scope.countryOptions = [];
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
			    // _get_filters();
			}

			_get_filters = function(){
		    	recommendationService.get_filters().then(function(data){
		    		$scope.more_filters = $scope.more_filters.concat(data["filters"]);
		    	});
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
				return {"name": "<span class='icon-earth filter_icon yellow_color'></span>"+
						"<span>&nbsp;&nbsp;&nbsp;Books by Region (Coming Soon)</span>"};
			}

			_time_init = function(){
				return {"name": "<span class='icon-calendar filter_icon'></span>"+
						"<span>&nbsp;&nbsp;&nbsp;Books by Era</span>"};
			}

			_read_time_init = function(){
				return {"name": "<span class='icon-clock filter_icon orange_color'></span>"+
						"<span>&nbsp;&nbsp;&nbsp;Books by Reading Time</span>"};
			}

			_init_dropdown_filters = function(){
				$scope.countrySelected = _country_init();
				$scope.timeSelected = _time_init();
				$scope.readTimeSelected = _read_time_init();
			}

			$scope.handle_left_columns = function(){
				$scope.column_heights = {"show_filters": true,
										"notifications_style" : {"max-height": "110px"}, 
										"friends_grid_style": {"height": RecommendationUIConstants.FriendsGridMinHeight}};
			}

			$scope.clear_filter = function(main_filter, type){
				delete $rootScope.filters.other_filters[type];
				// $rootScope.filters["other_filters"][type] = null;
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
					var genre = genre+String.fromCharCode(event.keyCode);
				}
				else{
					var genre = String.fromCharCode(event.keyCode);
				}
				var count = 3;
				if(genre == ""){
					count = 2;
				}
				var params = "q="+genre+"&filter="+filter+"&count="+count;
				websiteService.search_genres(params).then(function(data){
					$scope.genres = [];
					angular.forEach(data, function(value){
						var json = {"name": value[0], "id": value[1]};
						this.push(json);
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
						var json = {"name": value[0], "id": value[1]};
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

websiteApp.directive('mainHeader', ['$timeout', '$rootScope', function($timeout, $rootScope){
	return{
		restrict: 'E',
		controller: ['$scope', function($scope){
			_add_listeners = function(){
				$scope.$on('gamifyCount', function(event, data, is_additive){
					if($scope.initiate_counting){
						$scope.count = $scope.count + data;
					}
					else{
						$scope.initiate_counting = true;
						$scope.count = data;
						var timeout_event = $timeout(function(){
							$scope.is_additive = is_additive;
							if(is_additive){
								$rootScope.user.total_count = $rootScope.user.total_count + $scope.count;
							}
							else{
								$rootScope.user.total_count = $rootScope.user.total_count - $scope.count;	
							}
							$scope.initiate_counting = false;
							var timeout_event = $timeout(function(){
								$scope.count = false;
							}, 3000);

							$scope.$on('destroy', function(){
								$timeout.cancel(timeout_event);
							});
						}, 200);
						$scope.$on('destroy', function(){
							$timeout.cancel(timeout_event);
						});
					}
					// event.stopPropagation();
				});
			}

			_init = function(){
				$scope.count = false;
				_add_listeners();
			}

			_init();
		}],
		templateUrl: "/assets/angular/widgets/partials/main_header.html"
	}
}]);

websiteApp.directive('recommendationFooter', ['scroller', '$rootScope', 'websiteService', '$timeout', '$cookieStore', 'RecommendationUIConstants', function(scroller, $rootScope, websiteService, $timeout, $cookieStore, RecommendationUIConstants){
	return{
		restrict: 'E',
		controller: ['$scope', function($scope){

			$scope.toggle_bookmarked = function(event){
				if(!$scope.bookmark_selected){
					// _load_icon();
					$scope.panel_selected = 'BOOKMARK';
					$cookieStore.put("tab", $scope.panel_selected);
					$scope.bookmark_selected = true;
					$scope.read_selected = false;
					// $scope.glowBookmark = false;
					var skip_count = 0;
					websiteService.get_books_bookmarked(skip_count).then(function(data){
						if(angular.isArray(data)){
							$rootScope.user.books['bookmarked'] = [];
							angular.forEach(data, function(data){
								var labels = [];
								angular.forEach($rootScope.labels, function(value){
									if(data[2].indexOf(value.name) >= 0){
										var json = {"name": value.name, "checked": true};
									}
									else{
										var json = {"name": value.name, "checked": false};
									}
									labels.push(json);	
								}, labels);
								var json = {"isbn": data[0], 
											"id": data[1], 
											"bookmark_status": true, 
											"labels": labels};
								this.push(json);
							},  $rootScope.user.books['bookmarked']);
						}
					});
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
					$cookieStore.put("tab", $scope.panel_selected);
					$scope.reset();
					// $('body').css('background-image', '');
				}
			}

 		// 	$scope.toggle_more_filters = function(event){
			// 	if($scope.show_more_filters == true){
			// 		$scope.show_more_filters = false;
			// 		// $('.recommendation_block').css('margin-top', '40px');
			// 		// $('.info_cards').css('margin-top', '40px');
			// 	}
			// 	else{
			// 		$scope.show_more_filters = true;		
			// 		// $('.recommendation_block').css('margin-top', '0px');
			// 		// $('.info_cards').css('margin-top', '0px');
			// 	}
			// 	event.stopPropagation();
			// }

			$scope.toggle_read = function(){
				if(!$scope.read_selected){
					// _load_icon();
					$scope.glowShelf = false;
					$scope.bookmark_selected = false;
					$scope.read_selected = true;		
					$scope.panel_selected = 'READ';
					$cookieStore.put("tab", $scope.panel_selected);
					var skip_count = 0;
					websiteService.get_books_read(skip_count).then(function(data){
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
						// $scope.show_more_filters = true;
						$scope.handle_left_columns();
						_handle_filter_selection(type);
					}
				}
			}

			_handle_filter_selection = function(type){
				if(type == "genre"){
					$scope.show_lists = false;
					console.log("genre_selected", $scope.genre_selected);
					$scope.genre_selected = true;
					var timeout_event = $timeout(function(){
						$scope.genre_selected = false;
					}, 1000);

					$scope.$on('destroy', function(){
						$timeout.cancel(timeout_event);
					});
				}
				if(type == "author"){
					$scope.show_lists = false;
					$scope.author_selected = true;
					var timeout_event = $timeout(function(){
						$scope.author_selected = false;
					}, 500);

					$scope.$on('destroy', function(){
						$timeout.cancel(timeout_event);
					});
				}
			}

			$scope.handle_notification_ticker_size = function(event, scroll_down){
				var event_defined = angular.isDefined(event);
				if(event_defined){
					var increase_tab_size = event.deltaY > 0;
				}
				else{
					var increase_tab_size = scroll_down;
				}
				if(increase_tab_size){
					$scope.column_heights = {"notifications_style": {"max-height": "350px"},
											"friends_grid_style": {"height": RecommendationUIConstants.FriendsGridMinHeight},
											"show_filters": false};
				}
				delete $rootScope.ticker_popup;
				if(event_defined){
		        	event.stopPropagation();
				}
	        }
	        
			$scope.goto_info_card = function(){
				scroller.scrollTo(0, 0, 2000);
			}

			$scope.toggle_footer = function(){
				$scope.compact_footer = true;
			}

			_init_shelf = function(){
				$scope.read_selected = false;
				if(angular.isUndefined($scope.bookmark_selected) || !$scope.bookmark_selected){
					$scope.bookmark_selected = false;
				}
			}

			_add_listeners = function(){
				open_shelf_event = $scope.$on('showBookReadShelf', function(){
			    	$scope.read_selected = true;
			    	console.log("%c open_shelf_event", "color: green;");
			    	event.stopPropagation();
			    })

			}

			_init_left_column = function(){
				$scope.show_lists = false;
				$scope.column_heights = {"notifications_style": {"max-height": "110px"},
											"friends_grid_style": {"height": RecommendationUIConstants.FriendsGridMinHeight},
											"show_filters": true};
			}

			_init = function(){
				_init_left_column();
				_init_shelf();
				if(window.innerWidth < 1000){
					$scope.compact_footer = true;
				}
				else{
					$scope.compact_footer = false;	
				}
				$scope.genre_selected = false;
				$scope.author_selected = false;
				$scope.column_heights = {"show_filters": false};
			}

			_init();
		}],
		templateUrl: "/assets/angular/widgets/partials/recommendation_footer.html"
	}
}]);

websiteApp.directive('bookGrid', ['recommendationService', '$rootScope', function(recommendationService, $rootScope){
	return{
		restrict: 'E',
		scope: {'grid': '=data'},
		controller: ['$scope', function($scope){
			_init = function(){
				$scope.user_id = $rootScope.user.id;
				// recommendationService.get_grid_books().then(function(data){
				// 	$scope.grid_books = [];
				// 	angular.forEach(data, function(value){
				// 		var json = {"isbn": value[0], "id": value[1]};
				// 		this.push(json);
				// 	}, $scope.grid_books);
				// });
			}			

			_init();
		}],
		templateUrl: '/assets/angular/widgets/partials/book_grid.html'
	}
}]);

websiteApp.directive('infoCard', ['$rootScope', '$timeout', 'sharedService', 'websiteService', 'WebsiteUIConstants', function($rootScope, $timeout, sharedService, websiteService, WebsiteUIConstants){
	return{
		restrict: 'E',
		controller: ['$scope', 'websiteService', function($scope, websiteService){
			$scope.mark_as_read = function(book, event){
		        sharedService.mark_as_read($scope, book, event);
			}

			$scope.save_genre = function(genre){
				var params = {"genre": genre.id, "status": true};
				websiteService.save_user_info(params);
			}

			$scope.remove_genre = function(genre){
				var params = {"genre": genre.id, "status": false};
				websiteService.save_user_info(params);
			}

			$scope.search_info_card = function(event, type){
				var keyUp = event.keyCode == WebsiteUIConstants.KeyUp;
				var keyDown = event.keyCode == WebsiteUIConstants.KeyDown;
				var enter_pressed = event.keyCode == WebsiteUIConstants.Enter;
				var backspace = event.keyCode == WebsiteUIConstants.Backspace;
				var char_pressed = !(keyUp || keyDown || enter_pressed);
				if(char_pressed){
					if(type == 'BOOK'){
						var has_minimum_length = $scope.info.search_book.length > 3;
					}
					else{
						var has_minimum_length = $scope.info.search_author.length > 3;	
					}
					if(has_minimum_length){
						search_input_timeout = $timeout(function(){
							$scope.handle_search_input(type);
						}, 500);
					}
					else if(backspace){
						if(type == "BOOK"){
							$scope.popular_books = [];
							$scope.get_popular_books();
						}
						else{
							$scope.popular_authors = [];
							$scope.get_popular_authors();
						}
					}
				}
			}

			$scope.handle_search_input = function(type){
				$scope.loading = true;
				if(type == "BOOK"){
					websiteService.search_books($scope.info.search_book).then(function(data){
						$scope.popular_books = [];
						data = data.results;
						if(data.length != 0){
							angular.forEach(data, function(value){
								var status = value[4] != null;
								var json = {"isbn": value[0], 
										"id": value[1], 
										"title": value[2], 
										"author_name": value[3], 
										"status": status};
								this.push(json);
							},  $scope.popular_books);
						}
						else{
							$scope.popular_books = [{"title": "No results found..."}];
						}
						$scope.loading = false;
						$timeout.cancel(search_input_timeout);
					});
				}
				else{
					websiteService.search_authors($scope.info.search_author).then(function(data){
						$scope.popular_authors = [];
						data = data.results;
						if(data.length != 0){
							angular.forEach(data, function(value){
								var json = {"name": value[0]};
								this.push(json);
							},  $scope.popular_authors);
						}
						else{
							$scope.popular_authors = [{"title": "No results found..."}];
						}
						$scope.loading = false;
						$timeout.cancel(search_input_timeout);
					});
				}
			}

			_get_genres = function(){
				if(angular.isUndefined($scope.info.genres) || $scope.info.genres.length == 0){
					$scope.info.genres = [];
			    	websiteService.get_genres().then(function(data){
			    		angular.forEach(data, function(value){
			    			var status = value[3] != null;
			    			var json = {"name": value[0], 
			    						"id": value[1], 
			    						"icon": value[2], 
			    						"status": status};
			    			this.push(json);
			    		}, $scope.info.genres);
			    	});
				}
		    }

		    _profile_status_colors = function(){
				var profile_status = $rootScope.user.profile_status;
				if(profile_status == 0){
					$rootScope.user.profile_status_color = "#4374e0";
				}
				else if(profile_status == 1){
					$rootScope.user.profile_status_color = "#65b045";
				}
				else if(profile_status == 2){
					$rootScope.user.profile_status_color = "#d73d32";
				}
				else if(profile_status == 3){
					$rootScope.user.profile_status_color = "#11a9cc";
				}
				else if(profile_status == 4){
					$rootScope.user.profile_status_color = "#981b48";
				}
				else if(profile_status == 5){
					$rootScope.user.profile_status_color = "#7e3794";
				}
				else if(profile_status == 6){
					$rootScope.user.profile_status_color = "#4374e0";
				}
				else if(profile_status == 7){
					$rootScope.user.profile_status_color = "#981b48";	
				}
				else if(profile_status == 8){
					$rootScope.user.profile_status_color = "#981b48";
				}
			}

			_handle_info_card_bindings = function($scope){
				if($rootScope.user.profile_status == 3){
					$scope.get_popular_books();
				}
				else if($rootScope.user.profile_status == 2){
					_get_genres();
				}
				else if($rootScope.user.profile_status == 4){
					$scope.get_popular_authors();
					// $rootScope.$broadcast('showBookReadShelf');
				}
				else if($rootScope.user.profile_status == 6){
					if(navigator.geolocation){
						navigator.geolocation.getCurrentPosition(function(position){
							var latitude = position.coords.latitude;
							var longitude = position.coords.longitude;
							$rootScope.user.latitude = latitude;
							$rootScope.user.longitude = longitude;
							$scope.set_location();
						});
					}
					else{
						x.innerHTML="Geolocation is not supported by this browser.";
					}
				}
			}

			_get_info_data = function(){
				websiteService.get_info_data().then(function(data){
					$scope.book_counts = data.reading_count_list;
					$scope.user_book_count = $scope.book_counts[0];
				});
			}

			$scope.edit_books_read = function(){
				$scope.goto_info_card();
				$rootScope.user.profile_status = 3;
				$scope.get_popular_books();
				$scope.compressed_info = false;
			}

			$scope.edit_authors_read = function(){
				$scope.goto_info_card();
				$rootScope.user.profile_status = 4;
				$scope.get_popular_authors();
				$scope.compressed_info = false;	
			}

			$scope.get_popular_authors = function(){
				var skip_count = $scope.popular_authors.length;
				var get_popular_authors = !$scope.loading;
				if(get_popular_authors){
					$scope.loading = true;
					websiteService.get_popular_authors(skip_count).then(function(data){
						angular.forEach(data, function(value){
							var json = {"name": value[0]};
							this.push(json);
						},  $scope.popular_authors);
						$scope.loading = false;
					});
				}
			}			

			$scope.get_popular_books = function(){
				var skip_count = $scope.popular_books.length;
				var get_popular_books = !$scope.loading;
				if(get_popular_books){
					$scope.loading = true;
					websiteService.get_popular_books(skip_count).then(function(data){
						angular.forEach(data, function(value){
							var status = value[4] != null;
							var json = {"isbn": value[0], 
									"id": value[1], 
									"title": value[2], 
									"author_name": value[3], 
									"status": status};
							this.push(json);
						},  $scope.popular_books);
						$scope.loading = false;
					});
				}
			}

			$scope.prev_profile_state = function(){
				if($rootScope.user.profile_status != 0){
					$rootScope.user.profile_status = $rootScope.user.profile_status - 1;
				}
				else{
					$rootScope.user.profile_status = 8;
				}
				_handle_info_card_bindings($scope);
				_profile_status_colors();
			}

			$scope.next_profile_state = function(){
				if($rootScope.user.profile_status != 8){
					$rootScope.user.profile_status = $rootScope.user.profile_status + 1;
				}
				else{
					$rootScope.user.profile_status = 0;
				}
				_handle_info_card_bindings($scope);
				_profile_status_colors();
			}

			$scope.stop_horizontal_scroll = function(event){
				event.stopPropagation();
			}

			$scope.update_profile = function(){
				var enter_pressed = event.keyCode == WebsiteUIConstants.Enter;
				if(enter_pressed){
					var profile_status = $rootScope.user.profile_status;
					if(profile_status == 0){
						websiteService.update_profile($rootScope.user);
						$rootScope.user.profile_status = $rootScope.user.profile_status + 1;
						_profile_status_colors();
					}
				}
			}

			$scope.user_profile_changed = function(selected){
				var params = {"profile": selected.name};
				websiteService.save_user_info(params);
			}

			$scope.add_book = function(){

			}

			$scope.add_author = function(){

			}

			// $scope.get_search_results = function(event, type, searchResults){
			// 	if(searchResults){
			// 		searchResults = searchResults + String.fromCharCode(event.keyCode);
			// 	}
			// 	else{
			// 		searchResults = String.fromCharCode(event.keyCode);	
			// 	}
			// 	websiteService.search(searchResults, type, 3)
		 //        .then(function(result) {
		 //            $scope.search_results = $scope.search_results.concat(result.results);
		 //        });
			// }

			$scope.set_user_name = function(){
				if($rootScope.user.name.length > 0){
					var params = {"name": $rootScope.user.name};
					websiteService.save_user_info(params);
				}
			}

			$scope.set_gender = function(){
				if($rootScope.user.gender){
					var params = {"gender": $rootScope.user.gender};
					websiteService.save_user_info(params);
				}
			}

			$scope.set_init_book_read_count = function(){
				if($rootScope.user.init_book_read_count){
					var params = {"init_book_read_count": $rootScope.user.init_book_read_count};
					websiteService.save_user_info(params);	
				}
			}

			$scope.set_init_book_written_count = function(){
				if($rootScope.user.init_book_written_count){
					var params = {"init_book_written_count": $rootScope.user.init_book_written_count};
					websiteService.save_user_info(params);	
				}	
			}

			$scope.set_location = function(){
				if($rootScope.user.latitude){
					var params = {"latitude": $rootScope.user.latitude, "longitude": $rootScope.user.longitude};
					websiteService.save_user_info(params);
				}
			}

			$scope.set_date_of_birth = function(){
				var params = {"selectedYear":$rootScope.user.selectedYear, 
							  "selectedMonth": $rootScope.user.selectedMonth,
							  "selectedDay": $rootScope.user.selectedDay};
				websiteService.save_user_info(params);
			}
			
			_init = function(){
				var search_input_timeout = "";
				$rootScope.user.profile_status = 0;
	    		_profile_status_colors();
	    		_get_info_data();
	    		$scope.popular_books = [];
	    		$scope.popular_authors = [];
	    		$scope.loading = false;
	    		$scope.info = {"search_book": "", "search_author": "", "genres": []};
				$scope.profileOptions = [
					{"name": "Reader"},
					{"name": "Author"},
					{"name": "Publisher"},
					{"name": "Editor"}
				]
				$scope.compressed_info = false;
				$scope.profileSelected = {"name": "Reader"};
				$scope.info_card_width = 350; //in px
				$scope.info_card_ratio = 1.34;
				$scope.$on('cropme:done', function(event, canvasEl){
					var params = {"blob": canvasEl};
					websiteService.save_user_info(params);
				});
			}

			_init();

		}],
		templateUrl: "/assets/angular/widgets/base/widget/info_card.html"
	}
}]);