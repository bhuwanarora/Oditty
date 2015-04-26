app.controller('signupController', ["$scope", "$rootScope", "Facebook", "$timeout", "$cookieStore", "LoginConstants", "WebsiteUIConstants", "$location", "$routeParams", "websiteService", function($scope, $rootScope, Facebook, $timeout, $cookieStore, LoginConstants, WebsiteUIConstants, $location, $routeParams, websiteService){
    // Here we do the authentication processing and error handling.
    // Note that authResult is a JSON object.
    $scope.processAuth = function(authResult){
        // Do a check if authentication has been successful.
        if(authResult['access_token']){
            // Successful sign in.
            $scope.signedIn = true;
            console.log("signedIn");
        } 
        else if(authResult['error'] == "immediate_failed") {
            // Error while signing in.
            gapi.auth.authorize({
                client_id: '917672049716-pl6i0qbuen1so84tg2b5vijg7qfjhash.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/plus.login email',
                immediate: true
            }, function (authRes) {
                if (authRes['status']['signed_in']) {
                    console.log("signedIn",authResult['error']);
                }
            });
            console.log(" not signedIn",authResult['error']);
            $scope.signedIn = false;
 
            // Report error.
        }
    };

    // // When callback is received, we need to process authentication.
    $scope.signInCallback = function(authResult) {
        $scope.$apply(function() {
            $scope.processAuth(authResult);
        });
    };

    $scope.renderSignInButton = function() {
        gapi.signin.render('signInButton',
            {
                'callback': $scope.signInCallback, // Function handling the callback.
                'clientid': '917672049716-pl6i0qbuen1so84tg2b5vijg7qfjhash.apps.googleusercontent.com', 
                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                'cookiepolicy': 'single_host_origin'
            }
        );
    }

    $scope.submit = function(event){
        var enter_pressed = event.keyCode == WebsiteUIConstants.Enter;
        if(enter_pressed){
            $scope.authenticate(true);
        }
        event.stopPropagation();
    }

    $scope.recover_password = function(){
        var success_callback = function(data){
            $scope.loading_icon = false;
            $scope.user.error_message = data.message;
            $rootScope.user.password = null;
        }

        var error_callback = function(data){
            $scope.$apply(function(){
                $scope.loading_icon = false;
                $scope.user.error_message = data.message;
                $rootScope.user.password = null;
            });
        }
        if(!$rootScope.user.email){
            $scope.user.error_message = LoginConstants.EmailNotPresent;
        }
        else{
            $scope.loading_icon = true;
            websiteService.recover_password("email="+$rootScope.user.email).then(success_callback, error_callback);
        }
    }

    $scope.authenticate = function(old_user){
        if(!old_user){
            $scope.show_sign_up = true;
        }
        else{
            $scope.show_sign_up = false;    
        }
        var email = $rootScope.user.email;
        var password = $rootScope.user.password;
        var min_length_pattern = new RegExp("^.{8,}$");
        var not_repeat_pattern = new RegExp("^(.)\\1{7,16}$");
        var max_length_pattern = new RegExp("^.{100,}$");

        // var email = "bhuwanarora67@gmail.com";
        // var password = "test";
        var data_json = {"email": email, "password": password, "old_user": old_user};
        
        var success_callback = function(data){
            $rootScope.user.id = data.user_id;
            $scope._init_user();
            window.location.href = "/home";
        }

        var error_callback = function(reason){
            console.debug("error_callback", reason);
            $scope.loading_icon = false;
            $scope.user.error_message = reason.data.message;
            $rootScope.user.password = null;
        }

        if(!$rootScope.user.email){
            $scope.user.error_message = LoginConstants.EmailNotPresent;
        }
        else if(!$rootScope.user.password) {
            $scope.user.error_message = LoginConstants.PasswordNotPresent;
        }
        else if(!min_length_pattern.test($rootScope.user.password) && (!old_user)){
            $scope.user.error_message = LoginConstants.PasswordLengthError;
        }
        else if((not_repeat_pattern.test($rootScope.user.password)) && (!old_user)){
            $scope.user.error_message = LoginConstants.ChooseAMoreSecurePassword;
        }
        else if((max_length_pattern.test($rootScope.user.password)) && (!old_user)){
            $scope.user.error_message = LoginConstants.MaximumPasswordLengthError;
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
            console.log('facebookStatus: ', data);
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
     //         return Facebook.isReady();
     //    }
     //    var callback2 = function(newVal){
     //         if(newVal){
     //         $scope.facebookReady = true;
     //         }
     //    }
        // $scope.$watch(callback1, callback2);
    }
   
    $scope.intent_login = function(){
        $scope.loading_icon = true;
        if(!$rootScope.user.fb_connect){
            $scope.login();
        }
        else{
            $rootScope.logged = true;
            $scope.me();
        }
    }; 
      
    $scope.login = function() {
        Facebook.login(function(response){
            if (response.status == LoginConstants.FacebookLoginStatusCheck) {
                // $rootScope.logged = true;
                $scope.me();
            }
        }, {scope: 'email'});
    };
   
    $scope.me = function() {
        Facebook.api('/me', function(response){
            websiteService.handle_facebook_user(response).then(function(){
                $scope._init_user();
                // $scope._is_logged_in();
                window.location.href = "/home";
            });
            $rootScope.user = response;
            Facebook.api('me/picture?redirect=false&type=large', function(response){
                websiteService.save_user_info(response);
            });

        });
    };

    $scope._init_user = function(){
        $rootScope.user.logged = true;
        $cookieStore.put('logged', true);
    }
      
    // $scope.logout = function() {
   //   Facebook.logout(function() {
   //           $scope.$apply(function() {
   //           $rootScope.user   = {};
   //           // $rootScope.logged = false;
   //           });
   //   });
    // }

    $scope._is_logged_in = function(){
        var _handle_push_notifications = function(){
            websiteService.get_personal_notifications().then(function(data){
                $rootScope.user.push_notifications = [];
                angular.forEach(data, function(value){
                    var json = angular.extend({"id": value[1]}, value[0]["data"]);
                    this.push(json);
                }, $rootScope.user.push_notifications);
            });
        }

        websiteService.get_user().then(function(data){
            if(data["logged_in"]){
                $rootScope.user.logged = true;
                $rootScope.user.id = data["id"];
                websiteService.get_user_details().then(function(data){
                    angular.extend($rootScope.user, data);
                });
                $cookieStore.put('logged', true);
                // $scope._on_authenticate();
                _handle_push_notifications();     
                // stropheService.start_connection();
            }
        });
    }

    $scope._redirect = function(){
        var routeParams = $routeParams;
        if(angular.isDefined($routeParams.url)){
            $location.path("/user/"+$rootScope.user.id+$routeParams.url);
        }
    }

    var _init = (function(){
        // $cookieStore.remove('tab');
        // $scope.login_active = true;
        // $scope._is_logged_in();
        _bind_auth_listeners();
        $rootScope.user = {'books': {'bookmarked':[], 'read': []},
                'authors': {'bookmarked': [], 'follow': []},
                'readers': {'follow': []},
                'logged': false};
        $rootScope.user.fb_connect = false;
        Facebook.getLoginStatus(function(response){
            if(response.status === LoginConstants.FacebookLoginStatusCheck){
               $rootScope.user.fb_connect = true;
            }
        });

        var index = 0;
        var timer = 500;
        var _update_description = function(index){
            $scope.description = [];    
            $scope.description.splice(0, 0, LoginConstants.Description[index]);
        }

        angular.forEach(LoginConstants.Description, function(){
            if(index == 0){
                _update_description(index);
                index = index + 1;
            }
            else{
                $timeout(function(){
                    _update_description(index);
                    index = index + 1;
                }, timer);
            }
            timer = timer + 1500;
        });
        // $scope.renderSignInButton();
    }());

}]);