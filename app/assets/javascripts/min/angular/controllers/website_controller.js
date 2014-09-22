websiteApp.controller("websiteAppController",["$scope","$rootScope","$timeout","websiteService","$document","scroller","$window","WebsiteUIConstants",function(a,b,c,d,e,f,g,h){a.bindHorizontalScroll=function(b,c){b.preventDefault(),c>0?a.move_left(b):a.move_right(b),b.stopPropagation()},a._hide_popups=function(){b.user.collapsed_column=!0,b.user.collapsed_filters=!0,b.user.collapsed_friends=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!0,b.user.collapsed_left_column=!0,b.popups={},delete b.focused_book,delete b.ticker_popup},a.move_left=function(b){a._hide_popups();var d=1e3,e=(document.body.scrollWidth,g.pageXOffset),h=.4*window_height;if(angular.isDefined(b))if("click"==b.type){a.delta_x=angular.isDefined(a.delta_x)?a.delta_x+h:h;var i=c(function(){f.scrollTo(e-a.delta_x,0,d),delete a.delta_x,c.cancel(i)},400)}else f.scrollTo(e-h,0,d);else f.scrollTo(e-h,0,d)},a.move_right=function(d){a._hide_popups();var e=1e3,h=document.body.scrollWidth,i=g.pageXOffset,j=.4*window_height,k=i+2.5*window_width>h;if(k&&(b.loading||(b.loading=!0,b.$broadcast("loadRecommendations"))),angular.isDefined(d))if("click"==d.type){a.delta_x=angular.isDefined(a.delta_x)?a.delta_x+j:j;var l=c(function(){f.scrollTo(i+a.delta_x,0,e),delete a.delta_x,c.cancel(l)},400)}else f.scrollTo(i+j,0,e);else f.scrollTo(i+j,0,e)},a.scroll_one_page_right=function(a){var c=document.body.scrollWidth;if(a)var d=a.pageX-window_width/2,e=a.pageX+window_width>c;else var d=g.pageXOffset,e=g.pageXOffset;e&&b.$broadcast("loadRecommendations");var h=window_width;f.scrollTo(d+h,0,2e3)},a.scroll_one_page_left=function(a){if(a)var b=a.pageX-window_width/2;else var b=g.pageXOffset-window_width/2;var c=window_width;f.scrollTo(b-c,0,2e3)},a.showFeebackForm=function(){},a.show_uploader=function(){a.uploader=!0},_bind_feedback_form=function(){g.onmouseleave=function(){}},_load_recommendations=function(){var a=document.body.scrollWidth,c=event.pageX+window_width>a;c&&b.$broadcast("loadRecommendations")},_get_book_details=function(c){filter="id="+c,d.get_book_details(filter).then(function(c){a.detailed_book.book=c,b.show_book=!0})},_bind_emit=function(){show_book_event=a.$on("expandBook",function(a,c,d,e,f){b.book_x=d,b.screen_x=e,b.total_x=f,_get_book_details(c),a.stopPropagation()})},_add_listeners=function(){j=a.$on("moveRight",function(){i=c(function(){a.move_right()},1e3)}),add_to_notifications=a.$on("addToNotifications",function(b,c){if(_intro_notifications(),c instanceof Array){var d=!1;angular.forEach(a.notifications,function(a){a.id==c[0].id&&(d=!0)}),d||(a.notifications=a.notifications.concat(c))}else a.notifications.push(c),angular.isDefined(a.personal_notifications)&&a.personal_notifications.push(c);b.stopPropagation()}),get_notifications_event=a.$on("getNotifications",function(b,c){if(angular.isDefined(c)){if(angular.isDefined(a.personal_notifications))var e=a.personal_notifications.length;else var e=0;d.get_notifications(e,c).then(function(b){_intro_notifications(c),a.personal_notifications=b.notifications.concat(a.personal_notifications)})}else{if(angular.isDefined(a.notifications))var e=a.notifications.length;else var e=0;d.get_notifications(e).then(function(b){_intro_notifications(),a.notifications=b.notifications.concat(a.notifications)})}}),k=a.$on("getLatestNotification",function(){d.get_latest_notification().then(function(b){a.notifications.push(b.notification)})})},_intro_notifications=function(c){angular.isUndefined(c)?angular.isUndefined(a.notifications)&&(a.notifications=b.trends,delete a.personal_notifications):angular.isUndefined(a.personal_notifications)&&(a.personal_notifications=[],delete a.notifications)},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},_initiate_loading_page=function(){a.loading=!0,a.drop_icon=!1,a.show_login_form=!1,c(function(){a.loading=!1},2e3),c(function(){a.drop_icon=!0},1e3)},a.toggle_notifications=function(){a.show_notifications?(a.show_notifications=!1,a.notifications_seen=!0):a.show_notifications=!0},a.handle_keyboard_bindings=function(b){b.keyCode==h.KeyRight?(b.preventDefault(),a.move_right(b)):b.keyCode==h.KeyLeft&&(b.preventDefault(),a.move_left(b)),b.stopPropagation()},a.search=function(){var c=event.currentTarget==event.srcElement&&!b.show_book;c&&($("body").css("white-space","normal"),a.website.searching=!0,b.keyCode=event.keyCode)},_handle_socket_error=function(){},_init_notifications=function(){b.notification_active=!1},_init=function(){_initiate_loading_page(),a.more_filters=[],a.show_notifications=!0,a.notifications_seen=!1,angular.isDefined(b.focused_book)&&(b.focused_book.level2_option=""),a.website={},a.website.searching=!1,a.website.show_search_page=!0,_bind_emit(),_bind_feedback_form(),_add_listeners(),_handle_socket_error(),_init_notifications(),b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1},_detect_browser()},_detect_browser=function(){{var a,b,c,d=(navigator.appVersion,navigator.userAgent),e=navigator.appName,f=""+parseFloat(navigator.appVersion),g=parseInt(navigator.appVersion,10);h.BrowserIncompatible}-1!=(b=d.indexOf("Opera"))?(e="Opera",f=d.substring(b+6),-1!=(b=d.indexOf("Version"))&&(f=d.substring(b+8))):-1!=(b=d.indexOf("MSIE"))?(e="Microsoft Internet Explorer",f=d.substring(b+5)):-1!=(b=d.indexOf("Chrome"))?(e="Chrome",f=d.substring(b+7)):-1!=(b=d.indexOf("Safari"))?(e="Safari",f=d.substring(b+7),-1!=(b=d.indexOf("Version"))&&(f=d.substring(b+8))):-1!=(b=d.indexOf("Firefox"))?(e="Firefox",f=d.substring(b+8)):(a=d.lastIndexOf(" ")+1)<(b=d.lastIndexOf("/"))&&(e=d.substring(a,b),f=d.substring(b+1),e.toLowerCase()==e.toUpperCase()&&(e=navigator.appName)),-1!=(c=f.indexOf(";"))&&(f=f.substring(0,c)),-1!=(c=f.indexOf(" "))&&(f=f.substring(0,c)),g=parseInt(""+f,10),isNaN(g)&&(f=""+parseFloat(navigator.appVersion),g=parseInt(navigator.appVersion,10))};var i="",j="",k="";_init()}]);