websiteApp.controller('searchController', ['$scope', '$rootScope', 'websiteService', '$timeout', '$sce', 'recommendationService', '$routeParams', '$location', 'SearchUIConstants', 'WebsiteUIConstants', '$cookieStore', 'sharedService', 'widgetService', 'StatusUIConstants', function($scope, $rootScope, websiteService, $timeout, $sce, recommendationService, $routeParams, $location, SearchUIConstants, WebsiteUIConstants, $cookieStore, sharedService, widgetService, StatusUIConstants){
	$scope._update_filters = function(type, value){
		var item = $scope._get_option_json(type, value);
		if(type == SearchUIConstants.AuthorSearch){
			item = angular.extend(value, item);
		}
		if(angular.isUndefined($scope.filters_added)){
			$scope.filters_added = [];
		}
		$scope.add_filters(item);
	}

	$scope._get_option_json = function(type, value){
		var item = {"type": type, "custom_option": true};
		switch(type){
			case SearchUIConstants.Genre:
				var json = {"icon2": "icon-tag"};
				break;
			case SearchUIConstants.AuthorSearch:
				var json = {"icon2": "icon-pen"};
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
		return item;
	}

	$scope.get_notifications = function(trending, event){
  		$scope.$emit('getNotifications', trending);
  		// event.stopPropagation();
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
		$scope.shift_search_to_top();
		var key = $scope._detect_key(event);
		if(key.keyEnter){
			$scope.handle_selection_option($scope.search_tag.currentItem, event);
		}
		else{
			if(key.backspace_or_delete){
				var input = $scope.search_tag.custom_input;
			}
			else{
				var input = $scope.search_tag.custom_input + String.fromCharCode(event.keyCode);
			}

			$scope.search_results = [];
			if($scope.custom_search == SearchUIConstants.Genre){
				$scope._search_genres(input);
			}
			else if($scope.custom_search == SearchUIConstants.AuthorSearch){
				$scope._search_authors(input);
			}
		}
	}

	$scope.hide_popups = function(event){
		$rootScope.popups = {};
		$rootScope.user.interact = false;
		$rootScope.hide_options = true;
		$rootScope.user.show_share_box = false;
		// $scope.handle_base_selection();
		event.stopPropagation();
	}

	$scope._reset_results = function(){
		$scope.search_results = [];
		delete $scope.search_display;
	}

	$scope._search_genres = function(input){
		var params = "q="+input+"&count="+10;
		$scope.search_display = SearchUIConstants.SearchingGenres;
		$scope._reset_results();
		websiteService.search_genres(params).then(function(data){
			if(data.length > 0){
				angular.forEach(data, function(value){
					var json = $scope._get_option_json(SearchUIConstants.Genre);
					json = angular.extend(json, {"name": value[0], "id": value[1]});
					this.push(json);
				}, $scope.search_results);
			}
			else{
				$scope.search_display = SearchUIConstants.NoResultsFound;
			}
	    });
	}

	$scope._search_authors = function(input){
		$scope.search_display = SearchUIConstants.SearchingAuthor;
		$scope._reset_results();
		websiteService.search_authors("q="+input).then(function(data){
			if(data.length > 0){
				$scope.search_results = [];
				delete $scope.search_display;
				angular.forEach(data, function(value){
					var json = $scope._get_option_json(SearchUIConstants.AuthorSearch);
					json = angular.extend(json, {"name": value[0], "id": value[1]});
					this.push(json);
				}, $scope.search_results);
			}
			else{
				$scope.search_display = SearchUIConstants.NoResultsFound;
			}
	    });
	}

	$scope.reset_secondary_input_focus = function(){
		var timeout_event = $timeout(function(){
			$scope.website.searching_custom = false;
		}, 200);
		$scope.$on('destroy', function(){
			$timeout.cancel(timeout_event);
		});
	}

	$scope._find_next_option = function(selected_filter_types, type){
		var parent_found = false;
		var next_link_executed = false;
		angular.forEach($scope.base_book_options, function(item){
			filter_already_selected = false;
			if(parent_found && selected_filter_types.indexOf(item.type) < 0){
				if(on_search_page && ($scope.base_book_options.length == $scope.filters_added.length)){
					$scope.show_books();
				}
				$scope.handle_selection_option(item, event);
				next_link_executed = true;
				parent_found = false;
			}
			else if(item.type == type && !next_link_executed){
				parent_found = true;
			}
		});
		return next_link_executed;	
	}

	$scope._handle_next_link_not_executed = function(selected_filter_types, event){
		var all_filters_not_selected = $scope.base_book_options.length > $scope.filters_added.length;
		if(all_filters_not_selected){
			var first_filter_not_selected = "";
			angular.forEach($scope.base_book_options, function(item){
				if(selected_filter_types.indexOf(item.type) < 0 && first_filter_not_selected == ""){
					first_filter_not_selected = item;
				}
			});
			$scope.handle_selection_option(first_filter_not_selected, event);
		}
		else{
			$scope.show_books();
		}
	}

	$scope.select_next_option = function(type){
		if($scope.active_base == SearchUIConstants.BookSearch){
			var selected_filter_types = [];
			angular.forEach($scope.filters_added, function(filter_added){
				selected_filter_types.push(filter_added.type);
			}, selected_filter_types);
			var next_link_executed = $scope._find_next_option(selected_filter_types, type);

			if(on_search_page){
				if(!next_link_executed){
					$scope._handle_next_link_not_executed(selected_filter_types, event);
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

	$scope.handle_search_request = function(event){
		if(on_search_page){
			$scope.show_books();			
		}
		else{
			$scope.handle_options(event);
		}
	}

	$scope.show_books = function(){
		$location.path("/user/"+$rootScope.user.id+"/recommendations/books");
	}

	$scope._handle_year_selection = function(){
		$scope.custom_input_placeholder = SearchUIConstants.YearPlaceholder;
		if($rootScope.time_groups){
			$scope.search_results = [];
			if(!$scope._filters_added()){
				$scope._add_years();
			}
			else{
				$scope.search_results = $rootScope.time_groups;
			}
		}
		else{
			recommendationService.get_time_groups().then(function(data){
				$scope.search_results = [];
				$rootScope.time_groups = [];
				data = data["times"];
				angular.forEach(data, function(value){
					var time_data = value[0]["data"];
		    		var name = time_data["name"];
		    		var json = $scope._get_option_json(SearchUIConstants.Year);
					json = angular.extend(json, {"name": name, "label": time_data["range"]});
					this.push(json);
				}, $rootScope.time_groups);
				$scope._add_years();
			});
		}
	}

	$scope._filters_added = function(){
		return angular.isDefined($scope.filters_added) && $scope.filters_added.length > 0;
	}

	$scope._handle_list_selection = function(){
		if($rootScope.book_lists){
			$scope.search_results = [];
			if(!$scope._filters_added()){
				var results_timeout_event = $timeout(function(){
					$scope.search_results = $rootScope.book_lists;
				}, 200);
				$scope.$on('destroy', function(){
					$timeout.cancel(results_timeout_event);
				});
			}
			else{
				$scope.search_results = $rootScope.book_lists;
			}
		}
		else{
			recommendationService.get_book_lists().then(function(data){
				$scope.search_results = [];
				angular.forEach(data, function(value){
		    		var json = $scope._get_option_json(SearchUIConstants.List);
					json = angular.extend(json, {"name": value[1], "id": value[0]});
					this.push(json);
				}, $scope.search_results);
				$rootScope.book_lists = $scope.search_results;
			});
		}
	}

	$scope._handle_country_selection = function(){
		$scope.custom_input_placeholder = SearchUIConstants.CountryPlaceholder;
		if($rootScope.regions){
			$scope.search_results = [];
			if(!$scope._filters_added()){
				$scope._add_countries();
			}
			else{
				$scope.search_results = $rootScope.regions;
			}
		}
		else{
			recommendationService.get_countries().then(function(data){
				$scope.search_results = [];
				$rootScope.regions = [];

				angular.forEach(data.countries, function(value){
					var json = $scope._get_option_json(SearchUIConstants.Country);
					json = angular.extend(value, json);
					this.push(json);
				}, $rootScope.regions);

				$scope._add_countries();
			});
		}
	}

	$scope._handle_genre_selection = function(){
		$scope.custom_input_placeholder = SearchUIConstants.GenrePlaceholder;
		$scope.custom_search = SearchUIConstants.Genre;
		$scope.search_tag.result_count = 50;
		if(angular.isDefined($rootScope.genres)){
			$scope.search_results = [];
			if(!$scope._filters_added()){
				$scope._add_genres();
			}
			else{
				$scope.search_results = $rootScope.genres;
			}
		}
		else{
			var params = "q=''&count="+10;
			websiteService.search_genres(params).then(function(data){
				$scope.search_results = [];
				$rootScope.genres = [];

				angular.forEach(data, function(value){
					var cookie_filter = $cookieStore.get(SearchUIConstants.Genre);
					var add_genre = (angular.isDefined(cookie_filter) && cookie_filter.id != value[1]) || angular.isUndefined(cookie_filter);
					if(add_genre){
						var json = $scope._get_option_json(SearchUIConstants.Genre);
						json = angular.extend(json, {"name": value[0], "id": value[1], "icon": value[2]});
						this.push(json);
					}
				}, $rootScope.genres);
				$scope._add_genres();
		    });
		}
	}

	$scope._handle_author_selection = function(){
		$scope.custom_input_placeholder = SearchUIConstants.AuthorPlaceholder;
		$scope.custom_search = SearchUIConstants.AuthorSearch;
		var genre_filter_id = 0;
		if(angular.isDefined($scope.filters_added)){
			angular.forEach($scope.filters_added, function(item){
				if(item.type == SearchUIConstants.Genre){
					genre_filter_id = item.id;
				}
			});
		}
		if(angular.isUndefined($rootScope.authors)){
			$rootScope.authors = {};
		}

		var genre_changed = (genre_filter_id == 0 && 
									angular.isDefined($rootScope.authors.genre_filter_id)
							) || 
							(genre_filter_id != 0 && 
									(angular.isUndefined($rootScope.authors.genre_filter_id) || 
									 $rootScope.authors.genre_filter_id != genre_filter_id
									)
							);
		console.debug("genre_changed", genre_changed, genre_filter_id, $rootScope.authors.genre_filter_id);
		var reload_authors = angular.isDefined($rootScope.authors.data) && !genre_changed;
		if(reload_authors){
			$scope.search_results = [];
			if(!$scope._filters_added()){
				$scope._add_authors();
			}
			else{
				$scope.search_results = $rootScope.authors.data;
			}
		}
		else{
			websiteService.search_authors("genre_id="+genre_filter_id).then(function(data){
				if(genre_filter_id != 0){
					$rootScope.authors.genre_filter_id = genre_filter_id;
				}

				$scope.search_results = [];
				$rootScope.authors.data = [];

				angular.forEach(data, function(value){
					var cookie_filter = $cookieStore.get(SearchUIConstants.AuthorSearch);
					var add_author = (angular.isDefined(cookie_filter) && cookie_filter.id != value[1]) || angular.isUndefined(cookie_filter);
					if(add_author){
						var json = $scope._get_option_json(SearchUIConstants.AuthorSearch);
						json = angular.extend(json, {"name": value[0], "id": value[1]});
						this.push(json);
					}
				}, $rootScope.authors.data);

				$scope._add_authors();
		    });
		}		
	}

	$scope._handle_time_selection = function(){
		if($rootScope.read_times){
			$scope.search_results = [];
			if(!$scope._filters_added()){
				$scope._add_read_times();
			}
			else{
				$scope.search_results = $rootScope.read_times;
			}
		}
		else{
			recommendationService.get_read_times().then(function(data){
				$scope.search_results = [];
				$rootScope.read_times = [];

				angular.forEach(data["read_times"], function(value){
		    		var time_data = value[0]["data"];
		    		var name = time_data["name"];
		    		var tag = time_data["type"];
		    		var json = $scope._get_option_json(SearchUIConstants.Time);
					json = angular.extend(json, {"name": name, "tag": tag});
					this.push(json);
				}, $rootScope.read_times);
				
				$scope._add_read_times();
			});
		}
	}

	$scope.handle_selection_option = function(item, event){
		$scope.shift_search_to_top();
		$scope._set_base_selection();
		$scope.search_tag.result_count = 10;
		console.debug("handle_selection_option", item, $scope.active_base);
		if(item.level1_option){
			if($scope.active_base == SearchUIConstants.BookSearch){
				$scope.show_compressed_base = true;
				$scope.active_nest = item.name;
				$scope.hide_input_field = true;
				$scope.show_secondary_input = true;
				$scope.search_tag.custom_input = "";
				$scope.website.searching_custom = true;
				$scope.search_results = [];

				delete $scope.custom_search;
				delete $scope.search_display;
        		$scope.remove_active_state();

				switch(item.type){
					case SearchUIConstants.Year:
						$scope._handle_year_selection();
						break;
					case SearchUIConstants.List:
						$scope._handle_list_selection();
						break;
					case SearchUIConstants.Country:
						$scope._handle_country_selection();
						break;
					case SearchUIConstants.Genre:
						$scope._handle_genre_selection();
						break;
					case SearchUIConstants.AuthorSearch:
						$scope._handle_author_selection();
						break;
					case SearchUIConstants.Time:
						$scope.custom_input_placeholder = SearchUIConstants.TimePlaceholder;
						$scope._handle_time_selection();
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
				$scope.reset_secondary_input_focus();
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

	$scope._add_authors = function(){
		var results_timeout_event = $timeout(function(){
			$scope.search_results = $rootScope.authors.data;
		}, 200);
		$scope._destroy_timeout(results_timeout_event);
	}

	$scope._add_genres = function(){
		var results_timeout_event = $timeout(function(){
			$scope.search_results = $rootScope.genres;
		}, 200);
		$scope._destroy_timeout(results_timeout_event);
	}

	$scope._add_read_times = function(){
		var results_timeout_event = $timeout(function(){
			$scope.search_results = $rootScope.read_times;
		}, 200);
		$scope._destroy_timeout(results_timeout_event);
	}

	$scope._add_countries = function(){
		var results_timeout_event = $timeout(function(){
			$scope.search_results = $rootScope.regions;
		}, 200);
		$scope._destroy_timeout(results_timeout_event);
	}

	$scope._add_years = function(){
		var results_timeout_event = $timeout(function(){
			$scope.search_results = $rootScope.time_groups;
		}, 200);
		$scope._destroy_timeout(results_timeout_event);
	}

	$scope._destroy_timeout = function(timeout_event){
		$scope.$on('destroy', function(){
			$timeout.cancel(timeout_event);
		});	
	}

	$scope._set_active_type = function(type){
		angular.forEach($scope.base_book_options, function(item){
			if(item.type == type){
				item.active = true;
			}
		});
	}

	$scope._remove_active_type = function(type){
		angular.forEach($scope.base_book_options, function(item){
			if(item.type == type){
				delete item.active;
			}
		});
	}

	$scope.add_filters = function(item){
		console.debug("add_filters", item);
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

		$scope._set_active_type(item.type);
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
				$rootScope.hide_options = true;
				break;
			case SearchUIConstants.ReaderSearch:
				$location.path("/reader/"+item.id+"/profile");
				break;
			case SearchUIConstants.TextSearch:
				$rootScope.hide_options = true;
				break;
			default:
				break;
		}
		var custom_filters_added = item.type != SearchUIConstants.BookSearch;
		if(on_search_page){
			if(angular.isDefined(item.type)){
				$cookieStore.put(item.type, item);
				if(item.type == SearchUIConstants.BookSearch || item.type == SearchUIConstants.TextSearch){
					$scope.handle_search_request();
				}
				$scope.show_books();
			}
		}
		else if(on_custom_page){
			$cookieStore.put(item.type, item);
			$scope.show_books();
		}
		else{
			if(custom_filters_added && angular.isDefined(item.type)){
				$scope._reset_recommendations();
				$rootScope.filters.other_filters[item.type] = data;
				$cookieStore.put(item.type, item);
			}
			else{
				$scope._set_filter_for_book_search(item);
			}
			$scope.$emit('reloadRecommendations');
		}
		if(custom_filters_added){
			$scope.filters_added.splice(0, 0, item);
			$scope.search_results.splice($scope.search_results.indexOf(item), 1);
			$scope.select_next_option(item.type);
		}
	}

	$scope._set_filter_for_book_search = function(item){
		if(angular.isDefined(item.show_all) && item.show_all){
			$scope._all_text_search_results(item);
		}
		else{
			$scope._reset_recommendations();
			$rootScope.filters.other_filters["id"] = item.id;
		}
	}

	$scope._reset_recommendations = function(){
		if(angular.isUndefined($rootScope.filters)){
			$rootScope.filters = {"other_filters": {}};
		}
		$scope._reset_text_search();
	}

	$scope._reset_text_search = function(){
		$rootScope.filters.other_filters = {};
		$rootScope.filters["reset_count"] = 0;
		$rootScope.filters["reset"] = true;
	}

	$scope._all_text_search_results = function(item){
		$scope._reset_recommendations();
		$rootScope.filters.other_filters["show_all"] = true;
		$rootScope.filters.other_filters["title"] = item.value;
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
			case SearchUIConstants.AuthorSearch:
				if(angular.isDefined($rootScope.authors) && angular.isDefined($rootScope.authors.data)){
					$rootScope.authors.data.splice(0, 0, item);
				}
				break;
			case SearchUIConstants.Genre:
				if(angular.isDefined($rootScope.genres)){
					if(angular.isDefined($rootScope.authors) && angular.isDefined($rootScope.authors.genre_filter_id)){
						delete $rootScope.authors.genre_filter_id;
					}
					$rootScope.genres.splice(0, 0, item);
				}
				break;
			case SearchUIConstants.Country:
				if(angular.isDefined($rootScope.regions)){
					$rootScope.regions.splice(0, 0, item);
				}
				break;
			case SearchUIConstants.BookSearch:
				$scope._clear_book_search_filters();
				break;
		}
		$cookieStore.remove(item.type);
		if(!on_search_page){
			delete $rootScope.filters.other_filters[item.type];
			$scope._reset_text_search();
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

		angular.forEach($scope.base_book_options, function(parent_item){
			if(parent_item.type == item.type){
				$scope.handle_selection_option(parent_item, event);
				if($scope.hide_options){
					$scope.hide_input_field = false;
				}
				delete parent_item.active;
			}
		});
		event.stopPropagation();
	}

	$scope.reset_filters = function(){
		if(angular.isDefined($scope.filters_added)){
			angular.forEach($scope.filters_added, function(item){
				$scope._reset_filter(item);
			});
			$scope.filters_added = [];
		}
		$scope._clear_book_search_filters();
	}

	$scope.set_base_search = function(){
		switch($scope.active_base){
			case SearchUIConstants.BookSearch:
				$scope._init_book_search();
				break;
			case SearchUIConstants.AuthorSearch:
				$scope._init_author_search();
				break;
			case SearchUIConstants.ReaderSearch:
				$scope._init_reader_search();
				break;
		}		
	}

	$scope.reset_base_selection = function(){
		$scope.search_tag.placeholder = SearchUIConstants.SearchPlaceholder;
		$scope.search_results = [];
		delete $scope.active_base;
		$cookieStore.remove('base_search');
	}

	$scope.handle_base_selection = function(item){
		$scope.hide_input_field = false;
		$scope.show_secondary_input = false;
		$scope.reset_filters();
		$scope.search_tag.input = "";
		delete $scope.search_display;
		console.debug("handle_base_selection ", item, $scope.active_base);
		if(angular.isUndefined(item)){
			$scope.set_base_search();
			$scope._clear_book_search_filters();
		}
		else if(angular.isDefined($scope.active_base) && $scope.active_base == item.type){
			$scope.reset_base_selection();
		}
		else{
			switch(item.name){
				case SearchUIConstants.BookSearchLink:
					$scope._init_book_search();
					break;
				case SearchUIConstants.AuthorSearchLink:
					$scope._init_author_search();
					break;
				case SearchUIConstants.ReaderSearchLink:
					$scope._init_reader_search();
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

	$scope.is_current = function(index, selectedItem){
		_set_input_field = function(){
			if(selectedItem.show_all){
				$scope.search_tag.input = selectedItem.value;
			}
			else if(selectedItem.type != SearchUIConstants.ComingSoon && !selectedItem.level1_option && !selectedItem.custom_option){
				$scope.search_tag.input = selectedItem.name;
			}
		}
		
		if($scope.search_tag.current == index){
			$scope.search_tag.currentItem = selectedItem;
			// _set_input_field();
		} 
	    return $scope.search_tag.current == index;
	};

	$scope.set_current = function(index) {
	    $scope.search_tag.current = index;
	};

	$scope._detect_key = function(event){
        var backspace_or_delete = (event.keyCode == WebsiteUIConstants.Backspace) || (event.keyCode == WebsiteUIConstants.Delete);
		var keyUp = event.keyCode == WebsiteUIConstants.KeyUp;
		var keyDown = event.keyCode == WebsiteUIConstants.KeyDown;
		var keyLeft = event.keyCode == WebsiteUIConstants.KeyLeft;
		var keyRight = event.keyCode == WebsiteUIConstants.KeyRight;
		var enter = event.keyCode == WebsiteUIConstants.Enter;
		return {"backspace_or_delete": backspace_or_delete, "keyUp": keyUp, "keyDown": keyDown, "keyLeft": keyLeft, "keyRight": keyRight, "keyEnter": enter};
	}

	$scope._handle_key_up = function(){
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

	$scope._handle_key_down = function(){
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

	$scope._handle_backspace_or_delete_in_custom_search = function(current_value){
		if(current_value.length <= 1){
			if($scope.custom_search == SearchUIConstants.Genre){
				$scope.search_results = $rootScope.genres;
			}
			else if($scope.custom_search == SearchUIConstants.AuthorSearch){
				$scope.search_results = $rootScope.authors.data;
			}
		}
		else{
			$scope.search_custom(event);
		}
	}

	$scope._handle_backspace_or_delete_in_main_search = function(current_value){
		if(current_value.length <= 1){
    		$scope.search_tag.input = "";
    		$scope.search_ready = false;
    		$scope.set_base_search();
			if(angular.isUndefined($scope.active_base)){
				$scope.search_type = SearchUIConstants.All;
			}
			var displaying_search_results = angular.isDefined($rootScope.filters.other_filters) && (angular.isDefined($rootScope.filters.other_filters.title) || angular.isDefined($rootScope.filters.other_filters.id)) && !on_search_page
			if(displaying_search_results){
				$scope._clear_book_search_filters();
	  			$scope.$emit('reloadRecommendations');
			}
		}
    	else{
			$scope.get_search_results(event);
    	}
	}

	$scope._handle_backspace_or_delete = function(){
		var custom_search = angular.isDefined($scope.search_tag.custom_input);
    	if(custom_search){
    		var current_value = $scope.search_tag.custom_input.trim();
    	}
    	else{
    		var current_value = $scope.search_tag.input.trim();
    	}
    	console.debug("current_value, custom_search", current_value, custom_search);
    	
    	delete $scope.search_display;
    	$scope.remove_active_state();
    	if(custom_search){
    		$scope._handle_backspace_or_delete_in_custom_search(current_value);
    	}
    	else{
    		$scope._handle_backspace_or_delete_in_main_search(current_value);
        }
	}

	$scope.key_down = function(event){
		var key = $scope._detect_key(event);
		if(!on_search_page){
        	$scope.handle_options(event);
        }
		if(key.keyUp){
			$scope._handle_key_up();
		}
		else if(key.keyDown){
			$scope._handle_key_down();
		}
        else if(key.backspace_or_delete){
        	$scope._handle_backspace_or_delete();
        }
        else if(key.keyLeft || key.keyRight){
        	event.stopPropagation();
        }
        else if(key.keyEnter){
        	$scope._handle_enter(event);
        }
	}

	$scope._handle_enter = function(event){
		var searching_for_text = angular.isUndefined($scope.search_tag.currentItem);
		if(searching_for_text){
			var item = $scope._get_search_text_item();
			if(on_search_page){
				$cookieStore.put(item.type, item);
				$scope.handle_search_request();
			}
			else{
				console.debug("Full TextSearch");
				$scope._all_text_search_results(item);
				$scope.$emit('reloadRecommendations');
			}
		}
		else{
			$scope.handle_selection_option($scope.search_tag.currentItem, event);
		}
	}

	$scope._clear_book_search_filters = function(){
		if(angular.isDefined($rootScope.filters) && angular.isDefined($rootScope.filters.other_filters)){
			$rootScope.filters.other_filters = {};
		}
		delete $scope.search_tag.currentItem;
		$scope._clear_filter_cookies();
	}

	$scope.close_login_box = function(){
		$scope.show_login_form = false;
	}

	$scope.highlight = function(searchItem, textToSearchThrough){
		var html = '<span><i><b>$&</b></i></span>';
    	return $sce.trustAsHtml(textToSearchThrough.replace(new RegExp(searchItem, 'gi'), html));
	}

	$scope.remove_active_state = function(){
		delete $scope.search_tag.current;
	}

	$scope._init_graph_search = function(){
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

	$scope._init_book_search = function(){
		$scope.base_book_options = [
			{"name": SearchUIConstants.BookByGenreLink, 
				"level1_option": true, 
				"type": SearchUIConstants.Genre, 
				"icon":"icon-tag", 
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
			{"name": SearchUIConstants.BookByAuthorLink, 
				"level1_option": true, 
				"type": SearchUIConstants.AuthorSearch, 
				"icon":"icon-pen", 
				"icon2": "icon-book"}
			// {"name": SearchUIConstants.BookByRegionLink, 
			// 	"level1_option": true, 
			// 	"type": SearchUIConstants.Country, 
			// 	"icon": "icon-earth", 
			// 	"icon2": "icon-book"}
			// {"name": SearchUIConstants.BookListsLink, 
				// "level1_option": true, 
				// "type": SearchUIConstants.List, 
				// "icon": "icon-list", 
				// "icon2": "icon-book"}
		];
		$scope.search_results = $scope.base_book_options;
		// $scope.search_tag.placeholder = SearchUIConstants.BookSearchPlaceholder;
		if(on_search_page){
			$cookieStore.put('base_search', SearchUIConstants.BookSearchLink);
		}
	}

	$scope._init_author_search = function(){
		$scope.search_results = [
			{"name": SearchUIConstants.ComingSoon, "level1_option": true, "type": SearchUIConstants.ComingSoon, "icon2": "icon-pen"}
		];
		$scope.search_tag.placeholder = SearchUIConstants.AuthorSearchPlaceholder;
		if(on_search_page){
			$cookieStore.put('base_search', SearchUIConstants.AuthorSearchLink);
		}
	}

	$scope._init_reader_search = function(){
		$scope.search_results = [
			{"name": SearchUIConstants.ComingSoon, "level1_option": true, "type": SearchUIConstants.ComingSoon, "icon2": "icon-user22"}
		];
		$scope.search_tag.placeholder = SearchUIConstants.ReaderSearchPlaceholder;
		if(on_search_page){
			$cookieStore.put('base_search', SearchUIConstants.ReaderSearchLink);
		}
	}

	$scope._add_book_in_results = function(results){
		angular.forEach(results, function(value){
    		var json = {"name": value[0], "author_name": value[1], "id": value[2], "type": SearchUIConstants.BookSearch, "icon2":"icon-book"};
    		this.push(json);
    	}, $scope.search_results);
	}

	$scope._add_author_in_results = function(results){
		angular.forEach(results, function(value){
    		var json = {"name": value[0], "id": value[2], "type": SearchUIConstants.AuthorSearch, "icon2": "icon-pen"};
    		this.push(json);
    	}, $scope.search_results);
	}

	$scope._add_reader_in_results = function(results){
		angular.forEach(results, function(value){
    		var json = {"name": value[0], "id": value[2], "type": SearchUIConstants.ReaderSearch, "icon2": "icon-users"};
    		this.push(json);
    	}, $scope.search_results);	
	}

	$scope._add_mixed_type_results = function(results){
		angular.forEach(results, function(value){
			if(value[3].indexOf(SearchUIConstants.BookLabel) >= 0){
    			var json = {"name": value[0], "author_name": value[1], "id": value[2], "type": SearchUIConstants.BookSearch, "label": SearchUIConstants.BookSearch};
			}
			else if(value[3].indexOf(SearchUIConstants.AuthorLabel) >= 0){
				var json = {"name": value[0], "id": value[2], "type": SearchUIConstants.AuthorSearch, "label": SearchUIConstants.AuthorSearch};
			}
			else if(value[3].indexOf(SearchUIConstants.ReaderLabel) >= 0){
				var json = {"name": value[0], "id": value[2], "type": SearchUIConstants.ReaderSearch, "label": SearchUIConstants.ReaderSearch};
			}
    		this.push(json);
    	}, $scope.search_results);
	}


	$scope._handle_search_input = function(event){
        var currentValue = $scope.search_tag.input.trim();
        $scope.search_ready = true;

        if(angular.isUndefined($scope.active_base)){
	        var firstInput 			= currentValue.slice(0, 1);
	        var customBookSearch 	= firstInput == SearchUIConstants.Hash;
			var customAuthorSearch 	= firstInput == SearchUIConstants.AtTheRate;
			var customTagSearch 	= firstInput == SearchUIConstants.Plus;
	        var customSearch 		= customAuthorSearch || customBookSearch || customTagSearch;
        	if(currentValue.length > 0){
        		$scope._set_custom_search(customAuthorSearch, customBookSearch, customTagSearch);
        	}
        }
        else{
        	if(currentValue.length > 0){
        		$scope._set_custom_search();
        	}
        }

        if(customSearch){
			if(currentValue.length == 1){
				$scope.search_ready = false;
			}
        	currentValue = currentValue.substring(1, currentValue.length);
        }

        console.debug("$scope._handle_search_input", currentValue, $scope.search_type, $scope.search_tag.result_count);
    	if($scope.search_ready && currentValue != ""){
    		if(currentValue.length < 3){
    			$scope.search_display = SearchUIConstants.TypeMore;
    		}
    		else{
				$scope.search_type = SearchUIConstants.SearchAll;
		        websiteService.search(currentValue, $scope.search_type, $scope.search_tag.result_count)
		        .then(function(result){
		        	if($scope.search_ready){
		        		$scope.search_results = [];
			        	var results = result.results.data;
			        	$scope._add_mixed_type_results(results);
			        	// if($scope.active_base == SearchUIConstants.BookSearch){
			        	// 	$scope._add_book_in_results(results);
			        	// }
			        	// else if($scope.active_base == SearchUIConstants.AuthorSearch){
			        	// 	$scope._add_author_in_results(results);
			        	// }
			        	// else if($scope.active_base == SearchUIConstants.ReaderSearch){
			        	// 	$scope._add_reader_in_results(results);
			        	// }
			        	// else{
			        	// }

			        	if($scope.search_results.length == $scope.search_tag.result_count){
				        	var show_all = $scope._get_search_text_item();
							$scope.search_results.push(show_all);
							delete $scope.search_display;
			        	}
			        	else if($scope.search_results.length != 0){
			        		delete $scope.search_display;
			        	}
			        	else{
			        		$scope.search_display = SearchUIConstants.NoResultsFound;
			        	}
						$scope.search_initiated = false;
		        	}
					// $timeout.cancel(search_typing_timeout);
		        });
    		}
    	}
    	else{
    		$scope.search_initiated = false;
    		$scope.set_base_search();
			// $timeout.cancel(search_typing_timeout);
    	}
	}

	$scope._get_search_text_item = function(){
		return {"name": "<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+$scope.search_tag.input+"</em>'</span>", "show_all": true, "value":$scope.search_tag.input, "type": SearchUIConstants.TextSearch};
	}

	$scope._set_custom_search = function(customAuthorSearch, customBookSearch, customUserSearch, customTagSearch){
		$scope.search_results = [];
		if(angular.isUndefined(customAuthorSearch)){
			if($scope.active_base == SearchUIConstants.AuthorSearch){
				customAuthorSearch = true;
			}
			else if($scope.active_base == SearchUIConstants.BookSearch){
				customBookSearch = true;
			}
			else if($scope.active_base == SearchUIConstants.ReaderSearch){
				customUserSearch = true;
			}
		}
		// console.debug("$scope._set_custom_search", customAuthorSearch, customBookSearch, customUserSearch, customTagSearch);
		// if(customAuthorSearch){
		// 	$scope.search_type = SearchUIConstants.AuthorSearch;
		// 	$scope.search_display = SearchUIConstants.SearchingAuthorsAndReaders;
		// }
		// else if(customBookSearch){
		// 	$scope.search_type = SearchUIConstants.BookSearch;
		// 	$scope.search_display = SearchUIConstants.SearchingBooks;
		// }
		// else if(customUserSearch){
		// 	$scope.search_type = SearchUIConstants.ReaderSearch;
		// 	$scope.search_display = SearchUIConstants.SearchingUsers;
		// }
		// else if(customTagSearch){
		// 	$scope.search_type = SearchUIConstants.TagSearch;
		// 	$scope.search_display = SearchUIConstants.SearchingTags;
		// }
		// else{
		// }
		$scope.search_type = SearchUIConstants.SearchAll;
		$scope.search_display = SearchUIConstants.SearchingWebsite;
	}

	$scope.get_search_results = function(event){
		var time_delay = 350;
		console.debug("get_search_results", $scope.search_initiated, String.fromCharCode(event.keyCode));
		$scope.search_results = [];
		$scope.shift_search_to_top();

		if($scope.search_initiated){
    		$timeout.cancel(search_typing_timeout);
    		search_typing_timeout = $timeout(function(){
    			console.debug("get_search_results search_typing_timeout");
				$scope._handle_search_input(event);
			}, time_delay);
		}
		else{
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
			console.debug("$scope._set_custom_search get_search_results");
			search_typing_timeout = $timeout(function(){
				$scope._handle_search_input(event);
			}, time_delay);
		}
	}

	// $scope.toggle_login_panel = function(){
	// 	if($scope.show_login_form){
	// 		$scope.show_login_form = false;
	// 	}
	// 	else{
	// 		$scope.show_login_form = true;	
	// 	}
	// }

	$scope.handle_options = function(event){
		event.stopPropagation();
		if(!on_search_page){
			if($rootScope.hide_options){
				$rootScope.user.collapsed_column = true;
				$rootScope.user.collapsed_filters = true;
				$rootScope.user.collapsed_friends = true;
				$rootScope.user.collapsed_trends = true;
				$rootScope.user.collapsed_lists = true;
				$rootScope.user.collapsed_left_column = true;
				$rootScope.user.interact = false;
				$rootScope.popups = {};
				$rootScope.popups.left_panel_width = {'width': WebsiteUIConstants.LeftPanelMinWidth};

				delete $rootScope.focused_book;
			}
		}
		if($rootScope.hide_options){
			if(angular.isUndefined($scope.search_tag.input) || $scope.search_tag.input.length == 0){
				$scope.hide_input_field = false;
				$scope._init_book_search();
			}
			$scope.show_secondary_input = false;
			$rootScope.hide_options = false;
			
			delete $scope.active_nest;
			delete $scope.active_base;
			delete $scope.search_tag.custom_input;
			$scope.active_base = SearchUIConstants.BookSearch;
		}
		$scope._set_base_selection();
		console.debug("ISSUE", $scope.search_results.length > 0, $scope.search_results == $scope.base_book_options, !$rootScope.hide_options);
	}

	$scope._set_base_selection = function(){
		if(angular.isUndefined($scope.active_base)){
			$scope.handle_base_selection($scope.base_search_options[0]);
		}
	}

	$scope.shift_search_to_top = function(){
		if(on_search_page){
			// $scope.trending_panel_style = {"max-height": "26vh"};
			$scope.search_panel_style = {"bottom": "84%"};
		}
	}

	$scope.reset_search_bar = function(event){
		$rootScope.hide_options = true;
		$scope.hide_input_field = false;
		delete $rootScope.user.faded_wrapper;
		event.stopPropagation();
	}

	$scope._handle_search_page = function(){
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
		$scope.search_tag.result_count = 10;
		$scope._init_graph_search();
		if(on_search_page){
			$scope._set_cover_photo();
			if($rootScope.user.logged){
				$scope.set_focus(3000);
			}
			$scope._set_base_search();
			$scope._add_trends_as_notifications();
		}

		$rootScope.hide_options = true;
		// if($routeParams.type){
		// }
		// else{
		// 	$rootScope.hide_options = false;
		// }
	}

	$scope._set_cover_photo = function(){
		websiteService.get_background_image().then(function(data){
			var url = WebsiteUIConstants.CoverPhotoCDN+data+".jpg";
			$scope.search_style = {'background-image': 'url("'+url+'")'};
			$cookieStore.put('coverImage', url);
		});
	}

	$scope._add_trends_as_notifications = function(){
		if(angular.isUndefined($rootScope.trending_feed) || $rootScope.trending_feed.length == 0){
			sharedService.get_trends();
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

	$scope._init_genre_filter = function(){
		var item = $cookieStore.get(SearchUIConstants.Genre);
		if(angular.isDefined(item)){
			if(!on_search_page){
				if(angular.isUndefined($rootScope.filters)){
					$rootScope.filters = {"other_filters": {}};
				}
				$rootScope.filters.other_filters[SearchUIConstants.Genre] = item.id;
			}
			$scope._set_active_type(item.type);
			$scope.filters_added.push(item);
		}
	}

	$scope._init_author_filter = function(){
		var item = $cookieStore.get(SearchUIConstants.AuthorSearch);
		if(angular.isDefined(item)){
			if(!on_search_page){
				if(angular.isUndefined($rootScope.filters)){
					$rootScope.filters = {"other_filters": {}};
				}
				$rootScope.filters.other_filters[SearchUIConstants.AuthorSearch] = item.id;
			}
			$scope._set_active_type(item.type);
			$scope.filters_added.push(item);
		}
	}

	$scope._init_time_filter = function(){
		var item = $cookieStore.get(SearchUIConstants.Time);
		if(angular.isDefined(item)){
			if(!on_search_page){
				if(angular.isUndefined($rootScope.filters)){
					$rootScope.filters = {"other_filters": {}};
				}
				$rootScope.filters.other_filters[SearchUIConstants.Time] = item.tag;
			}
			$scope._set_active_type(item.type);
			$scope.filters_added.push(item);
		}
	}

	$scope._init_year_filter = function(){
		var item = $cookieStore.get(SearchUIConstants.Year);
		if(angular.isDefined(item)){
			if(!on_search_page){
				if(angular.isUndefined($rootScope.filters)){
					$rootScope.filters = {"other_filters": {}};
				}
				$rootScope.filters.other_filters[SearchUIConstants.Year] = item.name;
			}
			$scope._set_active_type(item.type);
			$scope.filters_added.push(item);
		}
	}

	$scope._init_country_filter = function(){
		var item = $cookieStore.get(SearchUIConstants.Country);
		if(angular.isDefined(item)){
			if(!on_search_page){
				if(angular.isUndefined($rootScope.filters)){
					$rootScope.filters = {"other_filters": {}};
				}
				$rootScope.filters.other_filters[SearchUIConstants.Country] = item.name;
			}
			$scope._set_active_type(item.type);
			$scope.filters_added.push(item);
		}
	}

	$scope._init_book_filter = function(){
		var item = $cookieStore.get(SearchUIConstants.BookSearch);
		if(angular.isDefined(item)){
			if(!on_search_page){
				$scope._set_filter_for_book_search(item);
				$scope._set_active_type(item.type);
				$scope.filters_added.push(item);
			}
			else{
				$cookieStore.remove(SearchUIConstants.BookSearch);
			}
		}
	}

	$scope._init_text_filter = function(){
		var item = $cookieStore.get(SearchUIConstants.TextSearch);
		if(angular.isDefined(item)){
			if(!on_search_page){
				$scope._set_filter_for_book_search(item);
				$scope.filters_added.push(item);
			}
			else{
				$cookieStore.remove(SearchUIConstants.TextSearch);
			}
		}
	}

	$scope._add_init_filters = function(){
		if(angular.isUndefined($scope.filters_added)){
			$scope.filters_added = [];
		}

		$scope._init_genre_filter();
		$scope._init_author_filter();
		$scope._init_time_filter();
		$scope._init_year_filter();
		$scope._init_country_filter();
		$scope._init_book_filter();
		$scope._init_text_filter();

		$scope.hide_input_field = false;

		if(!on_search_page){
			$scope.$emit('reloadRecommendations');
		}
	}

	$scope._clear_filter_cookies = function(){
		$cookieStore.remove(SearchUIConstants.Genre);
		$cookieStore.remove(SearchUIConstants.AuthorSearch);
		$cookieStore.remove(SearchUIConstants.Time);
		$cookieStore.remove(SearchUIConstants.Year);
		$cookieStore.remove(SearchUIConstants.Country);
		$cookieStore.remove(SearchUIConstants.BookSearch);
	}

	$scope._get_ten_random_books = function(){
		recommendationService.get_random_books().then(function(data){
			$scope.random_books = [];
			angular.forEach(data, function(value){
				var json = {"id": value[0], "isbn": value[1]};
				this.push(json);
			}, $scope.random_books);
		    var min_width = window_width/(data.length + 2);
		    var max_width = window_width/(data.length - 2);
		    var width_occupied = 0;
		    for(var i=0; i<data.length; i++){
		        var random_width = Math.random() * (max_width - min_width) + min_width;
		        if(random_width > window_width - width_occupied){
		            random_width = window_width - width_occupied;
		        }
		        $scope.random_books[i] = angular.extend($scope.random_books[i], {"width": random_width, "left": width_occupied});
		        width_occupied = width_occupied + random_width + 5;
		    }
		});
    }

    $scope.set_book_width = function(book){
    	return {"width": book.width+"px", "left": book.left+"px"};
    }

    $scope.increase_height = function(event){
    	if(on_search_page){
    		$scope.trending_panel_style = {"max-height": "60vh"};
    		$scope.search_panel_style = {"bottom": "100px"};
    	}
    }

    $scope._set_base_search = function(){
		$scope._init_book_search();
		// switch($cookieStore.get('base_search')){
		// 	case SearchUIConstants.BookSearchLink:
		// 		$scope.active_base = SearchUIConstants.BookSearch;
		// 		break;
		// 	case SearchUIConstants.AuthorSearchLink:
		// 		$scope._init_author_search();
		// 		$scope.active_base = SearchUIConstants.AuthorSearch;
		// 		break;
		// 	case SearchUIConstants.ReaderSearchLink:
		// 		$scope._init_reader_search();
		// 		$scope.active_base = SearchUIConstants.ReaderSearch;
		// 		break;
		// 	default:
		// 		break;
		// }
		$scope.search_tag.placeholder = SearchUIConstants.SearchPlaceholder;
    }

    $scope._set_interaction_options = function(){
    	if(angular.isUndefined($scope.interaction_options)){
    		$scope.interaction_options = [];
	    	angular.forEach(StatusUIConstants.EmotionConstants.value, function(value){
	    		this.push(value);
	    	}, $scope.interaction_options);
	    	
	    	angular.forEach(StatusUIConstants.OwnershipConstants.value, function(value){
	    		this.push(value);
	    	}, $scope.interaction_options);
    	}
    }

    $scope.show_interaction_box = function(option, event){
    	if(angular.isDefined($rootScope.user.option)){
    		delete $rootScope.user.option;
    		$rootScope.user.show_share_box = false;
    		$rootScope.user.interact = false;
    		var timeout_event = $timeout(function(){
    			$rootScope.user.option = option;
    			$rootScope.user.show_share_box = true;
    			$rootScope.user.interact = true;
    		}, 200);
    		$scope.$on('destroy', function(){
    			$timeout.cancel(timeout_event);
    		});
    	}
    	else{
    		$rootScope.user.option = option;
	    	$rootScope.user.show_share_box = true;
	    	$rootScope.user.interact = true;
    	}
    	event.stopPropagation();
    }

	$scope._init = function(){
		$scope.website.searching = false;
		$scope.filters_added = [];
		$scope._handle_search_page();
		if(!on_search_page){
			$scope._init_book_search();
			// $scope.active_base = SearchUIConstants.BookSearch;
		}
		

		$scope.$on('updateFilters', function(event, type, value){
			$scope._update_filters(type, value);
			event.preventDefault();
		});

		if(on_recommendation_page || on_search_page){
			$scope._add_init_filters();
		}
		else if(on_custom_page){
			$scope.$emit('reloadRecommendations');	
		}
		else{
			$scope._clear_filter_cookies();
		}
		$rootScope.book_lists = [];
		recommendationService.get_book_lists().then(function(data){
			angular.forEach(data, function(value){
	    		var json = $scope._get_option_json(SearchUIConstants.List);
				json = angular.extend(json, {"name": value[1], "id": value[0], "count": value[2], "book_isbns": value[3]});
				this.push(json);
			}, $rootScope.book_lists);
		});
		if(on_search_page){
			$rootScope.user.collapsed_left_column = false;
			$rootScope.user.collapsed_lists = false;
			$rootScope.user.collapsed_filters = false;
			$rootScope.user.collapsed_friends = false;
			delete $rootScope.user.main_header;
			delete $rootScope.user.main_header_background;
			var user_logged_in = $cookieStore.get('logged');
			if(user_logged_in){
				if(angular.isUndefined($rootScope.user.friends)){
					sharedService.set_friends();
				}
				sharedService.set_labels();
				sharedService.get_news_feed($scope);
			}
			$scope._set_interaction_options();
		}
		else{
			$rootScope.user.collapsed_left_column = true;
			$rootScope.user.collapsed_lists = true;
			$rootScope.user.collapsed_filters = true;
			$rootScope.user.collapsed_friends = true;
		}
		$scope.shift_search_to_top();
		var timeout_event = $timeout(function(){
			$scope.increase_height();
		}, 2300);
		$scope.$on('destroy', function(){
			$timeout.cancel(timeout_event);
		});
	}

	// $scope.search_tour_options = {
 //        steps:[
	//         {
	//             element: '#baseSearchTabs',
	//             intro: "TEST",
	//             position: 'bottom'
	//         }
 //        ],
 //        showStepNumbers: false,
 //        exitOnOverlayClick: true,
 //        exitOnEsc: true,
 //        nextLabel: '<strong>Next</strong>',
 //        prevLabel: '<span>Previous</span>',
 //        skipLabel: 'Exit',
 //        doneLabel: 'Thanks'
 //    };

	
	var search_typing_timeout = "";
	var on_search_page = angular.isUndefined($routeParams.type);
	var on_specific_list_page = angular.isDefined($routeParams.filter_id);
	var on_specific_shelf = angular.isDefined($routeParams.label_id);
	var on_grids_page = angular.isDefined($routeParams.grid_id);
	var on_trending_page = angular.isDefined($routeParams.trend_id);
	var on_custom_page = on_specific_list_page || on_grids_page || on_trending_page || on_specific_shelf;
	var on_recommendation_page = !(on_search_page || on_custom_page);

	$scope._init();
}]);