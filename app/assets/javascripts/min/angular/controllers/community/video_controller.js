homeApp.controller("videoController",["$scope","$rootScope","$timeout","websiteService","$sce",function(a,b,c,d,e){(function(){if(angular.isDefined(a.active_tag)&&angular.isDefined(a.active_tag.id)){var b=a.active_tag.id;d.get_community_videos(b).then(function(b){a.videos=[],angular.forEach(b,function(a){a.url=a.url.replace("watch?v=","v/"),a.url=e.trustAsResourceUrl(a.url+"?output=embed"),this.push(a)},a.videos)})}else $location.path("/room/books")})()}]);