oditApp.controller("oditController",["$scope","$location","$mdSidenav","$rootScope","$timeout","oditService",function(a,b,c,d,e,f){(function(){var c=b.absUrl().indexOf("odit_book")>0,d=b.absUrl().indexOf("odit_rooms")>0,e=b.absUrl().indexOf("odit_room")>0,g=b.absUrl().indexOf("odit_author")>0,h=b.absUrl().indexOf("odit_filters")>0;deleteCookie("todo");var i=getCookie("continue_to");angular.isDefined(i)&&i?a.continue_url=i:a.continue_url="/home",c?f.update_todo_key("filters/book"):d?f.update_todo_key("home/rooms"):e?f.update_todo_key("rooms/visit"):g?f.update_todo_key("book/author"):h&&f.update_todo_key("home/filters")})()}]);