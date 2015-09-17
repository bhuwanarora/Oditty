homeApp.controller('appController', ["$scope", "$rootScope", "$mdSidenav", '$mdDialog', 'shelfService', 'userService', '$cookieStore', '$timeout', '$location', 'feedService', '$filter', 'Facebook', 'websiteService', '$mdBottomSheet', function($scope, $rootScope, $mdSidenav, $mdDialog, shelfService, userService, $cookieStore, $timeout, $location, feedService, $filter, Facebook, websiteService, $mdBottomSheet){

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    }

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

    $scope.show_apps = function(){
        $mdSidenav('apps').toggle();
        event.stopPropagation();   
    }

    $scope.show_search_bar = function(){
        $scope.info.mobile_search = !$scope.info.mobile_search;
    }

    $scope.show_indexes = function(book, event){
        $scope.book = book;
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.room.rating){
                    deleteCookie("todo");
                    userService.update_todo_key('room/rating');
                }
            }
        }
        _handle_todo_update();

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

    $scope.logout = function(){
        $scope.$on('Facebook:statusChange', function(ev, data){
            FB.logout();
        });
        window.location.href = "/signup";
    }

    $scope.toggle_navigation_options = function(event){
        $scope.navigation_options = !$scope.navigation_options;
        $scope.show_notifications = false;
        event.stopPropagation();
    }

    var _get_user_details = function(){
        var user_timeout = $timeout(function(){
            if(angular.isUndefined($rootScope.user) || angular.isUndefined($rootScope.user.id)){
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

        var _fetch_picture = function(){
            Facebook.api('me/picture?redirect=false&type=large', function(response){
                if(angular.isDefined(response) && response.url != $rootScope.user.image_url){
                    websiteService.save_user_info(response);
                }
            });
        }

        $scope.$on('Facebook:statusChange', function(ev, data){
            _fetch_picture();
        });
    }

    $scope.fetch_todos = function(){
        userService.get_todos("home").then(function(data){
            $scope.todo = data;
            setCookie("todo", JSON.stringify(data));
        });
    }

    $scope.show_full_todos = function(event){
        $scope.flatten_todo = JSON.flatten($scope.todo);
        $mdDialog.show({
            templateUrl: 'assets/angular/html/todo/list.html',
            clickOutsideToClose: true,
            hasBackdrop: true,
            targetEvent: event,
            scope: $scope,
            preserveScope: true
        });
        event.stopPropagation();
    }

    $scope.show_quiz = function(key){
        $scope.key = key;
    }

    var _init = (function(){
        $scope.visible_search_bar = true;
        $scope.info = {};
        $scope.info.show_share = false;
        var url = $location.absUrl();

        $scope.search_results = [];

        if(getCookie("logged") != ""){
            $scope.info.hide_signin = true;
            _get_user_details();
            var todo = getCookie("todo");

            if(!todo){
                $scope.fetch_todos();
            }
            else{
                $scope.todo = JSON.parse(todo);
            }
        }

        $scope.data = {"selectedIndex" : 0};
        // deleteCookie("todo");
        $scope.key = 3;    

    }());

}]);