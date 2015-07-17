homeApp.directive('guestInterview', ["$rootScope", "authorService", "$timeout", function($rootScope, authorService, $timeout){
    return {
        restrict: 'E',
        scope: {"author": '=', "info": '='},
        controller: ["$scope", function($scope){
            var _init = function(){
                $scope.info.loading = true;
                authorService.get_interview_details($scope.author.id).then(function(data){
                    $scope.info.loading = false;
                    $scope.data = data;
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/author/guest_interview.html'
    };
}]);