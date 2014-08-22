websiteApp.controller('searchController', ['$scope', '$rootScope', 'websiteService', '$timeout', '$sce', 'recommendationService', '$routeParams', '$location', 'SearchUIConstants', 'WebsiteUIConstants', '$cookieStore', function($scope, $rootScope, websiteService, $timeout, $sce, recommendationService, $routeParams, $location, SearchUIConstants, WebsiteUIConstants, $cookieStore){
	$scope.update_filters = function(type, value){
		var item = {"type": type, "custom_option": true};
		switch(type){
			case SearchUIConstants.Genre:
				var json = {"icon2": "icon-shapes"};
				break;
			case SearchUIConstants.AuthorSearch:
				var json = {"icon2": "icon-pen", "id": value};
				break;
			case SearchUIConstants.Time:
				var json = {"icon2": "icon-clock"};
				break;
			case SearchUIConstants.Year:
				var json = {"icon2": "icon-calendar"};
				break;
			case SearchUIConstants.Country:
				var json = {"icon2": "icon-earth"};
				break;
		}
		item = angular.extend(item, json);
		if(angular.isUndefined($scope.filters_added)){
			$scope.filters_added = [];
		}
		$scope.add_filters(item);
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

	$scope.search_custom = function(event){
		if($scope.custom_search == SearchUIConstants.Genre){
			var keyEnter = event.keyCode == WebsiteUIConstants.Enter;
			if(keyEnter){
				$scope.handle_selection_option($scope.search_tag.currentItem, event);
			}
			else{
				var backspace_or_delete = event.keyCode == WebsiteUIConstants.Backspace || WebsiteUIConstants.Delete;
				if(backspace_or_delete){
					var input = $scope.search_tag.custom_input;
				}
				else{
					var input = $scope.search_tag.custom_input + String.fromCharCode(event.keyCode);
				}

				var params = "q="+input+"&count="+10;
				$scope.search_display = SearchUIConstants.SearchingGenres;
				$scope.search_results = [];
				websiteService.search_genres(params).then(function(data){
					if(data.length > 0){
						$scope.search_results = [];
						delete $scope.search_display;
						angular.forEach(data, function(value){
							var json = {"name": value[0], "id": value[1], "icon2": "icon-shapes", "custom_option": true, "type": SearchUIConstants.Genre};
							this.push(json);
						}, $scope.search_results);
					}
					else{
						$scope.search_display = SearchUIConstants.NoResultsFound;
					}
			    });
			}
		}
		else if($scope.custom_search == SearchUIConstants.AuthorSearch){
			var keyEnter = event.keyCode == WebsiteUIConstants.Enter;
			if(keyEnter){
				$scope.handle_selection_option($scope.search_tag.currentItem, event);
			}
			else{
				var backspace_or_delete = event.keyCode == WebsiteUIConstants.Backspace || WebsiteUIConstants.Delete;
				if(backspace_or_delete){
					var input = $scope.search_tag.custom_input;
				}
				else{
					var input = $scope.search_tag.custom_input + String.fromCharCode(event.keyCode);
				}

				$scope.search_display = SearchUIConstants.SearchingAuthor;
				$scope.search_results = [];
				websiteService.search_authors(input).then(function(data){
					if(data.length > 0){
						$scope.search_results = [];
						delete $scope.search_display;
						angular.forEach(data, function(value){
							var json = {"name": value[0], "id": value[1], "icon2": "icon-pen", "custom_option": true, "type": SearchUIConstants.AuthorSearch};
							this.push(json);
						}, $scope.search_results);
					}
					else{
						$scope.search_display = SearchUIConstants.NoResultsFound;
					}
			    });
			}
		}
	}

	$scope.reset_secondary_input_focus = function(){
		var timeout_event = $timeout(function(){
			$scope.website.searching_custom = false;
		}, 200);
		$scope.$on('destroy', function(){
			$timeout.cancel(timeout_event);
		});
	}

	$scope.select_next_option = function(type){
		if($scope.active_base == SearchUIConstants.BookSearch){
			var parent_found = false;
			var next_link_executed = false;
			angular.forEach($scope.base_book_options, function(item){
				if(parent_found){
					$scope.handle_selection_option(item, event);
					next_link_executed = true;
					parent_found = false;
				}
				else if(item.type == type && !next_link_executed){
					parent_found = true;
				}
			});
			if(on_search_page){
				if(!next_link_executed){
					$location.path("/user/"+$rootScope.user.id+"/recommendations/books");
				}
			}
			else{
				if(!next_link_executed){
					var first_item = $scope.base_book_options[0];
					$scope.handle_selection_option(first_item, event);
				}
			}
		}
	}

	$scope.handle_selection_option = function(item, event){
		if(item.level1_option){
			if($scope.active_base == SearchUIConstants.BookSearch){
				$scope.show_compressed_base = true;
				$scope.active_nest = item.name;
				$scope.search_results = [];
				$scope.hide_input_field = true;
				$scope.show_secondary_input = false;
				delete $scope.search_tag.custom_input;
				switch(item.type){
					case SearchUIConstants.Year:
						if($rootScope.time_groups){
							$scope.search_results = [];
							var results_timeout_event = $timeout(function(){
								$scope.search_results = $rootScope.time_groups;
							}, 200);
							$scope.$on('destroy', function(){
								$timeout.cancel(results_timeout_event);
							});
						}
						else{
							recommendationService.get_time_groups().then(function(data){
								$scope.search_results = [];
								angular.forEach(data["times"], function(value){
									var time_data = value[0]["data"];
						    		var name = time_data["name"];
						    		var json = {"name": name, "type": SearchUIConstants.Year, "label": time_data["range"], "icon2": "icon-calendar", "custom_option": true};
									this.push(json);
								}, $scope.search_results);
						    	$rootScope.time_groups = $scope.search_results;
							});
						}
						break;
					case SearchUIConstants.List:
						if($rootScope.book_lists){
							$scope.search_results = [];
							var results_timeout_event = $timeout(function(){
								$scope.search_results = $rootScope.book_lists;
							}, 200);
							$scope.$on('destroy', function(){
								$timeout.cancel(results_timeout_event);
							});
						}
						else{
							recommendationService.get_book_lists().then(function(data){
								$scope.search_results = [];
								angular.forEach(data, function(value){
						    		var json = {"name": value[1], "id": value[0], "type": SearchUIConstants.List, "icon2": "icon-list", "custom_option": true};
									this.push(json);
								}, $scope.search_results);
								$rootScope.book_lists = $scope.search_results;
							});
						}
						break;
					case SearchUIConstants.Country:
						if($rootScope.regions){
							$scope.search_results = [];
							var results_timeout_event = $timeout(function(){
								$scope.search_results = $rootScope.regions;
							}, 200);
							$scope.$on('destroy', function(){
								$timeout.cancel(results_timeout_event);
							});
						}
						else{
							recommendationService.get_countries().then(function(data){
								$scope.search_results = [];
								angular.forEach(data.countries, function(value){
									var json = angular.extend(value, {"type": SearchUIConstants.Country, "icon2": "icon-earth", "custom_option": true});
									this.push(json);
								}, $scope.search_results);
								$rootScope.regions = $scope.search_results;
							});
						}
						break;
					case SearchUIConstants.Genre:
						$scope.search_tag.custom_input = "";
						$scope.show_secondary_input = true;
						$scope.custom_input_placeholder = SearchUIConstants.GenrePlaceholder;
						$scope.custom_search = SearchUIConstants.Genre;
						$scope.website.searching_custom = true;
						if(angular.isDefined($rootScope.genres)){
							$scope.search_results = [];
							var results_timeout_event = $timeout(function(){
								$scope.search_results = $rootScope.genres;
							}, 200);
							$scope.$on('destroy', function(){
								$timeout.cancel(results_timeout_event);
							});
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
						$scope.reset_secondary_input_focus();
						break;
					case SearchUIConstants.AuthorSearch:
						$scope.search_tag.custom_input = "";
						$scope.show_secondary_input = true;
						$scope.custom_input_placeholder = SearchUIConstants.AuthorPlaceholder;
						$scope.custom_search = SearchUIConstants.AuthorSearch;
						$scope.website.searching_custom = true;
						if(angular.isDefined($rootScope.authors)){
							$scope.search_results = [];
							var results_timeout_event = $timeout(function(){
								$scope.search_results = $rootScope.authors;
							}, 200);
							$scope.$on('destroy', function(){
								$timeout.cancel(results_timeout_event);
							});
						}
						else{
							websiteService.search_authors("").then(function(data){
								$rootScope.authors = [];
								angular.forEach(data, function(value){
									var json = {"name": value[0], "id": value[1], "icon2": "icon-pen", "custom_option": true, "type": SearchUIConstants.AuthorSearch};
									this.push(json);
								}, $scope.search_results);
								$rootScope.authors = $scope.search_results;
						    });
						}
						$scope.reset_secondary_input_focus();
						break;
					case SearchUIConstants.Time:
						if($rootScope.read_times){
							$scope.search_results = [];
							var results_timeout_event = $timeout(function(){
								$scope.search_results = $rootScope.read_times;
							}, 200);
						}
						else{
							recommendationService.get_read_times().then(function(data){
								$scope.search_results = [];
								angular.forEach(data["read_times"], function(value){
						    		var time_data = value[0]["data"];
						    		var name = time_data["name"];
						    		var tag = time_data["type"]
						    		var json = {"name": name, "type": SearchUIConstants.Time, "icon2": "icon-clock", "tag": tag, "custom_option": true};
									this.push(json);
								}, $scope.search_results);
								$rootScope.read_times = $scope.search_results;
							});
						}
						break;
					case SearchUIConstants.Gender:
						$scope.search_results = [
							{"name": SearchUIConstants.MaleGender, "icon": "icon-male"},
							{"name": SearchUIConstants.FemaleGender, "icon": "icon-female"},
							{"name": SearchUIConstants.DontCareGender}
						];
						break;
					case SearchUIConstants.Awards:
						break;
					case SearchUIConstants.ComingSoon:
						$scope.coming_soon = true;
						break;
				}
			}
		}
		else{
			if(angular.isUndefined($scope.filters_added)){
				$scope.filters_added = [];
			}
			if($scope.filters_added.indexOf(item) < 0){
				$scope.add_filters(item);
			}
		}
		event.stopPropagation();
	}

	$scope.add_filters = function(item){
		console.debug("add_filters", item);
		var only_single_filter = true;
		if(only_single_filter){
			angular.forEach($scope.filters_added, function(value){
				if(value.type == item.type){
					$scope.filters_added.splice($scope.filters_added.indexOf(value), 1);
					$scope.search_results.splice(0, 0, value);
				}
			});
			if(!on_search_page){
				if(angular.isUndefined($rootScope.filters)){
		  			$rootScope.filters = {"other_filters": {}};
		  		}
			}
			switch(item.type){
				case SearchUIConstants.Genre:
					var data = item.id;
					break;
				case SearchUIConstants.AuthorSearch:
					var data = item.id;
					break;
				case SearchUIConstants.Time:
					var data = item.tag;
					break;
				case SearchUIConstants.Year:
					var data = item.name;
					break;
				case SearchUIConstants.Country:
					var data = item.name;
					break;
				case SearchUIConstants.BookSearch:
					if(on_search_page){
						var user_id = $rootScope.user.id;
						if(angular.isDefined(item.show_all) && item.show_all){
			  				$location.path("/user/"+user_id+"/book/"+item.name+"/all/"+true);
						}
						else{
							$location.path("/user/"+user_id+"/book/"+item.name+"/author/"+item.author_name+"/id/"+item.id);
						}
					}
					else{
						if(angular.isDefined(item.show_all) && item.show_all){
			  				$rootScope.filters.other_filters["show_all"] = true;
						}
						else{
							$rootScope.filters.other_filters["id"] = item.id;
							$rootScope.filters.other_filters["author_name"] = item.author_name;
						}
						$rootScope.filters.other_filters["title"] = item.name;
						var data_set = true;
					}
				default:
					break;
			}
			if(on_search_page){
				$cookieStore.put(item.type, item);
			}
			else{
				if(angular.isUndefined(data_set)){
					$rootScope.filters.other_filters[item.type] = data;
				}
				$rootScope.filters["reset_count"] = 0;
				$rootScope.filters["reset"] = true;
				$scope.$emit('reloadRecommendations');
			}
		}
		if(angular.isUndefined(data_set)){
			$scope.filters_added.splice(0, 0, item);
			$scope.search_results.splice($scope.search_results.indexOf(item), 1);
			$scope.select_next_option(item.type);
		}
	}

	$scope._reset_filter = function(item){
		console.debug("reset_filter", item.type, item.name, $scope.filters_added.length);
		switch(item.type){
			case SearchUIConstants.Time:
				if(angular.isDefined($rootScope.read_times)){
					$rootScope.read_times.splice(0, 0, item);
				}
				break;
			case SearchUIConstants.Year:
				if(angular.isDefined($rootScope.time_groups)){
					$rootScope.time_groups.splice(0, 0, item);
				}
				break;
			case SearchUIConstants.List:
				if(angular.isDefined($rootScope.book_lists)){
					$rootScope.book_lists.splice(0, 0, item);
				}
				break;
			case SearchUIConstants.Genre:
				if(angular.isDefined($rootScope.genres)){
					$rootScope.genres.splice(0, 0, item);
				}
				break;
			case SearchUIConstants.Country:
				if(angular.isDefined($rootScope.regions)){
					$rootScope.regions.splice(0, 0, item);
				}
				break;
		}
		if(on_search_page){
			$cookieStore.remove(item.type);
		}
		else{
			delete $rootScope.filters.other_filters[item.type];
			$scope.$emit('reloadRecommendations');
		}
	}

	$scope.remove_filter = function(item, event){
		$scope._reset_filter(item);
		$scope.filters_added.splice($scope.filters_added.indexOf(item), 1);
		if($scope.filters_added.length == 0){
			$scope.handle_options(event);
			$scope.set_focus(200);
		}
		event.stopPropagation();
	}

	$scope.reset_filters = function(){
		if(angular.isDefined($scope.filters_added)){
			angular.forEach($scope.filters_added, function(item){
				$scope._reset_filter(item);
			});
			$scope.filters_added = [];
		}
	}

	$scope.set_base_search = function(){
		switch($scope.active_base){
			case SearchUIConstants.BookSearch:
				_init_book_search();
				break;
			case SearchUIConstants.AuthorSearch:
				_init_author_search();
				break;
			case SearchUIConstants.ReaderSearch:
				_init_reader_search();
				break;
		}		
	}

	$scope.handle_base_selection = function(item){
		$scope.hide_input_field = false;
		$scope.show_secondary_input = false;
		$scope.reset_filters();
		if(angular.isUndefined(item)){
			$scope.set_base_search();
		}
		else if(angular.isDefined($scope.active_base) && $scope.active_base == item.type){
			$scope.search_tag.placeholder = SearchUIConstants.SearchPlaceholder;
			$scope.search_results = [];
			delete $scope.active_base;
		}
		else{
			switch(item.name){
				case SearchUIConstants.BookSearchLink:
					_init_book_search();
					break;
				case SearchUIConstants.AuthorSearchLink:
					_init_author_search();
					break;
				case SearchUIConstants.ReaderSearchLink:
					_init_reader_search();
					break;
			}
			$scope.active_base = item.type;
		}
		$scope.website.searching = true;
		var temout_event = $timeout(function(){
			$scope.website.searching = false;
		}, 200);
		$scope.$on('destroy', function(){
			$timeout.cancel(timeout_event);
		});
		delete $scope.active_nest;
		delete $scope.search_tag.custom_input;
	}

	$scope.is_active = function(item){
		var is_active = false;
		if(item.type == $scope.active_base){
			is_active = true;
		}
		return is_active;
	}

	$scope.is_current = function(index, selectedItem) {
		if($scope.search_tag.current == index){
			$scope.search_tag.currentItem = selectedItem;
			if(selectedItem.show_all){
				$scope.search_tag.input = selectedItem.value;
			}
			else if(selectedItem.type != SearchUIConstants.ComingSoon && !selectedItem.level1_option && !selectedItem.custom_option){
				$scope.search_tag.input = selectedItem.name;
			}
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
        	var currentValue = $scope.search_tag.input.trim();
        	var custom_search = angular.isDefined($scope.search_tag.custom_input);
        	console.debug("currentValue, custom_search", currentValue, custom_search, currentValue.length <= 1);
        	delete $scope.search_display;
        	delete $scope.search_tag.current;
        	if(custom_search){
        		if($scope.search_tag.custom_input.length > 1){
        			$scope.search_custom(event);
        		}
        		else{
        			if($scope.custom_search == SearchUIConstants.Genre){
        				$scope.search_results = $rootScope.genres;
        			}
        			else if($scope.custom_search == SearchUIConstants.AuthorSearch){
        				$scope.search_results = $rootScope.authors;
        			}
        		}
        	}
        	else if(currentValue.length <= 1){
        		$scope.search_tag.input = "";
        		$scope.search_results = [];
        		$scope.search_ready = false;
        		$scope.set_base_search();
				if(angular.isUndefined($scope.active_base)){
					$scope.search_type = SearchUIConstants.All;
				}
				if(!on_search_page){
					delete $rootScope.filters.other_filters.title;
					delete $rootScope.filters.other_filters.show_all;
					delete $rootScope.filters.other_filters.author_name;
		  			delete $rootScope.filters.other_filters.id;
		  			$scope.$emit('reloadRecommendations');
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

	$scope.close_login_box = function(){
		$scope.show_login_form = false;
	}

	$scope.highlight = function(searchItem, textToSearchThrough){
		var html = '<span><i><b>$&</b></i></span>';
    	return $sce.trustAsHtml(textToSearchThrough.replace(new RegExp(searchItem, 'gi'), html));
	}

	_init_graph_search = function(){
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
				"icon2": "icon-book"}
			// {"name": SearchUIConstants.BookListsLink, 
				// "level1_option": true, 
				// "type": SearchUIConstants.List, 
				// "icon": "icon-list", 
				// "icon2": "icon-book"}
		];
		$scope.search_results = $scope.base_book_options;
		$scope.search_tag.placeholder = SearchUIConstants.BookSearchPlaceholder;
	}

	_init_author_search = function(){
		$scope.search_results = [
			{"name": SearchUIConstants.ComingSoon, "level1_option": true, "type": SearchUIConstants.ComingSoon, "icon2": "icon-pen"}
		];
		$scope.search_tag.placeholder = SearchUIConstants.AuthorSearchPlaceholder;
	}

	_init_reader_search = function(){
		$scope.search_results = [
			{"name": SearchUIConstants.ComingSoon, "level1_option": true, "type": SearchUIConstants.ComingSoon, "icon2": "icon-user22"}
		];
		$scope.search_tag.placeholder = SearchUIConstants.ReaderSearchPlaceholder;
	}

	_handle_search_input = function(event){
        var currentValue = $scope.search_tag.input.trim();
        _init_graph_search();
        $scope.search_ready = true;

        if(angular.isUndefined($scope.active_base)){
	        var firstInput 			= currentValue.slice(0, 1);
	        var customBookSearch 	= firstInput == SearchUIConstants.Hash;
			var customAuthorSearch 	= firstInput == SearchUIConstants.AtTheRate;
			var customTagSearch 	= firstInput == SearchUIConstants.Plus;
	        var customSearch 		= customAuthorSearch || customBookSearch || customTagSearch;
        	if(currentValue.length > 0){
        		_set_custom_search(customAuthorSearch, customBookSearch, customTagSearch);
        	}
        }
        else{
        	if(currentValue.length > 0){
        		_set_custom_search();
        	}
        }

        if(customSearch){
			if(currentValue.length == 1){
				$scope.search_ready = false;
			}
        	currentValue = currentValue.substring(1, currentValue.length);
        }

        console.debug("_handle_search_input", currentValue, $scope.search_type, $scope.search_tag.result_count);
    	if($scope.search_ready && currentValue != ""){
	        websiteService.search(currentValue, $scope.search_type, $scope.search_tag.result_count)
	        .then(function(result){
	        	if($scope.search_ready){
		        	var results = result.results.data;
		        	angular.forEach(results, function(value){
		        		var json = {"name": value[0], "author_name": value[1], "id": value[2], "type": SearchUIConstants.BookSearch};
		        		this.push(json);
		        	}, $scope.search_results);
		        	if($scope.search_results.length != 0){
			        	var show_all = {"name": "<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+$scope.search_tag.input+"</em>'</span>", "show_all": true, "value":$scope.search_tag.input};
						$scope.search_results.push(show_all);
						delete $scope.search_display;
		        	}
		        	else{
		        		$scope.search_display = SearchUIConstants.NoResultsFound;
		        	}
					$scope.search_initiated = false;
	        	}
				$timeout.cancel(search_typing_timeout);
	        });
    	}
    	else{
    		$scope.search_initiated = false;
			_init_graph_search();
			$timeout.cancel(search_typing_timeout);
    	}
	}

	_set_custom_search = function(customAuthorSearch, customBookSearch, customTagSearch){
		$scope.search_results = [];
		if(angular.isUndefined(customAuthorSearch)){
			if($scope.active_base == SearchUIConstants.AuthorSearch){
				customAuthorSearch = true;
			}
			else if($scope.active_base == SearchUIConstants.BookSearch){
				customBookSearch = true;
			}
		}
		console.debug("_set_custom_search", customAuthorSearch, customBookSearch, customTagSearch);
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
		else{
			$scope.search_type = SearchUIConstants.SearchAll;
			$scope.search_display = SearchUIConstants.SearchingWebsite;
		}
	}

	$scope.get_search_results = function(event){
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
				$scope.handle_selection_option($scope.search_tag.currentItem, event);
			}
			else{
				_init_graph_search();
        		var firstInput = String.fromCharCode(event.keyCode);
	        	var currentValue = $scope.search_tag.input.trim();
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
				console.debug("_set_custom_search get_search_results");
				search_typing_timeout = $timeout(function(){
					_handle_search_input(event);
				}, 500);
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

	$scope.handle_options = function(event){
		if($routeParams.type){
			if($rootScope.hide_options){
				if(angular.isUndefined($scope.search_tag.input) || $scope.search_tag.input.length == 0){
					$scope.hide_input_field = false;
					_init_book_search();
				}
				$scope.show_secondary_input = false;
				$rootScope.hide_options = false;
				delete $scope.active_nest;
				delete $scope.active_base;
				delete $scope.search_tag.custom_input;
				$scope.active_base = SearchUIConstants.BookSearch;
			}
			event.stopPropagation();
		}
	}

	$scope.reset_search_bar = function(event){
		$rootScope.hide_options = true;
		$scope.hide_input_field = false;
		event.stopPropagation();
	}

	_handle_search_page = function(){
		$scope.search_initiated = false;
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

	$scope.set_focus = function(timer){
		var focus_timeout = $timeout(function(){
			$scope.website.searching = true;
			var reset_focus_param_timeout = $timeout(function(){
				$scope.website.searching = false;
			}, 200);

		}, timer);
		$scope.$on('destroy', function(){
			$timeout.cancel(focus_timeout);
			$timeout.cancel(reset_focus_param_timeout);
		});
	}

	_add_init_filters = function(){
		if(!on_search_page){
			if(angular.isUndefined($scope.filters_added)){
				$scope.filters_added = [];
			}
			switch(true){
				case angular.isDefined($cookieStore.get(SearchUIConstants.Genre)):
					var item = $cookieStore.get(SearchUIConstants.Genre);
					$rootScope.filters.other_filters[SearchUIConstants.Genre] = item.id;
					$scope.filters_added.push(item)
					$cookieStore.remove(SearchUIConstants.Genre);
				case angular.isDefined($cookieStore.get(SearchUIConstants.AuthorSearch)):
					var item = $cookieStore.get(SearchUIConstants.AuthorSearch);
					$rootScope.filters.other_filters[SearchUIConstants.AuthorSearch] = item.id;
					$scope.filters_added.push(item)
					$cookieStore.remove(SearchUIConstants.AuthorSearch);
				case angular.isDefined($cookieStore.get(SearchUIConstants.Time)):
					var item = $cookieStore.get(SearchUIConstants.Time);
					$rootScope.filters.other_filters[SearchUIConstants.Time] = item.tag;
					$scope.filters_added.push(item)
					$cookieStore.remove(SearchUIConstants.Time);
				case angular.isDefined($cookieStore.get(SearchUIConstants.Year)):
					var item = $cookieStore.get(SearchUIConstants.Year);
					$rootScope.filters.other_filters[SearchUIConstants.Year] = item.name;
					$scope.filters_added.push(item)
					$cookieStore.remove(SearchUIConstants.Year);
				case angular.isDefined($cookieStore.get(SearchUIConstants.Country)):
					var item = $cookieStore.get(SearchUIConstants.Country);
					$rootScope.filters.other_filters[SearchUIConstants.Country] = item;
					$scope.filters_added.push(item)
					$cookieStore.remove(SearchUIConstants.Country);
			}
			if($scope.filters_added.length > 0){
				$scope.$emit('reloadRecommendations');
			}
		}
	}

	_init = function(){
		$scope.website.searching = false;
		if(on_search_page){
			$scope.set_focus(3000);
		}
		_handle_search_page();
		_init_book_search();
		$scope.active_base = SearchUIConstants.BookSearch;
		_get_trends();

		$scope.$on('updateFilters', function(event, type, value){
			$scope.update_filters(type, value);
			event.preventDefault();
		});

		_add_init_filters();
	}
	
	var search_typing_timeout = "";
	var on_search_page = angular.isUndefined($routeParams.type);
	_init();
}]);