websiteApp.controller("bookTimelineController",["$scope","$rootScope","$timeout","widgetService","$route","$routeParams","$interval",function(a,b,c,d){(_init=function(){d.get_moments().then(function(b){a.moments=b.moments})})()}]);;websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller",function(a,b,c,d,e,f,g,h,i){a.toggle_bookmarked=function(b){a.bookmark_selected||(a.panel_selected="BOOKMARK",a.bookmark_selected=!0,a.read_selected=!1,a.glowBookmark=!1),b.stopPropagation()},a.toggle_recommendations=function(){(a.bookmark_selected||a.read_selected)&&(a.read_selected=!1,a.bookmark_selected=!1,a.panel_selected="",a.reset())},a.handle_height_of_popup=function(b){a.ticker_popup_style=b.deltaY>0?{height:"62vh"}:{height:"42vh"},b.stopPropagation()},a.handle_friends_grid_size=function(){a.column_heights=event.deltaY>0?{notifications_style:{height:"110px"},friends_grid_style:{"max-height":"120px",overflow:"auto"},show_filters:!1}:{notifications_style:{height:"110px"},friends_grid_style:{height:"75px"},show_filters:!1},event.stopPropagation()},a.reset=function(){_init_recommendations(),_get_recommendations()},a.toggle_read=function(){a.read_selected||(a.glowShelf=!1,a.bookmark_selected=!1,a.read_selected=!0,a.panel_selected="READ")},a.toggle_more_filters=function(b){a.show_more_filters=1==a.show_more_filters?!1:!0,b.stopPropagation()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){b.hide_options=!0,b.focused_book=null,b.ticker_popup=null},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){k=a.$on("loadRecommendations",function(){a.read_selected||a.bookmark_selected||(b.filters.reset=!1,b.filters.reset_count=angular.isUndefined(b.filters.reset_count)?0:b.filters.reset_count+1,_get_recommendations())}),l=a.$on("reloadRecommendations",function(){b.filters.reset=!0,b.filters.reset_count=0,a.reset()}),n=a.$on("showBookReadShelf",function(){a.read_selected=!0,event.stopPropagation()}),glow_shelf_event=a.$on("glowShelf",function(){a.glowShelf=!0,event.stopPropagation()}),glow_bookmark_event=a.$on("glowBookmark",function(){a.glowBookmark=!0,event.stopPropagation()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(j),c.cancel(m)})},_init_shelf=function(){a.read_selected=!1,a.bookmark_selected=!1},_initialize_filters=function(){a.show_more_filters=!0,b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type?b.filters.filter_type="BOOK":"authors"==f.type?b.filters.filter_type="AUTHOR":"readers"==f.type?b.filters.filter_type="READER":f.title?(a.$routeParams.type="books",b.filters.reset=!0,b.filters.filter_type="BOOK",b.filters.other_filters.title=a.$routeParams.title,b.filters.other_filters.author_name=a.$routeParams.author):(b.filters.filter_type="BOOK",a.show_notifications=!0),f.filter_id&&(a.show_more_filters=!0)},_update_recommendations=function(d){if("BOOK"==b.filters.filter_type){var e="INFO- "+d.recommendations.books.length+" books found.",f=notify(b,e,c);if(a.$on("destroy",function(){c.cancel(f)}),b.loading){var g=30;if(0==d.recommendations.books.length){var e="ALERT- Reset the filters couldn't find more books.",f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})}else{if(a.recommendations.books.length>=g){a.recommendations.books=[a.recommendations.books[g-2],a.recommendations.books[g-1]];var f=c(function(){i.scrollTo(screen.width/2,0,3e3)},1e3);a.$on("destroy",function(){c.cancel(f)})}b.filters.other_filters.title?(a.bookmark_selected=!1,a.read_selected=!1,b.hide_options=!0,_set_books(d.recommendations.books),b.focused_book=a.recommendations.books[0],b.focused_book.tweets=[]):_set_books(d.recommendations.books)}b.loading=!1}}else"AUTHOR"==b.filters.filter_type?a.recommendations.authors=a.recommendations.authors.length>=30?d.recommendations.authors:a.recommendations.authors.concat(d.recommendations.authors):"READER"==b.filters.filter_type?a.recommendations.readers=a.recommendations.readers.length>=30?d.recommendations.readers:a.recommendations.readers.concat(d.recommendations.readers):_set_books(a.recommendations.books.length>=30?d.recommendations.books:d.recommendations.books)},_set_books=function(b){angular.forEach(b,function(a){var b={isbn:a[0],id:a[1]};this.push(b)},a.recommendations.books)},_push_recommendations=function(){var a=3e3;j=c(function(){d.push_recommendations().then(function(a){b.message_type="Notification",b.message="We think you like Hermann Hesse, and here is his best read.",_update_recommendations(a)})},a)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.loading=!0,d.get_recommendations().then(function(a){_update_recommendations(a)})},_get_filters=function(){d.get_filters().then(function(b){a.more_filters=a.more_filters.concat(b.filters)})},_handle_focused_book=function(){b.focused_book=a.recommendations.books.first},_get_friends=function(){h.get_friends(a.$routeParams.id).then(function(a){b.user.friends=a.friends})},_get_labels=function(){d.get_labels().then(function(a){b.labels=a.labels})},_init=function(){a.$routeParams=f;var d=1e4;a.drop_icon=!1,b.show_book=!1,m=c(function(){_recordUserBehaviour()},d),a.searching=!1,_get_filters(),_get_labels(),_initialize_filters(),_init_recommendations(),a.$routeParams.title&&_get_recommendations(),_add_listeners(),_init_analytics(),_init_shelf(),_bind_destroy(),_get_friends()};var j="",k="",l="",m="",n="";_init()}]);;websiteApp.controller("searchController",["$scope","$rootScope","websiteService","$timeout","$sce","recommendationService","$routeParams",function(a,b,c,d,e,f,g){_show_search_result=function(c,d){d?(b.filters.other_filters.title=c,b.filters.other_filters.show_all=!0):(b.filters.other_filters.title=c.name,b.filters.other_filters.author_name=c.author_name),a.$emit("reloadRecommendations")},_handle_graph_search=function(){a.hide_search_page()},_search_by=function(c){if(!c)var c=a.search_type;if(a.search_level1){if(a.search_level1){if(a.search_level2=!0,a.search_results=[],"YEAR"==c){a.year_search=!0;b.time_groups?a.search_results=b.time_groups:f.get_time_groups().then(function(c){a.search_results=[],angular.forEach(c.times,function(a){var b=a[0].data,c=b.name+" ("+b.range+")",d={name:c,custom_option:!0,type:"timeGroup"};this.push(d)},a.search_results),b.time_groups=a.search_results})}else if("LIST"==c){a.list_search=!0}else if("COUNTRY"==c){a.country_search=!0;b.regions?a.search_results=b.regions:f.get_countries().then(function(c){a.search_results=c.countries,b.regions=a.search_results})}else if("GENRE"==c){a.genre_search=!0}else if("AUTHOR"==c){a.author_search=!0}else if("TIME"==c){a.time_search=!0;b.read_times?a.search_results=b.read_times:f.get_read_times().then(function(c){a.search_results=[],angular.forEach(c.read_times,function(a){var b=a[0].data,c=b.name,d={name:c,custom_option:!0,type:"readingTime"};this.push(d)},a.search_results),b.read_times=a.search_results})}else if("GENDER"==c){a.gender_search=!0;a.search_results=[{name:"Male",custom_option:!0,icon:"icon-male"},{name:"Female",custom_option:!0,icon:"icon-female"},{name:"I don't care",custom_option:!0}]}else if("AWARDS"==c){a.awards_search=!0}a.search_tag.placeholder="Select a category"}}else a.search_level1=!0,-1!=c.indexOf("BOOK")?(a.search_display="Searching Books...",a.search_type="[BOOK]",a.book_search=!0,a.author_search=!1,a.reader_search=!1,a.search_tag.placeholder="Search Books...",_init_book_search()):-1!=c.indexOf("AUTHOR")?(a.search_display="Searching Authors...",a.search_type="[AUTHOR]",a.author_search=!0,a.reader_search=!1,a.book_search=!1,a.search_tag.placeholder="Search Authors...",_init_author_search()):-1!=c.indexOf("READER")&&(a.search_display="Searching Readers...",a.search_type="[READER]",a.reader_search=!0,a.book_search=!1,a.author_search=!1,a.search_tag.placeholder="Search Readers...",_init_reader_search())},a.handle_selection=function(c){var d=c.name,e=c.graph_option,f=c.custom_option,g=c.type,h=c.show_all;h?_show_search_result(a.search_tag.input,!0):f?(a.search_level1?a.search_level2&&(_handle_input_focus(),b.$broadcast("filterChange",{name:d},g),b.hide_options=!0,a.search_tag.input=d):(_handle_input_focus(),a.search_type=g),_search_by(g),a.search_tag.input=""):(a.search_tag.selected_result=!0,e?_handle_graph_search(d):_show_search_result(c),a.search_tag.input=""),event.stopPropagation()},a.hide_search_page=function(c){var e=a.logged;e?($("body").css("white-space","nowrap"),a.website.searching=!1,a.website.show_search_page=!1,b.$broadcast("initPage",c),a.loading=!0,d(function(){a.loading=!1},2e3)):a.show_login_form=!0},a.is_current=function(b,c){return a.search_tag.current==b&&(a.search_tag.currentItem=c),a.search_tag.current==b},a.set_current=function(b){a.search_tag.current=b},_navigate_options=function(){var b=13==event.keyCode;b&&a.handle_selection(a.search_tag.currentItem)},a.key_up=function(){var b=38==event.keyCode,c=40==event.keyCode;b&&a.set_current(0!=a.search_tag.current?a.search_tag.current-1:a.search_results.length-1),c&&a.set_current(a.search_tag.current!=a.search_results.length-1?a.search_tag.current+1:0)},a.key_down=function(b){var c=8==b.keyCode||46==b.keyCode;if(c){var d=_get_search_input(b);d.length<=1?d.length<1&&a.search_level1&&!a.search_level2?(a.clear_search_level1_var(b),b.preventDefault()):d.length<1&&a.search_level2?(a.clear_search_level2_var(b),b.preventDefault()):_init_search():a.get_search_results(b)}},a.clear_search_level1_var=function(c){a.clear_search_level2_var(c),a.search_level1=!1,a.book_search=!1,a.author_search=!1,a.reader_search=!1,b.hide_options=!1,_handle_input_focus(),_init_graph_search(),c.stopPropagation()},_handle_input_focus=function(){a.website.searching=!0;var b=d(function(){a.website.searching=!1},200);a.$on("destroy",function(){d.cancel(b)})},a.close_login_box=function(){a.show_login_form=!1},a.clear_search_level2_var=function(c){a.search_level1=!1,a.search_level2=!1,a.year_search=!1,a.list_search=!1,a.country_search=!1,a.genre_search=!1,a.author_search=!1,a.time_search=!1,a.gender_search=!1,a.awards_search=!1,b.hide_options=!1,_search_by(),_handle_input_focus(),c.stopPropagation()},a.highlight=function(a,b){var c="<span><i><b>$&</b></i></span>";return e.trustAsHtml(b.replace(new RegExp(a,"gi"),c))},_init_graph_search=function(){a.search_level1?(a.search_level1=!1,_search_by()):(a.search_tag.placeholder="Search...",a.search_results=[{name:"Search a Book",icon:"icon-book",custom_option:!0,type:"BOOK",graph_option:!0},{name:"Search an Author",icon:"icon-pen",custom_option:!0,type:"AUTHOR",graph_option:!0},{name:"Search a Reader",icon:"icon-users",custom_option:!0,type:"READER",graph_option:!0}])},_init_book_search=function(){a.search_results=[{name:"Find Books by Era",custom_option:!0,type:"YEAR",icon:"icon-calendar"},{name:"Find Books by Reading Time",custom_option:!0,type:"TIME",icon:"icon-clock"},{name:"Find Books by Author's Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Books by Genre",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Get popular lists of Books",custom_option:!0,type:"LIST",icon:"icon-list"},{name:"Get Books by Author",custom_option:!0,type:"AUTHOR",icon:"icon-pen"}]},_init_author_search=function(){a.search_results=[{name:"Find Authors by Era",custom_option:!0,type:"YEAR",icon:"icon-clock"},{name:"Find Authors by Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Authors by Awards",custom_option:!0,type:"AWARDS",icon:"icon-trophy"},{name:"Find Authors by Genre",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Get popular lists of Authors",custom_option:!0,type:"LIST",icon:"icon-list"}]},_init_reader_search=function(){a.search_results=[{name:"Find Readers by Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Readers by their Taste",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Find Readers by Gender",custom_option:!0,type:"GENDER",icon:"icon-male icon-female"},{name:"Get popular lists of Readers",custom_option:!0,type:"LIST",icon:"icon-list"}]},_init_search=function(){_init_graph_search(),a.search_level1||a.search_level2||(a.search_type="[ALL]",a.search_display="Searching reader's door...")},_handle_search_input=function(b){var e=_get_search_input(b);_init_graph_search(),a.search_ready=!0;{var f=e.slice(0,1),g="#"==f,i="@"==f,j="+"==f,k=i||g||j;e.length}_set_custom_search(i,g,j),k&&(1==e.length&&(a.search_ready=!1),e=e.substring(1,e.length)),a.search_ready&&""!=e?c.search(e,a.search_type,a.search_tag.result_count).then(function(b){a.search_results=[];var c=b.results.data;if(angular.forEach(c,function(a){var b={name:a[0],author_name:a[1]};this.push(b)},a.search_results),0!=a.search_results.length){var e={name:"<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+a.search_tag.input+"</em>'</span>",show_all:!0};a.search_results.push(e)}a.search_initiated=!1,d.cancel(h)}):(a.search_initiated=!1,_init_graph_search(),d.cancel(h))},_get_search_input=function(){return a.search_tag.input.trim()},_set_custom_search=function(b,c,d){b?(a.search_type="['AUTHOR', 'READER']",a.search_display="Searching authors and readers..."):c?(a.search_type="['BOOK']",a.search_display="Searching books..."):d&&(a.search_type="['TAG']",a.search_display="Searching book categories...")},a.get_search_results=function(b,c){if(c){if(a.search_initiated=!0,"BOOK"==c)var e=!0,f=!1,g=!1;else if("AUTHOR"==c)var i="@",e=!1,f=!0,g=!1;_set_custom_search(f,e,g)}else if(_init_graph_search(),a.search_initiated)d.cancel(h);else{if(!i){var i=String.fromCharCode(b.keyCode);_navigate_options()}var j=_get_search_input(b);if(j&&j.length>1)var e=0==j.indexOf("#"),f=0==j.indexOf("@"),g=0==j.indexOf("+");else var e="#"==i,f="@"==i,g="+"==i;a.search_initiated=!0,_set_custom_search(f,e,g)}h=d(function(){_handle_search_input(b)},500)},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},a.handle_options=function(){g.type&&(b.hide_options&&(b.hide_options=!1),event.stopPropagation())},_handle_search_page=function(){a.search_initiated=!1,a.search_display="Searching reader's door...",a.search_type="[ALL]",a.show_login_form=!0,a.search_tag={},a.search_tag.search_placeholder="Search...",a.search_tag.current=0,a.search_tag.input="",a.search_tag.result_count=5,a.website.searching=!1,a.website.show_search_page=!0,c.get_background_image().then(function(b){a.search_style={"background-image":'url("'+b.url+'")'}}),_init_graph_search(),b.hide_options=g.type?!0:!1},_get_trends=function(){angular.isUndefined(a.$routeParams)&&c.get_trending_topics().then(function(b){a.trends=b})},_init=function(){_handle_search_page(),_get_trends()};var h="";_init()}]);;websiteApp.controller("timelineController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval",function(){}]);;websiteApp.controller("loginController",["$scope","$rootScope","websiteService","Facebook","stropheService","$timeout",function(a,b,c,d,e,f){a.authenticate=function(d){var g=b.user.email,h=b.user.password,i=new RegExp("^.{8,}$"),j=new RegExp("^(.)\\1{7,16}$"),k=new RegExp("^.{100,}$");a.error_message="";var l={email:g,password:h,old_user:d};a.loading_icon=!1;var m=function(c){a.error_message=c.message,b.user.profile_status=c.profile_status,b.user.logged=!0,b.user.id=c.user_id,a.loading_icon=!1;var d="INFO- Welcome back "+b.user.name,e=notify(b,d,f);a.$on("destroy",function(){f.cancel(e)}),a.$emit("getNotifications")},n=function(c){a.loading_icon=!1,a.error_message=c.data.message,b.user.password=null};b.user.email?b.user.password?i.test(b.user.password)||d?j.test(b.user.password)&&!d?a.error_message="Choose a more secure password":k.test(b.user.password)&&!d?a.error_message="Maximum password length is 100":(a.loading_icon=!0,c.authenticate(l).then(m,n),e.start_connection()):a.error_message="Minimum password length is 8":a.error_message="Enter your password":a.error_message="Enter your email address"},_bind_auth_listeners=function(){a.$on("event:google-plus-signin-success",function(){}),a.$on("event:google-plus-signin-failure",function(){}),a.$on("Facebook:statusChange",function(b,c){"connected"==c.status&&a.$apply(function(){})}),a.$watch(function(){return d.isReady()},function(b){b&&(a.facebookReady=!0)})},a.intent_login=function(){d.getLoginStatus(function(c){"connected"==c.status?(b.logged=!0,a.me()):a.login()})},a.login=function(){d.login(function(c){"connected"==c.status&&(b.logged=!0,a.me())})},a.me=function(){d.api("/me",function(c){a.$apply(function(){b.user=c,b.user.profile_status=0,b.user.thumb="https://scontent-b-kul.xx.fbcdn.net/hphotos-ash3/t1.0-9/66784_415130785223231_1615890777_n.jpg",b.user.logged=!0})})},a.logout=function(){d.logout(function(){a.$apply(function(){b.user={},b.logged=!1})})},(_init=function(){_bind_auth_listeners()})()}]);;websiteApp.controller("websiteAppController",["$scope","$rootScope","$timeout","websiteService","$document","scroller","$window",function(a,b,c,d,e,f,g){a.bindHorizontalScroll=function(b,c){b.preventDefault(),c>0?a.move_left(b):a.move_right(b),b.stopPropagation()},_hide_popups=function(){b.focused_book=null,b.ticker_popup=null},a.move_left=function(b){_hide_popups();var c=2e3,d=document.body.scrollWidth;if(b)if("keydown"==b.type||"wheel"==b.type)var e=g.pageXOffset,h=e*screen.width/d;else var e=b.pageX-b.screenX;else{var e=g.pageXOffset;c=1e3}a.progression_state={width:h+"px"};var i=.31*screen.width;f.scrollTo(e-i,0,c)},a.move_right=function(c){_hide_popups();var d=2e3,e=document.body.scrollWidth;if(c){var h=c.pageX;if("keydown"==c.type||"wheel"==c.type)var i=g.pageXOffset,j=i+2.5*screen.width>e,k=i*screen.width/e;else var i=c.pageX-(c.screenX-c.offsetX),j=h+screen.width>e}else{var i=g.pageXOffset,j=i+2.5*screen.width>e;d=1e3}a.progression_state={width:k+"px"},j&&(b.loading||(b.loading=!0,b.$broadcast("loadRecommendations")));var l=.31*screen.width;f.scrollTo(i+l,0,d)},a.scroll_one_page_right=function(a){var c=document.body.scrollWidth;if(a)var d=a.pageX-screen.width/2,e=a.pageX+screen.width>c;else{var d=g.pageXOffset;-screen.width/2;var e=g.pageXOffset;+screen.width>c}e&&b.$broadcast("loadRecommendations");var h=screen.width;f.scrollTo(d+h,0,2e3)},a.scroll_one_page_left=function(a){if(a)var b=a.pageX-screen.width/2;else var b=g.pageXOffset-screen.width/2;var c=screen.width;f.scrollTo(b-c,0,2e3)},a.showFeebackForm=function(){},a.show_uploader=function(){a.uploader=!0},_bind_feedback_form=function(){g.onmouseleave=function(){}},_load_recommendations=function(){var a=document.body.scrollWidth,c=event.pageX+screen.width>a;c&&b.$broadcast("loadRecommendations")},_get_book_details=function(c){filter="id="+c,d.get_book_details(filter).then(function(c){a.detailed_book.book=c,b.show_book=!0})},_bind_emit=function(){show_book_event=a.$on("expandBook",function(a,c,d,e,f){b.book_x=d,b.screen_x=e,b.total_x=f,_get_book_details(c),a.stopPropagation()})},_add_listeners=function(){h=a.$on("addToShelf",function(a,c,d){"BOOK"==c?b.user.books.read.push(d):"AUTHOR"==c?b.user.authors.follow.push(d):"READER"==c&&b.user.readers.follow.push(d),a.stopPropagation()}),i=a.$on("removeFromShelf",function(a,c,d){if("BOOK"==c){var e=b.user.books.read.indexOf(d);b.user.books.read.splice(e,1)}else if("AUTHOR"==c){var e=b.user.authors.follow.indexOf(d);b.user.authors.follow.splice(e,1)}else if("READER"==c){var e=b.user.readers.follow.indexOf(d);b.user.readers.follow.splice(e,1)}a.stopPropagation()}),j=a.$on("addToBookmarks",function(a,c,d){"BOOK"==c?b.user.books.bookmarked.push(d):"AUTHOR"==c&&b.user.authors.bookmarked.push(d),a.stopPropagation()}),k=a.$on("removeFromBookmarks",function(a,c,d){if("BOOK"==c){var e=b.user.books.bookmarked.indexOf(d);b.user.books.bookmarked.splice(e,1)}else if("AUTHOR"==c){var e=b.user.authors.bookmarked.indexOf(d);b.user.authors.bookmarked.splice(e,1)}a.stopPropagation()}),m=a.$on("moveRight",function(){l=c(function(){a.move_right()},1e3)}),get_notifications_event=a.$on("getNotifications",function(){d.get_notifications(b.user).then(function(b){a.notifications=b.notifications})})},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},_initiate_loading_page=function(){a.loading=!0,a.drop_icon=!1,a.show_login_form=!1,c(function(){a.loading=!1},3e3),c(function(){a.drop_icon=!0},1e3)},a.toggle_notifications=function(){a.show_notifications?(a.show_notifications=!1,a.notifications_seen=!0):a.show_notifications=!0},a.handle_keyboard_bindings=function(c){a.show_book?39==c.keyCode?(c.preventDefault(),$(".detailed_book").turn("next")):37==c.keyCode?(c.preventDefault(),$(".detailed_book").turn("previous")):27==c.keyCode&&(c.preventDefault(),b.show_book=!1):39==c.keyCode?(c.preventDefault(),a.move_right(c)):37==c.keyCode&&(c.preventDefault(),a.move_left(c)),c.stopPropagation();8==c.keyCode},a.search=function(){var c=event.currentTarget==event.srcElement&&!b.show_book;c&&($("body").css("white-space","normal"),a.website.searching=!0,b.keyCode=event.keyCode)},_handle_socket_error=function(){},_init_notifications=function(){b.notification_active=!1},_init=function(){_initiate_loading_page(),a.more_filters=[],a.show_notifications=!0,a.notifications_seen=!1,a.website={},a.website.searching=!1,a.website.show_search_page=!0,_bind_emit(),_bind_feedback_form(),_add_listeners(),_handle_socket_error(),_init_notifications(),b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1}};var h="",i="",j="",k="",l="",m="";_init()}]);