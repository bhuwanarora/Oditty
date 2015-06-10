homeApp.controller('profileController', ["$scope", "userService", '$rootScope', "WebsiteUIConstants", 'ColorConstants', '$location', 'bookService', 'newsService', '$mdDialog', 'infinityService', '$timeout', 'sharedService', function($scope, userService, $rootScope, WebsiteUIConstants, ColorConstants, $location, bookService, newsService, $mdDialog, infinityService, $timeout, sharedService){
	var _get_user_details = function(){
		userService.get_user_details($scope.active_user_id).then(function(data){
			$scope.profile_user = data;
		});
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
						message = "Joined room.";
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
						var random_int = Math.floor(Math.random() * ColorConstants.value.length);
						if(angular.isDefined(value.book)){
							value.book = angular.extend(value.book, {"color": ColorConstants.value[random_int]});
						}
						this.push(value);
					}, personal_feed);
					_group_feed();
					angular.forEach(personal_feed, function(value){
						if(angular.isDefined(value.book)){
							angular.forEach(value.data, function(feed_data){
								var message = _get_message(feed_data);
								feed_data = angular.extend(feed_data, {"message": message});
							});
						}
						else if(angular.isDefined(value.community)){
							var message = _get_message(value);
							feed_data = angular.extend(value, {"message": message});
						}
						else{
							var message = _get_message(value);
							var feed_data = angular.extend(value, {"message": message});
							value.data = [feed_data];
						}
					});
				}
				$scope.info.loading = false;
				$scope.personal_feed = $scope.personal_feed.concat(personal_feed);
			});
		}
	}

	$scope.follow_user = function(){
		$scope.profile_user.status = !$scope.profile_user.status;
		userService.follow($scope.profile_user.id, $scope.profile_user.status);
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
    //     $rootScope.active_book = book;
    //     $rootScope.active_book.show_info_only = true;
    //     $mdDialog.show({
    //         templateUrl: '/assets/angular/html/news/book.html',
    //         scope: $scope,
    //         preserveScope: true,
    //         clickOutsideToClose: true,
    //         targetEvent: event
    //     });
    //     event.stopPropagation();
        sharedService.show_book_dialog($rootScope, $scope, book, event);    	
    }

	var _init = (function(){
        $scope.info.books = [];
		$scope.profile_user = {};
		$scope.info.embed_share = true;
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parser = regex.exec($location.absUrl());
        if(angular.isDefined(url_parser) && url_parser != null){
            $scope.active_user_id = url_parser[2];
            if(angular.isDefined($rootScope.user)){
                $scope.profile_user = {"id": $scope.active_user_id};
                if($rootScope.user.id == $scope.active_user_id){
                    $scope.info.my_profile = true;
                }
                else{
                    $scope.info.my_profile = false;
                    $scope.hide_follow_links = true;
                }
            }
            else{
                $scope.info.my_profile = false;
                $scope.hide_follow_links = true;
            }
            var details_timeout = $timeout(function(){
            	_get_user_details();
            }, 100);
            $scope.$on('destroy', function(){
            	$timeout.cancel(details_timeout);	
            });
        }
        else{
            $scope.info.my_profile = true;
            if(angular.isUndefined($rootScope.user)){
            	var details_timeout = $timeout(function(){
	                userService.get_user_details().then(function(data){
	                    $rootScope.user = data;
	                    $scope.profile_user = $rootScope.user;
	                    $scope.active_user_id = $scope.profile_user.id;
	                });
            	}, 100);
            	$scope.$on('destroy', function(){
	            	$timeout.cancel(details_timeout);	
	            });
            }
            else{
                $scope.profile_user = $rootScope.user;
                $scope.active_user_id = $scope.profile_user.id;
            }
        }
       
       	var feed_timeout = $timeout(function(){
        	$scope.get_feed();
       	}, 100);
       	$scope.$on('destroy', function(){
       		$timeout.cancel(feed_timeout);
       	});

    }());
}]);