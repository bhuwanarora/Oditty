homeApp.controller("appController",["$scope","$rootScope","$mdSidenav","$mdDialog","shelfService","userService","$cookieStore","$timeout","$location","feedService","$filter","Facebook","websiteService","$mdBottomSheet",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){a.stop_propagation=function(a){a.stopPropagation()},a.invite_friends=function(a){d.show({templateUrl:"assets/angular/html/shared/invite.html",clickOutsideToClose:!0,hasBackdrop:!1,targetEvent:a,scope:b,preserveScope:!0}),a.stopPropagation()},a.show_signin_options=function(a){c("signup").toggle(),a.stopPropagation()},a.show_apps=function(){c("apps").toggle(),event.stopPropagation()},a.show_search_bar=function(){a.info.mobile_search=!a.info.mobile_search},a.show_indexes=function(b,c){a.book=b;var e=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.room.rating||(deleteCookie("todo"),f.update_todo_key("room/rating")))};e(),d.show({templateUrl:"assets/angular/html/shared/rating.html",clickOutsideToClose:!0,hasBackdrop:!1,targetEvent:c,scope:a,preserveScope:!0}),c.stopPropagation()},a.toggle_notifications=function(b){a.info.notifications_seen=!0,a.info.loading=!0;var d=h(function(){j.get_notifications().then(function(b){a.info.loading=!1,a.notifications=[],angular.forEach(b,function(a){k("timestamp")(a.created_at,"date:'h:mm a, dd MMM'");switch(a.label){case"FollowsNode":a.message="<div layout-padding><div><a href='/profile?id="+a.data.user.id+"'>"+a.data.user.name+"</a><span> started following you.</span></div></div>";break;case"RecommendNode":a.message="<div layout-padding><div><span><a href='/profile?id="+a.data.user.id+"'>"+a.data.user.name+"</a> recommended you <a href='/book?id="+a.data.book.id+"'>"+a.data.book.title+"</a><span><span>&nbsp;by&nbsp;<a href='/author?id="+a.data.author.id+"'>"+a.data.author.name+"</a></span>.</div></div>";break;case"BorrowNode":a.message="<div layout-padding><div><a href='/profile?id="+a.data.user.id+"'>"+a.data.user.name+"</a><span> is looking to borrow </span><span><a href='/book?id="+a.data.book.id+"'>"+a.data.book.title+"</a></span><span>&nbsp;by&nbsp;<a href='/author?id="+a.data.author.id+"'>"+a.data.author.name+"</a></span></div></div>"}this.push(a)},a.notifications)})},100);a.$on("destroy",function(){h.cancel(d)}),c("notifications").toggle(),a.navigation_options=!1,b.stopPropagation()},a.close_popups=function(c){a.show_notifications=!1,b.shelves_visible=!1,a.navigation_options=!1,angular.isUndefined(c)&&(a.info.status_state=!1)},a.toggleLeft=function(a){c("left").toggle(),a.stopPropagation()},a.toggleRight=function(a){c("right").toggle(),a.stopPropagation()},a.stop_propagation=function(a){a.stopPropagation()},a.logout=function(){a.$on("Facebook:statusChange",function(a,b){FB.logout()}),window.location.href="/signup"},a.toggle_navigation_options=function(b){a.navigation_options=!a.navigation_options,a.show_notifications=!1,b.stopPropagation()};var o=function(){var c=h(function(){angular.isUndefined(b.user)||angular.isUndefined(b.user.id)?f.get_user_details().then(function(c){angular.equals(c,{})&&""!=getCookie("logged")?(deleteCookie("logged"),a.info.hide_signin=!1):(b.user=c,p())}):p()},100);a.$on("destroy",function(){h.cancel(c)})},p=function(){var c=function(){l.api("me/books",function(a){m.handle_facebook_books(a)}),l.api("me/books.reads",function(a){m.handle_facebook_books(a)}),l.api("me/books.wants_to_read",function(a){m.handle_facebook_books(a)})},d=function(){l.api("me/picture?redirect=false&type=large",function(a){angular.isDefined(a)&&a.url!=b.user.image_url&&m.save_user_info(a)})},e=function(){l.api("me/likes",function(a){m.handle_facebook_likes(a)})},g=function(){f.get_facebook_likes().then(function(b){a.facebook_likes=b,null!=b&&b.length>0&&angular.forEach(b,function(a){var b=a.app_id;j(b)})})},h=function(a){l.api("/"+a,function(a){a&&!a.error&&m.map_facebook_books(a)})},i=function(){f.get_social_books().then(function(b){a.social_books=b,null!=b&&b.length>0&&angular.forEach(b,function(a){var b=a.app_id;h(b)})})},j=function(a){l.api("/"+a,function(a){a&&!a.error&&m.set_like_info(a)})};a.$on("Facebook:statusChange",function(a,f){var h=(new Date).getTime()/1e3;if(angular.isDefined(b.user.facebook_books_retrieval_time)){var j=(h-b.user.facebook_books_retrieval_time)/2678400;j>1?c():i()}else c();if(angular.isDefined(b.user.facebook_likes_retrieval_time)){var k=(h-b.user.facebook_likes_retrieval_time)/2678400;k>1?e():g()}else e();d()})};a.fetch_todos=function(){f.get_todos("home").then(function(b){a.todo=b,setCookie("todo",JSON.stringify(b))})},a.show_full_todos=function(b){a.flatten_todo=JSON.flatten(a.todo),d.show({templateUrl:"assets/angular/html/todo/list.html",clickOutsideToClose:!0,hasBackdrop:!0,targetEvent:b,scope:a,preserveScope:!0}),b.stopPropagation()};(function(){a.visible_search_bar=!0,a.info={},a.info.show_share=!1;i.absUrl();if(a.search_results=[],""!=getCookie("logged")){a.info.hide_signin=!0,o();var b=getCookie("todo");b?a.todo=JSON.parse(b):a.fetch_todos()}a.data={selectedIndex:0}})()}]);