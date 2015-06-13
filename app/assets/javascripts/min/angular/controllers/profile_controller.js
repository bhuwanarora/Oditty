homeApp.controller("profileController",["$scope","userService","$rootScope","WebsiteUIConstants","ColorConstants","$location","bookService","newsService","$mdDialog","infinityService","$timeout","sharedService","$mdSidenav",function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n=function(){b.get_user_details(a.active_user_id).then(function(b){a.profile_user=b})};a.get_feed=function(){if(a.info.selectedIndex=1,!a.info.loading){var c=a.active_user_id;a.info.loading=!0;var d=function(a){var b="";switch(a.label){case"BookmarkNode":b="Added to "+a.node.key;break;case"Listopia":break;case"CommunityNode":break;case"BlogNode":break;case"StatusNode":b=a.node.wrapper_content;break;case"EndorseNode":b="Endorsed this book.";break;case"RatingNode":b="Gave "+a.node.content+" rating on 10.";break;case"FollowsNode":b="Joined room.";break;case"RecommendNode":b="Recommended this book."}return b};angular.isUndefined(a.personal_feed)&&(a.personal_feed=[]);var e=a.personal_feed.length;b.get_personal_feed(c,e).then(function(b){b.length>0&&angular.forEach(b,function(a){if(angular.isDefined(a.book)){var b=d(a);a=angular.extend(a,{message:b})}else if(angular.isDefined(a.community)){var b=d(a);a=angular.extend(a,{message:b})}else{var b=d(a);a=angular.extend(a,{message:b})}}),a.info.loading=!1,a.personal_feed=a.personal_feed.concat(b)})}};var o=function(){return""==getCookie("logged")||null==getCookie("logged")};a.follow_user=function(){o()?m("signup").toggle():(a.profile_user.status=!a.profile_user.status,b.follow(a.profile_user.id,a.profile_user.status))};a.show_book_dialog=function(b,d){l.show_book_dialog(c,a,b,d)};(function(){a.info.books=[],a.profile_user={},a.info.embed_share=!0;var d=/[?&]([^=#]+)=([^&#]*)/g,e=d.exec(f.absUrl());if(angular.isDefined(e)&&null!=e){a.active_user_id=e[2],angular.isDefined(c.user)?(a.profile_user={id:a.active_user_id},c.user.id==a.active_user_id?a.info.my_profile=!0:(a.info.my_profile=!1,a.hide_follow_links=!0)):(a.info.my_profile=!1,a.hide_follow_links=!0);var g=k(function(){n()},100);a.$on("destroy",function(){k.cancel(g)})}else if(a.info.my_profile=!0,angular.isUndefined(c.user)){var g=k(function(){b.get_user_details().then(function(b){c.user=b,a.profile_user=c.user,a.active_user_id=a.profile_user.id})},100);a.$on("destroy",function(){k.cancel(g)})}else a.profile_user=c.user,a.active_user_id=a.profile_user.id;var h=k(function(){a.get_feed()},100);a.$on("destroy",function(){k.cancel(h)})})()}]);