websiteApp.controller('websiteAppController', ['$scope', '$rootScope', '$timeout', 'websiteService', 'Facebook', '$document', 'scroller', '$window', '$motion',
	function($scope, $rootScope, $timeout, websiteService, Facebook, $document, scroller, $window, $motion){
	$scope.bindHorizontalScroll = function(event, delta, deltaX, deltaY){
		event.preventDefault();
		if(delta > 0){
			$scope.move_left(event);
	        // event.view.window.scrollBy(-80, 0);
		}
		else{
			$scope.move_right(event);
			_load_recommendations();
			//move forward
			// event.view.window.scrollBy(80, 0);
		}
		event.stopPropagation();
	}

	$scope.move_left = function(event){
		var swipe_time = 2000;
		if(event){
			if(event.type == "keydown" || event.type == "wheel"){
				var current_x = $window.pageXOffset;
			}
			else{
				var current_x = event.pageX - ($('.scroller').position().left + $('.scroller-left').position().left);
			}
		}
		else{
			var current_x = $window.pageXOffset;
			swipe_time = 1000;
		}
		var delta_x = $('.recommendation_block:first').width();
		scroller.scrollTo(current_x - delta_x, 0, swipe_time);
	}

	$scope.move_right = function(event){
		var swipe_time = 2000;
		var clientWidth = $document.width();
		if(event){
			var pageX = event.pageX;
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
			var current_x = $window.pageXOffset;
			// var pageX = $('.scroller').position().left+$('.scroller-right').position().left;
			var lessThanOnePageLeft = current_x + (1.5)*screen.width > clientWidth;
			swipe_time = 1000;
		}
		if(lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations');
		}
		var delta_x = $('.recommendation_block:first').width();
		scroller.scrollTo(current_x + delta_x, 0, swipe_time);
	}

	$scope.scroll_one_page_right = function(event){
		var clientWidth = $document.width();
		if(event){
			var current_x = event.pageX - screen.width/2;
			var lessThanOnePageLeft = event.pageX + screen.width > clientWidth;
		}
		else{
			var current_x = $window.pageXOffset; - screen.width/2;
			var lessThanOnePageLeft = $window.pageXOffset; + screen.width > clientWidth;
		}
		if(lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations');
		}
		var delta_x = screen.width;
		scroller.scrollTo(current_x + delta_x, 0, 2000);	
	}

	$scope.scroll_one_page_left = function(event){
		if(event){
			var current_x = event.pageX - screen.width/2;
		}
		else{
			var current_x = $window.pageXOffset - screen.width/2;
		}
		var delta_x = screen.width;
		scroller.scrollTo(current_x - delta_x, 0, 2000);
	}


	$scope.showFeebackForm = function(){
		// console.log("showFeebackForm")
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
	}

	$scope.update_profile = function(){
		var enter_pressed = event.keyCode == 13;
		if(enter_pressed){
			var profile_status = $rootScope.user.profile_status;
			if(profile_status == 0){
				websiteService.update_profile($rootScope.user);
				$rootScope.user.profile_status = $rootScope.user.profile_status + 1;
				_profile_status_colors();
			}
		}
	}

	$scope.authenticate = function(){
		var data_json = $rootScope.user;
		websiteService.authenticate(data_json).then(function(data){
			if(data.message == "success"){
				$rootScope.user.profile_status = data.profile_status;
				$rootScope.user.logged = true;
				$rootScope.user.id = data.user_id;
				$scope.show_login_form = true;
				_profile_status_colors();
				websiteService.get_user_details().then(function(data){
		    		$rootScope.user.books = data["books"];
		    	});
				websiteService.get_notifications($rootScope.user).then(function(data){
					$scope.notifications = data.notifications;
				});
			}
		});
	}

	_handle_info_card_bindings = function($scope){
		if($rootScope.user.profile_status == 3){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(function(position){
					var latitude = position.coords.latitude;
					var longitude = position.coords.longitude;
					$rootScope.user.latitude = latitude;
					$rootScope.user.longitude = longitude;
				});
			}
			else{
				x.innerHTML="Geolocation is not supported by this browser.";
			}
		}
		else if($rootScope.user.profile_status == 4){
			// $rootScope.$broadcast('showBookReadShelf');
		}
	}

	$scope.prev_profile_state = function(){
		if($rootScope.user.profile_status != 0){
			$rootScope.user.profile_status = $rootScope.user.profile_status - 1;
			_handle_info_card_bindings($scope);
			_profile_status_colors();
		}
	}

	$scope.next_profile_state = function(){
		if($rootScope.user.profile_status != 6){
			$rootScope.user.profile_status = $rootScope.user.profile_status + 1;
			_handle_info_card_bindings($scope);
			_profile_status_colors();
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
		        $rootScope.user = response;
		    });
        });
    };
      
  	$scope.logout = function() {
    	Facebook.logout(function() {
      		$scope.$apply(function() {
        		$rootScope.user   = {};
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

	_load_recommendations = function(){
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
		add_to_shelf_event = $scope.$on('addToShelf', function(event, type, data){
			if(type == "BOOK"){
	    		$rootScope.user.books['read'].push(data);
			}
			else if(type == "AUTHOR"){
				$rootScope.user.authors['follow'].push(data);
			}
			else if(type == "READER"){
				$rootScope.user.readers['follow'].push(data);
			}
	    	event.stopPropagation();
	    });

	    remove_from_shelf = $scope.$on('removeFromShelf', function(event, type, data){
	    	if(type == "BOOK"){
		    	var index = $rootScope.user.books['read'].indexOf(data);
		    	$rootScope.user.books['read'].splice(index, 1);
	    	}
	    	else if(type == "AUTHOR"){
	    		var index = $rootScope.user.authors['follow'].indexOf(data);
		    	$rootScope.user.authors['follow'].splice(index, 1);
	    	}
	    	else if(type == "READER"){
	    		var index = $rootScope.user.readers['follow'].indexOf(data);
		    	$rootScope.user.readers['follow'].splice(index, 1);
	    	}
		    event.stopPropagation();	
	    });

	    add_to_bookmarks_event = $scope.$on('addToBookmarks', function(event, type, data){
	    	if(type == "BOOK"){
	    		$rootScope.user.books['bookmarked'].push(data);
	    	}
	    	else if(type == "AUTHOR"){
	    		$rootScope.user.authors['bookmarked'].push(data);
	    	}
	    	event.stopPropagation();
	    });

	    remove_from_bookmarks_event = $scope.$on('removeFromBookmarks', function(event, type, data){
	    	if(type == "BOOK"){
		    	var index = $rootScope.user.books['bookmarked'].indexOf(data);
		    	$rootScope.user.books['bookmarked'].splice(index, 1);
	    	}
	    	else if(type == "AUTHOR"){
	    		var index = $rootScope.user.authors['bookmarked'].indexOf(data);
		    	$rootScope.user.authors['bookmarked'].splice(index, 1);	
	    	}
	    	event.stopPropagation();
	    });

	    move_right_listener_event = $scope.$on('moveRight', function(event){
	    	move_right_event = $timeout(function(){
				$scope.move_right();
			}, 1000);
	    });
	}

	$scope.toggle_login_panel = function(){
		if($scope.show_login_form){
			$scope.show_login_form = false;
		}
		else{
			$scope.show_login_form = true;
		}
	}

	_initiate_loading_page = function(){
		$scope.loading = true;
		$scope.drop_icon = false;
		$scope.show_login_form = true;

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
			$scope.notifications_seen = true;
		}
		else{
			$scope.show_notifications = true;
		}
	}

	$scope.handle_keyboard_bindings = function(){
		if(!$scope.website.show_search_page){
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


	$scope.search = function(){
		var input_aimed_for_searching = (event.currentTarget == event.srcElement) && !$rootScope.show_book;
		if(input_aimed_for_searching){
			$('body').css('white-space', 'normal');
			$scope.website.searching = true;
			$rootScope.keyCode = event.keyCode;
		}
	}

	_init = function(){
		console.time("websiteAppController");
		$scope.more_filters = [];
		$scope.show_notifications = false;
		$scope.notifications_seen = false;
		$scope.test = {time: 1970};
		$scope.detailed_book = {};
		$rootScope.initPage = 3;
		// Define user empty data :/
		$rootScope.user = {'books': {'bookmarked':[], 'read': []},
						'authors': {'bookmarked': [], 'follow': []},
						'readers': {'follow': []},
						'logged': false};
		$rootScope.user.profile_status = 0;
		$scope.website = {};
		$scope.website.searching = true;
		$scope.website.show_search_page = true;
	    _profile_status_colors();

		_bind_emit();
		_bind_feedback_form();
		_bind_auth_listeners();
		_add_listeners();
		
		// $('body').css('white-space', 'normal');
		// $speechRecognition.onstart(function(){
		//   $speechSynthetis.speak("You're at Reader's Door. How can I help you?", 'en-UK');
		// });
		// $speechRecognition.setLang('en-UK'); // Default value is en-US
		// $speechRecognition.listen();
		_initiate_loading_page();
		
		console.timeEnd("websiteAppController");
	}

	var add_to_shelf_event = "";
	var remove_from_shelf = "";
	var add_to_bookmarks_event = "";
	var remove_from_bookmarks_event = "";
	var move_right_event = ""
	var move_right_listener_event = "";
	
	_init();

}]);