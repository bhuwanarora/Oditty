websiteApp.controller('searchController', function($scope, $rootScope, websiteService, $timeout, $sce, recommendationService){
	_show_search_result = function(){
		$rootScope.show_book = true;
		$rootScope.book_x = 0;
		$rootScope.screen_x = 0;
		$rootScope.total_x = screen.width;
		var data = 1;
    	_get_book_details(data);
	}

	_handle_graph_search = function(selectedItem){
		$scope.hide_search_page();
	}

	_search_by = function(type){
		if(!type){
			var type = $scope.search_type;
		}
		if(!$scope.search_level1){
			$scope.website.searching_level1 = true;
			$scope.search_level1 = true;
			if(type == "BOOK"){
				$scope.book_search = true;
				$scope.author_search = false;
				$scope.reader_search = false;
				$scope.search_tag.search_level1_placeholder = "Search Books...";
				_init_book_search();
			}
			else if(type == "AUTHOR"){
				$scope.author_search = true;
				$scope.reader_search = false;
				$scope.book_search = false;
				$scope.search_tag.search_level1_placeholder = "Search Authors...";
				_init_author_search();
			}
			else if(type == "READER"){
				$scope.reader_search = true;
				$scope.book_search = false;
				$scope.author_search = false;
				$scope.search_tag.search_level1_placeholder = "Search Readers...";
				_init_reader_search();
			}
		}
		else if($scope.search_level1){
			$scope.search_level2 = true;
			$scope.website.searching_level2 = true;
			$scope.search_results = [];
			if(type == "YEAR"){
				$scope.year_search = true;
				var search_placeholder = "by year...";
				recommendationService.get_time_groups().then(function(data){
					$scope.search_results = data.times;
				});
			}
			else if(type == "LIST"){
				$scope.list_search = true;	
				var search_placeholder = "by list...";
			}
			else if(type == "COUNTRY"){
				$scope.country_search = true;
				var search_placeholder = "by country...";
				recommendationService.get_countries().then(function(data){
					$scope.search_results = data.countries;
				});
			}
			else if(type == "GENRE"){
				$scope.genre_search = true;
				var search_placeholder = "by genre...";
			}
			else if(type == "AUTHOR"){
				$scope.author_search = true;
				var search_placeholder = "by author...";
			}
			else if(type == "TIME"){
				$scope.time_search = true;
				var search_placeholder = "by time...";
				recommendationService.get_read_times().then(function(data){
					$scope.search_results = data.read_times;
				});
			}
			else if(type == "GENDER"){
				$scope.gender_search = true;
				var search_placeholder = "by gender...";
				$scope.search_results = [
					{"name": "Male", "custom_option": true, "icon": "icon-male"},
					{"name": "Female", "custom_option": true, "icon": "icon-female"},
					{"name": "I don't care", "custom_option": true}
				];
			}
			else if(type == "AWARDS"){
				$scope.awards_search = true;
				var search_placeholder = "by awards...";	
			}

			if($scope.book_search){
				$scope.search_tag.search_level2_placeholder = "Search Books "+search_placeholder;
			}
			else if($scope.author_search){
				$scope.search_tag.search_level2_placeholder = "Search Authors "+search_placeholder;
			}
			else if($scope.reader_search){
				$scope.search_tag.search_level2_placeholder = "Search Readers "+search_placeholder;
			}
		}
	}

	$scope.handle_selection = function(item){
		var selectedItem = item.name;
		var graphOption = item.graph_option;
		var customOption = item.custom_option;
		var type = item.type;

		if(customOption){
			if(!$scope.search_level1){
				$scope.search_type = type;
			}
			_search_by(type);
		}
		else{
		    $scope.search_tag.current = 0;
		    $scope.search_tag.selected_result = true;
		    if(graphOption){
		    	_handle_graph_search(selectedItem);
		    }
		    else{
		    	_show_search_result();
		    }
		    event.stopPropagation();
			$scope.search_tag.input = "";
		}
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

	$scope.navigate_options = function(){
		var keyEnter = event.keyCode == 13;
		if(keyEnter){
			$scope.handle_selection($scope.search_tag.currentItem);
		}
	}

	$scope.key_up = function(){
		var keyUp = event.keyCode == 38;
		var keyDown = event.keyCode == 40;
		if(keyUp){
			if($scope.search_tag.current != 0){
				$scope.set_current($scope.search_tag.current-1);
			}
		}

		if(keyDown){
			if($scope.search_tag.current != $scope.search_results.length -1){
				$scope.set_current($scope.search_tag.current+1);
			}
		}
	}

	$scope.key_down = function(event){
		// $scope.search_tag.selected_result = false;
        var backspace_or_delete = (event.keyCode == 8) || (event.keyCode == 46);
        if(backspace_or_delete){
        	var currentValue = _get_search_input();
        	if(currentValue.length <= 1){
        		if(currentValue.length < 1 && $scope.search_level1 && !$scope.search_level2){
        			$scope.clear_search_level1_var();
        			event.preventDefault();
        		}
        		else if(currentValue.length < 1 && $scope.search_level2){
        			$scope.clear_search_level2_var();
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
	}

	$scope.clear_search_level1_var = function(){
		$scope.clear_search_level2_var();
		$scope.search_level1 = false;
		$scope.book_search = false;
		$scope.author_search = false;
		$scope.reader_search = false;
		$scope.website.searching_level1 = false;
		_init_graph_search();
	}

	$scope.clear_search_level2_var = function(){
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
		$scope.website.searching_level2 = false;
		_search_by();
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
		if(!$scope.search_level1){
			$scope.search_results = [
				{
					"name": "Search a Book", 
					"icon": "icon-book", 
					"custom_option": true, 
					"type": "BOOK",
					"graph_option": true
				},
				{
					"name": "Search an Author", 
					"icon": "icon-pen", 
					"custom_option": true, 
					"type": "AUTHOR",
					"graph_option": true
				},
				{
					"name": "Search a Reader", 
					"icon": "icon-users", 
					"custom_option": true, 
					"type": "READER",
					"graph_option": true
				}];
		}
		else{
			$scope.search_level1 = false;
			_search_by();
		}
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
		$scope.search_results = [
			{"name": "Find Books by Era", "custom_option": true, "type": "YEAR", "icon":"icon-calendar"},
			{"name": "Find Books by Reading Time", "custom_option": true, "type": "TIME", "icon": "icon-clock"},
			{"name": "Find Books by Author's Region", "custom_option": true, "type": "COUNTRY", "icon": "icon-earth"},
			{"name": "Find Books by Genre", "custom_option": true, "type": "GENRE", "icon": "icon-shapes"},
			{"name": "Get popular lists of Books", "custom_option": true, "type": "LIST", "icon": "icon-list"},
			{"name": "Get Books by Author", "custom_option": true, "type": "AUTHOR", "icon": "icon-pen"}
		]
	}

	_init_author_search = function(){
		// $scope.search_results = [
		// 	{"name": "10 Authors to read before you die", "graph_option": true},
		// 	{"name": "Authors bookmarked by a-friend-name-or-me", "graph_option": true},
		// 	{"name": "Popular Authors", "graph_option": true}
		// ];

		$scope.search_results = [
			{"name": "Find Authors by Era", "custom_option": true, "type": "YEAR", "icon": "icon-clock"},
			{"name": "Find Authors by Region", "custom_option": true, "type": "COUNTRY", "icon": "icon-earth"},
			{"name": "Find Authors by Awards", "custom_option": true, "type": "AWARDS", "icon": "icon-trophy"},
			{"name": "Find Authors by Genre", "custom_option": true, "type": "GENRE", "icon": "icon-shapes"},
			{"name": "Get popular lists of Authors", "custom_option": true, "type": "LIST", "icon": "icon-list"}
		];
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
			{"name": "Find Readers by Region", "custom_option": true, "type": "COUNTRY", "icon": "icon-earth"},
			{"name": "Find Readers by their Taste", "custom_option": true, "type": "GENRE", "icon": "icon-shapes"},
			{"name": "Find Readers by Gender", "custom_option": true, "type": "GENDER", "icon": "icon-male icon-female"},
			{"name": "Get popular lists of Readers", "custom_option": true, "type": "LIST", "icon": "icon-list"}
		];
	}

	_init_search = function(){
		_init_graph_search();
		$scope.search_type = "[ALL]";
		$scope.search_display = "Searching reader's door...";
	}

	_handle_search_input = function(){
        var currentValue = _get_search_input();
        _init_graph_search();
        $scope.search_ready = true;
        var firstInput = currentValue.slice(0, 1);
        var customBookSearch = firstInput == "#";
		var customAuthorSearch = firstInput == "@";
		var customTagSearch = firstInput == "+";
        var customSearch = customAuthorSearch || customBookSearch || customTagSearch;
        var currentValueLength = currentValue.length;
        _set_custom_search(customAuthorSearch, customBookSearch, customTagSearch);
        if(customSearch){
			if(currentValue.length == 1){
				$scope.search_ready = false;
			}
        	currentValue = currentValue.substring(1, currentValue.length)
        }

    	if($scope.search_ready && currentValue != ""){
	        websiteService.search(currentValue, $scope.search_type, $scope.search_tag.result_count)
	        .then(function(result) {
	            $scope.search_results = $scope.search_results.concat(result.results);
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

	_get_search_input = function(){
		return $('#searchInput').val().trim();
	}

	_set_custom_search = function(customAuthorSearch, customBookSearch, customTagSearch){
		if(customAuthorSearch){
			$scope.search_type = "['AUTHOR', 'READER']";
			$scope.search_display = "Searching authors and readers..."
		}
		else if(customBookSearch){
			$scope.search_type = "['BOOK']";
			$scope.search_display = "Searching books..."
		}
		else if(customTagSearch){
			$scope.search_type = "['TAG']";
			$scope.search_display = "Searching book categories..."
		}
	}

	$scope.get_search_results = function(event){
		_init_graph_search();
		if($scope.search_initiated){
    		$timeout.cancel(search_typing_timeout);
		}
		else{
        	var firstInput = String.fromCharCode(event.keyCode);
        	var currentValue = _get_search_input();
        	if(currentValue && currentValue.length > 1){
        		var customBookSearch = currentValue.indexOf("#") == 0;
        		var customAuthorSearch = currentValue.indexOf("@") == 0;
        		var customTagSearch = currentValue.indexOf("+") == 0;
        	}
        	else{
        		var customBookSearch = firstInput == "#";
        		var customAuthorSearch = firstInput == "@";
        		var customTagSearch = firstInput == "+";
        	}
			$scope.search_initiated = true;
			_set_custom_search(customAuthorSearch, customBookSearch, customTagSearch);
		}
		search_typing_timeout = $timeout(function(){
			_handle_search_input();
		}, 500);
	}

	$scope.toggle_login_panel = function(){
		if($scope.show_login_form){
			$scope.show_login_form = false;
		}
		else{
			$scope.show_login_form = true;	
		}
	}

	_handle_search_page = function(){
		$scope.search_initiated = false;
		$scope.search_display = "Searching reader's door...";
		$scope.search_type = "[ALL]";
		$scope.show_login_form = false;

		// $scope.search_tag.selected_result = true; // hides the list initially
		$scope.search_tag = {};
		$scope.search_tag.search_placeholder = "Search...";
		$scope.search_tag.current = 0;
		$scope.search_tag.result_count = 5;
		$scope.website.searching = true;
		$scope.website.show_search_page = true;
		websiteService.get_background_image().then(function(data){
			$scope.search_style = {'background-image': 'url("'+data.url+'")'};
		});
		_init_graph_search();
	}

	_init = function(){
		_handle_search_page();
	}
	var search_typing_timeout = "";
	_init();
});