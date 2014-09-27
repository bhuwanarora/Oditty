websiteApp.directive('moreFilters', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'E',
		controller: ['$scope', 'recommendationService', 'websiteService', 'RecommendationUIConstants',
			function($scope, recommendationService, websiteService, RecommendationUIConstants){

			$scope.handle_left_columns = function(){
				$scope.column_heights = {"show_filters": true,
										"notifications_style" : {"max-height": RecommendationUIConstants.NotificationsMinHeight}, 
										"friends_grid_style": {"height": RecommendationUIConstants.FriendsGridMinHeight}};
			}

			$scope.stop_click_propagation = function(event){
				event.stopPropagation();
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
		}],
		templateUrl: "/assets/angular/views/unused/more_filters.html"
	}
}]);

websiteApp.directive('notificationLink', function(){
	return{
		restrict: 'E',
		templateUrl: '/assets/angular/views/unused/notification_link.html'
	}
});

websiteApp.directive('tickerPopup', function(){
	return{
		restrict: 'E',
		templateUrl: '/assets/angular/views/left_panel/shared/ticker_popup.html'
	}
});

websiteApp.directive('filter', ['$rootScope', '$timeout', '$routeParams', function($rootScope, $timeout, $routeParams){
	return{
		restrict: 'E',
		scope: { 'filter': '=data',
				 'url': '@',
				 'hideIcon': '@',
				 'iconClass': '@' },
		controller: ['$scope', function($scope){
			_initialise_filters = function(type){
				if($scope.filter){
					var filter_id = $scope.filter.id;
					var filter_name = $scope.filter.name;
					var shelf_selected = filter_id == parseInt($scope.$routeParams.label_id);
					var trend_selected = filter_id == parseInt($scope.$routeParams.trend_id);
					var grid_selected = filter_id == parseInt($scope.$routeParams.grid_id);
					if(shelf_selected || trend_selected || grid_selected){
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
		templateUrl: "/assets/angular/views/left_panel/partials/filter.html"
	}
}]);

websiteApp.directive('header', ['$timeout', '$rootScope', function($timeout, $rootScope){
	return{
		restrict: 'E',
		controller: ['$scope', function($scope){
			$scope.toggle_notification_popup = function($event){
				if(angular.isDefined($rootScope.popups) && angular.isDefined($rootScope.popups.show_notifications_popup)){
					if($rootScope.popups.show_notifications_popup){
						$rootScope.popups.show_notifications_popup = false;
					}
					else{
						$rootScope.popups = {};
						$rootScope.popups.show_notifications_popup = true;
					}
				}
				else{
					$rootScope.popups = {};
					$rootScope.popups.show_notifications_popup = true;
				}
				
				$scope.hide_notification_circle = true;
				event.stopPropagation();
			}

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
		templateUrl: "/assets/angular/views/header/show.html"
	}
}]);

websiteApp.directive('navbar', ['scroller', '$rootScope', 'websiteService', '$timeout', '$cookieStore', 'RecommendationUIConstants', function(scroller, $rootScope, websiteService, $timeout, $cookieStore, RecommendationUIConstants){
	return{
		restrict: 'E',
		controller: ['$scope', function($scope){

			$scope.toggle_bookmarked = function(event){
				$rootScope.user.show_profile = false;
				delete $rootScope.focused_book;
				delete $rootScope.ticker_popup;
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
							$rootScope.user.books = {};
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
				delete $rootScope.focused_book;
				delete $rootScope.ticker_popup;
				$rootScope.user.show_profile = false;
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

			$scope.toggle_read = function(){
				$rootScope.user.show_profile = false;
				delete $rootScope.focused_book;
				delete $rootScope.ticker_popup;
				if(!$scope.read_selected){
					// _load_icon();

					$scope.glowShelf = false;
					$scope.bookmark_selected = false;
					$scope.read_selected = true;		
					$scope.panel_selected = 'READ';
					$cookieStore.put("tab", $scope.panel_selected);
					var skip_count = 0;
					websiteService.get_books_read(skip_count).then(function(data){
						$rootScope.user.books = {};
						
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
					$scope.column_heights = {"notifications_style": {"max-height": RecommendationUIConstants.NotificationsMaxHeight},
											"friends_grid_style": {"height": RecommendationUIConstants.FriendsGridMinHeight},
											"show_filters": false};
				}
				delete $rootScope.ticker_popup;
				if(event_defined){
		        	event.stopPropagation();
				}
	        }
	        
			$scope.goto_info_card = function(page_number){
				if(angular.isDefined(page_number)){
					$rootScope.user.profile_status = page_number;
				}
				$rootScope.user.compressed_info = false;
				$rootScope.user.collapsed_column = true;
				$rootScope.user.collapsed_filters = true;
				$rootScope.user.collapsed_friends = true;
				$rootScope.user.collapsed_trends = true;
				$rootScope.user.collapsed_lists = true;
				$rootScope.user.collapsed_left_column = true;
				$rootScope.popups.left_panel_width = {'width': '15%'};
				// scroller.scrollTo(0, 0, 2000);
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
				$scope.column_heights = {"notifications_style": {"max-height": RecommendationUIConstants.NotificationsMinHeight},
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
		templateUrl: "/assets/angular/views/cover/navbar.html"
	}
}]);

websiteApp.directive('rate', ['$rootScope', '$timeout', 'widgetService', 'sharedService', function($rootScope, $timeout, widgetService, sharedService){
  return{
    restrict: 'E',
    scope: {'rate_object': '=data'},
    controller: ['$scope', function($scope){
      $scope.show_if_rated = function(index){
        $scope.temp_rating = $scope.rate_object.user_rating;
        $scope.rate_object.user_rating = parseInt(index) + 1;
        $scope.ready_to_rate = true;
      }

      $scope.reset_rating = function(){
        $scope.ready_to_rate = false;
        $scope.rate_object.user_rating = $scope.temp_rating;
      }

      _add_notification = function(){
        var name = $rootScope.user.email;
        if(angular.isDefined($rootScope.user.name)){
          name = $rootScope.user.name;
        }
        var message = "<span>gave "+$scope.rate_object.user_rating+"/10 stars to&nbsp;</span><span class='site_color'>"+$scope.rate_object.title+"</span>";
        var notification = {
          "thumb":$rootScope.user.thumb,
          "message":message,
          "timestamp":new Date().getTime(),
          "book":{
            "id":$scope.rate_object.id,
            "title":$scope.rate_object.title,
            "author_name":$scope.rate_object.author_name,
            "isbn":$scope.rate_object.isbn
          },
          "user":{
            "id":$rootScope.user.id,
            "name":name
          }
        }
        $scope.$emit('addToNotifications', notification);
      }

      _gamify = function(){
        if(!$scope.rate_object.rated){
          $scope.$emit('gamifyCount', 10, true);
        }
      }

      $scope.mark_as_rated = function(index, event){
        _gamify();
        $scope.rate_object.rated = true;
        $scope.rate_object.user_rating = parseInt(index) + 1;
        $scope.temp_rating = parseInt(index) + 1;
        var timeout_event = notify($rootScope, "SUCCESS-Thanks, This will help us to recommend you better books.", $timeout);

        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });
        var params = {"id":$scope.rate_object.id, "data":$scope.rate_object.user_rating};

        //ONLY FOR BOOKS
        if(angular.isUndefined($scope.rate_object.status) || !$scope.rate_object.status){
          sharedService.mark_as_read($scope, $scope.rate_object, event);
        }
        widgetService.rate_this_book(params);
        _add_notification();
        event.stopPropagation();
      }

      $scope.is_active = function(index){
        var is_active = false;
        if($scope.rate_object){
          var rating = parseInt(index) + 1;
          if(rating <= $scope.rate_object.user_rating){
            is_active = true;
          }
        }
        return is_active;
      }

    }],
    templateUrl: '/assets/angular/views/shared/rate.html'
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
		templateUrl: '/assets/angular/views/home/partials/book_grid.html'
	}
}]);

websiteApp.directive('gettingStarted', ['$rootScope', '$timeout', 'sharedService', 'websiteService', 'WebsiteUIConstants', 'scroller', '$cookieStore', 'RecommendationUIConstants', function($rootScope, $timeout, sharedService, websiteService, WebsiteUIConstants, scroller, $cookieStore, RecommendationUIConstants){
	return{
		restrict: 'E',
		controller: ['$scope', 'websiteService', function($scope, websiteService){
			$scope.mark_as_read = function(book, event){
				if(angular.isDefined(book.id)){
					sharedService.bookmark_book($scope, book, event, RecommendationUIConstants.InfluentialBooks);
					sharedService.mark_as_read($scope, book, event);
				}
			}

			$scope.close_edit_profile = function(event){
				$rootScope.user.compressed_info = true;
				$scope.popular_books = [];
				event.stopPropagation();
			}

			$scope.stop_propagation = function(event){
				event.stopPropagation();
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
				var keyLeft = event.keyCode == WebsiteUIConstants.KeyLeft;
				var keyRight = event.keyCode == WebsiteUIConstants.KeyRight;
				var enter_pressed = event.keyCode == WebsiteUIConstants.Enter;
				var backspace = event.keyCode == WebsiteUIConstants.Backspace;
				var char_pressed = !(keyUp || keyDown || enter_pressed || keyLeft || keyRight);
				if(char_pressed){
					if(type == 'BOOK'){
						var has_minimum_length = $scope.info.search_book.length > 3;
					}
					else{
						var has_minimum_length = $scope.info.search_author.length > 3;	
					}
					if(has_minimum_length){
						$scope.popular_books = [{"title": "Searching..."}];
						$timeout.cancel(search_input_timeout);
						search_input_timeout = $timeout(function(){
							$scope.handle_search_input(type);
						}, 300);
					}
					else {
						if(backspace){
							if(type == "BOOK"){
								$scope.popular_books = [];
								$scope.get_popular_books();
							}
							else{
								$scope.popular_authors = [];
								$scope.get_popular_authors();
							
							}
						}
						else{
							$scope.popular_books = [{"title": "Type more characters..."}];
						}
					}
				}
				event.stopPropagation();
			}

			$scope._fetch_book_results = function(reset_required){
				var skip_count = $scope.popular_books.length;
				var _all_results_fetched = function(){
					$scope.all_results_found = true;
					$scope.popular_books.push({"title": "All results fetched. "+$scope.popular_books.length+" books found for <span class='site_color'>"+$scope.info.search_book+"</span>"});
				}

				websiteService.search_books($scope.info.search_book, skip_count).then(function(data){
					if(angular.isDefined(reset_required)){
						$scope.popular_books = [];
					}

					data = data.results;
					if(data.length != 0){
						angular.forEach(data, function(value){
							var status = value[4] != null;
							var json = {"isbn": value[0], 
									"id": value[1], 
									"title": value[2], 
									"author_name": value[3], 
									"status": status,
									"user_rating": value[5]};
							this.push(json);
						},  $scope.popular_books);

						if(data.length != 10){
							_all_results_fetched();
						}
					}
					else{
						if($scope.popular_books.length == 0){
							$scope.all_results_found = true;
							$scope.popular_books = [{"title": "No results found..."}];
						}
						else{
							_all_results_fetched();
						}
					}
					$scope.loading = false;
				});
			}

			$scope.handle_search_input = function(type){
				$scope.loading = true;
				if(type == "BOOK"){
					$scope.all_results_found = false;
					$scope.popular_books = [];
					$scope._fetch_book_results(true);
				}
				else{
					websiteService.search_authors("q="+$scope.info.search_author).then(function(data){
						$scope.popular_authors = [];
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
					});
				}
			}

			$scope._get_genres = function(){
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

			_handle_info_card_bindings = function($scope){
				if($rootScope.user.profile_status == 1){
					$scope._get_genres();
				}
				else if($rootScope.user.profile_status == 2){
					$scope.get_popular_books();
				}
				// else if($rootScope.user.profile_status == 3){
				// 	$scope.get_popular_authors();
				// 	// $rootScope.$broadcast('showBookReadShelf');
				// }
				else if($rootScope.user.profile_status == 3){
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
				$rootScope.user.profile_status = 2;
				$scope.get_popular_books();
			}

			$scope.edit_genres_like = function(){
				$scope.goto_info_card();
				$rootScope.user.profile_status = 1;
				$scope._get_genres();
			}

			$scope.edit_authors_read = function(){
				$scope.goto_info_card();
				$rootScope.user.profile_status = 3;
				$scope.get_popular_authors();
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
				var get_popular_books = !$scope.loading && (angular.isUndefined($scope.info.search_book) || $scope.info.search_book.length < 1);
				if(get_popular_books){
					$scope.loading = true;
					websiteService.get_popular_books(skip_count).then(function(data){
						angular.forEach(data, function(value){
							var status = value[4] != null;
							var json = {"isbn": value[0], 
									"id": value[1], 
									"title": value[2], 
									"author_name": value[3], 
									"user_rating": value[5],
									"status": status};
							this.push(json);
						},  $scope.popular_books);
						$scope.loading = false;
					});
				}
				else{
					if(!$scope.all_results_found){
						$scope._fetch_book_results();
					}
				}
			}

			$scope.prev_profile_state = function(){
				if($rootScope.user.profile_status != 0){
					$rootScope.user.profile_status = $rootScope.user.profile_status - 1;
				}
				else{
					$rootScope.user.profile_status = 3;
				}
				_handle_info_card_bindings($scope);
			}

			$scope.next_profile_state = function(){
				if($rootScope.user.profile_status != 3){
					$rootScope.user.profile_status = $rootScope.user.profile_status + 1;
				}
				else{
					$rootScope.user.profile_status = 0;
				}
				_handle_info_card_bindings($scope);
			}

			$scope.stop_horizontal_scroll = function(event){
				event.stopPropagation();
			}

			$scope.user_profile_changed = function(selected){
				var params = {"profile": selected.name};
				websiteService.save_user_info(params);
			}

			$scope.add_book = function(){

			}

			$scope.add_author = function(){

			}
	
			$scope.set_user_name = function(){
				if(angular.isDefined($rootScope.user.name) && $rootScope.user.name.length > 0){
					var params = {"name": $rootScope.user.name};
					websiteService.save_user_info(params);
				}
			}

			$scope.set_email = function(){
				if(angular.isDefined($rootScope.user.email) && $rootScope.user.email.length > 0){
					var params = {"email": $rootScope.user.email};
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

			
			var search_input_timeout = "";
			
			
			_init = function(){
				$rootScope.user.profile_status = 0;
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
				];
				
				if(angular.isUndefined($cookieStore.get('ask_info'))){
					$rootScope.user.compressed_info = false;
					$cookieStore.put('ask_info', true);
				}
				else{
					$rootScope.user.compressed_info = true;
				}
				$scope.profileSelected = {"name": "Reader"};
				$scope.info_card_width = 350; //in px
				$scope.info_card_ratio = 1.34;
				// $scope.$on('cropme:done', function(event, canvasEl){
				// 	var params = {"blob": canvasEl};
				// 	websiteService.save_user_info(params);
				// });

				// _facebook_invite();
			}

			_init();

		}],
		templateUrl: "/assets/angular/views/getting_started/show.html"
	}
}]);

var facebook_invite = function(){
	// _facebook_init();
	FB.ui({
		method: 'apprequests',
		message: 'Your Message diaolog'
	});
}

