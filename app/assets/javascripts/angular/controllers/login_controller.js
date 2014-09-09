websiteApp.controller('loginController', ['$scope', '$rootScope', 'websiteService', 'Facebook', 'stropheService', '$timeout', '$cookieStore', 'LoginConstants', 'WebsiteUIConstants', function($scope, $rootScope, websiteService, Facebook, stropheService, $timeout, $cookieStore, LoginConstants, WebsiteUIConstants){
	$scope.submit = function(event){
		var enter_pressed = event.keyCode == WebsiteUIConstants.Enter;
		if(enter_pressed){
			$scope.authenticate(true);
		}
		event.stopPropagation();
	}

	$scope.recover_password = function(){
		delete $rootScope.user.error_message;
		var success_callback = function(data){
			$scope.loading_icon = false;
			$rootScope.user.error_message = data.message;
			$rootScope.user.password = null;
		}

		var error_callback = function(data){
			$scope.loading_icon = false;
			$rootScope.user.error_message = data.message;
			$rootScope.user.password = null;
		}
		if(!$rootScope.user.email){
			$rootScope.user.error_message = LoginConstants.EmailNotPresent;
		}
		else{
			$scope.loading_icon = true;
			websiteService.recover_password("email="+$rootScope.user.email).then(success_callback, error_callback);
		}
	}

	$scope.authenticate = function(old_user){
		var email = $rootScope.user.email;
		var password = $rootScope.user.password;		
		var min_length_pattern = new RegExp("^.{8,}$");
		var not_repeat_pattern = new RegExp("^(.)\\1{7,16}$");
		var max_length_pattern = new RegExp("^.{100,}$");
		delete $rootScope.user.error_message;
		// var email = "bhuwanarora67@gmail.com";
		// var password = "test";
		var data_json = {"email": email, "password": password, "old_user": old_user};
		$scope.loading_icon = false;
		
		var success_callback = function(data){
			$rootScope.user.error_message = data.message;
			$rootScope.user.profile_status = data.profile_status;
			$rootScope.user.logged = true;
			$rootScope.user.id = data.user_id;
			$scope.loading_icon = false;
			var message = "INFO- Welcome back ";
			var timeout_event = notify($rootScope, message, $timeout);
			$scope.$on('destroy', function(){
				$timeout.cancel(timeout_event);
			});
			_is_logged_in();
			// $scope.$emit('getNotifications');
		}

		var error_callback = function(reason){
			$scope.loading_icon = false;
			$rootScope.user.error_message = reason.data.message;
			$rootScope.user.password = null;
		}

		if(!$rootScope.user.email){
			$rootScope.user.error_message = LoginConstants.EmailNotPresent;
		}
		else if(!$rootScope.user.password) {
			$rootScope.user.error_message = LoginConstants.PasswordNotPresent;
		}
		else if(!min_length_pattern.test($rootScope.user.password) && (!old_user)){
			$rootScope.user.error_message = LoginConstants.PasswordLengthError;
		}
		else if((not_repeat_pattern.test($rootScope.user.password)) && (!old_user)){
			$rootScope.user.error_message = LoginConstants.ChooseAMoreSecurePassword;
		}
		else if((max_length_pattern.test($rootScope.user.password)) && (!old_user)){
			$rootScope.user.error_message = LoginConstants.MaximumPasswordLengthError;	
		}
		else{
			$scope.loading_icon = true;
			websiteService.authenticate(data_json).then(success_callback, error_callback);
			// stropheService.start_connection();
		}
	}

		
	_bind_auth_listeners = function(){
		$scope.$on('event:google-plus-signin-success', function (event, authResult){
			websiteService.handle_google_user(authResult);
		    console.log("google login", authResult);
		    $scope._init_user();
		});

		$scope.$on('event:google-plus-signin-failure', function (event, authResult){
		    console.log("google login", authResult);
		});


	    $scope.$on('Facebook:statusChange', function(ev, data){
	    	console.log('Status: ', data);
	        if(data.status == LoginConstants.FacebookLoginStatusCheck) {
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
	    // var callback1 = function(){
     //      	return Facebook.isReady();
     //    }
     //    var callback2 = function(newVal){
     //      	if(newVal){
     //        	$scope.facebookReady = true;
     //      	}
     //    }
	    // $scope.$watch(callback1, callback2);
	}


    $scope.intent_login = function() {
        Facebook.getLoginStatus(function(response){
          	if(response.status == LoginConstants.FacebookLoginStatusCheck){
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
      		if (response.status == LoginConstants.FacebookLoginStatusCheck) {
        		// $rootScope.logged = true;
        		$scope.me();
        		
      		}
    	});
   	};
   
    $scope.me = function() {
        Facebook.api('/me', function(response){
        	// console.log(response);
        	websiteService.handle_facebook_user(response);
		    $scope.$apply(function(){
    			$rootScope.user = response;
        		$rootScope.user.thumb = response["thumb"];
		        $scope._init_user();
		    });
        });
        // $scope.fb_books();
    };

    $scope.fb_books = function(){
        FB.api(
		    "/me/books",
		    function(response) {
		      if(response && !response.error) {
		        websiteService.handle_facebook_books(response);
		      }
		    }
		);
		FB.api(
		    "/me/books.reads",
		    function(response) {
		      if(response && !response.error) {
		        websiteService.handle_facebook_books(response);
		      }
		    }
		);
		FB.api(
		    "/me/books.rates",
		    function(response) {
		      if(response && !response.error) {
		        websiteService.handle_facebook_books(response);
		      }
		    }
		);
		FB.api(
		    "/me/books.quotes",
		    function(response) {
		      if(response && !response.error) {
		        websiteService.handle_facebook_books(response);
		      }
		    }
		);
		FB.api(
		    "/me/books.wants_to_read",
		    function(response) {
		      if(response && !response.error) {
		        websiteService.handle_facebook_books(response);
		      }
		    }
		);
    }

    $scope._init_user = function(){
        $rootScope.user.profile_status = 0;
        $rootScope.user.logged = true;
    }
      
  	// $scope.logout = function() {
   //  	Facebook.logout(function() {
   //    		$scope.$apply(function() {
   //      		$rootScope.user   = {};
   //      		// $rootScope.logged = false;
   //    		});
   //  	});
  	// }

  	_is_logged_in = function(){
  		websiteService.get_user().then(function(data){
  			if(data["logged_in"]){
  				$rootScope.user.logged = true;
  				$rootScope.user.id = data["id"];
  				websiteService.get_user_details().then(function(data){
	  		  		angular.extend($rootScope.user, data);
	  	   		});
	  	   		$cookieStore.put('logged', true);
  				// stropheService.start_connection();
  			}
  		});
  	}

	_init = function(){
		$cookieStore.remove('tab');
		_is_logged_in();
		_bind_auth_listeners();
		// $scope.authenticate(true);
	}

	_init();
}]);