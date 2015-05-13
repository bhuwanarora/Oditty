homeApp.controller('appController', ["$scope", "$rootScope", "$mdSidenav", '$mdBottomSheet', '$mdDialog', 'shelfService', 'userService', '$cookieStore', function($scope, $rootScope, $mdSidenav, $mdBottomSheet, $mdDialog, shelfService, userService, $cookieStore){

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    }

    $scope.stopPropagation = function(){
        if($scope.constant.show_book){
            // $scope.constant = {"show_book": true};
        }
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
        if($scope.show_notifications){
            $scope.show_notifications = false;
        }
        else{
            $scope.show_notifications = true;
        }
        event.stopPropagation();
    }

    $scope.close_popups = function(){
        $scope.show_notifications = false;
        // $mdSidenav('left').close();
        // debugger

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

    $scope.show_share_bottom_sheet = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/shared/social_bottom_sheet.html',
            controller: 'shelfController',
            targetEvent: event
        });
    }; 

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    }

    var _init = (function(){
        $scope.visible_search_bar = true;
        $scope.info = {};
        $scope.info.show_share = false;
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

        var _handle_user_details = function(){
            if(angular.isUndefined($cookieStore.get('user')) || $cookieStore.get('user') == null){
                userService.get_user_details().then(function(data){
                    $rootScope.user = data;
                    $cookieStore.put('user', data);
                });
            }
            else{
                $rootScope.user = $cookieStore.get('user');
            }
        }

        $scope.search_results = [];

        _handle_labels();
        _handle_user_details();

    }());

}]);