homeApp.controller("spacesController",["$scope","$rootScope","userService","$timeout","$mdSidenav",function(a,b,c,d,e){e.get_feed=function(){if(!e.info.feed_loading){if(e.info.feed_loading=!0,angular.isDefined(e.social_feed))var a=e.social_feed.length;else{var a=0;e.social_feed=[]}angular.isDefined(e.global)&&e.global?b.get_global_feed(a).then(function(a){e.info.feed_loading=!1,e.social_feed=e.social_feed.concat(a)}):b.get_social_feed(a).then(function(a){e.info.feed_loading=!1,e.social_feed=e.social_feed.concat(a)})}};var f=function(){return""==getCookie("logged")||null==getCookie("logged")};e.handle_feed=function(){f()?d("signup").toggle():e.get_feed()};(function(){var a=c(function(){e.handle_feed()},100);e.$on("destroy",function(){c.cancel(a)})})()}]);