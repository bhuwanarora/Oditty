homeApp.controller("roomsController",["$scope","$rootScope","roomsService","$mdSidenav","newsService",function(a,b,c,d,e){a.get_rooms=function(){if(!a.info.loading){a.info.loading=!0,angular.isUndefined(a.rooms)&&(a.rooms=[]);var b=a.rooms.length;c.get_rooms(b).then(function(b){a.rooms=a.rooms.concat(b),a.info.loading=!1})}},a.join_room=function(a){var b=""==getCookie("logged")||null==getCookie("logged");b?d("signup").toggle():(a.status=!a.status,e.follow(a.id,a.status))};(function(){a.get_rooms()})()}]);