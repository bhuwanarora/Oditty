websiteApp.controller('loginController', ['$scope', '$rootScope', 'websiteService', 'Facebook', 'stropheService', function($scope, $rootScope, websiteService, Facebook, stropheService){
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
			// $scope.show_login_form = true;
			// _profile_status_colors();
		// 	websiteService.get_user_details().then(function(data){
	  //   		$rootScope.user.books = data["books"];
	  //   	});
			$scope.$emit('getNotifications');
		}

		var error_callback = function(reason){
			$scope.loading_icon = false;
			$scope.error_message = reason.data.message;
			$rootScope.user.password = null;
		}
		if(!$rootScope.user.email){
			$scope.error_message = "Enter your email address";
		}
		else if (!$rootScope.user.password) {
			$scope.error_message = "Enter your password";
		}
		else if(!min_length_pattern.test($rootScope.user.password) && (!old_user)){
			$scope.error_message = "Minimum password length is 8";
		}
		else if((not_repeat_pattern.test($rootScope.user.password)) && (!old_user)){
			$scope.error_message = "Choose a more secure password";
		}
		else if((max_length_pattern.test($rootScope.user.password)) && (!old_user)){
			$scope.error_message = "Maximum password length is 100";	
		}
		else{
			$scope.loading_icon = true;
			websiteService.authenticate(data_json).then(success_callback, error_callback);
			stropheService.start_connection();
		}
	}

		
	_bind_auth_listeners = function(){
		$scope.$on('event:google-plus-signin-success', function (event, authResult) {
		    // console.log("google login", authResult);
		});

		$scope.$on('event:google-plus-signin-failure', function (event, authResult) {
		    // console.log("google login", authResult);
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


    $scope.intent_login = function() {
        Facebook.getLoginStatus(function(response){
          	if (response.status == 'connected'){
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
        Facebook.api('/me', function(response){
        	console.log(response);
		    $scope.$apply(function(){
		        $rootScope.user = response;
		        $rootScope.user.profile_status = 0;
		        $rootScope.user.thumb = "https://scontent-b-kul.xx.fbcdn.net/hphotos-ash3/t1.0-9/66784_415130785223231_1615890777_n.jpg";
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

	_init = function(){
		_bind_auth_listeners();
		// $scope.authenticate(true);
	}

	_init();	
}]);