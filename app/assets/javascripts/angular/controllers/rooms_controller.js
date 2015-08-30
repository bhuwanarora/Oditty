homeApp.controller('roomsController', ["$scope", "$rootScope", "roomsService", "$mdSidenav", "newsService", "$mdBottomSheet", "userService", function($scope, $rootScope, roomsService, $mdSidenav, newsService, $mdBottomSheet, userService){
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

            var _handle_todo_update = function(){
                var todo = getCookie("todo");
                if(todo){
                    todo = JSON.parse(todo);
                    if(!todo.rooms.join){
                        deleteCookie("todo");
                        userService.update_todo_key('rooms/join');
                    }
                }
            }

            _handle_todo_update();
            newsService.follow(room.id, room.status);
        }
    }

    $scope.show_todo_list = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/todo/rooms.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: event
        });
    }

    var _init = (function(){
        $scope.get_rooms();
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                $scope.todo = JSON.parse(todo);
                if(!$scope.todo.home.rooms){
                    deleteCookie("todo");
                    userService.update_todo_key('home/rooms');
                }
            }
        }

        _handle_todo_update();
    }());

}]);