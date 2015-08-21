homeApp.controller('authorsController', ["$scope", 'authorService', function($scope, authorService){
	$scope.get_authors_interviewed = function(){
		if(!$scope.info.loading){
			$scope.info.loading = true;
			if(angular.isUndefined($scope.authors_interviewed)){
				$scope.authors_interviewed = [];
			}
			var skip = $scope.authors_interviewed.length;
			authorService.get_authors_interviewed(skip).then(function(data){
				$scope.info.loading = false;
				$scope.authors_interviewed = $scope.authors_interviewed.concat(data);
			});
		}
	}

	var _init = (function(){
		$scope.get_authors_interviewed();
	}());
   
}]);