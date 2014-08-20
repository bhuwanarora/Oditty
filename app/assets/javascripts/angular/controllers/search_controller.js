websiteApp.controller('searchController', ['$scope', '$rootScope', 'websiteService', '$timeout', '$sce', 'recommendationService', '$routeParams', '$location', 'SearchUIConstants', 'WebsiteUIConstants', '$cookieStore', function($scope, $rootScope, websiteService, $timeout, $sce, recommendationService, $routeParams, $location, SearchUIConstants, WebsiteUIConstants, $cookieStore){
	_show_search_result = function(item, show_all){
		console.debug("%c _show_search_result"+item.name, "color: green");
		var user_id = $rootScope.user.id;
  		var on_search_page = angular.isUndefined($routeParams.type);
  		if(angular.isUndefined($rootScope.filters)){
  			$rootScope.filters = {"other_filters": {}};
  		}
  		if(show_all){
  			if(on_search_page){
		  		$location.path("/user/"+user_id+"/book/"+item+"/all/"+true);
	  		}
	  		else{
  				$scope.search_tag.input = item;
  				$rootScope.filters.other_filters["title"] = item;
  				delete $rootScope.filters.other_filters["author_name"];
  				delete $rootScope.filters.other_filters["id"];
  				$rootScope.filters.other_filters["show_all"] = true;
	  			$scope.$emit('reloadRecommendations');
	  		}
  		}
  		else{
	  		if(on_search_page){
		  		$location.path("/user/"+user_id+"/book/"+item.name+"/author/"+item.author_name+"/id/"+item.id);
	  		}
	  		else{
	  			$scope.search_tag.input = item.name;
		  		$rootScope.filters.other_filters["title"] = item.name;
		  		$rootScope.filters.other_filters["author_name"] = item.author_name;
		  		$rootScope.filters.other_filters["id"] = item.id;
		  		delete $rootScope.filters.other_filters["show_all"];
	  			$scope.$emit('reloadRecommendations');
	  		}
  		}
	}

	_handle_graph_search = function(selectedItem){
		$scope.hide_search_page();
	}

	_search_by = function(type){
		console.log("SEARCH BY");
		if(!type){
			var type = $scope.search_type;
		}
		if(!$scope.search_level1){
			console.debug("setting search level 1", type);
			$scope.search_level1 = true;
			if(type.indexOf(SearchUIConstants.BookSearch) != -1){
				$scope.search_display = SearchUIConstants.SearchingBooks;
				$scope.search_type = SearchUIConstants.BookSearch;
				$scope.book_search = true;
				$scope.author_search = false;
				$scope.reader_search = false;
				$scope.search_tag.placeholder = SearchUIConstants.BookSearchPlaceholder;
				_init_book_search();
			}
			else if(type.indexOf(SearchUIConstants.AuthorSearch) != -1){
				$scope.search_display = SearchUIConstants.SearchingAuthors;
				$scope.search_type = SearchUIConstants.AuthorSearch;
				$scope.author_search = true;
				$scope.reader_search = false;
				$scope.book_search = false;
				$scope.search_tag.placeholder = SearchUIConstants.AuthorSearchPlaceholder;
				_init_author_search();
			}
			else if(type.indexOf(SearchUIConstants.ReaderSearch) != -1){
				$scope.search_display = SearchUIConstants.SearchingReaders;
				$scope.search_type = SearchUIConstants.ReaderSearch;
				$scope.reader_search = true;
				$scope.book_search = false;
				$scope.author_search = false;
				$scope.search_tag.placeholder = SearchUIConstants.ReaderSearchPlaceholder;
				_init_reader_search();
			}
		}
		else if($scope.search_level1){
			console.debug("setting search level 2");
			$scope.search_level2 = true;
			$scope.search_results = [];
			if(type == SearchUIConstants.Year){
				$scope.year_search = true;
				// var search_placeholder = SearchUIConstants.YearPlaceholder;
				if($rootScope.time_groups){
					$scope.search_results = $rootScope.time_groups;
				}
				else{
					recommendationService.get_time_groups().then(function(data){
						$scope.search_results = [];
						angular.forEach(data["times"], function(value){
							var time_data = value[0]["data"];
				    		var name = time_data["name"];
				    		var json = {"name": name, "custom_option": true, "type": SearchUIConstants.TimeGroup, "label": time_data["range"]};
							this.push(json);
						}, $scope.search_results);
				    	$rootScope.time_groups = $scope.search_results;
					});
				}
			}
			else if(type == SearchUIConstants.List){
				$scope.list_search = true;	
				// var search_placeholder = SearchUIConstants.ListPlaceholder;
				if($rootScope.book_lists){
					$scope.search_results = $rootScope.book_lists;
				}
				else{
					recommendationService.get_book_lists().then(function(data){
						$scope.search_results = [];
						angular.forEach(data, function(value){
				    		var json = {"name": value[1], "id": value[0], "custom_option": true, "type": SearchUIConstants.List};
							this.push(json);
						}, $scope.search_results);
						$rootScope.book_lists = $scope.search_results;
					});
				}
			}
			else if(type == SearchUIConstants.Country){
				$scope.country_search = true;
				// var search_placeholder = SearchUIConstants.CountryPlaceholder;
				if($rootScope.regions){
					$scope.search_results = $rootScope.regions;
				}
				else{
					recommendationService.get_countries().then(function(data){
						$scope.search_results = data.countries;
						$rootScope.regions = $scope.search_results;
					});
				}
			}
			else if(type == SearchUIConstants.Genre){
				$scope.genre_search = true;
				// var search_placeholder = SearchUIConstants.GenrePlaceholder;
			}
			else if(type == SearchUIConstants.AuthorSearch){
				$scope.author_search = true;
				// var search_placeholder = SearchUIConstants.AuthorPlaceholder;
			}
			else if(type == SearchUIConstants.Time){
				$scope.time_search = true;
				// var search_placeholder = SearchUIConstants.TimePlaceholder;
				if($rootScope.read_times){
					$scope.search_results = $rootScope.read_times;
				}
				else{
					recommendationService.get_read_times().then(function(data){
						$scope.search_results = [];
						angular.forEach(data["read_times"], function(value){
				    		var time_data = value[0]["data"];
				    		var name = time_data["name"];
				    		var json = {"name": name, "custom_option": true, "type": "readingTime"};
							this.push(json);
						}, $scope.search_results);
						$rootScope.read_times = $scope.search_results;
					});
				}
			}
			else if(type == SearchUIConstants.Gender){
				$scope.gender_search = true;
				// var search_placeholder = SearchUIConstants.GenderPlaceholder;
				$scope.search_results = [
					{"name": SearchUIConstants.MaleGender, "custom_option": true, "icon": "icon-male"},
					{"name": SearchUIConstants.FemaleGender, "custom_option": true, "icon": "icon-female"},
					{"name": SearchUIConstants.DontCareGender, "custom_option": true}
				];
			}
			else if(type == SearchUIConstants.Awards){
				$scope.awards_search = true;
				// var search_placeholder = SearchUIConstants.AwardsPlaceholder;	
			}
			else if(type == SearchUIConstants.ComingSoon){
				$scope.coming_soon = true;
				// var search_placeholder = 
			}
			$scope.search_tag.placeholder = SearchUIConstants.LevelTwoPlaceHolder;
		}
	}

	$scope.stop_horizontal_scroll = function(event){
		event.stopPropagation();
	}

	$scope.is_active_nest = function(item){
		var is_active_nest = false;
		if($scope.active_nest == item.name){
			is_active_nest = true;
		}
		return is_active_nest;
	}

	$scope.handle_selection_option = function(item){
		if(item.level1_option){
			if($scope.active_base == SearchUIConstants.BookSearchLink){
				$scope.show_compressed_base = true;
				$scope.active_nest = item.name;
				$scope.search_results = [];
				$scope.hide_input_field = true;
				$scope.show_secondary_input = false;
				if(item.type == SearchUIConstants.Year){
					// $scope.year_search = true;
					// var search_placeholder = SearchUIConstants.YearPlaceholder;
					if($rootScope.time_groups){
						$scope.search_results = $rootScope.time_groups;
					}
					else{
						recommendationService.get_time_groups().then(function(data){
							$scope.search_results = [];
							angular.forEach(data["times"], function(value){
								var time_data = value[0]["data"];
					    		var name = time_data["name"];
					    		var json = {"name": name, "type": "timeGroup", "label": time_data["range"], "icon2": "icon-calendar"};
								this.push(json);
							}, $scope.search_results);
					    	$rootScope.time_groups = $scope.search_results;
						});
					}
				}
				else if(item.type == SearchUIConstants.List){
					// $scope.list_search = true;	
					// var search_placeholder = SearchUIConstants.ListPlaceholder;
					if($rootScope.book_lists){
						$scope.search_results = $rootScope.book_lists;
					}
					else{
						recommendationService.get_book_lists().then(function(data){
							$scope.search_results = [];
							angular.forEach(data, function(value){
					    		var json = {"name": value[1], "id": value[0], "type": SearchUIConstants.List, "icon2": "icon-list"};
								this.push(json);
							}, $scope.search_results);
							$rootScope.book_lists = $scope.search_results;
						});
					}
				}
				else if(item.type == SearchUIConstants.Country){
					// $scope.country_search = true;
					// var search_placeholder = SearchUIConstants.CountryPlaceholder;
					if($rootScope.regions){
						$scope.search_results = $rootScope.regions;
					}
					else{
						recommendationService.get_countries().then(function(data){
							$scope.search_results = data.countries;
							$rootScope.regions = $scope.search_results;
						});
					}
				}
				else if(item.type == SearchUIConstants.Genre){
					// $scope.genre_search = true;
					$scope.show_secondary_input = true;
					$scope.custom_input_placeholder = SearchUIConstants.GenrePlaceholder;
					$scope.website.searching_custom = true;
					if(angular.isDefined($rootScope.genres)){
						$scope.search_results = $rootScope.genres;
					}
					else{
						var params = "q=''&count="+10;
						websiteService.search_genres(params).then(function(data){
							$rootScope.genres = [];
							angular.forEach(data, function(value){
								var json = {"name": value[0], "id": value[1], "icon2": "icon-shapes", "custom_option": true, "type": SearchUIConstants.Genre};
								this.push(json);
							}, $scope.search_results);
							$rootScope.genres = $scope.search_results;
					    });
					}
					var temout_event = $timeout(function(){
						$scope.website.searching_custom = false;
					}, 200);
					$scope.$on('destroy', function(){
						$timeout.cancel(timeout_event);
					});
				}
				else if(item.type == SearchUIConstants.AuthorSearch){
					// $scope.author_search = true;
					$scope.show_secondary_input = true;
					$scope.custom_input_placeholder = SearchUIConstants.AuthorPlaceholder;
					$scope.website.searching_custom = true;
					var temout_event = $timeout(function(){
						$scope.website.searching_custom = false;
					}, 200);
					$scope.$on('destroy', function(){
						$timeout.cancel(timeout_event);
					});
				}
				else if(item.type == SearchUIConstants.Time){
					// $scope.time_search = true;
					// var search_placeholder = SearchUIConstants.TimePlaceholder;
					if($rootScope.read_times){
						$scope.search_results = $rootScope.read_times;
					}
					else{
						recommendationService.get_read_times().then(function(data){
							$scope.search_results = [];
							angular.forEach(data["read_times"], function(value){
					    		var time_data = value[0]["data"];
					    		var name = time_data["name"];
					    		var json = {"name": name, "type": SearchUIConstants.ReadingTime, "icon2": "icon-clock"};
								this.push(json);
							}, $scope.search_results);
							$rootScope.read_times = $scope.search_results;
						});
					}
				}
				else if(item.type == SearchUIConstants.Gender){
					// $scope.gender_search = true;
					// var search_placeholder = SearchUIConstants.GenderPlaceholder;
					$scope.search_results = [
						{"name": SearchUIConstants.MaleGender, "icon": "icon-male"},
						{"name": SearchUIConstants.FemaleGender, "icon": "icon-female"},
						{"name": SearchUIConstants.DontCareGender}
					];
				}
				else if(item.type == SearchUIConstants.Awards){
					// $scope.awards_search = true;
					// var search_placeholder = SearchUIConstants.AwardsPlaceholder;	
				}
				else if(item.type == SearchUIConstants.ComingSoon){
					$scope.coming_soon = true;
					// var search_placeholder = 
				}
				$scope.search_tag.placeholder = SearchUIConstants.LevelTwoPlaceHolder;
			}
		}
		else{
			if(angular.isUndefined($scope.filters_added)){
				$scope.filters_added = [];
			}
			if($scope.filters_added.indexOf(item) < 0){
				$scope.filters_added.push(item);
				$scope.search_results.splice($scope.search_results.indexOf(item), 1);
			}
		}
	}

	$scope.remove_filter = function(item){
		if(item.type == SearchUIConstants.ReadingTime){
			$rootScope.read_times.splice(0, 0, item);
		}
		else if(item.type == SearchUIConstants.TimeGroup){
			$rootScope.time_groups.splice(0, 0, item);
		}
		else if(item.type == SearchUIConstants.List){
			$rootScope.book_lists.splice(0, 0, item);
		}
		else if(item.type == SearchUIConstants.Genre){
			$rootScope.genres.splice(0, 0, item);
		}
		$scope.filters_added.splice($scope.filters_added.indexOf(item), 1);
	}

	_reset_filters = function(){
		if(angular.isDefined($scope.filters_added)){
			angular.forEach($scope.filters_added, function(item){
				$scope.remove_filter(item);
			});
		}
		$scope.filters_added = [];	
	}

	$scope.handle_base_selection = function(item){
		$scope.hide_input_field = false;
		$scope.show_secondary_input = false;
		_reset_filters();
		if(angular.isUndefined(item)){
			if($scope.active_base == SearchUIConstants.BookSearchLink){
				_init_book_search();
			}
			else if($scope.active_base == SearchUIConstants.AuthorSearchLink){
				_init_author_search();
			}
			else if($scope.active_base == SearchUIConstants.ReaderSearchLink){
				_init_reader_search();
			}
		}
		else if(angular.isDefined($scope.active_base) && $scope.active_base == item.name){
			$scope.search_tag.placeholder = SearchUIConstants.SearchPlaceholder;
			$scope.search_results = [];
			delete $scope.active_base;
		}
		else{
			if(item.name == SearchUIConstants.BookSearchLink){
				_init_book_search();
			}
			else if(item.name == SearchUIConstants.AuthorSearchLink){
				_init_author_search();
			}
			else if(item.name == SearchUIConstants.ReaderSearchLink){
				_init_reader_search();
			}
			$scope.active_base = item.name;
		}
		$scope.website.searching = true;
		var temout_event = $timeout(function(){
			$scope.website.searching = false;
		}, 200);
		$scope.$on('destroy', function(){
			$timeout.cancel(timeout_event);
		});
		delete $scope.active_nest;
	}

	$scope.is_active = function(item){
		var is_active = false;
		if(item.name == $scope.active_base){
			is_active = true;
		}
		return is_active;
	}

	$scope.handle_selection = function(item){
		var selectedItem = item.name;
		var graphOption = item.graph_option;
		var customOption = item.custom_option;
		var type = item.type;
		var show_all = item.show_all;

		console.log("%c search "+graphOption+" "+customOption+" "+selectedItem+" "+type+" "+$scope.search_level1+" "+$scope.search_level2, "color: green; font-weight: bold;");
		if(show_all){
			_show_search_result(item.value, true);
		}
		else{
			if(customOption){
				if(!$scope.search_level1){
					_handle_input_focus();
					$scope.search_type = type;
					_search_by(type);
					$scope.search_tag.input = "";
				}
				else if($scope.search_level2){

					var on_search_page = angular.isUndefined($routeParams.type);
					var user_id = $rootScope.user.id;
					if(type == SearchUIConstants.List){
						$location.path("/user/"+user_id+"/grid/books/id/"+item.id+"/name/"+item.name);
					}
					else {
						if(on_search_page){
							$location.path("/user/"+user_id+"/recommendations/books");
							$cookieStore.put('broadcast', 'filterChange');
							$cookieStore.put('selectedItem', selectedItem);
							$cookieStore.put('type', type);
						}
						else{
							_handle_input_focus();
							$rootScope.$broadcast('filterChange', {"name": selectedItem}, type);
							$rootScope.hide_options = true;
							$scope.search_tag.input = selectedItem;
						}
					}
				}
				else{
					_search_by(type);
					$scope.search_tag.input = "";
				}
			}
			else{
			    // $scope.search_tag.current = 0;
			    $scope.search_tag.selected_result = true;
			    if(graphOption){
			    	_handle_graph_search(selectedItem);
					$scope.search_tag.input = "";
			    }
			    else{
			    	_show_search_result(item);
			    }
			}
		}
		event.stopPropagation();
	};

	$scope.hide_search_page = function(type){
		var logged_in = $scope.logged;
		if(logged_in){
			$('body').css('white-space', 'nowrap');
			$scope.website.searching = false;
			$scope.website.show_search_page = false;
			$rootScope.$broadcast('initPage', type);
			$scope.loading = true;
			$timeout(function(){
				$scope.loading = false;
			}, 2000);
		}
		else{
			$scope.show_login_form = true;
		}
	}

	$scope.is_current = function(index, selectedItem) {
		if($scope.search_tag.current == index){
			$scope.search_tag.currentItem = selectedItem;
		} 
	    return $scope.search_tag.current == index;
	};

	$scope.set_current = function(index) {
	    $scope.search_tag.current = index;
	};

	$scope.key_down = function(event){
		// $scope.search_tag.selected_result = false;
        var backspace_or_delete = (event.keyCode == WebsiteUIConstants.Backspace) || (event.keyCode == WebsiteUIConstants.Delete);
		var keyUp = event.keyCode == WebsiteUIConstants.KeyUp;
		var keyDown = event.keyCode == WebsiteUIConstants.KeyDown;
		var keyLeft = event.keyCode == WebsiteUIConstants.KeyLeft;
		var keyRight = event.keyCode == WebsiteUIConstants.KeyRight;
		if(keyUp){
			if(angular.isUndefined($scope.search_tag.current)){
				$scope.search_tag.current = 0;
			}
			else{
				if($scope.search_tag.current != 0){
					$scope.set_current($scope.search_tag.current-1);
				}
				else{
					$scope.set_current($scope.search_results.length-1);
				}
			}
		}
		else if(keyDown){
			if(angular.isUndefined($scope.search_tag.current)){
				$scope.search_tag.current = 0;
			}
			else{
				if($scope.search_tag.current != $scope.search_results.length -1){
					$scope.set_current($scope.search_tag.current+1);
				}
				else{
					$scope.set_current(0);
				}
			}
		}
        else if(backspace_or_delete){
        	var currentValue = _get_search_input(event);
        	if(currentValue.length <= 1){
        		if(currentValue.length < 1 && $scope.search_level1 && !$scope.search_level2){
        			$scope.clear_search_level1_var(event);
        			event.preventDefault();
        		}
        		else if(currentValue.length < 1 && $scope.search_level2){
        			$scope.clear_search_level2_var(event);
        			event.preventDefault();
        		}
        		else{
        			_init_search();
        		}
        	}
        	else{
				$scope.get_search_results(event);
        	}
        }
        else if(keyLeft || keyRight){
        	event.stopPropagation();
        }
	}

	$scope.clear_search_level1_var = function(event){
		$scope.clear_search_level2_var(event);
		$scope.search_level1 = false;
		$scope.book_search = false;
		$scope.author_search = false;
		$scope.reader_search = false;
		$scope.search_tag.input = "";
		$rootScope.hide_options = false;

		_handle_input_focus();
		_init_graph_search();
		event.stopPropagation();
	}

	_handle_input_focus = function(){
		$scope.website.searching = true;
		var timeout_event = $timeout(function(){
			$scope.website.searching = false;
		}, 200);

		$scope.$on('destroy', function(){
			$timeout.cancel(timeout_event);
		});
	}

	$scope.close_login_box = function(){
		$scope.show_login_form = false;
	}

	$scope.clear_search_level2_var = function(event){
		$scope.search_level1 = false;
		$scope.search_level2 = false;
		$scope.year_search = false;
		$scope.list_search = false;	
		$scope.country_search = false;
		$scope.genre_search = false;
		$scope.author_search = false;
		$scope.time_search = false;
		$scope.gender_search = false;
		$scope.awards_search = false;
		$scope.coming_soon = false;
		$rootScope.hide_options = false;
		$scope.search_tag.input = "";
		_search_by();
		_handle_input_focus();
		event.stopPropagation();
	}

	$scope.highlight = function(searchItem, textToSearchThrough){
		var html = '<span><i><b>$&</b></i></span>';
    	return $sce.trustAsHtml(textToSearchThrough.replace(new RegExp(searchItem, 'gi'), html));
	}

	_init_graph_search = function(){
		// $scope.search_results = [
		// {"name": "Popular Readers", "graph_option": true},
		// {"name": "10 Readers to meet before you die", "graph_option": true},
		// {"name": "Friends who like a-book-category", "graph_option": true},
		// {"name": "Friends who are reading author-name-or-a-book-name", "graph_option": true},
		// {"name": "Friends who own a-book-name", "graph_option": true},
		// {"name": "Friends who need a-book-name", "graph_option": true},
		// {"name": "Friends who read a-book-name", "graph_option": true},
		// {"name": "Friends who bookmarked a-book-name-or-author-name-or-a-reader-name", "graph_option": true},
		// {"name": "Friends who follow an-author-name and a-friend-name", "graph_option": true},
		// {"name": "Readers bookmarked by a-friend-name-or-me", "graph_option": true},
		
		// {"name": "Popular books", "graph_option": true},
		// {"name": "10 Books to read before you die", "graph_option": true},
		// {"name": "100 Books to read before you die", "graph_option": true},
		// {"name": "Books recommended by a-friend-name-or-me", "graph_option": true},
		// {"name": "Books by an-author-name", "graph_option": true},
		// {"name": "Books published in a-year", "graph_option": true},
		// {"name": "Books published today", "graph_option": true},
		// {"name": "Books published between a-year and another-year", "graph_option": true},
		// {"name": "Books published in country a-country-name", "graph_option": true},
		// {"name": "Books tagged as a-tag", "graph_option": true},
		// {"name": "Books I own", "graph_option": true},
		// {"name": "Books I have read", "graph_option": true},
		// {"name": "Books I have rated", "graph_option": true},
		// {"name": "Books I have discussed", "graph_option": true},
		// {"name": "Books discussed by a-friend-name-or-me", "graph_option": true},
		// {"name": "Books reviewed by a-friend-name-or-me", "graph_option": true},
		// {"name": "Books read by a-friend-name-or-me", "graph_option": true},
		// {"name": "Books bookmarked by a-friend-name-or-me", "graph_option": true},
		// {"name": "Books published this year", "graph_option": true},
		
		// {"name": "10 Authors to read before you die", "graph_option": true},
		// {"name": "Authors bookmarked by a-friend-name-or-me", "graph_option": true},
		// {"name": "Popular Authors", "graph_option": true},
		

		// {"name": "Popular Bookmarks", "graph_option": true},
		// {"name": "a-book-category Books", "graph_option": true},
		// {"name": "Reviews on a-book-name", "graph_option": true},
		// {"name": "Discussions on a-book-name", "graph_option": true},
		// {"name": "Quotes from a-book-name", "graph_option": true},
		// {"name": "Characters from a-book-name", "graph_option": true},
		// {"name": "Popular Recommendations", "graph_option": true},
		// {"name": "Movies based on a-book-name", "graph_option": true}

		// ];
		$scope.base_search_options = [
			{
				"name": SearchUIConstants.BookSearchLink,
				"icon": "icon-book", 
				"type": SearchUIConstants.BookSearch
			},
			{
				"name": SearchUIConstants.AuthorSearchLink, 
				"icon": "icon-pen", 
				"type": SearchUIConstants.AuthorSearch
			},
			{
				"name": SearchUIConstants.ReaderSearchLink, 
				"icon": "icon-users", 
				"type": SearchUIConstants.ReaderSearch
			}
		];
	}

	_init_book_search = function(){
		// $scope.search_results = [
		// 	{"name": "Popular books", "graph_option": true},
		// 	{"name": "10 Books to read before you die", "graph_option": true},
		// 	{"name": "100 Books to read before you die", "graph_option": true},
		// 	{"name": "Books recommended by a-friend-name-or-me", "graph_option": true},
		// 	{"name": "Books by an-author-name", "graph_option": true},
		// 	{"name": "Books published in a-year", "graph_option": true},
		// 	{"name": "Books published today", "graph_option": true},
		// 	{"name": "Books published between a-year and another-year", "graph_option": true},
		// 	{"name": "Books published in country a-country-name", "graph_option": true},
		// 	{"name": "Books tagged as a-tag", "graph_option": true},
		// 	{"name": "Books I own", "graph_option": true},
		// 	{"name": "Books I have read", "graph_option": true},
		// 	{"name": "Books I have rated", "graph_option": true},
		// 	{"name": "Books I have discussed", "graph_option": true},
		// 	{"name": "Books discussed by a-friend-name-or-me", "graph_option": true},
		// 	{"name": "Books reviewed by a-friend-name-or-me", "graph_option": true},
		// 	{"name": "Books read by a-friend-name-or-me", "graph_option": true},
		// 	{"name": "Books bookmarked by a-friend-name-or-me", "graph_option": true},
		// 	{"name": "Books published this year", "graph_option": true}
		// ];
		$scope.base_book_options = [
			{"name": SearchUIConstants.BookByGenreLink, 
				"level1_option": true, 
				"type": SearchUIConstants.Genre, 
				"icon":"icon-shapes", 
				"icon2": "icon-book"},
			{"name": SearchUIConstants.BookByAuthorLink, 
				"level1_option": true, 
				"type": SearchUIConstants.AuthorSearch, 
				"icon":"icon-pen", 
				"icon2": "icon-book"},
			{"name": SearchUIConstants.BookByReadingTimeLink, 
				"level1_option": true, 
				"type": SearchUIConstants.Time, 
				"icon": "icon-clock", 
				"icon2": "icon-book"},
			{"name": SearchUIConstants.BookByYearLink, 
				"level1_option": true, 
				"type": SearchUIConstants.Year, 
				"icon":"icon-calendar", 
				"icon2": "icon-book"},
			{"name": SearchUIConstants.BookByRegionLink, 
				"level1_option": true, 
				"type": SearchUIConstants.Country, 
				"icon": "icon-earth", 
				"icon2": "icon-book"},
			{"name": SearchUIConstants.BookListsLink, 
				"level1_option": true, 
				"type": SearchUIConstants.List, 
				"icon": "icon-list", 
				"icon2": "icon-book"}
		];
		$scope.search_results = $scope.base_book_options;
		$scope.search_tag.placeholder = SearchUIConstants.BookSearchPlaceholder;
	}

	_init_author_search = function(){
		// $scope.search_results = [
		// 	{"name": "10 Authors to read before you die", "graph_option": true},
		// 	{"name": "Authors bookmarked by a-friend-name-or-me", "graph_option": true},
		// 	{"name": "Popular Authors", "graph_option": true}
		// ];

		$scope.search_results = [
			{"name": SearchUIConstants.AuthorByYearLink, "level1_option": true, "type": SearchUIConstants.Year, "icon": "icon-clock", "icon2": "icon-pen"},
			{"name": SearchUIConstants.AuthorByRegionLink, "level1_option": true, "type": SearchUIConstants.Country, "icon": "icon-earth", "icon2": "icon-pen"},
			{"name": SearchUIConstants.AuthorByAwardsLink, "level1_option": true, "type": SearchUIConstants.Awards, "icon": "icon-trophy", "icon2": "icon-pen"},
			{"name": SearchUIConstants.AuthorsByGenreLink, "level1_option": true, "type": SearchUIConstants.Genre, "icon": "icon-shapes", "icon2": "icon-pen"},
			{"name": SearchUIConstants.AuthorListsLink, "level1_option": true, "type": SearchUIConstants.List, "icon": "icon-list", "icon2": "icon-pen"}
		];

		$scope.search_results = [
			{"name": SearchUIConstants.ComingSoon, "level1_option": true, "type": SearchUIConstants.ComingSoon, "icon2": "icon-pen"}
		];

		$scope.search_tag.placeholder = SearchUIConstants.AuthorSearchPlaceholder;
	}

	_init_reader_search = function(){
		// $scope.search_results = [
		// 	{"name": "Popular Readers", "graph_option": true},
		// 	{"name": "10 Readers to meet before you die", "graph_option": true},
		// 	{"name": "Friends who like a-book-category", "graph_option": true},
		// 	{"name": "Friends who are reading author-name-or-a-book-name", "graph_option": true},
		// 	{"name": "Friends who own a-book-name", "graph_option": true},
		// 	{"name": "Friends who need a-book-name", "graph_option": true},
		// 	{"name": "Friends who read a-book-name", "graph_option": true},
		// 	{"name": "Friends who bookmarked a-book-name-or-author-name-or-a-reader-name", "graph_option": true},
		// 	{"name": "Friends who follow an-author-name and a-friend-name", "graph_option": true},
		// 	{"name": "Readers bookmarked by a-friend-name-or-me", "graph_option": true},
		// ]

		$scope.search_results = [
			{"name": SearchUIConstants.ReaderByRegionLink, "level1_option": true, "type": SearchUIConstants.Country, "icon": "icon-earth", "icon2": "icon-user22"},
			{"name": SearchUIConstants.ReaderByTasteLink, "level1_option": true, "type": SearchUIConstants.Genre, "icon": "icon-shapes", "icon2": "icon-user22"},
			{"name": SearchUIConstants.ReaderByGenderLink, "level1_option": true, "type": SearchUIConstants.Gender, "icon": "icon-male icon-female", "icon2": "icon-user22"},
			{"name": SearchUIConstants.ReaderListsLink, "level1_option": true, "type": SearchUIConstants.List, "icon": "icon-list", "icon2": "icon-user22"}
		];
		$scope.search_results = [
			{"name": SearchUIConstants.ComingSoon, "level1_option": true, "type": SearchUIConstants.ComingSoon, "icon2": "icon-user22"}
		];
		$scope.search_tag.placeholder = SearchUIConstants.ReaderSearchPlaceholder;
	}

	_init_search = function(){
		_init_graph_search();
		if(!$scope.search_level1 && !$scope.search_level2){
			$scope.search_type = SearchUIConstants.All;
			$scope.search_display = SearchUIConstants.SearchingWebsite;
		}
		var on_search_page = angular.isUndefined($routeParams.type);
		if(!on_search_page){
			delete $rootScope.filters.other_filters.title;
			delete $rootScope.filters.other_filters.show_all;
			delete $rootScope.filters.other_filters.author_name;
  			delete $rootScope.filters.other_filters.id;
  			$scope.$emit('reloadRecommendations');
		}

	}

	_handle_search_input = function(event){
        var currentValue = _get_search_input(event);
        _init_graph_search();
        $scope.search_ready = true;
        var firstInput = currentValue.slice(0, 1);
        var customBookSearch = firstInput == SearchUIConstants.Hash;
		var customAuthorSearch = firstInput == SearchUIConstants.AtTheRate;
		var customTagSearch = firstInput == SearchUIConstants.Plus;
        var customSearch = customAuthorSearch || customBookSearch || customTagSearch;
        var currentValueLength = currentValue.length;
        _set_custom_search(customAuthorSearch, customBookSearch, customTagSearch);
        if(customSearch){
			if(currentValue.length == 1){
				$scope.search_ready = false;
			}
        	currentValue = currentValue.substring(1, currentValue.length);
        }
        console.debug(currentValue, $scope.search_type, $scope.search_tag.result_count);
    	if($scope.search_ready && currentValue != ""){
	        websiteService.search(currentValue, $scope.search_type, $scope.search_tag.result_count)
	        .then(function(result){
	        	$scope.search_results = [];
	        	var results = result.results.data;
	        	angular.forEach(results, function(value){
	        		var json = {"name": value[0], "author_name": value[1], "id": value[2]};
	        		this.push(json);
	        	}, $scope.search_results);
	        	if($scope.search_results.length != 0){
		        	var show_all = {"name": "<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+$scope.search_tag.input+"</em>'</span>", "show_all": true, "value":$scope.search_tag.input};
					$scope.search_results.push(show_all);
	        	}
				$scope.search_initiated = false;
				$timeout.cancel(search_typing_timeout);
	        });
    	}
    	else{
    		$scope.search_initiated = false;
			_init_graph_search();
			$timeout.cancel(search_typing_timeout);
    	}
	}

	_get_search_input = function(event){
		console.debug("search_input", $scope.search_tag.input.trim());
		return $scope.search_tag.input.trim();
	}

	_set_custom_search = function(customAuthorSearch, customBookSearch, customTagSearch){
		console.debug("_set_custom_search", customBookSearch, customAuthorSearch, customTagSearch);
		if(customAuthorSearch){
			$scope.search_type = SearchUIConstants.AuthorSearch+", "+SearchUIConstants.ReaderSearch;
			$scope.search_display = SearchUIConstants.SearchingAuthorsAndReaders;
		}
		else if(customBookSearch){
			$scope.search_type = SearchUIConstants.BookSearch;
			$scope.search_display = SearchUIConstants.SearchingBooks;
		}
		else if(customTagSearch){
			$scope.search_type = SearchUIConstants.TagSearch;
			$scope.search_display = SearchUIConstants.SearchingTags;
		}
	}

	$scope.get_search_results = function(event, type){
		var specific_search = angular.isDefined(type);
		if(specific_search){
			$scope.search_initiated = true;
			if(type == SearchUIConstants.BookSearch){
				var customBookSearch = true;
				var customAuthorSearch = false;
				var customTagSearch = false;
			}
			else if(type == SearchUIConstants.AuthorSearch){
				var firstInput = SearchUIConstants.AtTheRate;	
				var customBookSearch = false;
				var customAuthorSearch = true;
				var customTagSearch = false;
			}
			_set_custom_search(customAuthorSearch, customBookSearch, customTagSearch);
			search_typing_timeout = $timeout(function(){
				_handle_search_input(event);
			}, 500);
		}
		else{
			if($scope.search_initiated){
				_init_graph_search();
	    		$timeout.cancel(search_typing_timeout);
	    		search_typing_timeout = $timeout(function(){
					_handle_search_input(event);
				}, 500);
			}
			else{
        		var keyEnter = event.keyCode == WebsiteUIConstants.Enter;
				if(keyEnter){
					$scope.handle_selection_option($scope.search_tag.currentItem);
				}
				else{
					_init_graph_search();
	        		var firstInput = String.fromCharCode(event.keyCode);
		        	var currentValue = _get_search_input(event);
		        	if(currentValue && currentValue.length > 1){
		        		var customBookSearch = currentValue.indexOf(SearchUIConstants.Hash) == 0;
		        		var customAuthorSearch = currentValue.indexOf(SearchUIConstants.AtTheRate) == 0;
		        		var customTagSearch = currentValue.indexOf(SearchUIConstants.Plus) == 0;
		        	}
		        	else{
		        		var customBookSearch = firstInput == SearchUIConstants.Hash;
		        		var customAuthorSearch = firstInput == SearchUIConstants.AtTheRate;
		        		var customTagSearch = firstInput == SearchUIConstants.Plus;
		        	}
					$scope.search_initiated = true;
					_set_custom_search(customAuthorSearch, customBookSearch, customTagSearch);
					search_typing_timeout = $timeout(function(){
						_handle_search_input(event);
					}, 500);
				}
			}
		}
		
	}

	$scope.toggle_login_panel = function(){
		if($scope.show_login_form){
			$scope.show_login_form = false;
		}
		else{
			$scope.show_login_form = true;	
		}
	}

	$scope.handle_options = function(){
		if($routeParams.type){
			if($rootScope.hide_options){
				$rootScope.hide_options = false;
			}
			/*else{
				$rootScope.hide_options = true;	
			}*/
			event.stopPropagation();
		}
	}

	_handle_search_page = function(){
		$scope.search_initiated = false;
		$scope.search_display = SearchUIConstants.SearchingWebsite;
		$scope.search_type = SearchUIConstants.All;
		$scope.show_login_form = true;

		// $scope.search_tag.selected_result = true; // hides the list initially
		$scope.search_tag = {};
		$scope.search_tag.search_placeholder = SearchUIConstants.SearchPlaceholder;
		
		var searched_input = angular.isDefined($rootScope.filters) && angular.isDefined($rootScope.filters.other_filters) && angular.isDefined($rootScope.filters.other_filters.title);
		if(searched_input){
			$scope.search_tag.input = $rootScope.filters.other_filters["title"];
		}
		else{
			$scope.search_tag.input = "";	
		}
		$scope.search_tag.result_count = 100;
	    $scope.website.searching = false;
		$scope.website.show_search_page = true;
		websiteService.get_background_image().then(function(data){
			$scope.search_style = {'background-image': 'url("'+data.url+'")'};
		});
		_init_graph_search();
		if($routeParams.type){
			$rootScope.hide_options = true;
		}
		else{
			$rootScope.hide_options = false;
		}
	}

	_get_trends = function(){
		if(angular.isUndefined($scope.$routeParams) && angular.isUndefined($scope.trends)){
			$scope.trends = [];
			websiteService.get_trending_topics().then(function(data){
				angular.forEach(data, function(value){
					var json = {"name": value[0], "id": value[1]};
					this.push(json);
				}, $scope.trends);
			});
		}
	}

	_init = function(){
		$scope.website.searching = true;
		_handle_search_page();
		_init_book_search();
		$scope.active_base = SearchUIConstants.BookSearchLink;
		_get_trends();
	}
	
	var search_typing_timeout = "";
	_init();
}]);