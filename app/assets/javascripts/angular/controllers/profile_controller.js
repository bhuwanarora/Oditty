homeApp.controller('profileController', ["$scope", "userService", '$rootScope', "WebsiteUIConstants", function($scope, userService, $rootScope, WebsiteUIConstants){
	var _init = function(){
		userService.get_detailed_info().then(function(data){
			data = data[0];
			var categories = [];
			angular.forEach(data.categories_id, function(value, index){
				var url = WebsiteUIConstants.GenreAWS + data.categories_aws_key[index];
				var json = {"root_category_id": value, "root_category_name": data.categories_name[index], "url": url, "status": true};
				this.push(json);
			}, categories);
			$rootScope.user = angular.extend($rootScope.user, data);
			$rootScope.user = angular.extend($rootScope.user, {"favourite_categories": categories});
		});
	}

	_init();
}]);