homeApp.controller("spacesController",["$scope","$rootScope","userService","$timeout","$mdSidenav",function(a,b,c,d,e){a.get_feed=function(){if(!a.info.feed_loading){if(a.info.feed_loading=!0,angular.isDefined(a.social_feed))var b=a.social_feed.length;else{var b=0;a.social_feed=[]}angular.isDefined(a.global)&&a.global?c.get_global_feed(b).then(function(b){a.info.feed_loading=!1,a.social_feed=a.social_feed.concat(b)}):c.get_social_feed(b).then(function(b){a.info.feed_loading=!1,a.social_feed=a.social_feed.concat(b)})}};var f=function(){return""==getCookie("logged")||null==getCookie("logged")};a.handle_feed=function(){f()?e("signup").toggle():a.get_feed()};(function(){var b=d(function(){a.handle_feed()},100);a.$on("destroy",function(){d.cancel(b)})})()}]);