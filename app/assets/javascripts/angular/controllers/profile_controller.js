homeApp.controller('profileController', ["$scope", "userService", '$rootScope', "WebsiteUIConstants", 'ColorConstants', '$location', 'bookService', 'newsService', '$mdDialog', 'infinityService', '$timeout', 'sharedService', '$mdSidenav', function($scope, userService, $rootScope, WebsiteUIConstants, ColorConstants, $location, bookService, newsService, $mdDialog, infinityService, $timeout, sharedService, $mdSidenav){
	var _get_user_details = function(user, user_id){
		userService.get_user_details(user_id).then(function(data){
			user = data;
        });
	}

	$scope.toggle_genres = function(){
		$scope.show_genres = !$scope.show_genres;
	}

	$scope.get_feed = function(){
        $scope.info.selectedIndex = 1;
		if(!$scope.info.loading){
			var personal_feed = [];
			var id = $scope.active_user_id;
			$scope.info.loading = true;

			var _get_message = function(value){
				var message = "";
				switch(value.label){
					case "BookmarkNode":
						message = "Added to "+value.node.key;
						break;
					case "Listopia":
						break;
					case "CommunityNode":
						break;
					case "BlogNode":
						break;
					case "StatusNode":
						message = value.node.wrapper_content;
						break;
					case "EndorseNode":
						message = "Endorsed this book.";
						break;
					case "RatingNode":
						message = "Gave "+value.node.content + " rating on 10.";
						break;
					case "FollowsNode":
						if(angular.isDefined(value.community)){
							message = "Joined a room.";
						}
						else if(angular.isDefined(value.author)){
							message = "Followed an author.";
						}
						break;
					case "RecommendNode":
						message = "Recommended this book.";
				}
				return message;
			}

			var _group_feed = function(){
				var grouped_feed = [];
				var _book_exists = function(grouped_feed, book_id){
					var book_exists = false;
					var feed_index = 0;
					if(grouped_feed.length > 0){
						angular.forEach(grouped_feed, function(value, index){
							if(angular.isDefined(value.book)){
								if(value.book.id == book_id){
									book_exists = true;
									feed_index = index
								}
							}
						});
					}
					return {"status": book_exists, "index": feed_index};
				}

				angular.forEach(personal_feed, function(value){
					if(angular.isDefined(value.book)){
						var book = _book_exists(grouped_feed, value.book.id);
						if(book.status){
							delete value.book;
							grouped_feed[book.index].data.push(value)
						}
						else{
							if(angular.isDefined(value.book)){
								book = {"book": value.book};
								delete value.book;
								value = angular.extend(book, {"data": [value]});
							}
							this.push(value);
						}
					}
					else{
						this.push(value);
					}
				}, grouped_feed);
				personal_feed = grouped_feed;
			}

			if(angular.isUndefined($scope.personal_feed)){
				$scope.personal_feed = [];
			}

			var skip = $scope.personal_feed.length;
			userService.get_personal_feed(id, skip).then(function(data){
				if(data.length > 0){
					angular.forEach(data, function(value){
						if(angular.isDefined(value.book)){
							var message = _get_message(value);
							value = angular.extend(value, {"message": message});
						}
						else if(angular.isDefined(value.community)){
							var message = _get_message(value);
							value = angular.extend(value, {"message": message});
						}
						else{
							var message = _get_message(value);
							value = angular.extend(value, {"message": message});
						}
					});
				}
				$scope.info.loading = false;
				$scope.personal_feed = $scope.personal_feed.concat(data);
			});
		}
	}

	var _unauthenticated_user = function(){
        return ((getCookie("logged") == "") || (getCookie("logged") == null));
    }

	$scope.follow_user = function(){
		if(_unauthenticated_user()){
			$mdSidenav('signup').toggle();
		}
		else{
			$scope.profile_user.status = !$scope.profile_user.status;
			userService.follow($scope.profile_user.id, $scope.profile_user.status);
		}
	}

	var _set_data = function(data, array){
        angular.forEach(data, function(value){
            var random_int = Math.floor(Math.random()*ColorConstants.value.length);
            var json = {"colspan": 1,
                        "color": ColorConstants.value[random_int],
                        "rowspan": 1};
            value = angular.extend(value, json);
            this.push(value);
        }, array);
        return array;
    }

    $scope.show_book_dialog = function(book, event){
        sharedService.show_book_dialog($rootScope, $scope, book, event);
    }

    var _user_is_me = function(){
    	var user_is_me = false;
    	if($scope.active_user_id == $rootScope.user.id){
    		user_is_me = true;
    		$scope.info.my_profile = true;
        	$scope.hide_follow_links = false;
    	}
    	else{
    		$scope.info.my_profile = false;
        	$scope.hide_follow_links = true;	
    	}
    	return user_is_me;
    }

    var _handle_profile_data = function(){
        var user_is_me = _user_is_me();
    	if(user_is_me){
        	_set_my_profile();
        }
        else{
        	userService.get_user_details($scope.active_user_id).then(function(data){
    			$scope.profile_user = data;
        		debugger
    		});
        }
    }

    var _handle_id_from_url = function(url_parser){
    	var user_is_me = false;
        $scope.active_user_id = url_parser[2];
        if(angular.isDefined($rootScope.user)){
        	_handle_profile_data();
        }
        else{
        	userService.get_user_details().then(function(data){
				$rootScope.user = data;
		        _handle_profile_data();
	        });
        }
    }

    var _set_my_profile = function(){
    	$scope.profile_user = $rootScope.user;
        $scope.active_user_id = $scope.profile_user.id;
    }

    var _handle_me = function(){
        $scope.info.my_profile = true;
        $scope.hide_follow_links = false;
        if(angular.isUndefined($rootScope.user)){
        	var details_timeout = $timeout(function(){
        		userService.get_user_details().then(function(data){
					$rootScope.user = data;
			        _set_my_profile();
		        });
        	}, 100);
        	$scope.$on('destroy', function(){
            	$timeout.cancel(details_timeout);	
            });
        }
        else{
            _set_my_profile();
        }
    }

    var _get_feed = function(){
       	var feed_timeout = $timeout(function(){
        	$scope.get_feed();
       	}, 100);
       	$scope.$on('destroy', function(){
       		$timeout.cancel(feed_timeout);
       	});
    }

	var _init = (function(){
		$scope.profile_user = {};
		$scope.info.embed_share = true;

        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parser = regex.exec($location.absUrl());
        if(angular.isDefined(url_parser) && url_parser != null){
        	_handle_id_from_url(url_parser);
        }
        else{
        	_handle_me();
        }
       _get_feed();

    }());
}]);