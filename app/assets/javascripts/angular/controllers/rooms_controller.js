homeApp.controller('roomsController', ["$scope", "$rootScope", "roomsService", "$mdSidenav", "newsService", function($scope, $rootScope, roomsService, $mdSidenav, newsService){
    $scope.get_rooms = function(){
        if(!$scope.info.loading){
            $scope.info.loading = true;
            if(angular.isUndefined($scope.rooms)){
                $scope.rooms = [];
            }
            var length = $scope.rooms.length;
            roomsService.get_rooms(length).then(function(data){
                $scope.rooms = $scope.rooms.concat(data);
                $scope.info.loading = false;
            });
        }
    }

    $scope.join_room = function(room){
        var unauthenticated_user = (getCookie("logged") == "") || (getCookie("logged") == null);
        if(unauthenticated_user){
            $mdSidenav('signup').toggle();
        }
        else{
            room.status = !room.status;
            newsService.follow(room.id, room.status);
        }
    }

    var _init = (function(){
        $scope.get_rooms();
    }());

}]);