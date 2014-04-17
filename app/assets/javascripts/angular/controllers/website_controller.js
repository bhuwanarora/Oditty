websiteApp.controller('websiteAppController', function($scope, $rootScope, $interval, $http, 
	$timeout, $q, $window, websiteService, Facebook, $document, scroller){
	$scope.bindHorizontalScroll = function(event, delta, deltaX, deltaY){
		event.preventDefault();
		if(delta > 0){
			$scope.move_left(event);
	        // event.view.window.scrollBy(-80, 0);
		}
		else{
			$scope.move_right(event);
			_loadRecommendations();
			//move forward
			// event.view.window.scrollBy(80, 0);
		}
		event.stopPropagation();
	}

	$scope.move_left = function(event){
		if(event){
			if(event.type == "keydown" || event.type == "wheel"){
				var current_x = $window.pageXOffset;
			}
			else{
				var current_x = event.pageX - ($('.scroller').position().left + $('.scroller-left').position().left);
			}
		}
		else{
			var current_x = 0;	
		}
		var delta_x = $('.recommendation_block:first').width();
		scroller.scrollTo(current_x - delta_x, 0, 3000);
	}

	$scope.move_right = function(event){
		if(event){
			var pageX = event.pageX;
			var clientWidth = $document.width();
			if(event.type == "keydown" || event.type == "wheel"){
				var current_x = $window.pageXOffset;
				var lessThanOnePageLeft = current_x + (1.5)*screen.width > clientWidth;
			}
			else{
				var current_x = pageX - ($('.scroller').position().left+$('.scroller-right').position().left);
				var lessThanOnePageLeft = pageX + screen.width > clientWidth;
			}
		}
		else{
			var pageX = $('.scroller').position().left+$('.scroller-right').position().left;
			var lessThanOnePageLeft = pageX + screen.width > clientWidth;
		}
		if(lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations');
		}
		var delta_x = $('.recommendation_block:first').width();
		scroller.scrollTo(current_x + delta_x, 0, 3000);
	}

	$scope.scroll_one_page_right = function(event){
		$scope.dbl_clicked = true;
		var clientWidth = $document.width();
		var lessThanOnePageLeft = event.pageX + screen.width > clientWidth;
		if(lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations');
		}
		var current_x = event.pageX - screen.width/2;
		var delta_x = screen.width;
		scroller.scrollTo(current_x + delta_x, 0, 2000);
	}

	$scope.scroll_one_page_left = function(event){
		$scope.dbl_clicked = true;
		var current_x = event.pageX - screen.width/2;
		var delta_x = screen.width;
		scroller.scrollTo(current_x - delta_x, 0, 2000);
	}


	$scope.showFeebackForm = function(){
		// console.log("showFeebackForm")
	}

	_show_search_result = function(){
		$rootScope.show_book = true;
		$rootScope.book_x = 0;
		$rootScope.screen_x = 0;
		$rootScope.total_x = screen.width;
		var data = 1;
    	_get_book_details(data);
	}

	_profile_status_colors = function(){
		var profile_status = $scope.user.profile_status;
		if(profile_status == 0){
			$scope.user.profile_status_color = "#4374e0";
		}
		else if(profile_status == 1){
			$scope.user.profile_status_color = "#65b045";
		}
		else if(profile_status == 2){
			$scope.user.profile_status_color = "#d73d32";
		}
		else if(profile_status == 3){
			$scope.user.profile_status_color = "#11a9cc";
		}
		else if(profile_status == 4){
			$scope.user.profile_status_color = "#981b48";
		}
		else if(profile_status == 5){
			$scope.user.profile_status_color = "#7e3794";
		}
		else if(profile_status == 6){
			$scope.user.profile_status_color = "#4374e0";
		}
	}

	$scope.update_profile = function(){
		var enter_pressed = event.keyCode == 13;
		if(enter_pressed){
			var profile_status = $scope.user.profile_status;
			if(profile_status == 0){
				websiteService.update_profile($scope.user);
				$scope.user.profile_status = $scope.user.profile_status + 1;
				_profile_status_colors();
			}
		}
	}

	$scope.authenticate = function(){
		var data_json = $scope.user;
		websiteService.authenticate(data_json).then(function(data){
			if(data.message == "success"){
				$scope.logged = true;
				$scope.user.profile_status = data.profile_status;
				$scope.user.id = data.user_id;
				$scope.show_login_form = false;
				_profile_status_colors();
				websiteService.get_user_details().then(function(data){
		    		$scope.user.books = data["books"];
		    	});
				websiteService.get_notifications($scope.user).then(function(data){
					$scope.notifications = data.notifications;
				});
			}
			else{
				$scope.logged = false;	
			}
		});
	}

	_handle_info_card_bindings = function($scope){
		if($scope.user.profile_status == 3){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					$scope.user.latitude = latitude;
					$scope.user.longitude = longitude;
				});
			}
			else{
				x.innerHTML="Geolocation is not supported by this browser.";
			}
		}
		else if($scope.user.profile_status == 4){
			// $rootScope.$broadcast('showBookReadShelf');
		}
	}

	$scope.prev_profile_state = function(){
		if($scope.user.profile_status != 0){
			$scope.user.profile_status = $scope.user.profile_status - 1;
			_handle_info_card_bindings($scope);
			_profile_status_colors();
		}
	}

	$scope.next_profile_state = function(){
		if($scope.user.profile_status != 6){
			$scope.user.profile_status = $scope.user.profile_status + 1;
			_handle_info_card_bindings($scope);
			_profile_status_colors();
		}
	}

	$scope.search = function(){
		input_aimed_for_searching = event.currentTarget == event.srcElement;
		if(input_aimed_for_searching && !$rootScope.show_book){
			$('body').css('white-space', 'normal');
			$scope.searching = true;
			$rootScope.keyCode = event.keyCode;
		}
	}
      
    $scope.intent_login = function() {
        Facebook.getLoginStatus(function(response) {
          	if (response.status == 'connected') {
            	$rootScope.logged = true;
            	$scope.me(); 
          	}
          	else{
           		$scope.login();
          	}
        });
    };
      
   	$scope.login = function() {
     	Facebook.login(function(response) {
      		if (response.status == 'connected') {
        		$rootScope.logged = true;
        		$scope.me();
      		}
    	});
   	};
   
    $scope.me = function() {
        Facebook.api('/me', function(response) {
		    $scope.$apply(function() {
		    	console.log('logged_in user', response);
		        $scope.user = response;
		    });
        });
    };
      
  	$scope.logout = function() {
    	Facebook.logout(function() {
      		$scope.$apply(function() {
        		$scope.user   = {};
        		$rootScope.logged = false;
      		});
    	});
  	}

  	$scope.show_uploader = function(){
  		$scope.uploader = true;	
  	}

	_bind_feedback_form = function(){
		$window.onmouseleave = function(){
			console.log('move');
		}
	}

	_loadRecommendations = function(){
		var currentWidth = $document.width();
		var lessThanOnePageLeft = event.pageX + screen.width > currentWidth;
		if (lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations');
		}
	}

	_get_book_details = function(data){
    	filter = "id="+data;
    	websiteService.get_book_details(filter).then(function(data){
			$scope.detailed_book["book"] = data;
	    	$rootScope.show_book = true;
    	});
    }

	_bind_emit = function(){
		show_book_event = $scope.$on('expandBook', function(event, data, posX, screenX, scrollWidth){
			$rootScope.book_x = posX;
			$rootScope.screen_x = screenX;
			$rootScope.total_x = scrollWidth;
	    	_get_book_details(data);
			event.stopPropagation();
	    });
	}

	_bind_auth_listeners = function(){
		$scope.$on('event:google-plus-signin-success', function (event, authResult) {
		    console.log("google login", authResult);
		});

		$scope.$on('event:google-plus-signin-failure', function (event, authResult) {
		    console.log("google login", authResult);
		});


	    $scope.$on('Facebook:statusChange', function(ev, data) {
	        if (data.status == 'connected') {
	        	$scope.$apply(function() {
	          	});
	        } 
	        else {
	        }
	    });

	    /**
	     * Watch for Facebook to be ready.
	     * There's also the event that could be used
	    */
	    $scope.$watch(
	        function() {
	          return Facebook.isReady();
	        },
	        function(newVal) {
	          if (newVal)
	            $scope.facebookReady = true;
	        }
	    );
	}

	_add_listeners = function(){
		add_book_to_shelf_event = $scope.$on('addBookToShelf', function(event, data){
	    	$scope.user.books['read'].push(data);
	    	event.stopPropagation();
	    });

	    remove_book_from_shelf = $scope.$on('removeBookFromShelf', function(event, data){
	    	var index = $scope.user.books['read'].indexOf(data);
	    	$scope.user.books['read'].splice(index, 1);
	    	event.stopPropagation();
	    });

	    add_to_bookmarks_event = $scope.$on('addToBookmarks', function(event, data){
	    	$scope.user.books['bookmarked'].push(data);
	    	event.stopPropagation();
	    });

	    remove_from_bookmarks_event = $scope.$on('removeFromBookmarks', function(event, data){
	    	var index = $scope.user.books['bookmarked'].indexOf(data);
	    	$scope.user.books['bookmarked'].splice(index, 1);
	    	event.stopPropagation();
	    });

	    move_right_listener_event = $scope.$on('moveRight', function(event){
	    	move_right_event = $timeout(function(){
				$scope.move_right();
			}, 1000);
	    });
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
			$scope.searching = false;
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
        	if(currentValue.length == 1){
        		$scope.search_type = "[ALL]";
	    		$scope.search_display = "Searching reader's door...";
        	}
        	else{
				$scope.get_search_results(event);
        	}
        }
	}

	_handle_search_input = function(){
        var currentValue = _get_search_input();
        $scope.search_results = [];
        $scope.search_ready = true;
        var firstInput = currentValue.slice(0, 1);
        var customSearch = (firstInput == "@") || (firstInput == "#") || (firstInput == "+");
        var currentValueLength = currentValue.length;
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

	$scope.get_search_results = function(event){
		if($scope.search_initiated){
    		$timeout.cancel(search_typing_timeout);
		}
		else{
        	var firstInput = String.fromCharCode(event.keyCode);
			$scope.search_initiated = true;
			if(firstInput == '@'){
				$scope.search_type = "['AUTHOR', 'READER']";
				$scope.search_display = "Searching authors and readers..."
			}
			else if(firstInput == '#'){
				$scope.search_type = "['BOOK']";
				$scope.search_display = "Searching books..."
			}
			else if(firstInput == '+'){
				$scope.search_type = "['TAG']";
				$scope.search_display = "Searching book categories..."
			}
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
		// $scope.search_tag.selected_result = true; // hides the list initially
		$scope.search_tag = {};
		$scope.search_tag.current = 0;
		$scope.searching = true;
		websiteService.get_background_image().then(function(data){
			$scope.search_style = {'background-image': 'url("'+data.url+'")'};
		});
	}

	_initiate_loading_page = function(){
		$scope.loading = true;
		$scope.drop_icon = false;
		
		$timeout(function(){
			$scope.loading = false;
			// $scope.drop_icon = false;
		}, 5000);

		$timeout(function(){
			$scope.drop_icon = true;
		}, 2000);
	}

	$scope.toggle_notifications = function(){
		if($scope.show_notifications){
			$scope.show_notifications = false;
		}
		else{
			$scope.show_notifications = true;
		}
	}

	$scope.handle_keyboard_bindings = function(){
		if(!$scope.searching){
			if($scope.show_book){
				if(event.keyCode == 39){
					event.preventDefault();
					$('.detailed_book').turn('next');
				}
				else if(event.keyCode == 37){
					event.preventDefault();
					$('.detailed_book').turn('previous');
				}
				else if(event.keyCode == 27){
					event.preventDefault();
					$rootScope.show_book = false;
				}
			}
			else{
				if(event.keyCode == 39){
					event.preventDefault();
					$scope.move_right(event);
				}
				else if(event.keyCode == 37){
					event.preventDefault();
					$scope.move_left(event);
				}
			}
			event.stopPropagation();
		}
	}

	_init = function(){
		console.time("websiteAppController");
		$scope.more_filters = [];
		$scope.show_notifications = true;
		$scope.test = {time: 1970};
		$scope.detailed_book = {};
		$rootScope.initPage = 3;
		$scope.logged = false;
		// Define user empty data :/
		$scope.user = {'books': {'bookmark':[], 'read': []}};
		$scope.user.profile_status = 0;
	    _profile_status_colors();

		_bind_emit();
		_bind_feedback_form();
		_bind_auth_listeners();
		_add_listeners();
		_handle_search_page();
		// $('body').css('white-space', 'normal');
		// $speechRecognition.onstart(function(){
		//   $speechSynthetis.speak("You're at Reader's Door. How can I help you?", 'en-UK');
		// });
		// $speechRecognition.setLang('en-UK'); // Default value is en-US
		// $speechRecognition.listen();
		_initiate_loading_page();
		console.timeEnd("websiteAppController");
	}

	var add_book_to_shelf_event = "";
	var remove_book_from_shelf = "";
	var add_to_bookmarks_event = "";
	var remove_from_bookmarks_event = "";
	var move_right_event = ""
	var move_right_listener_event = "";
	var search_typing_timeout = "";
	_init();

});