homeApp.controller('authorsController', ["$scope", "$rootScope", "$timeout", 'userService', function($scope, $rootScope, $timeout, userService){

     $scope.edit_authors_read = function(){
        $scope.goto_info_card();
        $rootScope.user.profile_status = 3;
        $scope.get_people();
    }

    $scope.get_people = function(){
        var skip_count = $scope.people.length;
        var get_people = !$scope._loading;
        if(get_people){
            $scope._loading = true;
            userService.get_people(skip_count).then(function(data){
                angular.forEach(data, function(value){
                    var json = {"name": value[0]};
                    this.push(json);
                },  $scope.people);
                $scope._loading = false;
            });
        }
    }

   

    var _init = function(){
    }

    _init();
}]);