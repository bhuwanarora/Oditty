homeApp.controller('testimonialsController', ["$scope", 'websiteService', '$rootScope', '$mdSidenav', function($scope, websiteService, $rootScope, $mdSidenav){
	$scope.get_testimonials = function(){
		if(!$scope.info.loading){
			$scope.info.loading = true;
			if(angular.isUndefined($scope.testimonials)){
				$scope.testimonials = [];
			}
			var skip = $scope.testimonials.length;
			websiteService.get_testimonials(skip).then(function(data){
				$scope.info.loading = false;
				$scope.testimonials = $scope.testimonials.concat(data);
			});
		}
	}

	$scope.save_testimonial = function(event){
        if(angular.isDefined($rootScope.user) && angular.isDefined($rootScope.user.id)){
        	if(angular.isDefined($scope.new_testimonial) && $scope.new_testimonial.length > 10){
	        	delete $scope.new_testimonial;
	            websiteService.add_testimonial($scope.new_testimonial);
	            window.location.reload();
        	}
        	else{
        		alert("Explain a bit more...");
        	}
        }
        else{
            $mdSidenav('signup').toggle();
        }
	}

	var _init = (function(){
		$scope.get_testimonials();
	}());
   
}]);