loadingApp.controller('loadingAppController', function($scope){
	$scope.loading = true;
	$scope.$on('hideLoadingPage', function(){
		$scope.loading = false;
	});
});