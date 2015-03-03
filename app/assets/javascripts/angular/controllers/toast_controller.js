homeApp.controller('toastController', ["$scope", "$mdToast", function($scope, $mdToast) {
  	$scope.closeToast = function() {
	    $mdToast.hide();
  	};

}]);