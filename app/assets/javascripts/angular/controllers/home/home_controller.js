homeApp.controller('homeController', ["$scope", "$rootScope", "$timeout", "$mdSidenav", "$log", '$q', '$mdBottomSheet', '$mdDialog', 'scroller', '$document', 'feedService', '$mdToast', function($scope, $rootScope, $timeout, $mdSidenav, $log, $q, $mdBottomSheet, $mdDialog, scroller, $document, feedService, $mdToast){

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
        $mdSidenav('left').close();
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

  
  // list of `state` value/display objects
  $scope.states       = loadAll();
  $scope.selectedItem = null;
  $scope.searchText   = null;
  $scope.querySearch  = querySearch;
    // ******************************
    // Internal methods
    // ******************************
    /**
    * Search for states... use $timeout to simulate
        * remote dataservice call.
    */
    function querySearch (query) {
        var deferred = $q.defer();
        $timeout(function () {
            var results = query ? $scope.states.filter( createFilterFor(query) ) : [ ];
            deferred.resolve(results);
        }, Math.random() * 1000, false);
        return deferred.promise;
    }

    /**
        * Build `states` list of key/value pairs
    */

    function loadAll() {
        var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';
        return allStates.split(/, +/g).map( function (state) {
            return {
                value: state.toLowerCase(),
                display: state
            };
        });
    }

    /**
        * Create filter function for a query string
    */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };
    }

    $scope.show_shelf_bottom_sheet = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/shared/shelf_bottom_sheet.html',
            controller: 'listBottomSheetController',
            targetEvent: event
        });
    };

    $scope.show_share_bottom_sheet = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/shared/social_bottom_sheet.html',
            controller: 'listBottomSheetController',
            targetEvent: event
        });
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

    $scope._init = function(){
        $scope.info = {};
        $scope.info.show_share = false;
        $scope.data = {"selectedIndex" : 0};
        $rootScope.user = {};
        // feedService.get_feed(0).then(function(data){
        //     // debugger
        // });

        
    };

    $scope._init();
}]);