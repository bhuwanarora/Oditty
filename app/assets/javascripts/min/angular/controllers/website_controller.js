websiteApp.controller("websiteAppController",["$scope","$rootScope","$timeout","websiteService","Facebook","$document","scroller","$window",function(a,b,c,d,e,f,g,h){a.bindHorizontalScroll=function(b,c){b.preventDefault(),c>0?a.move_left(b):a.move_right(b),b.stopPropagation()},_hide_popups=function(){b.focused_book=null,b.ticker_popup=null},a.move_left=function(b){_hide_popups();var c=2e3,d=document.body.scrollWidth;if(b)if("keydown"==b.type||"wheel"==b.type)var e=h.pageXOffset,f=e*screen.width/d;else var e=b.pageX-b.screenX;else{var e=h.pageXOffset;c=1e3}a.progression_state={width:f+"px"};var i=.31*screen.width;g.scrollTo(e-i,0,c)},a.move_right=function(c){_hide_popups();var d=2e3,e=document.body.scrollWidth;if(c){var f=c.pageX;if("keydown"==c.type||"wheel"==c.type)var i=h.pageXOffset,j=i+2.5*screen.width>e,k=i*screen.width/e;else var i=c.pageX-(c.screenX-c.offsetX),j=f+screen.width>e}else{var i=h.pageXOffset,j=i+2.5*screen.width>e;d=1e3}a.progression_state={width:k+"px"},j&&(b.loading||(b.loading=!0,b.$broadcast("loadRecommendations")));var l=.31*screen.width;g.scrollTo(i+l,0,d)},a.scroll_one_page_right=function(a){var c=document.body.scrollWidth;if(a)var d=a.pageX-screen.width/2,e=a.pageX+screen.width>c;else{var d=h.pageXOffset;-screen.width/2;var e=h.pageXOffset;+screen.width>c}e&&b.$broadcast("loadRecommendations");var f=screen.width;g.scrollTo(d+f,0,2e3)},a.scroll_one_page_left=function(a){if(a)var b=a.pageX-screen.width/2;else var b=h.pageXOffset-screen.width/2;var c=screen.width;g.scrollTo(b-c,0,2e3)},a.showFeebackForm=function(){},a.authenticate=function(c,e,f){var g={email:c,password:e,old_user:f};a.loading_icon=!0;var h=function(c){a.error_message=c.message,b.user.profile_status=c.profile_status,b.user.logged=!0,b.user.id=c.user_id,a.loading_icon=!1,d.get_notifications(b.user).then(function(b){a.notifications=b.notifications})},i=function(b){a.loading_icon=!1,a.error_message=b.data.message};d.authenticate(g).then(h,i)},a.intent_login=function(){e.getLoginStatus(function(c){"connected"==c.status?(b.logged=!0,a.me()):a.login()})},a.login=function(){e.login(function(c){"connected"==c.status&&(b.logged=!0,a.me())})},a.me=function(){e.api("/me",function(c){a.$apply(function(){b.user=c,b.user.profile_status=0,b.user.thumb="https://scontent-b-kul.xx.fbcdn.net/hphotos-ash3/t1.0-9/66784_415130785223231_1615890777_n.jpg",b.user.logged=!0})})},a.logout=function(){e.logout(function(){a.$apply(function(){b.user={},b.logged=!1})})},a.show_uploader=function(){a.uploader=!0},_bind_feedback_form=function(){h.onmouseleave=function(){}},_load_recommendations=function(){var a=document.body.scrollWidth,c=event.pageX+screen.width>a;c&&b.$broadcast("loadRecommendations")},_get_book_details=function(c){filter="id="+c,d.get_book_details(filter).then(function(c){a.detailed_book.book=c,b.show_book=!0})},_bind_emit=function(){show_book_event=a.$on("expandBook",function(a,c,d,e,f){b.book_x=d,b.screen_x=e,b.total_x=f,_get_book_details(c),a.stopPropagation()})},_bind_auth_listeners=function(){a.$on("event:google-plus-signin-success",function(){}),a.$on("event:google-plus-signin-failure",function(){}),a.$on("Facebook:statusChange",function(b,c){"connected"==c.status&&a.$apply(function(){})}),a.$watch(function(){return e.isReady()},function(b){b&&(a.facebookReady=!0)})},_add_listeners=function(){i=a.$on("addToShelf",function(a,c,d){"BOOK"==c?b.user.books.read.push(d):"AUTHOR"==c?b.user.authors.follow.push(d):"READER"==c&&b.user.readers.follow.push(d),a.stopPropagation()}),j=a.$on("removeFromShelf",function(a,c,d){if("BOOK"==c){var e=b.user.books.read.indexOf(d);b.user.books.read.splice(e,1)}else if("AUTHOR"==c){var e=b.user.authors.follow.indexOf(d);b.user.authors.follow.splice(e,1)}else if("READER"==c){var e=b.user.readers.follow.indexOf(d);b.user.readers.follow.splice(e,1)}a.stopPropagation()}),k=a.$on("addToBookmarks",function(a,c,d){"BOOK"==c?b.user.books.bookmarked.push(d):"AUTHOR"==c&&b.user.authors.bookmarked.push(d),a.stopPropagation()}),l=a.$on("removeFromBookmarks",function(a,c,d){if("BOOK"==c){var e=b.user.books.bookmarked.indexOf(d);b.user.books.bookmarked.splice(e,1)}else if("AUTHOR"==c){var e=b.user.authors.bookmarked.indexOf(d);b.user.authors.bookmarked.splice(e,1)}a.stopPropagation()}),n=a.$on("moveRight",function(){m=c(function(){a.move_right()},1e3)})},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},_initiate_loading_page=function(){a.loading=!0,a.drop_icon=!1,a.show_login_form=!1,c(function(){a.loading=!1},3e3),c(function(){a.drop_icon=!0},1e3)},a.toggle_notifications=function(){a.show_notifications?(a.show_notifications=!1,a.notifications_seen=!0):a.show_notifications=!0},a.handle_keyboard_bindings=function(c){a.show_book?39==c.keyCode?(c.preventDefault(),$(".detailed_book").turn("next")):37==c.keyCode?(c.preventDefault(),$(".detailed_book").turn("previous")):27==c.keyCode&&(c.preventDefault(),b.show_book=!1):39==c.keyCode?(c.preventDefault(),a.move_right(c)):37==c.keyCode&&(c.preventDefault(),a.move_left(c)),c.stopPropagation();8==c.keyCode},a.search=function(){var c=event.currentTarget==event.srcElement&&!b.show_book;c&&($("body").css("white-space","normal"),a.website.searching=!0,b.keyCode=event.keyCode)},_handle_socket_error=function(){a.$on("socket:error",function(){})},_init=function(){_initiate_loading_page(),a.more_filters=[],a.show_notifications=!0,a.notifications_seen=!1,a.test={time:1970},a.detailed_book={},b.initPage=3,b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1},a.website={},a.website.searching=!1,a.website.show_search_page=!0,_bind_emit(),_bind_feedback_form(),_bind_auth_listeners(),_add_listeners(),_handle_socket_error(),a.authenticate()};var i="",j="",k="",l="",m="",n="";_init()}]);