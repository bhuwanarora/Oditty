homeApp.controller("appController",["$scope","$rootScope","$mdSidenav","$mdBottomSheet","$mdDialog","shelfService","userService","$cookieStore","$timeout","$location","feedService",function(a,b,c,d,e,f,g,h,i,j,k){a.stop_propagation=function(a){a.stopPropagation()},a.show_signin_options=function(a){c("signup").toggle(),a.stopPropagation()},a.show_search_bar=function(){a.info.mobile_search=!a.info.mobile_search},a.show_rating=function(a){e.show({templateUrl:"assets/angular/html/shared/share.html",targetEvent:a}),a.stopPropagation()},a.toggle_notifications=function(b){a.info.notifications_seen=!0,a.info.loading=!0;var d=i(function(){k.get_notifications().then(function(b){a.info.loading=!1,a.notifications=b,angular.forEach(a.notifications,function(a){switch(a.label){case"FollowsNode":angular.isDefined(a.friend)&&(a.message="<span>Your <a href='/profile?id="+a.notification.user_id+"'>friend</a> started following you.");break;case"RecommendNode":a.message="<span>Your <a href='/profile?id="+a.notification.user_id+"'>friend</a> recommended you a <a href='/book?id="+a.notification.book_id+"'>book</a><span>."}})})},100);a.$on("destroy",function(){i.cancel(d)}),c("notifications").toggle(),a.navigation_options=!1,b.stopPropagation()},a.close_popups=function(){a.show_notifications=!1,b.shelves_visible=!1,a.navigation_options=!1},a.toggleLeft=function(a){c("left").toggle(),a.stopPropagation()},a.toggleRight=function(a){c("right").toggle(),a.stopPropagation()},a.stop_propagation=function(a){a.stopPropagation()},a.toggle_navigation_options=function(b){a.navigation_options=!a.navigation_options,a.show_notifications=!1,b.stopPropagation()};var l=function(){var c=i(function(){angular.isUndefined(b.user)&&g.get_user_details().then(function(a){b.user=a})},100);a.$on("destroy",function(){i.cancel(c)})};(function(){a.visible_search_bar=!0,a.info={},a.info.show_share=!1;var b=j.absUrl(),c=b.indexOf("rooms")>0,d=b.indexOf("personalised_suggestions")>0,e=b.indexOf("filters")>0||b.indexOf("signup")>0;c?a.active_page=1:d?a.active_page=0:e?a.active_page=2:a.active_page=-1,a.random_set=-1,a.data={selectedIndex:0},l();a.search_results=[],""!=getCookie("logged")&&(a.info.hide_signin=!0)})()}]);