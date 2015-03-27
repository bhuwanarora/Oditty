homeApp.controller('homeController', ["$scope", "$rootScope", "$timeout", "$mdSidenav", "$log", '$q', '$mdBottomSheet', '$mdDialog', 'scroller', '$document', 'feedService', '$mdToast', 'shelfService', function($scope, $rootScope, $timeout, $mdSidenav, $log, $q, $mdBottomSheet, $mdDialog, scroller, $document, feedService, $mdToast, shelfService){

    $scope.play_type_key = function(event){
        if($scope.info.show_share){
            if(angular.isUndefined($scope.current_track) || $scope.current_track == 0){
                $scope.current_track = 1;
                document.getElementById('audiotag1').play();
            }
            else if($scope.current_track == 1){
                $scope.current_track = 2;
                document.getElementById('audiotag2').play();
            }
            else{
                $scope.current_track = 0;
                document.getElementById('audiotag3').play();
            }
            event.stopPropagation();
        }
    }

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    }

    $scope.stopPropagation = function(){
        if($scope.constant.show_book){
            // $scope.constant = {"show_book": true};
        }
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

    $scope.show_shelf_bottom_sheet = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/shared/shelf_bottom_sheet.html',
            controller: 'shelfController',
            targetEvent: event
        });
    };

    $scope.show_share_bottom_sheet = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/shared/social_bottom_sheet.html',
            controller: 'shelfController',
            targetEvent: event
        });
    }; 

    $scope.show_search_bar = function() {
        $scope.visible_search_bar = !$scope.visible_search_bar;
    
    };

    $scope.show_share_page = function(event) {
        if(!$scope.info.show_share){
            $scope.info.show_share = true;
        }
        else{
            if($scope.info.status.length > 1){
                $scope.info.status = "";
                $scope.type_icon_pressed = {"margin-right": "60vw"};
                $timeout(function(){
                    $scope.type_icon_pressed = {"margin-right": "0px"};
                }, 100);
            }
        }
    };

    var _init = function(){
        $scope.visible_search_bar = true;
        $scope.info = {};
        $scope.info.show_share = false;
        $scope.data = {"selectedIndex" : 0};

        $rootScope.user = {};
        shelfService.get_all_shelves().then(function(data){
            $rootScope.labels = data;
        });
    };

    _init();
}]);