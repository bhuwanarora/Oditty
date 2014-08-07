websiteApp.controller('websiteAppController', ['$scope', '$rootScope', '$timeout', 'websiteService', '$document', 'scroller', '$window', 'WebsiteUIConstants', function($scope, $rootScope, $timeout, websiteService, $document, scroller, $window, WebsiteUIConstants){
	$scope.bindHorizontalScroll = function(event, delta, deltaX, deltaY){
		event.preventDefault();
		if(delta > 0){
			$scope.move_left(event);
	        // event.view.window.scrollBy(-80, 0);
		}
		else{
			$scope.move_right(event);
			// _load_recommendations();
			//move forward
			// event.view.window.scrollBy(80, 0);
		}
		event.stopPropagation();
	}

	_hide_popups = function(){
		delete $rootScope.focused_book;
		delete $rootScope.ticker_popup;
	}

	$scope.move_left = function(event){
		_hide_popups();
		var swipe_time = 2000;
		var clientWidth = document.body["scrollWidth"];
		if(event){
			if(event.type == "keydown" || event.type == "wheel"){
				var current_x = $window.pageXOffset;
				var progression_width = (current_x*screen.width)/clientWidth;
			}
			else{
				// debugger
				var current_x = event.pageX - (event.screenX);
				// var current_x = event.pageX - ($('.scroller').position().left + $('.scroller-left').position().left);
			}
		}
		else{
			var current_x = $window.pageXOffset;
			swipe_time = 1000;
		}

		// $scope.progression_state = {"width": progression_width+"px"};
		
		var delta_x = screen.width*(0.35);
		// var delta_x = screen.width;
		scroller.scrollTo(current_x - delta_x, 0, swipe_time);
	}

	$scope.move_right = function(event){
		_hide_popups();
		var swipe_time = 2000;
		var clientWidth = document.body["scrollWidth"];
		if(event){
			var pageX = event.pageX;
			if(event.type == "keydown" || event.type == "wheel"){
				var current_x = $window.pageXOffset;
				var lessThanOnePageLeft = current_x + (2.5)*screen.width > clientWidth;
				var progression_width = (current_x*screen.width)/clientWidth;
			}
			else{
				// var current_x = pageX - ($('.scroller').position().left+$('.scroller-right').position().left);
				var current_x = event.pageX - (event.screenX - event.offsetX);
				var lessThanOnePageLeft = pageX + screen.width > clientWidth;
			}
		}
		else{
			var current_x = $window.pageXOffset;
			// var pageX = $('.scroller').position().left+$('.scroller-right').position().left;
			var lessThanOnePageLeft = current_x + 2.5*screen.width > clientWidth;
			swipe_time = 1000;
		}

		// $scope.progression_state = {"width": progression_width+"px"};

		if(lessThanOnePageLeft){
			if(!$rootScope.loading){
				console.debug("%c lessThanOnePageLeft", "color:green");
				$rootScope.loading = true;
				$rootScope.$broadcast('loadRecommendations');
			}
		}
		var delta_x = screen.width*(0.35);
		// var delta_x = screen.width;
		scroller.scrollTo(current_x + delta_x, 0, swipe_time);
	}

	$scope.scroll_one_page_right = function(event){
		var clientWidth = document.body["scrollWidth"];
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

  	$scope.show_uploader = function(){
  		$scope.uploader = true;	
  	}

	_bind_feedback_form = function(){
		$window.onmouseleave = function(){
			console.log('move');
		}
	}

	_load_recommendations = function(){
		var currentWidth = document.body["scrollWidth"];
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

	_add_listeners = function(){

	    // add_to_bookmarks_event = $scope.$on('addToBookmarks', function(event, type, data){
	    // 	if(type == "BOOK"){
	    // 		$rootScope.user.books['bookmarked'].push(data);
	    // 	}
	    // 	else if(type == "AUTHOR"){
	    // 		$rootScope.user.authors['bookmarked'].push(data);
	    // 	}
	    // 	event.stopPropagation();
	    // });

	    // remove_from_bookmarks_event = $scope.$on('removeFromBookmarks', function(event, type, data){
	    // 	if(type == "BOOK"){
		   //  	var index = $rootScope.user.books['bookmarked'].indexOf(data);
		   //  	$rootScope.user.books['bookmarked'].splice(index, 1);
	    // 	}
	    // 	else if(type == "AUTHOR"){
	    // 		var index = $rootScope.user.authors['bookmarked'].indexOf(data);
		   //  	$rootScope.user.authors['bookmarked'].splice(index, 1);	
	    // 	}
	    // 	event.stopPropagation();
	    // });

	    move_right_listener_event = $scope.$on('moveRight', function(event){
	    	move_right_event = $timeout(function(){
				$scope.move_right();
			}, 1000);
	    });

	    add_to_notifications = $scope.$on('addToNotifications', function(event, notification){
	    	if(angular.isUndefined($scope.notifications)){
	    		$scope.notifications = [];	
	    	}
	    	$scope.notifications.push(notification);
	    	event.stopPropagation();
	    });

	    get_notifications_event = $scope.$on('getNotifications', function(){
	    	websiteService.get_notifications().then(function(data){
				$scope.notifications = data.notifications;
			});
	    });

	    get_latest_notification = $scope.$on('getLatestNotification', function(){
			websiteService.get_latest_notification().then(function(data){
				$scope.notifications.push(data.notification);
			});
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
		$scope.show_login_form = false;

		$timeout(function(){
			$scope.loading = false;
			// $scope.drop_icon = false;
		}, 3000);

		$timeout(function(){
			$scope.drop_icon = true;
		}, 1000);
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

	$scope.handle_keyboard_bindings = function(event){
		// $scope.website.show_search_page
		if(true){
			if($scope.show_book){
				if(event.keyCode == WebsiteUIConstants.KeyRight){
					event.preventDefault();
					$('.detailed_book').turn('next');
				}
				else if(event.keyCode == WebsiteUIConstants.KeyLeft){
					event.preventDefault();
					$('.detailed_book').turn('previous');
				}
				else if(event.keyCode == WebsiteUIConstants.Escape){
					event.preventDefault();
					$rootScope.show_book = false;
				}
			}
			else{
				if(event.keyCode == WebsiteUIConstants.KeyRight){
					event.preventDefault();
					$scope.move_right(event);
				}
				else if(event.keyCode == WebsiteUIConstants.KeyLeft){
					event.preventDefault();
					$scope.move_left(event);
				}
			}
			event.stopPropagation();
		}
		var backspace = (event.keyCode == WebsiteUIConstants.Backspace);
		if(backspace){
			// event.preventDefault();
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

	_handle_socket_error = function(){
		// $scope.$on('socket:error', function (ev, data) {
		// 	debugger
	 //    });
	    // debugger

	    // appSocket.forward('someEvent', $scope);
	    // $scope.$on('socket:someEvent', function (ev, data) {
	    //   $scope.theData = data;
	    // });
	}

	_init_notifications = function(){
		$rootScope.notification_active = false;
	}

	_init = function(){
		console.time("websiteAppController");
		_initiate_loading_page();
		$scope.more_filters = [];
		$scope.show_notifications = true;
		$scope.notifications_seen = false;
		// $scope.test = {time: 1970};
		// $scope.detailed_book = {};
		// $rootScope.initPage = 3;
		// Define user empty data :/
		if(angular.isDefined($rootScope.focused_book)){
			$rootScope.focused_book.level2_option = "";
		}
		
		$scope.website = {};
		$scope.website.searching = false;
		$scope.website.show_search_page = true;
		_bind_emit();
		_bind_feedback_form();
		// _bind_auth_listeners();
		_add_listeners();
		_handle_socket_error();
		_init_notifications();
		// $('body').css('white-space', 'normal');
		// $speechRecognition.onstart(function(){
		//   $speechSynthetis.speak("You're at Reader's Door. How can I help you?", 'en-UK');
		// });
		// $speechRecognition.setLang('en-UK'); // Default value is en-US
		// $speechRecognition.listen();
		$rootScope.user = {'books': {'bookmarked':[], 'read': []},
						'authors': {'bookmarked': [], 'follow': []},
						'readers': {'follow': []},
						'logged': false};
		_detect_browser();
		console.timeEnd("websiteAppController");
	}

	_detect_browser = function(){
		var nVer = navigator.appVersion;
		var nAgt = navigator.userAgent;
		var browserName  = navigator.appName;
		var fullVersion  = ''+parseFloat(navigator.appVersion); 
		var majorVersion = parseInt(navigator.appVersion,10);
		var nameOffset,verOffset,ix;
		var message = WebsiteUIConstants.BrowserIncompatible;
		// In Opera, the true version is after "Opera" or after "Version"
		if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
			alert(message);
		 	browserName = "Opera";
		 	fullVersion = nAgt.substring(verOffset+6);
		 	if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		   		fullVersion = nAgt.substring(verOffset+8);
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
			alert(message);
		 	browserName = "Microsoft Internet Explorer";
		 	fullVersion = nAgt.substring(verOffset+5);
		}
		// In Chrome, the true version is after "Chrome" 
		else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
		 	browserName = "Chrome";
		 	fullVersion = nAgt.substring(verOffset+7);
		}
		// In Safari, the true version is after "Safari" or after "Version" 
		else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
			alert(message);
		 	browserName = "Safari";
		 	fullVersion = nAgt.substring(verOffset+7);
		 	if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		   		fullVersion = nAgt.substring(verOffset+8);
		}
		// In Firefox, the true version is after "Firefox" 
		else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
			alert(message);
		 	browserName = "Firefox";
		 	fullVersion = nAgt.substring(verOffset+8);
		}
		// In most other browsers, "name/version" is at the end of userAgent 
		else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
		          (verOffset=nAgt.lastIndexOf('/')) ) 
		{
			alert(message);
		 	browserName = nAgt.substring(nameOffset,verOffset);
		 	fullVersion = nAgt.substring(verOffset+1);
		 	if (browserName.toLowerCase()==browserName.toUpperCase()) {
		  		browserName = navigator.appName;
		 	}
		}
		// trim the fullVersion string at semicolon/space if present
		if ((ix=fullVersion.indexOf(";"))!=-1)
		   	fullVersion=fullVersion.substring(0,ix);
		if ((ix=fullVersion.indexOf(" "))!=-1)
		   	fullVersion=fullVersion.substring(0,ix);

		majorVersion = parseInt(''+fullVersion,10);
		if (isNaN(majorVersion)) {
		 	fullVersion  = ''+parseFloat(navigator.appVersion); 
		 	majorVersion = parseInt(navigator.appVersion,10);
		}

		console.debug(''
		 +'Browser name  = '+browserName+'<br>'
		 +'Full version  = '+fullVersion+'<br>'
		 +'Major version = '+majorVersion+'<br>'
		 +'navigator.appName = '+navigator.appName+'<br>'
		 +'navigator.userAgent = '+navigator.userAgent+'<br>'
		);
	}

	// var add_to_bookmarks_event = "";
	// var remove_from_bookmarks_event = "";
	var move_right_event = ""
	var move_right_listener_event = "";
	var get_latest_notification = "";
	_init();

}]);