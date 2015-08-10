homeApp.controller('signupController', ["$scope", "$rootScope", "Facebook", "$timeout", "$cookieStore", "LoginConstants", "WebsiteUIConstants", "$location", "$routeParams", "websiteService", function($scope, $rootScope, Facebook, $timeout, $cookieStore, LoginConstants, WebsiteUIConstants, $location, $routeParams, websiteService){
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
                    console.log("signedIn", authResult['error']);
                }
            });
            console.log(" not signedIn", authResult['error']);
            $scope.signedIn = false;
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

        var data_json = {"email": email, "password": password, "old_user": old_user};
        
        var success_callback = function(data){
            $rootScope.user = data.user;
            $cookieStore.put('user', data.user);
            $scope._init_user();
            $scope.info.hide_signin = true;
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
        }
    }
   
    var _bind_auth_listeners = function(){
        $scope.$on('event:google-plus-signin-success', function (event, authResult){
            websiteService.handle_google_user(authResult);
            console.log("google login", authResult);
            $scope._init_user();
        });

        $scope.$on('event:google-plus-signin-failure', function (event, authResult){
            console.log("google login", authResult);
        });
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
                $scope.me();
            }
        }, {scope: 'email'});
    };
   
    $scope.me = function() {
        deleteCookie("redirect_url");
        setCookie("redirect_url", $location.$$absUrl);
        Facebook.api('/me', function(response){
            websiteService.handle_facebook_user(response).then(function(data){
                $rootScope.user = $rootScope.user.extend(data);
                $scope._init_user();
                _redirect_user();
            });
            $rootScope.user = response;
            Facebook.api('me/picture?redirect=false&type=large', function(response){
                websiteService.save_user_info(response);
            });
        });
    };

    var _redirect_user = function(){
        var redirect_url = getCookie("redirect_url");
        if($rootScope.user.login_count == 1){
            redirect_url = "/customise";
        }
        else{
            if(!redirect_url){
                redirect_url = "/home";
            }
        }
        window.location.href = redirect_url;
    }

    $scope._init_user = function(){
        $rootScope.user.logged = true;
        setCookie("logged", true, 31);
        setCookie("logged", $rootScope.user.id, 31);
    }
      
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
                $scope._init_user();
                _handle_push_notifications();     
            }
        });
    }

    var _init = (function(){
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

        // $rootScope.user.logged = true;
        // setCookie("logged", true, 31);
        // setCookie("logged", 4986324, 31);
    }());

}]);