homeApp.controller("homeController",["$scope","$rootScope","userService","$mdBottomSheet","shelfService","$timeout","$location","userService","bookService",function(a,b,c,d,e,f,g,c,h){a.goto_community_page=function(a,b){c.news_visited(a),deleteCookie("active_community"),angular.isDefined(b)&&setCookie("active_community",b,1),window.location.href="/news?q="+a},a.search_books=function(b){a.info.loading=!0,h.search_books(b,10).then(function(b){a.info.loading=!1,a.did_you_mean=!0,angular.forEach(b,function(a){angular.isUndefined(a.fuzzy)&&this.push(a)},a.search_results)})},a.change_feed=function(){a.feed=[],setCookie("active_region",a.info.active_region,31),a.get_community_feed()},a.get_community_feed=function(){if(!a.info.loading){a.info.loading=!0;var b=a.info.active_region;c.get_feed(b).then(function(b){a.info.loading=!1,angular.forEach(b,function(a){var b={label:"news"};a=angular.extend(a,b),this.push(a)},a.feed)})}},a.get_blog_feed=function(){if(!a.info.loading){a.info.loading=!0,angular.isUndefined(a.feed)&&(a.feed=[]);var b=a.feed.length,d=!0;c.get_blog_feed(b,d).then(function(b){angular.forEach(b,function(a){a.label="blog",this.push(a)},a.feed),a.info.loading=!1})}};(function(){a.feed=[];var b=getCookie("active_region");if(angular.isDefined(b)&&""!=b&&null!=b){a.info.active_region=b;f(function(){a.info.active_region=b},2e3)}var d=g.absUrl();a.$on("destroy",function(){f.cancel(timeout_event)}),c.get_regions().then(function(b){a.regions=b[0].regions});var e=d.indexOf("communities")>0,h=d.indexOf("blogs")>0;a.info.loading=!1,e?a.get_community_feed():h?a.get_blog_feed():a.get_community_feed()})()}]);