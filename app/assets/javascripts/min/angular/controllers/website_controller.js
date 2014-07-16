websiteApp.controller("websiteAppController",["$scope","$rootScope","$timeout","websiteService","$document","scroller","$window",function(a,b,c,d,e,f,g){a.bindHorizontalScroll=function(b,c){b.preventDefault(),c>0?a.move_left(b):a.move_right(b),b.stopPropagation()},_hide_popups=function(){b.focused_book=null,b.ticker_popup=null},a.move_left=function(b){_hide_popups();var c=2e3,d=document.body.scrollWidth;if(b)if("keydown"==b.type||"wheel"==b.type)var e=g.pageXOffset,h=e*screen.width/d;else var e=b.pageX-b.screenX;else{var e=g.pageXOffset;c=1e3}a.progression_state={width:h+"px"};var i=.31*screen.width;f.scrollTo(e-i,0,c)},a.move_right=function(c){_hide_popups();var d=2e3,e=document.body.scrollWidth;if(c){var h=c.pageX;if("keydown"==c.type||"wheel"==c.type)var i=g.pageXOffset,j=i+2.5*screen.width>e,k=i*screen.width/e;else var i=c.pageX-(c.screenX-c.offsetX),j=h+screen.width>e}else{var i=g.pageXOffset,j=i+2.5*screen.width>e;d=1e3}a.progression_state={width:k+"px"},j&&(b.loading||(b.loading=!0,b.$broadcast("loadRecommendations")));var l=.31*screen.width;f.scrollTo(i+l,0,d)},a.scroll_one_page_right=function(a){var c=document.body.scrollWidth;if(a)var d=a.pageX-screen.width/2,e=a.pageX+screen.width>c;else{var d=g.pageXOffset;-screen.width/2;var e=g.pageXOffset;+screen.width>c}e&&b.$broadcast("loadRecommendations");var h=screen.width;f.scrollTo(d+h,0,2e3)},a.scroll_one_page_left=function(a){if(a)var b=a.pageX-screen.width/2;else var b=g.pageXOffset-screen.width/2;var c=screen.width;f.scrollTo(b-c,0,2e3)},a.showFeebackForm=function(){},a.show_uploader=function(){a.uploader=!0},_bind_feedback_form=function(){g.onmouseleave=function(){}},_load_recommendations=function(){var a=document.body.scrollWidth,c=event.pageX+screen.width>a;c&&b.$broadcast("loadRecommendations")},_get_book_details=function(c){filter="id="+c,d.get_book_details(filter).then(function(c){a.detailed_book.book=c,b.show_book=!0})},_bind_emit=function(){show_book_event=a.$on("expandBook",function(a,c,d,e,f){b.book_x=d,b.screen_x=e,b.total_x=f,_get_book_details(c),a.stopPropagation()})},_add_listeners=function(){i=a.$on("moveRight",function(){h=c(function(){a.move_right()},1e3)}),get_notifications_event=a.$on("getNotifications",function(){d.get_notifications(b.user).then(function(b){a.notifications=b.notifications})})},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},_initiate_loading_page=function(){a.loading=!0,a.drop_icon=!1,a.show_login_form=!1,c(function(){a.loading=!1},3e3),c(function(){a.drop_icon=!0},1e3)},a.toggle_notifications=function(){a.show_notifications?(a.show_notifications=!1,a.notifications_seen=!0):a.show_notifications=!0},a.handle_keyboard_bindings=function(c){a.show_book?39==c.keyCode?(c.preventDefault(),$(".detailed_book").turn("next")):37==c.keyCode?(c.preventDefault(),$(".detailed_book").turn("previous")):27==c.keyCode&&(c.preventDefault(),b.show_book=!1):39==c.keyCode?(c.preventDefault(),a.move_right(c)):37==c.keyCode&&(c.preventDefault(),a.move_left(c)),c.stopPropagation();8==c.keyCode},a.search=function(){var c=event.currentTarget==event.srcElement&&!b.show_book;c&&($("body").css("white-space","normal"),a.website.searching=!0,b.keyCode=event.keyCode)},_handle_socket_error=function(){},_init_notifications=function(){b.notification_active=!1},_init=function(){_initiate_loading_page(),a.more_filters=[],a.show_notifications=!0,a.notifications_seen=!1,a.website={},a.website.searching=!1,a.website.show_search_page=!0,_bind_emit(),_bind_feedback_form(),_add_listeners(),_handle_socket_error(),_init_notifications(),b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1}};var h="",i="";_init()}]);