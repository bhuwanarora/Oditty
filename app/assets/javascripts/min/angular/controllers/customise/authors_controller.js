homeApp.controller("customiseAuthorsController",["$scope","$rootScope","$timeout","userService",function(a,b,c,d){a.edit_authors_read=function(){a.goto_info_card(),b.user.profile_status=3,a.get_people()},a.get_people=function(){var b=a.people.length,c=!a._loading;c&&(a._loading=!0,d.get_people(b).then(function(b){angular.forEach(b,function(a){var b={name:a[0]};this.push(b)},a.people),a._loading=!1}))};var e=function(){};e()}]);