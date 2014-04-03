websiteApp.controller('websiteAppController', function($scope, $rootScope, $interval, $http, 
	$timeout, $q, $window, websiteService, Facebook, $speechRecognition, $speechSynthetis){
	$scope.bindHorizontalScroll = function(event, delta, deltaX, deltaY){
		event.preventDefault();
		if(delta > 0){
			//move backward
	        event.view.window.scrollBy(-80, 0);
		}
		else{
			//move forward
			event.view.window.scrollBy(80, 0);
			_loadRecommendations();
		}
	}

	$scope.scrollOnePageRight = function(event){
		event.preventDefault();
		//TODO put a better condition instead of two parent elements
		// clientWidth = event.currentTarget.parentElement.parentElement.clientWidth;
		clientWidth = $('#recommendationFooter')[0].clientWidth;
		lessThanOnePageLeft = event.pageX + 1000 > clientWidth;
		if(lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations');
		}
		event.view.window.scrollBy(1000, 0);
	}

	$scope.scrollOnePageLeft = function(event){
		event.preventDefault();
		event.view.window.scrollBy(-1000, 0);
	}


	$scope.showFeebackForm = function(){
		// console.log("showFeebackForm")
	}

	$scope.show_search_result = function(){
		console.log("show_search_result");
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
			$rootScope.$broadcast('showBookReadShelf');
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
		if(input_aimed_for_searching){
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
		currentWidth = event.currentTarget.clientWidth;
		lessThanOnePageLeft = event.pageX + 1575 > currentWidth;
		if (lessThanOnePageLeft){
			newElementsCount = 5;
			leftMargin = 40;
			newElementsWidth = (275+leftMargin)*newElementsCount;
			newWidth = currentWidth+newElementsWidth;
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
	    	var book = {title: data['title'], author_name: data['author_name'], book_cover_url: data['book_cover_url']};
	    	$scope.user.books['bookmark'].push(book);
	    	event.stopPropagation();
	    });
	}

	$scope.handle_selection = function(selectedItem) {
		$scope.search_input = selectedItem.toUpperCase();
	    $scope.current = 0;
	    $scope.selected_result = true;
	    $scope.show_search_result();
	    event.stopPropagation();
	};

	$scope.hide_search_page = function(){
		var logged_in = $scope.logged;
		if(logged_in){
			$('body').css('white-space', 'nowrap');
			$scope.searching = false;
		}
	}

	$scope.stop_propagation = function(){
		event.stopPropagation();
	}

	$scope.is_current = function(index) {
	    return $scope.current == index;
	};

	$scope.set_current = function(index) {
	    $scope.current = index;
	};

	$scope.navigate_options = function(){
		var keyEnter = event.keyCode == 13;
		if(keyEnter){
			$scope.handle_selection("NOT WORKING"+$scope.current);
		}
	}

	$scope.key_up = function(){
		var keyUp = event.keyCode == 38;
		var keyDown = event.keyCode == 40;
		if(keyUp){
			if($scope.current != 0){
				$scope.set_current($scope.current-1);
			}
		}

		if(keyDown){
			$scope.set_current($scope.current+1);
		}
	}


	$scope.get_search_results = function(event, type){
        var currentValue = $scope.searchResults;
        var currentInput = String.fromCharCode(event.keyCode);
        $scope.search_results = [{name: "Test 1"}, {name: "Test 2"}];

        // var backspace_or_delete_or_enter = (event.keyCode == 8) || (event.keyCode == 46) || (event.keyCode == 13);
    //     if(backspace_or_delete_or_enter && currentValue.length == 0){
    //     	$scope.stopSearching(event);
    //     	//NOT WORKING
    //     }
    //     else{
    //     	if(currentValue.length >= 2){
				// var deferred = $q.defer();
				// var query_params = currentValue+currentInput;
		  //       $http.get('/api/v0/search?count=5&q='+query_params).then(function(result) {
    //                 return deferred.resolve(result.data); 
    //             });
		  //       return deferred.promise;
    //     	}
    //     	else{
    //     		//Type atleast 3 chars to search
    //     	}
    //     }
	}

	$scope.toggle_login_panel = function(){
		if($scope.show_login_form){
			$scope.show_login_form = false;
		}
		else{
			$scope.show_login_form = true;
		}
	}

	_init = function(){
		$scope.current = 0;
		$scope.searching = true;
		$scope.selected_result = true; // hides the list initially
		$scope.more_filters = [];
		$scope.test = {time: 1970};
		$scope.detailed_book = {};
		$rootScope.initPage = 3;
		$scope.logged = false;
		// Define user empty data :/
		$scope.user = {'books': {'bookmark':[], 'read': []}};
		$scope.user.profile_status = 0;
		$scope.search_type = "Books";
	    _profile_status_colors();

		_bind_emit();
		_bind_feedback_form();
		_bind_auth_listeners();
		_add_listeners();
		$('body').css('white-space', 'normal');
		// $speechRecognition.onstart(function(){
		//   $speechSynthetis.speak("You're at Reader's Door. How can I help you?", 'en-UK');
		// });
		// $speechRecognition.setLang('en-UK'); // Default value is en-US
		$speechRecognition.listen();
	}

	var add_book_to_shelf_event = ""
	_init();

});