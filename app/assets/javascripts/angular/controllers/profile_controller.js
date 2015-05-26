homeApp.controller('profileController', ["$scope", "userService", '$rootScope', "WebsiteUIConstants", 'ColorConstants', '$location', 'bookService', 'newsService', '$mdDialog', 'infinityService', function($scope, userService, $rootScope, WebsiteUIConstants, ColorConstants, $location, bookService, newsService, $mdDialog, infinityService){
	var _get_user_details = function(){
		userService.get_user_details($scope.active_user_id).then(function(data){
			$scope.profile_user = data;
		});
	}

    $scope.toggle_circles = function(){
        $scope.info.circles = !$scope.info.circles;
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
						message = "Joined community.";
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

	$scope.search_book = function(event){
		
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

    $scope.show_unexplored_subject_books = function(){
        if(angular.isUndefined($scope.books_from_unexplored_subjects)){
            $scope.info.loading = true;
            infinityService.get_books_from_unexplored_subjects().then(function(data){
                $scope.books_from_unexplored_subjects = data.books;
                $scope.unexplored_subject = data.info;
                $scope.info.loading = false;
            });
        }
    }

    $scope.goto_user_profile = function(){
        window.location.href = "/profile?id=" + $scope.info.active_tag.id;
    }

    $scope.goto_author_profile = function(){
        window.location.href = "/author?id=" + $scope.info.active_tag.id;   
    }

    $scope.show_books_on_friend_shelves = function(){
        if(angular.isUndefined($scope.friends) || $scope.friends.length == 0){
            $scope.info.active_tab = "friend_shelves";
            $scope.info.loading = true;
            infinityService.get_books_on_friends_shelves().then(function(data){
                angular.forEach(data, function(value){
                    if((value.info[0].image_url == null) || (value.info[0].image_url == "")){
                        var image_url = "http://www.sessionlogs.com/media/icons/defaultIcon.png";
                    }
                    else{
                        var image_url = value.info[0].image_url;
                    }
                    var json = {"image_url": image_url, "view_count": 100, "name": value.info[0].first_name, "id": value.info[0].id};
                    value = angular.extend(value, json);
                    value.books = _set_data(value.books, []);
                    if(value.name != null){
                        this.push(value);
                    }
                }, $scope.friends);
                $scope.info.active_tag = $scope.friends[0];
                $scope.info.loading = false;
            });
        }
        else{
            var temp = $scope.friends;
            $scope.friends = [];
            $scope.info.loading = true;
            var timeout_event = $timeout(function(){
                $scope.info.loading = false;
                $scope.friends = temp;
                $scope.info.active_tag = $scope.friends[0];
            }, 1000);
            $scope.$on('destroy', function(){
                $timeout.cancel(timeout_event);
            });
        }
    }

     $scope.show_book_dialog = function(book, event){
        $rootScope.active_book = book;
        $rootScope.active_book.show_info_only = true;
        $mdDialog.show({
            templateUrl: '/assets/angular/html/news/book.html',
            scope: $scope,
            preserveScope: true,
            clickOutsideToClose: true,
            targetEvent: event
        });
        event.stopPropagation();
    }

    $scope.show_books_for_era = function(){
        if(angular.isUndefined($scope.books_from_favourite_era)){
            $scope.info.loading = true;
            delete $scope.info.active_tag;
            infinityService.get_books_from_favourite_era().then(function(data){
                data = data[0];
                $scope.books_from_favourite_era = [];
                _set_data(data.books, $scope.books_from_favourite_era);
                $scope.likeable_era = data.info;
                $scope.info.loading = false;
            });
        }
    }

    $scope.show_books_for_category = function(){
        if(angular.isUndefined($scope.books_from_favourite_category)){
            $scope.info.loading = true;
            delete $scope.info.active_tag;
            infinityService.get_books_from_favourite_category().then(function(data){
                $scope.books_from_favourite_category = [];
                _set_data(data.books, $scope.books_from_favourite_category);
                $scope.likeable_category = data.info;
                $scope.info.loading = false;
            });
        }
    }

    $scope.show_books_for_author = function(){
        $scope.info.selectedIndex = 0;
        if(angular.isUndefined($scope.books_from_favourite_author)){
            $scope.books_from_favourite_author = [];
            $scope.info.active_tab = "favourite_author";
            $scope.info.loading = true;
            infinityService.get_books_from_favourite_author().then(function(data){
                angular.forEach(data, function(value){
                    var json = {"image_url": "http://rd-authors.readersdoor.netdna-cdn.com/"+value.id+"/M.png", 
                                "view_count": 100};
                    value = angular.extend(value, json);
                    value.books = _set_data(value.books, []);
                    this.push(value);
                }, $scope.books_from_favourite_author);
                $scope.info.active_tag = $scope.books_from_favourite_author[0];
                $scope.info.loading = false;
            });
        }
        else{
            $scope.info.active_tag = $scope.books_from_favourite_author[0];
        }
    }

    $scope.refresh_data = function(active_item){
        $scope.info.active_tag = active_item;
    }

    $scope.show_small_reads = function(){
        if(angular.isUndefined($scope.small_reads)){
            $scope.info.loading = true;
            $scope.info.active_tab = "small_read";
            delete $scope.info.active_tag;
            infinityService.get_small_reads().then(function(data){
                $scope.small_reads = [];
                _set_data(data, $scope.small_reads);
                $scope.info.loading = false;
            });
        }
    }

	var _init = (function(){
        $scope.info.books = [];
        $scope.active_tab = {};
        $scope.friends = [];
		$scope.profile_user = {};
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
            _get_user_details();
        }
        else{
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
        }
        if($scope.info.my_profile){
    		$scope.info.selectedIndex = 0;
    		$scope.show_books_for_author();
        }
        else{
            $scope.info.selectedIndex = 1;
            $scope.get_feed();   
        }

    }());

}]);