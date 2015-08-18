homeApp.controller("appController",["$scope","$rootScope","$mdSidenav","$mdDialog","shelfService","userService","$cookieStore","$timeout","$location","feedService","$filter","Facebook","websiteService",function(a,b,c,d,e,f,g,h,i,j,k,l,m){a.stop_propagation=function(a){a.stopPropagation()},a.invite_friends=function(a){d.show({templateUrl:"assets/angular/html/shared/invite.html",clickOutsideToClose:!0,hasBackdrop:!1,targetEvent:a}),a.stopPropagation()},a.show_signin_options=function(a){c("signup").toggle(),a.stopPropagation()},a.show_search_bar=function(){a.info.mobile_search=!a.info.mobile_search},a.show_rating=function(a){d.show({templateUrl:"assets/angular/html/shared/share.html",targetEvent:a}),a.stopPropagation()},a.toggle_notifications=function(b){a.info.notifications_seen=!0,a.info.loading=!0;var d=h(function(){j.get_notifications().then(function(b){a.info.loading=!1,a.notifications=[],angular.forEach(b,function(a){var b=k("timestamp")(a.created_at,"date:'h:mm a, dd MMM'");switch(a.label[0]){case"FollowsNode":a.message="<div layout-padding><div><span>Your </span><a href='/profile?id="+a.notification.friend_id+"'>friend</a><span> started following you.</span></div><div class='less_important'>"+b+"</div></div>";break;case"RecommendNode":a.message="<div layout-padding><div><span>Your <a href='/profile?id="+a.notification.friend_id+"'>friend</a> recommended you a <a href='/book?id="+a.notification.book_id+"'>book</a><span>.</div><div class='less_important'>"+b+"</div></div>";break;case"BorrowNode":a.message="<div layout-padding><div><span>Your </span><a href='/profile?id="+a.notification.user_id+"'>friend</a><span> is looking to borrow </span><span><a href='/book?id="+a.notification.book_id+"'>book</a></span></div><div class='less_important'>"+b+"</div></div>"}this.push(a)},a.notifications)})},100);a.$on("destroy",function(){h.cancel(d)}),c("notifications").toggle(),a.navigation_options=!1,b.stopPropagation()},a.close_popups=function(c){a.show_notifications=!1,b.shelves_visible=!1,a.navigation_options=!1,angular.isUndefined(c)&&(a.info.status_state=!1)},a.toggleLeft=function(a){c("left").toggle(),a.stopPropagation()},a.toggleRight=function(a){c("right").toggle(),a.stopPropagation()},a.stop_propagation=function(a){a.stopPropagation()},a.toggle_navigation_options=function(b){a.navigation_options=!a.navigation_options,a.show_notifications=!1,b.stopPropagation()};var n=function(){var c=h(function(){angular.isUndefined(b.user)?f.get_user_details().then(function(a){b.user=a,o()}):o()},100);a.$on("destroy",function(){h.cancel(c)})},o=function(){var c=function(){l.api("me/books",function(a){m.handle_facebook_books(a)}),l.api("me/books.reads",function(a){m.handle_facebook_books(a)}),l.api("me/books.wants_to_read",function(a){m.handle_facebook_books(a)})},d=function(){l.api("me/picture?redirect=false&type=large",function(a){m.save_user_info(a)})},e=function(){l.api("me/likes",function(a){m.handle_facebook_likes(a)})},g=function(){f.get_facebook_likes().then(function(b){a.facebook_likes=b,null!=b&&b.length>0&&angular.forEach(b,function(a){var b=a.app_id;j(b)})})},h=function(a){l.api("/"+a,function(a){a&&!a.error&&m.handle_facebook_books(a)})},i=function(){f.get_social_books().then(function(b){a.social_books=b,null!=b&&b.length>0&&angular.forEach(b,function(a){var b=a.app_id;h(b)})})},j=function(a){l.api("/"+a,function(a){a&&!a.error&&m.set_like_info(a)})};a.$on("Facebook:statusChange",function(a,f){var h=(new Date).getTime()/1e3;if(angular.isDefined(b.user.facebook_books_retrieval_time)){var j=(h-b.user.facebook_books_retrieval_time)/2678400;j>1?c():i()}else c();if(angular.isDefined(b.user.facebook_likes_retrieval_time)){var k=(h-b.user.facebook_likes_retrieval_time)/2678400;k>1?e():g()}else e();d()})};(function(){a.visible_search_bar=!0,a.info={},a.info.show_share=!1;var b=i.absUrl(),c=b.indexOf("rooms")>0,d=b.indexOf("personalised_suggestions")>0,e=b.indexOf("filters")>0||b.indexOf("signup")>0;c?a.active_page=1:d?a.active_page=0:e?a.active_page=2:a.active_page=-1,a.random_set=-1,a.data={selectedIndex:0},n();a.search_results=[],""!=getCookie("logged")&&(a.info.hide_signin=!0)})()}]);