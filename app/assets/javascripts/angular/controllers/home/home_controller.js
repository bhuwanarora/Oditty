homeApp.controller('homeController', ["$scope", "$rootScope", "$timeout", "$mdSidenav", "$log", '$q', '$mdBottomSheet', '$mdDialog', 'scroller', '$document', function($scope, $rootScope, $timeout, $mdSidenav, $log, $q, $mdBottomSheet, $mdDialog, scroller, $document){

    $scope.next = function(){
        if(angular.isDefined($scope.data.selectedIndex)){
            if($scope.data.selectedIndex == 3){
                window.location.href = "/library";
            }
            else{
                $scope.data.selectedIndex = $scope.data.selectedIndex + 1;
            }
        }
        else{
            $scope.data.selectedIndex = 0;
        }
    }

    $scope.previous = function(){
        if(angular.isDefined($scope.data.selectedIndex)){
            if($scope.data.selectedIndex == 0){
                $scope.data.selectedIndex = 3;
            }
            else{
                $scope.data.selectedIndex = $scope.data.selectedIndex - 1;
            }
        }
        else{
            $scope.data.selectedIndex = 0;
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

    

	var item = {
    	face: '/img/list/60.jpeg',
    	what: 'Brunch this weekend?',
    	who: 'Min Li Chan',
    	notes: "I'll be in your neighborhood doing errands."
  	};
  	$scope.todos = [];
  	for (var i = 0; i < 15; i++) {
    	$scope.todos.push({
      		face: 'https://pbs.twimg.com/profile_images/551665023399899136/Y6DsU5eJ_400x400.jpeg',
      		what: "Brunch this weekend?",
      		who: "Min Li Chan",
      		notes: "I'll be in your neighborhood doing errands."
    	});
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

    $scope.showAdvanced = function(event) {
        $mdDialog.show({
            controller: 'shareController',
            templateUrl: 'assets/angular/html/shared/share.html',
            targetEvent: event,
        });
    };

    $scope._init = function(){
        $scope.info = {};
        $scope.data = {"selectedIndex" : 0};
        $rootScope.user = {};
    }

    $scope._init();


}]);