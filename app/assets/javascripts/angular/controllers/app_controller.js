homeApp.controller('appController', ["$scope", "$rootScope", "$mdSidenav", '$mdDialog', 'shelfService', 'userService', '$cookieStore', '$timeout', '$location', 'feedService', '$filter', 'Facebook', 'websiteService', '$mdBottomSheet', function($scope, $rootScope, $mdSidenav, $mdDialog, shelfService, userService, $cookieStore, $timeout, $location, feedService, $filter, Facebook, websiteService, $mdBottomSheet){

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    }

    // $scope.stopPropagation = function(){
    //     if($scope.constant.show_book){
    //         // $scope.constant = {"show_book": true};
    //     }
    // }

    $scope.invite_friends = function(event){
        $mdDialog.show({
            templateUrl: 'assets/angular/html/shared/invite.html',
            clickOutsideToClose: true,
            hasBackdrop: false,
            targetEvent: event,
            scope: $rootScope,
            preserveScope: true
        });
        event.stopPropagation();
    }

    $scope.show_signin_options = function(event){
        $mdSidenav('signup').toggle();
        event.stopPropagation();
    }

    $scope.show_search_bar = function(){
        $scope.info.mobile_search = !$scope.info.mobile_search;
    }

    $scope.show_indexes = function(book, event){
        $scope.book = book;
        $mdDialog.show({
            templateUrl: 'assets/angular/html/shared/rating.html',
            clickOutsideToClose: true,
            hasBackdrop: false,
            targetEvent: event,
            scope: $scope,
            preserveScope: true
        });
        event.stopPropagation();
    }

    $scope.toggle_notifications = function(event){
        $scope.info.notifications_seen = true;
        $scope.info.loading = true;
        var notifications_timeout = $timeout(function(){
            feedService.get_notifications().then(function(data){
                $scope.info.loading = false;
                $scope.notifications = [];
                angular.forEach(data, function(value){
                    var timestamp = $filter('timestamp')(value.created_at, "date:'h:mm a, dd MMM'");
                    switch(value.label){
                        case "FollowsNode":
                            value.message = "<div layout-padding><div><a href='/profile?id="+value.data.user.id+"'>"+value.data.user.name+"</a><span> started following you.</span></div></div>";
                            break;
                        case "RecommendNode":
                            value.message = "<div layout-padding><div><span><a href='/profile?id="+value.data.user.id+"'>"+value.data.user.name+"</a> recommended you <a href='/book?id="+value.data.book.id+"'>"+value.data.book.title+"</a><span><span>&nbsp;by&nbsp;<a href='/author?id="+value.data.author.id+"'>"+value.data.author.name+"</a></span>.</div></div>";
                            break;
                        case "BorrowNode":
                            value.message = "<div layout-padding><div><a href='/profile?id="+value.data.user.id+"'>"+value.data.user.name+"</a><span> is looking to borrow </span><span><a href='/book?id="+value.data.book.id+"'>"+value.data.book.title+"</a></span><span>&nbsp;by&nbsp;<a href='/author?id="+value.data.author.id+"'>"+value.data.author.name+"</a></span></div></div>";
                    }
                    this.push(value);
                }, $scope.notifications);
            });
        }, 100);
        $scope.$on('destroy', function(){
            $timeout.cancel(notifications_timeout);
        });
        $mdSidenav('notifications').toggle();
        $scope.navigation_options = false;
        event.stopPropagation();
    }

    $scope.close_popups = function(wheel){
        $scope.show_notifications = false;
        $rootScope.shelves_visible = false;
        $scope.navigation_options = false;
        if(angular.isUndefined(wheel)){
            $scope.info.status_state = false;
        }
        // $mdSidenav('left').close();
        // $mdBottomSheet.hide({"test": "test"});
    }

	$scope.toggleLeft = function(event){
	    $mdSidenav('left').toggle();
        event.stopPropagation();
	};

	$scope.toggleRight = function(event){
	    $mdSidenav('right').toggle();
        event.stopPropagation();
	};

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    };

    $scope.toggle_navigation_options = function(event){
        $scope.navigation_options = !$scope.navigation_options;
        $scope.show_notifications = false;
        event.stopPropagation();
    }

    var _get_user_details = function(){
        var user_timeout = $timeout(function(){
            if(angular.isUndefined($rootScope.user)){
                userService.get_user_details().then(function(data){
                    if(angular.equals(data, {}) && (getCookie("logged") != "")){
                        deleteCookie("logged");
                        $scope.info.hide_signin = false;
                    }
                    else{
                        $rootScope.user = data;
                        _handle_facebook_data();
                    }
                });
            }
            else{
                _handle_facebook_data();
            }
        }, 100);

        $scope.$on('destroy', function(){
            $timeout.cancel(user_timeout);
        });
    }

    var _handle_facebook_data = function(){
        var _fetch_books = function(){
            Facebook.api('me/books', function(response){
                websiteService.handle_facebook_books(response);
            });
            Facebook.api('me/books.reads', function(response){
                websiteService.handle_facebook_books(response);
            });
            Facebook.api('me/books.wants_to_read', function(response){
                websiteService.handle_facebook_books(response);
            });
        }

        var _fetch_picture = function(){
            Facebook.api('me/picture?redirect=false&type=large', function(response){
                websiteService.save_user_info(response);
            });
        }

        var _fetch_likes = function(){
            Facebook.api('me/likes', function(response){
                websiteService.handle_facebook_likes(response);
            });
        }

        var _fetch_likes_from_database = function(){
            userService.get_facebook_likes().then(function(data){
                $scope.facebook_likes = data;
                if(data != null && data.length >0){
                    angular.forEach(data, function(value){
                        var app_id = value.app_id;
                        _fetch_like_info(app_id);
                    });
                }
            });
        }

        var _fetch_book_info = function(app_id){
            Facebook.api(
                "/"+app_id,
                function (response) {
                    if(response && !response.error){
                        websiteService.handle_facebook_books(response);
                    }
                }
            );
        }

        var _fetch_books_from_database = function(){
            userService.get_social_books().then(function(data){
                $scope.social_books = data;
                if(data != null && data.length >0){
                    angular.forEach(data, function(value){
                        var app_id = value.app_id;
                        _fetch_book_info(app_id);
                    });
                }
            });
        }

        var _fetch_like_info = function(app_id){
            Facebook.api(
                "/"+app_id,
                function (response) {
                    if (response && !response.error){
                        websiteService.set_like_info(response);
                    }
                }
            );
        }
        
        $scope.$on('Facebook:statusChange', function(ev, data){
            var time = (new Date().getTime())/1000;
            if(angular.isDefined($rootScope.user.facebook_books_retrieval_time)){
                var books_retrieval_time_difference = (time-$rootScope.user.facebook_books_retrieval_time)/(3600*24*31);
                if(books_retrieval_time_difference > 1){
                    _fetch_books();
                }
                else{
                    _fetch_books_from_database();
                }
            }
            else{
                _fetch_books();
            }

            if(angular.isDefined($rootScope.user.facebook_likes_retrieval_time)){
                var likes_retrieval_time_difference = (time-$rootScope.user.facebook_likes_retrieval_time)/(3600*24*31);
                if(likes_retrieval_time_difference > 1){
                    _fetch_likes();
                }
                else{
                    _fetch_likes_from_database();
                }
            }
            else{
                _fetch_likes();
            }
            _fetch_picture();
        });
    }

    $scope.fetch_todos = function(){
        userService.get_todos("home").then(function(data){
            $scope.todo = data;
            setCookie("todo", JSON.stringify(data));
        });
    }

    var _init = (function(){
        $scope.visible_search_bar = true;
        $scope.info = {};
        $scope.info.show_share = false;
        var url = $location.absUrl();

        _get_user_details();

        // var _handle_labels = function(){
        //     if(angular.isUndefined($cookieStore.get('labels')) || $cookieStore.get('labels') == null || $cookieStore.get('labels').length == 0){
        //         var data_timeout = $timeout(function(){
        //             shelfService.get_all_shelves().then(function(data){
        //                 $rootScope.labels = data;
        //                 $cookieStore.put('labels', data);
        //             });
        //         }, 100);
        //         $scope.$on('destroy', function(){
        //             $timeout.cancel(data_timeout);
        //         });
        //     }
        //     else{
        //         $rootScope.labels = $cookieStore.get('labels');
        //     }
        // }

        $scope.search_results = [];

        if(getCookie("logged") != ""){
            $scope.info.hide_signin = true;
        }

        $scope.data = {"selectedIndex" : 0};
        // deleteCookie("todo");

        var todo = getCookie("todo");

        if(!todo){
            $scope.fetch_todos();
        }
        else{
            $scope.todo = JSON.parse(todo);
        }
    }());

}]);