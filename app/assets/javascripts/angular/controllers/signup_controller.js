homeApp.controller('signupController', ["$scope", "$rootScope", "Facebook", "$timeout", "$cookieStore", "LoginConstants", "WebsiteUIConstants", "$location", "$routeParams", "websiteService", "$mdSidenav", function($scope, $rootScope, Facebook, $timeout, $cookieStore, LoginConstants, WebsiteUIConstants, $location, $routeParams, websiteService, $mdSidenav){
    // $scope.processAuth = function(authResult){
    //     // Do a check if authentication has been successful.
    //     if(authResult['access_token']){
    //         // Successful sign in.
    //         $scope.signedIn = true;
    //         console.log("signedIn");
    //     } 
    //     else if(authResult['error'] == "immediate_failed") {
    //         // Error while signing in.
    //         gapi.auth.authorize({
    //             client_id: '917672049716-pl6i0qbuen1so84tg2b5vijg7qfjhash.apps.googleusercontent.com',
    //             scope: 'https://www.googleapis.com/auth/plus.login email',
    //             immediate: true
    //         }, function (authRes) {
    //             if (authRes['status']['signed_in']) {
    //                 console.log("signedIn", authResult['error']);
    //             }
    //         });
    //         console.log(" not signedIn", authResult['error']);
    //         $scope.signedIn = false;
    //     }
    // };

    $scope.close_signup_options = function(){
        $mdSidenav('signup').toggle();
    }

    // // When callback is received, we need to process authentication.
    // $scope.signInCallback = function(authResult) {
    //     $scope.$apply(function() {
    //         $scope.processAuth(authResult);
    //     });
    // };

    // $scope.renderSignInButton = function() {
    //     gapi.signin.render('signInButton',
    //         {
    //             'callback': $scope.signInCallback, // Function handling the callback.
    //             'clientid': '917672049716-pl6i0qbuen1so84tg2b5vijg7qfjhash.apps.googleusercontent.com', 
    //             'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
    //             'cookiepolicy': 'single_host_origin'
    //         }
    //     );
    // }

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
            _redirect_user();
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
   
    // var _bind_auth_listeners = function(){
    //     $scope.$on('event:google-plus-signin-success', function (event, authResult){
    //         websiteService.handle_google_user(authResult);
    //         console.log("google login", authResult);
    //         $scope._init_user();
    //     });

    //     $scope.$on('event:google-plus-signin-failure', function (event, authResult){
    //         console.log("google login", authResult);
    //     });
    // }
   
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
            if(angular.isUndefined($rootScope.user)){
                $rootScope.user = {};
            }
            if(angular.isDefined(FB)){
                FB.getLoginStatus(function(fbresponse) {
                   var token = fbresponse.authResponse.accessToken;
                    response = angular.extend(response, {"auth_response": token});
                    websiteService.handle_facebook_user(response).then(function(data){
                        $rootScope.user = angular.extend($rootScope.user, data);
                        $scope._init_user();
                        _redirect_user();
                    });
                    $rootScope.user = angular.extend($rootScope.user, response);
                });
            }
        });
    };

    var _redirect_user = function(){
        var redirect_url = getCookie("redirect_url");
        if($rootScope.user.login_count == 1){
            redirect_url = "/customise";
        }
        else{
            if(!redirect_url || (redirect_url.indexOf("signup") > 0)){
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
        websiteService.get_user().then(function(data){
            if(data["logged_in"]){
                $rootScope.user.logged = true;
                $rootScope.user.id = data["id"];
                websiteService.get_user_details().then(function(data){
                    angular.extend($rootScope.user, data);
                });
                $scope._init_user();
            }
        });
    }

    var _init = (function(){
        $rootScope.user = {'books': {'bookmarked':[], 'read': []},
                'authors': {'bookmarked': [], 'follow': []},
                'readers': {'follow': []},
                'logged': false};
        
    }());

}]);