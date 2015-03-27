homeApp.controller('authorController', ["$scope", 'parallaxHelper', function($scope, parallaxHelper){

  	_init = function(){
  		$scope.background_parallax = parallaxHelper.createAnimator(-0.3, 150, -150);
  	}

  	_init();

}]);