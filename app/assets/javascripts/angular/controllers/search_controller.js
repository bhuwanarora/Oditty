websiteApp.controller('searchController', function($scope, $rootScope, websiteService, $timeout){
	_show_search_result = function(){
		$rootScope.show_book = true;
		$rootScope.book_x = 0;
		$rootScope.screen_x = 0;
		$rootScope.total_x = screen.width;
		var data = 1;
    	_get_book_details(data);
	}

	$scope.handle_selection = function(selectedItem) {
	    $scope.search_tag.current = 0;
	    $scope.search_tag.selected_result = true;
	    _show_search_result();
	    event.stopPropagation();
		$scope.search_tag.input = "";
	};

	$scope.hide_search_page = function(){
		var logged_in = $scope.logged;
		if(logged_in){
			$('body').css('white-space', 'nowrap');
			$scope.website.searching = false;
			$scope.loading = true;
			$timeout(function(){
				$scope.loading = false;
			}, 2000);
		}
	}

	$scope.is_current = function(index) {
	    return $scope.search_tag.current == index;
	};

	$scope.set_current = function(index) {
	    $scope.search_tag.current = index;
	};

	$scope.navigate_options = function(){
		var keyEnter = event.keyCode == 13;
		if(keyEnter){
			$scope.handle_selection("NOT WORKING"+$scope.search_tag.current);
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
			$scope.set_current($scope.search_tag.current+1);
		}
	}

	$scope.key_down = function(event){
		// $scope.search_tag.selected_result = false;
        var backspace_or_delete = (event.keyCode == 8) || (event.keyCode == 46);
        if(backspace_or_delete){
        	var currentValue = _get_search_input();
        	console.error(currentValue.length <= 1);
        	if(currentValue.length <= 1){
        		_init_search();
        	}
        	else{
				$scope.get_search_results(event);
        	}
        }
	}

	_init_search = function(){
		$scope.search_results = [];
		$scope.search_type = "[ALL]";
		$scope.search_display = "Searching reader's door...";
	}

	_handle_search_input = function(){
        var currentValue = _get_search_input();
        $scope.search_results = [];
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
	        websiteService.search(currentValue, $scope.search_type).then(function(result) {
	            $scope.search_results = result.results;
				$scope.search_initiated = false;
				$timeout.cancel(search_typing_timeout);
	        });
    	}
    	else{
    		$scope.search_initiated = false;
			$scope.search_results = [];
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
		$scope.search_results = [];
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