homeApp.controller("homeController",["$scope","$rootScope","userService","$mdBottomSheet","shelfService","$timeout","$location",function(a,b,c,d,e,f,g){a.goto_community_page=function(a){c.news_visited(a),window.location.href="/community?q="+a},a.show_shelf_bottom_sheet=function(a,c){b.bookmark_object={type:c,id:a},d.show({templateUrl:"assets/angular/html/shared/shelf_bottom_sheet.html",controller:"shelfController",targetEvent:event}),event.stopPropagation()},a.get_community_feed=function(){c.get_feed().then(function(b){angular.forEach(b,function(a){var b={label:"news"};a=angular.extend(a,b),this.push(a)},a.feed)})};!function(){a.feed=[];var b=function(){c.get_last_blog().then(function(b){b[0].label="blog",a.feed.push(b[0])})},d=g.absUrl();a.$on("destroy",function(){f.cancel(i)});var e=d.indexOf("communities")>0,h=d.indexOf("blogs")>0;if(e)a.get_community_feed();else if(h)b();else{a.get_community_feed();var i=f(function(){b()},6e3);a.$on("destroy",function(){f.cancel(i)})}}()}]);