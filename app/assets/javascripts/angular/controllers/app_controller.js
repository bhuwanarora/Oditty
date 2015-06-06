homeApp.controller('appController', ["$scope", "$rootScope", "$mdSidenav", '$mdBottomSheet', '$mdDialog', 'shelfService', 'userService', '$cookieStore', '$timeout', '$location', function($scope, $rootScope, $mdSidenav, $mdBottomSheet, $mdDialog, shelfService, userService, $cookieStore, $timeout, $location){

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    }

    // $scope.stopPropagation = function(){
    //     if($scope.constant.show_book){
    //         // $scope.constant = {"show_book": true};
    //     }
    // }

    $scope.show_signin_options = function(event){
        $mdSidenav('signup').toggle();
        event.stopPropagation();
    }

    $scope.show_search_bar = function(){
        $scope.info.mobile_search = !$scope.info.mobile_search;
    }

    $scope.show_rating = function(event){
        $mdDialog.show({
            templateUrl: 'assets/angular/html/shared/share.html',
            targetEvent: event,
        });
        event.stopPropagation();
    }

    $scope.toggle_notifications = function(event){
        $scope.show_notifications = !$scope.show_notifications;
        $scope.navigation_options = false;
        event.stopPropagation();
    }

    $scope.close_popups = function(){
        $scope.show_notifications = false;
        $rootScope.shelves_visible = false;
        $scope.navigation_options = false;
        // $mdSidenav('left').close();
        // debugger

        // $mdBottomSheet.hide({"test": "test"});
    }

	$scope.toggleLeft = function(event){
        if($scope.info.hide_signin){
    	    $mdSidenav('left').toggle();
            event.stopPropagation();
        }
        else{
            $scope.show_signin_options(event);
        }
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

    var _init = (function(){
        $scope.visible_search_bar = true;
        $scope.info = {};
        $scope.info.show_share = false;
        var url = $location.absUrl();
        var communities = (url.indexOf("communities") > 0);
        var personalised_suggestions = (url.indexOf("personalised_suggestions") > 0);
        var infinity = (url.indexOf("infinity") > 0);

        if(communities){
            $scope.active_page = 1;
        }
        else if(personalised_suggestions){
            $scope.active_page = 0;
        }
        else if(infinity){
            $scope.active_page = 2;
        }
        else{
            $scope.active_page = -1;
        }

        $scope.random_set = -1;

        $scope.data = {"selectedIndex" : 0};

        var _handle_labels = function(){
            if(angular.isUndefined($cookieStore.get('labels')) || $cookieStore.get('labels') == null || $cookieStore.get('labels').length == 0){
                shelfService.get_all_shelves().then(function(data){
                    $rootScope.labels = data;
                    $cookieStore.put('labels', data);
                });
            }
            else{
                $rootScope.labels = $cookieStore.get('labels');
            }
        }

        $scope.search_results = [];

        if(getCookie("logged") != ""){
            $scope.info.hide_signin = true;
        }

    }());

}]);