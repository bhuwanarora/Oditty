homeApp.controller("roomsController",["$scope","$location","roomsService","$mdSidenav","newsService","$mdBottomSheet","userService",function(a,b,c,d,e,f,g){a.get_rooms=function(){if(!a.info.loading){a.info.loading=!0,angular.isUndefined(a.rooms)&&(a.rooms=[]);var b=a.rooms.length;c.get_rooms(b).then(function(b){a.rooms=a.rooms.concat(b),a.info.loading=!1})}},a.join_room=function(a){var b=""==getCookie("logged")||null==getCookie("logged");if(b)d("signup").toggle();else{a.status=!a.status;var c=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.rooms.join||(deleteCookie("todo"),g.update_todo_key("rooms/join")))};c(),e.follow(a.id,a.status)}},a.show_todo_list=function(b){f.show({templateUrl:"assets/angular/html/todo/rooms.html",scope:a,preserveScope:!0,targetEvent:b})};(function(){a.get_rooms()})()}]);