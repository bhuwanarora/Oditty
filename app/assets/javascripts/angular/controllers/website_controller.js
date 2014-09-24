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

	$scope._hide_popups = function(){
		$rootScope.user.collapsed_column = true;
		$rootScope.user.collapsed_filters = true;
		$rootScope.user.collapsed_friends = true;
		$rootScope.user.collapsed_trends = true;
		$rootScope.user.collapsed_lists = true;
		$rootScope.user.collapsed_left_column = true;
		$rootScope.popups = {};
		delete $rootScope.focused_book;
		delete $rootScope.ticker_popup;
	}

	$scope.toggle_left_columns = function(){
		var _show_friends = function(){
			$rootScope.user.collapsed_filters = true;
			$rootScope.user.collapsed_friends = false;
			$rootScope.user.collapsed_column = true;
			$rootScope.user.collapsed_lists = true;
			$rootScope.user.collapsed_trends = true;
			$rootScope.user.collapsed_left_column = false;
		}

		var _show_news_feed = function(){
			$rootScope.user.collapsed_filters = true;
			$rootScope.user.collapsed_friends = true;
			$rootScope.user.collapsed_column = false;
			$rootScope.user.collapsed_lists = true;
			$rootScope.user.collapsed_trends = true;
			$rootScope.user.collapsed_left_column = false;
		}

		var _show_lists = function(){
			$rootScope.user.collapsed_filters = true;
			$rootScope.user.collapsed_friends = true;
			$rootScope.user.collapsed_column = true;
			$rootScope.user.collapsed_lists = false;
			$rootScope.user.collapsed_trends = true;
			$rootScope.user.collapsed_left_column = false;
		}

		var _show_trends = function(){
			$rootScope.user.collapsed_filters = true;
			$rootScope.user.collapsed_friends = true;
			$rootScope.user.collapsed_column = true;
			$rootScope.user.collapsed_lists = true;
			$rootScope.user.collapsed_trends = false;
			$rootScope.user.collapsed_left_column = false;
		}

		var _show_shelves = function(){
			$rootScope.user.collapsed_filters = false;
			$rootScope.user.collapsed_friends = true;
			$rootScope.user.collapsed_column = true;
			$rootScope.user.collapsed_lists = true;
			$rootScope.user.collapsed_trends = true;
			$rootScope.user.collapsed_left_column = false;
		}

		if(!$rootScope.user.collapsed_filters){
			_show_friends();
		}
		else if(!$rootScope.user.collapsed_friends){
			_show_news_feed();
		}
		else if(!$rootScope.user.collapsed_column){
			_show_lists();
		}
		else if(!$rootScope.user.collapsed_lists){
			_show_trends();
		}
		else if(!$rootScope.user.collapsed_trends){
			_show_shelves();
		}
		else{
			_show_news_feed();
		}
	}

	$scope.move_left = function(event){
		$scope._hide_popups();
		var swipe_time = 1000;
		var clientWidth = document.body["scrollWidth"];
		var current_x = $window.pageXOffset;
		var delta_x = window_height*(0.4);
		if(angular.isDefined(event)){
			if(event.type == "click"){
				if(angular.isDefined($scope.delta_x)){
					$scope.delta_x = $scope.delta_x + delta_x;
				}
				else{
					$scope.delta_x = delta_x;
				}
				var timeout_event = $timeout(function(){
					scroller.scrollTo(current_x - $scope.delta_x, 0, swipe_time);
					delete $scope.delta_x;
					$timeout.cancel(timeout_event);
				}, 400);
			}
			else{
				scroller.scrollTo(current_x - delta_x, 0, swipe_time);
			}
		}
		else{
			scroller.scrollTo(current_x - delta_x, 0, swipe_time);
		}
	}

	$scope.move_right = function(event){
		// $scope.toggle_left_columns();
		$scope._hide_popups();
		var swipe_time = 1000;
		var clientWidth = document.body["scrollWidth"];
		var current_x = $window.pageXOffset;
		var delta_x = window_height*(0.4);
		var lessThanOnePageLeft = current_x + (2.5)*window_width > clientWidth;
		if(lessThanOnePageLeft){
			if(!$rootScope.loading){
				console.debug("%c lessThanOnePageLeft", "color:green");
				$rootScope.loading = true;
				$rootScope.$broadcast('loadRecommendations');
			}
		}
		if(angular.isDefined(event)){
			if(event.type == "click"){
				if(angular.isDefined($scope.delta_x)){
					$scope.delta_x = $scope.delta_x + delta_x;
				}
				else{
					$scope.delta_x = delta_x;
				}
				var timeout_event = $timeout(function(){
					scroller.scrollTo(current_x + $scope.delta_x, 0, swipe_time);
					delete $scope.delta_x;
					$timeout.cancel(timeout_event);
				}, 400);
			}
			else{
				scroller.scrollTo(current_x + delta_x, 0, swipe_time);
			}
		}
		else{
			scroller.scrollTo(current_x + delta_x, 0, swipe_time);
		}

	}

	$scope.scroll_one_page_right = function(event){
		var clientWidth = document.body["scrollWidth"];
		if(event){
			var current_x = event.pageX - window_width/2;
			var lessThanOnePageLeft = event.pageX + window_width > clientWidth;
		}
		else{
			var current_x = $window.pageXOffset; - window_width/2;
			var lessThanOnePageLeft = $window.pageXOffset; + window_width > clientWidth;
		}
		if(lessThanOnePageLeft){
			$rootScope.$broadcast('loadRecommendations');
		}
		var delta_x = window_width;
		scroller.scrollTo(current_x + delta_x, 0, 2000);	
	}

	$scope.scroll_one_page_left = function(event){
		if(event){
			var current_x = event.pageX - window_width/2;
		}
		else{
			var current_x = $window.pageXOffset - window_width/2;
		}
		var delta_x = window_width;
		scroller.scrollTo(current_x - delta_x, 0, 2000);
	}


	$scope.showFeebackForm = function(){
		// console.log("showFeebackForm");
	}

  	$scope.show_uploader = function(){
  		$scope.uploader = true;	
  	}

  	$scope.close_notification =function(){
  		$rootScope.notification_active = false;
  	}

	_bind_feedback_form = function(){
		$window.onmouseleave = function(){
			console.log('move');
		}
	}

	_load_recommendations = function(){
		var currentWidth = document.body["scrollWidth"];
		var lessThanOnePageLeft = event.pageX + window_width > currentWidth;
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

	    move_right_listener_event = $scope.$on('moveRight', function(event){
	    	move_right_event = $timeout(function(){
				$scope.move_right();
			}, 1000);
	    });

	    add_to_notifications = $scope.$on('addToNotifications', function(event, notification){
	    	_intro_notifications();
	    	if(notification instanceof Array){
	    		var notification_already_added = false;
	    		angular.forEach($scope.notifications, function(value){
	    			if(value.id == notification[0].id){
	    				notification_already_added = true;
	    			}
	    		});
	    		if(!notification_already_added){
	    			$scope.notifications = $scope.notifications.concat(notification);
	    		}
	    	}
	    	else{
	    		$scope.notifications.push(notification);
	    		if(angular.isDefined($scope.personal_notifications)){
	    			$scope.personal_notifications.push(notification);
	    		}
	    	}
	    	event.stopPropagation();
	    });

	    get_notifications_event = $scope.$on('getNotifications', function(event, trending, user_id){
	    	console.debug("getNotifications ", user_id, trending, angular.isDefined($rootScope.reader));
    		if(angular.isUndefined(trending) || !trending){
    			if(angular.isDefined(user_id)){
		    		if(angular.isDefined($rootScope.reader) && (user_id == $rootScope.reader.id)){
		    			if(angular.isDefined($scope.readers_notifications)){
				    		var existing_notifications_count = $scope.readers_notifications.length;
				    	}
				    	else{
				    		var existing_notifications_count = 0;
				    	}
			    		websiteService.get_notifications(existing_notifications_count, user_id).then(function(data){
				    		_intro_notifications(user_id);
							$scope.readers_notifications = data.notifications.concat($scope.readers_notifications);
						});
		    		}
		    		else{
			    		if(angular.isDefined($scope.personal_notifications)){
				    		var existing_notifications_count = $scope.personal_notifications.length;
				    	}
				    	else{
				    		var existing_notifications_count = 0;
				    	}
			    		websiteService.get_notifications(existing_notifications_count, user_id).then(function(data){
				    		_intro_notifications(user_id);
							$scope.personal_notifications = data.notifications.concat($scope.personal_notifications);
						});
		    		}
	    		}
	    		else{
			    	if(angular.isDefined($scope.notifications)){
			    		var existing_notifications_count = $scope.notifications.length;
			    	}
			    	else{
			    		var existing_notifications_count = 0;
			    	}
			    	websiteService.get_notifications(existing_notifications_count).then(function(data){
			    		_intro_notifications();
						$scope.notifications = data.notifications.concat($scope.notifications);
					});
	    		}
     		}
     		else{
     			$scope.notifications = $rootScope.trends;
     			$scope.show_trending = true;
     		}
	    	
	    });

	    get_latest_notification = $scope.$on('getLatestNotification', function(){
			websiteService.get_latest_notification().then(function(data){
				$scope.notifications.push(data.notification);
			});
	    });
	}

	_intro_notifications = function(user_id){
		if(angular.isDefined($scope.show_trending)){
			delete $scope.personal_notifications;
			delete $scope.readers_notifications;
			delete $scope.show_trending;
			$scope.notifications = [];
		}
		
		if(angular.isUndefined(user_id)){
			if(angular.isUndefined($scope.notifications)){
				$scope.notifications = [];
				delete $scope.personal_notifications;
				delete $scope.readers_notifications;
			}
		}
		else{
			if(angular.isDefined($rootScope.reader)){
				if(angular.isUndefined($scope.readers_notifications)){
					$scope.readers_notifications = [];
					delete $scope.notifications;
					delete $scope.personal_notifications;
				}
			}
			else{
				if(angular.isUndefined($scope.personal_notifications)){
					$scope.personal_notifications = [];
					delete $scope.notifications;
					delete $scope.readers_notifications;
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

	_initiate_loading_page = function(){
		$scope.loading = true;
		$scope.drop_icon = false;
		$scope.show_login_form = false;

		$timeout(function(){
			$scope.loading = false;
			// $scope.drop_icon = false;
		}, 2000);

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
		if(event.keyCode == WebsiteUIConstants.KeyRight){
			event.preventDefault();
			$scope.move_right(event);
		}
		else if(event.keyCode == WebsiteUIConstants.KeyLeft){
			event.preventDefault();
			$scope.move_left(event);
		}
		event.stopPropagation();
		// var backspace = (event.keyCode == WebsiteUIConstants.Backspace);
		// if(backspace){
		// 	// event.preventDefault();
		// }
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
		if(angular.isDefined($rootScope.reader)){
			$scope.readers_notifications = [];
		}
		else{
			$scope.notifications = [];
		}
		$scope.personal_notifications = [];
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
		$scope._init_notifications();
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
			
		 	browserName = "Opera";
		 	fullVersion = nAgt.substring(verOffset+6);
		 	if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		   		fullVersion = nAgt.substring(verOffset+8);
		}
		// In MSIE, the true version is after "MSIE" in userAgent
		else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
			
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
			
		 	browserName = "Safari";
		 	fullVersion = nAgt.substring(verOffset+7);
		 	if ((verOffset=nAgt.indexOf("Version"))!=-1) 
		   		fullVersion = nAgt.substring(verOffset+8);
		}
		// In Firefox, the true version is after "Firefox" 
		else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
			
		 	browserName = "Firefox";
		 	fullVersion = nAgt.substring(verOffset+8);
		}
		// In most other browsers, "name/version" is at the end of userAgent 
		else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
		          (verOffset=nAgt.lastIndexOf('/')) ) 
		{
			
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