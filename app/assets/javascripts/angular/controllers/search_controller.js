websiteApp.controller('searchController', function($scope, $rootScope, websiteService, $timeout, $sce){
	_show_search_result = function(){
		$rootScope.show_book = true;
		$rootScope.book_x = 0;
		$rootScope.screen_x = 0;
		$rootScope.total_x = screen.width;
		var data = 1;
    	_get_book_details(data);
	}

	_handle_graph_search = function(selectedItem){
		$scope.website.searching = false;
			
	}

	$scope.handle_selection = function(selectedItem, graphOption) {
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
	};

	$scope.hide_search_page = function(type){
		var logged_in = $scope.logged;
		if(logged_in){
			$('body').css('white-space', 'nowrap');
			$scope.website.searching = false;
			$rootScope.$broadcast('initPage', type);
			$scope.loading = true;
			$timeout(function(){
				$scope.loading = false;
			}, 2000);
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
        		_init_search();
        	}
        	else{
				$scope.get_search_results(event);
        	}
        }
	}

	$scope.highlight = function(searchItem, textToSearchThrough){
		var html = '<span><i><b>$&</b></i></span>';
    	return $sce.trustAsHtml(textToSearchThrough.replace(new RegExp(searchItem, 'gi'), html));
	}

	_init_graph_search = function(){
		$scope.search_results = [{"name": "Friends who like a-book-category", "graph_option": true},
		{"name": "Friends who are reading author-name-or-a-book-name", "graph_option": true},
		{"name": "Friends who own a-book-name", "graph_option": true},
		{"name": "Friends who need a-book-name", "graph_option": true},
		{"name": "Friends who read a-book-name", "graph_option": true},
		{"name": "Friends who bookmarked a-book-name-or-author-name-or-a-reader-name", "graph_option": true},
		{"name": "Friends who follow an-author-name and a-friend-name", "graph_option": true},
		{"name": "Books recommended by a-friend-name-or-me", "graph_option": true},
		{"name": "Books by an-author-name", "graph_option": true},
		{"name": "Books published in a-year", "graph_option": true},
		{"name": "Books published today", "graph_option": true},
		{"name": "Books published between a-year and another-year", "graph_option": true},
		{"name": "Books published in country a-country-name", "graph_option": true},
		{"name": "Books tagged as a-tag", "graph_option": true},
		{"name": "Books I own", "graph_option": true},
		{"name": "Books I have read", "graph_option": true},
		{"name": "Books I have rated", "graph_option": true},
		{"name": "Books I have discussed", "graph_option": true},
		{"name": "Books discussed by a-friend-name-or-me", "graph_option": true},
		{"name": "Books reviewed by a-friend-name-or-me", "graph_option": true},
		{"name": "Books read by a-friend-name-or-me", "graph_option": true},
		{"name": "Books bookmarked by a-friend-name-or-me", "graph_option": true},
		{"name": "Authors bookmarked by a-friend-name-or-me", "graph_option": true},
		{"name": "Readers bookmarked by a-friend-name-or-me", "graph_option": true},
		{"name": "Books published this year", "graph_option": true},
		{"name": "Popular books", "graph_option": true},
		{"name": "Popular Recommendations", "graph_option": true},
		{"name": "Popular Bookmarks", "graph_option": true},
		{"name": "Popular Authors", "graph_option": true},
		{"name": "Popular Readers", "graph_option": true},
		{"name": "100 Books to read before you die", "graph_option": true},
		{"name": "100 Readers to meet before you die", "graph_option": true},
		{"name": "10 Authors to read before you die", "graph_option": true},
		{"name": "a-book-category Books", "graph_option": true},
		{"name": "Reviews on a-book-name", "graph_option": true},
		{"name": "Discussions on a-book-name", "graph_option": true},
		{"name": "Quotes from a-book-name", "graph_option": true},
		{"name": "Characters from a-book-name", "graph_option": true},
		{"name": "Movies based on a-book-name", "graph_option": true}]
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

	_handle_search_page = function(){
		$scope.search_initiated = false;
		$scope.search_display = "Searching reader's door...";
		$scope.search_type = "[ALL]";

		// $scope.search_tag.selected_result = true; // hides the list initially
		$scope.search_tag = {};
		$scope.search_tag.current = 0;
		$scope.search_tag.result_count = 5;
		$scope.website.searching = true;
		websiteService.get_background_image().then(function(data){
			$scope.search_style = {'background-image': 'url("'+data.url+'")'};
		});
	}

	_init = function(){
		_handle_search_page();
	}
	var search_typing_timeout = "";
	_init();
});