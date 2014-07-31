websiteApp.controller('loginController', ['$scope', '$rootScope', 'websiteService', 'Facebook', 'stropheService', '$timeout', '$cookieStore', 'LoginConstants', function($scope, $rootScope, websiteService, Facebook, stropheService, $timeout, $cookieStore, LoginConstants){
	$scope.submit = function(event){
		var enter_pressed = event.keyCode == 13;
		if(enter_pressed){
			$scope.authenticate(true);
		}
	}

	$scope.authenticate = function(old_user){
		var email = $rootScope.user.email;
		var password = $rootScope.user.password;		
		var min_length_pattern = new RegExp("^.{8,}$");
		var not_repeat_pattern = new RegExp("^(.)\\1{7,16}$");
		var max_length_pattern = new RegExp("^.{100,}$");
		$scope.error_message = "";
		// var email = "bhuwanarora67@gmail.com";
		// var password = "test";
		var data_json = {"email": email, "password": password, "old_user": old_user};
		$scope.loading_icon = false;
		var success_callback = function(data){
			$scope.error_message = data.message;
			$rootScope.user.profile_status = data.profile_status;
			$rootScope.user.logged = true;
			$rootScope.user.id = data.user_id;
			$scope.loading_icon = false;
			var message = "INFO- Welcome back "+$rootScope.user.name;
			var timeout_event = notify($rootScope, message, $timeout);
			$scope.$on('destroy', function(){
				$timeout.cancel(timeout_event);
			});
			_is_logged_in();
			// $scope.$emit('getNotifications');
		}

		var error_callback = function(reason){
			$scope.loading_icon = false;
			$scope.error_message = reason.data.message;
			$rootScope.user.password = null;
		}
		if(!$rootScope.user.email){
			$scope.error_message = LoginConstants.EmailNotPresent;
		}
		else if (!$rootScope.user.password) {
			$scope.error_message = LoginConstants.PasswordNotPresent;
		}
		else if(!min_length_pattern.test($rootScope.user.password) && (!old_user)){
			$scope.error_message = LoginConstants.PasswordLengthError;
		}
		else if((not_repeat_pattern.test($rootScope.user.password)) && (!old_user)){
			$scope.error_message = LoginConstants.ChooseAMoreSecurePassword;
		}
		else if((max_length_pattern.test($rootScope.user.password)) && (!old_user)){
			$scope.error_message = LoginConstants.MaximumPasswordLengthError;	
		}
		else{
			$scope.loading_icon = true;
			websiteService.authenticate(data_json).then(success_callback, error_callback);
			stropheService.start_connection();
		}
	}

		
	_bind_auth_listeners = function(){
		$scope.$on('event:google-plus-signin-success', function (event, authResult){
			
			// debugger
			// websiteService.handle_google_user(authResult);
		    // console.log("google login", authResult);
		});

		$scope.$on('event:google-plus-signin-failure', function (event, authResult){
		    // console.log("google login", authResult);
		});


	    $scope.$on('Facebook:statusChange', function(ev, data) {
	        if (data.status == LoginConstants.FacebookLoginStatusCheck) {
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


    $scope.intent_login = function() {
        Facebook.getLoginStatus(function(response){
          	if (response.status == LoginConstants.FacebookLoginStatusCheck){
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
        		$rootScope.logged = true;
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
		        $rootScope.user.profile_status = 0;
		        $rootScope.user.thumb = response["thumb"];
		        // _profile_status_colors();
		        $rootScope.user.logged = true;
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

  	_is_logged_in = function(){
  		websiteService.get_user().then(function(data){
  			if(data["logged_in"]){
  				$rootScope.user.logged = true;
  				$rootScope.user.id = data["id"];
  				$scope.$emit('getNotifications');
  				websiteService.get_user_details().then(function(data){
	  		  		angular.extend($rootScope.user, data);
	  	   		});
	  	   		$cookieStore.put('logged', true);
  				stropheService.start_connection();
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