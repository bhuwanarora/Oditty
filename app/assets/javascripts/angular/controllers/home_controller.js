homeApp.controller('homeController', ["$scope", "$mdSidenav", function($scope, $mdSidenav){

    $scope.show_signin_options = function(event){
        $mdSidenav('signup').toggle();
        event.stopPropagation();
    }

    $scope.handle_personalised_redirect = function(event){
    	if($scope.info.hide_signin){
    		window.location.href = "/personalised_suggestions";
    	}
    	else{
    		$scope.show_signin_options(event);
    	}
    }

    $scope.handle_news_redirect = function(event){
    	if($scope.info.hide_signin){
    		window.location.href = "/rooms";
    	}
    	else{
    		$scope.show_signin_options(event);
    	}
    }

    $scope.handle_infinity_redirect = function(event){
    	if($scope.info.hide_signin){
    		window.location.href = "/filters";
    	}
    	else{
    		$scope.show_signin_options(event);
    	}
    }

    var _init = (function(){
    }());

}]);