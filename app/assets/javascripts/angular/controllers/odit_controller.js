oditApp.controller('oditController', ["$scope", "$location", "$mdSidenav", '$rootScope', '$timeout', 'oditService', function($scope, $location, $mdSidenav, $rootScope, $timeout, oditService){

    var _init = (function(){
        var is_book = $location.absUrl().indexOf("odit_book") > 0;
        var is_rooms = $location.absUrl().indexOf("odit_rooms") > 0;
        var is_room = $location.absUrl().indexOf("odit_room") > 0;
        var is_author = $location.absUrl().indexOf("odit_author") > 0;
        var is_filters = $location.absUrl().indexOf("odit_filters") > 0;
        deleteCookie("todo");
        var continue_to = getCookie("continue_to");
        if(angular.isDefined(continue_to) && continue_to){
            $scope.continue_url = continue_to;
        }
        else{
            $scope.continue_url = "/home";
        }
        
        if(is_book){
            oditService.update_todo_key('filters/book');
        }
        else if(is_rooms){
            oditService.update_todo_key('home/rooms');
        }
        else if(is_room){
            oditService.update_todo_key('rooms/visit');
        }
        else if(is_author){
            oditService.update_todo_key('book/author');
        }
        else if(is_filters){
            oditService.update_todo_key('home/filters');
        }
    }());
    
}]);