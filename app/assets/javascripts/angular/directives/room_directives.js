homeApp.directive('gotoTestimonial', ["$rootScope", function($rootScope){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
        }],
        templateUrl: '/assets/angular/html/shared/partials/goto_testimonial.html'
    };
}]);