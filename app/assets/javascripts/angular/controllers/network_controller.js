homeApp.controller('networkController', ["$scope", "$rootScope", 'networkService', '$location', '$mdToast', 'userService', function($scope, $rootScope, networkService, $location, $mdToast, userService){
	$scope.get_followers = function(){
		$scope.selectedIndex = 0;
		$scope.load_followers();
	}

	$scope.toggle_follow = function(user){
		if(angular.isDefined(user.status) && status != null){
			user.status = null;
			userService.follow(user.id, false);
		}
		else{
			user.status = true;
			userService.follow(user.id, true);	
		}
	}

	$scope.load_followers = function(){
		if(!$scope.info.loading){
			$scope.info.loading = true;
			var skip = $scope.users_list.length;
			var id = $scope.active_user_id;
			networkService.get_followers(skip, id).then(function(data){
				$scope.users_list = $scope.users_list.concat(data);
				$scope.info.loading = false;
			});
		}
	}

	$scope.load_users_followed = function(){
		if(!$scope.info.loading){
			$scope.info.loading = true;
			var skip = $scope.users_list.length;
			var id = $scope.active_user_id;
			networkService.get_users_followed(skip, id).then(function(data){
				$scope.users_list = $scope.users_list.concat(data);
				$scope.info.loading = false;
			});	
		}
	}

    $scope.get_users_followed = function(){
		$scope.selectedIndex = 1;
		$scope.load_users_followed();
	}

	$scope.load_users = function(){
		if(angular.isUndefined($scope.users_list)){
			$scope.users_list = [];
		}
		var followers = $location.path() == "/profile/followers";
		var following = $location.path() == "/profile/followings";
		if(followers){
           $scope.get_followers();
		}
		else if(following){
           $scope.get_users_followed();
        }
	}

	$scope.say_thanks = function(){
		$mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/invite_success.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
	}

	$scope.getToastPosition = function(){
		return Object.keys($scope.toast_position)
          .filter(function(pos) { return $scope.toast_position[pos]; })
          .join(' ');
	}

	$scope.facebook_invite = function(){
		// _facebook_init();
		if(navigator.userAgent.indexOf("Mobi") > -1){
			FB.ui({
				method: 'send',
				title: 'Hey! Check this awesome book discovery website..',
				message: 'Spread the love for books',
				link: 'http://www.oditty.me/'
			}, $scope.say_thanks());
		}
		else{
			window.location.replace("https://www.facebook.com/dialog/send?app_id=667868653261167&link=http://www.oditty.me&redirect_uri=http://oditty.me/network?q=0");
		}
	}

    var _init = (function(){
	 	// var regex = /[?&]([^=#]+)=([^&#]*)/g;
		// var url_parser = regex.exec($location.absUrl());
		// if(angular.isDefined(url_parser) && url_parser != null){
		// 	// var follow_state = url_parser[2];
		// 	// $scope.follow_state = follow_state;
		// }

		var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parser = regex.exec($location.absUrl());
        if(angular.isDefined(url_parser) && url_parser != null){
        	$scope.active_user_id = url_parser[2];
        }

		$scope.load_users();

		$scope.info.my_profile = true;
    	if(angular.isUndefined($rootScope.user)){
    		userService.get_user_details().then(function(data){
                $rootScope.user = data;
                $scope.profile_user = $rootScope.user;
				$scope.active_user_id = $scope.profile_user.id;
            });
    	}
    	else{
        	$scope.profile_user = $rootScope.user;
			$scope.active_user_id = $scope.profile_user.id;
    	}

		$scope.hide_follow = true;

		$scope.toast_position = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
	}());
}]);