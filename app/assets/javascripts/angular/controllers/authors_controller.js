homeApp.controller('authorsController', ["$scope", 'authorService', 'sharedService', function($scope, authorService, sharedService){
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

	$scope.handle_scroll_bottom = function(){
		$scope.get_authors_interviewed();
	}

	$scope.render_page = function(event){
        sharedService.render_page(event);
    }

	var _init = (function(){
		$scope.get_authors_interviewed();
	}());
   
}]);