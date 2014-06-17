websiteApp.controller("bookTimelineController",["$scope","$rootScope","$timeout","widgetService","$route","$routeParams","$interval",function(a,b,c,d){(_init=function(){d.get_moments().then(function(b){a.moments=b.moments})})()}]);;websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller",function(a,b,c,d,e,f,g,h,i){a.toggle_bookmarked=function(b){a.bookmark_selected||(a.panel_selected="BOOKMARK",a.bookmark_selected=!0,a.read_selected=!1,a.glowBookmark=!1),b.stopPropagation()},a.toggle_recommendations=function(){(a.bookmark_selected||a.read_selected)&&(a.read_selected=!1,a.bookmark_selected=!1,a.panel_selected="",a.reset())},a.reset=function(){_init_recommendations(),_get_recommendations()},a.toggle_read=function(){a.read_selected||(a.glowShelf=!1,a.bookmark_selected=!1,a.read_selected=!0,a.panel_selected="READ")},a.toggle_more_filters=function(b){a.show_more_filters=1==a.show_more_filters?!1:!0,b.stopPropagation()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){b.hide_options=!0,b.focused_book=null,a.show_more_filters=!1},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){k=a.$on("loadRecommendations",function(){b.filters.reset=!1,b.filters.reset_count=void 0==b.filters.reset_count?0:b.filters.reset_count+1,_get_recommendations()}),l=a.$on("reloadRecommendations",function(){b.filters.reset=!0,b.filters.reset_count=0,a.reset()}),n=a.$on("showBookReadShelf",function(){a.read_selected=!0,event.stopPropagation()}),glow_shelf_event=a.$on("glowShelf",function(){a.glowShelf=!0,event.stopPropagation()}),glow_bookmark_event=a.$on("glowBookmark",function(){a.glowBookmark=!0,event.stopPropagation()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(j),c.cancel(m)})},_init_shelf=function(){a.read_selected=!1,a.bookmark_selected=!1},_init_notifications=function(){b.notification_active=!1},_initialize_filters=function(){a.show_more_filters=!1,b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type?b.filters.filter_type="BOOK":"authors"==f.type?b.filters.filter_type="AUTHOR":"readers"==f.type?b.filters.filter_type="READER":(b.filters.filter_type="BOOK",a.show_notifications=!0),f.filter_id&&(a.show_more_filters=!0)},_update_recommendations=function(d){if("BOOK"==b.filters.filter_type){var e="INFO- "+d.recommendations.books.length+" books found.",f=notify(b,e,c);if(a.$on("destroy",function(){c.cancel(f)}),b.loading){var g=30;if(0==d.recommendations.books.length){var e="ALERT- Reset the filters couldn't find more books.",f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})}else{if(a.recommendations.books.length>=g){a.recommendations.books=[a.recommendations.books[g-2],a.recommendations.books[g-1]];var f=c(function(){i.scrollTo(screen.width/2,0,3e3)},1e3);a.$on("destroy",function(){c.cancel(f)})}b.filters.other_filters.title?(a.bookmark_selected=!1,a.read_selected=!1,a.$emit("moveRight"),b.hide_options=!0,a.recommendations.books=d.recommendations.books,b.focused_book=a.recommendations.books[0]):a.recommendations.books=a.recommendations.books.concat(d.recommendations.books)}b.loading=!1}}else"AUTHOR"==b.filters.filter_type?a.recommendations.authors=a.recommendations.authors.length>=30?d.recommendations.authors:a.recommendations.authors.concat(d.recommendations.authors):"READER"==b.filters.filter_type?a.recommendations.readers=a.recommendations.readers.length>=30?d.recommendations.readers:a.recommendations.readers.concat(d.recommendations.readers):a.recommendations.books=a.recommendations.books.length>=30?d.recommendations.books:a.recommendations.books.concat(d.recommendations.books)},_push_recommendations=function(){var a=3e3;j=c(function(){d.push_recommendations().then(function(a){b.message_type="Notification",b.message="We think you like Hermann Hesse, and here is his best read.",_update_recommendations(a)})},a)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.loading=!0,d.get_recommendations().then(function(a){_update_recommendations(a)})},_get_filters=function(){d.get_filters().then(function(b){a.more_filters=a.more_filters.concat(b.filters)})},_handle_focused_book=function(){b.focused_book=a.recommendations.books.first},_get_friends=function(){h.get_friends(a.$routeParams.id).then(function(a){b.user.friends=a.friends})},_get_labels=function(){d.get_labels().then(function(a){b.labels=a.labels})},_init=function(){a.$routeParams=f;var d=1e4;a.drop_icon=!1,b.show_book=!1,m=c(function(){_recordUserBehaviour()},d),a.searching=!1,_get_filters(),_get_labels(),_init_recommendations(),_add_listeners(),_init_notifications(),_init_analytics(),_init_shelf(),_initialize_filters(),_get_recommendations(),_bind_destroy(),_get_friends()};var j="",k="",l="",m="",n="";_init()}]);;websiteApp.controller("searchController",["$scope","$rootScope","websiteService","$timeout","$sce","recommendationService","$routeParams",function(a,b,c,d,e,f,g){_show_search_result=function(c){b.filters.other_filters.title=c.name,b.filters.other_filters.author_name=c.author_name,a.$emit("reloadRecommendations")},_handle_graph_search=function(){a.hide_search_page()},_search_by=function(b){if(!b)var b=a.search_type;if(a.search_level1){if(a.search_level1){if(a.search_level2=!0,a.search_results=[],"YEAR"==b){a.year_search=!0;f.get_time_groups().then(function(b){a.search_results=[];for(var c=0;c<b.times.length;c++){var d=b.times[c][0].data,e=d.name+" ("+d.range+")",f={name:e};a.search_results=a.search_results.concat([f])}})}else if("LIST"==b){a.list_search=!0}else if("COUNTRY"==b){a.country_search=!0;f.get_countries().then(function(b){a.search_results=b.countries})}else if("GENRE"==b){a.genre_search=!0}else if("AUTHOR"==b){a.author_search=!0}else if("TIME"==b){a.time_search=!0;f.get_read_times().then(function(b){a.search_results=b.read_times})}else if("GENDER"==b){a.gender_search=!0;a.search_results=[{name:"Male",custom_option:!0,icon:"icon-male"},{name:"Female",custom_option:!0,icon:"icon-female"},{name:"I don't care",custom_option:!0}]}else if("AWARDS"==b){a.awards_search=!0}a.search_tag.placeholder="Select a category"}}else a.search_level1=!0,-1!=b.indexOf("BOOK")?(a.search_display="Searching Books...",a.search_type="[BOOK]",a.book_search=!0,a.author_search=!1,a.reader_search=!1,a.search_tag.placeholder="Search Books...",_init_book_search()):-1!=b.indexOf("AUTHOR")?(a.search_display="Searching Authors...",a.search_type="[AUTHOR]",a.author_search=!0,a.reader_search=!1,a.book_search=!1,a.search_tag.placeholder="Search Authors...",_init_author_search()):-1!=b.indexOf("READER")&&(a.search_display="Searching Readers...",a.search_type="[READER]",a.reader_search=!0,a.book_search=!1,a.author_search=!1,a.search_tag.placeholder="Search Readers...",_init_reader_search())},a.handle_selection=function(b){var c=b.name,d=b.graph_option,e=b.custom_option,f=b.type;e?(a.search_level1||(a.search_type=f),_search_by(f),a.search_tag.input=""):(a.search_tag.current=0,a.search_tag.selected_result=!0,d?_handle_graph_search(c):_show_search_result(b),a.search_tag.input=""),event.stopPropagation()},a.hide_search_page=function(c){var e=a.logged;e?($("body").css("white-space","nowrap"),a.website.searching=!1,a.website.show_search_page=!1,b.$broadcast("initPage",c),a.loading=!0,d(function(){a.loading=!1},2e3)):a.show_login_form=!0},a.is_current=function(b,c){return a.search_tag.current==b&&(a.search_tag.currentItem=c),a.search_tag.current==b},a.set_current=function(b){a.search_tag.current=b},a.navigate_options=function(){var b=13==event.keyCode;b&&a.handle_selection(a.search_tag.currentItem)},a.key_up=function(){var b=38==event.keyCode,c=40==event.keyCode;b&&0!=a.search_tag.current&&a.set_current(a.search_tag.current-1),c&&a.search_tag.current!=a.search_results.length-1&&a.set_current(a.search_tag.current+1)},a.key_down=function(b){var c=8==b.keyCode||46==b.keyCode;if(c){var d=_get_search_input(b);d.length<=1?d.length<1&&a.search_level1&&!a.search_level2?(a.clear_search_level1_var(b),b.preventDefault()):d.length<1&&a.search_level2?(a.clear_search_level2_var(b),b.preventDefault()):_init_search():a.get_search_results(b)}},a.clear_search_level1_var=function(b){a.clear_search_level2_var(b),a.search_level1=!1,a.book_search=!1,a.author_search=!1,a.reader_search=!1,_init_graph_search(),b.stopPropagation()},a.close_login_box=function(){a.show_login_form=!1},a.clear_search_level2_var=function(b){a.search_level1=!1,a.search_level2=!1,a.year_search=!1,a.list_search=!1,a.country_search=!1,a.genre_search=!1,a.author_search=!1,a.time_search=!1,a.gender_search=!1,a.awards_search=!1,_search_by(),b.stopPropagation()},a.highlight=function(a,b){var c="<span><i><b>$&</b></i></span>";return e.trustAsHtml(b.replace(new RegExp(a,"gi"),c))},_init_graph_search=function(){a.search_level1?(a.search_level1=!1,_search_by()):(a.search_tag.placeholder="Search...",a.search_results=[{name:"Search a Book",icon:"icon-book",custom_option:!0,type:"BOOK",graph_option:!0},{name:"Search an Author",icon:"icon-pen",custom_option:!0,type:"AUTHOR",graph_option:!0},{name:"Search a Reader",icon:"icon-users",custom_option:!0,type:"READER",graph_option:!0}])},_init_book_search=function(){a.search_results=[{name:"Find Books by Era",custom_option:!0,type:"YEAR",icon:"icon-calendar"},{name:"Find Books by Reading Time",custom_option:!0,type:"TIME",icon:"icon-clock"},{name:"Find Books by Author's Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Books by Genre",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Get popular lists of Books",custom_option:!0,type:"LIST",icon:"icon-list"},{name:"Get Books by Author",custom_option:!0,type:"AUTHOR",icon:"icon-pen"}]},_init_author_search=function(){a.search_results=[{name:"Find Authors by Era",custom_option:!0,type:"YEAR",icon:"icon-clock"},{name:"Find Authors by Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Authors by Awards",custom_option:!0,type:"AWARDS",icon:"icon-trophy"},{name:"Find Authors by Genre",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Get popular lists of Authors",custom_option:!0,type:"LIST",icon:"icon-list"}]},_init_reader_search=function(){a.search_results=[{name:"Find Readers by Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Readers by their Taste",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Find Readers by Gender",custom_option:!0,type:"GENDER",icon:"icon-male icon-female"},{name:"Get popular lists of Readers",custom_option:!0,type:"LIST",icon:"icon-list"}]},_init_search=function(){_init_graph_search(),a.search_level1||a.search_level2||(a.search_type="[ALL]",a.search_display="Searching reader's door...")},_handle_search_input=function(b){var e=_get_search_input(b);_init_graph_search(),a.search_ready=!0;{var f=e.slice(0,1),g="#"==f,i="@"==f,j="+"==f,k=i||g||j;e.length}_set_custom_search(i,g,j),k&&(1==e.length&&(a.search_ready=!1),e=e.substring(1,e.length)),a.search_ready&&""!=e?c.search(e,a.search_type,a.search_tag.result_count).then(function(b){a.search_results=[];for(var c=b.results.data,e=0;e<c.length;e++){var f={name:c[e][0],author_name:c[e][1]};a.search_results.push(f)}a.search_initiated=!1,d.cancel(h)}):(a.search_initiated=!1,_init_graph_search(),d.cancel(h))},_get_search_input=function(){return a.search_tag.input.trim()},_set_custom_search=function(b,c,d){b?(a.search_type="['AUTHOR', 'READER']",a.search_display="Searching authors and readers..."):c?(a.search_type="['BOOK']",a.search_display="Searching books..."):d&&(a.search_type="['TAG']",a.search_display="Searching book categories...")},a.get_search_results=function(b,c){if(c){if(a.search_initiated=!0,"BOOK"==c)var e=!0,f=!1,g=!1;else if("AUTHOR"==c)var i="@",e=!1,f=!0,g=!1;_set_custom_search(f,e,g)}else if(_init_graph_search(),a.search_initiated)d.cancel(h);else{if(!i)var i=String.fromCharCode(b.keyCode);var j=_get_search_input(b);if(j&&j.length>1)var e=0==j.indexOf("#"),f=0==j.indexOf("@"),g=0==j.indexOf("+");else var e="#"==i,f="@"==i,g="+"==i;a.search_initiated=!0,_set_custom_search(f,e,g)}h=d(function(){_handle_search_input(b)},500)},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},a.handle_options=function(){g.type&&(b.hide_options=b.hide_options?!1:!0,event.stopPropagation())},_handle_search_page=function(){a.search_initiated=!1,a.search_display="Searching reader's door...",a.search_type="[ALL]",a.show_login_form=!0,a.search_tag={},a.search_tag.search_placeholder="Search...",a.search_tag.current=0,a.search_tag.input="",a.search_tag.result_count=5,a.website.searching=!0,a.website.show_search_page=!0,c.get_background_image().then(function(b){a.search_style={"background-image":'url("'+b.url+'")'}}),_init_graph_search(),b.hide_options=g.type?!0:!1},_init=function(){_handle_search_page()};var h="";_init()}]);;websiteApp.controller("timelineController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval",function(){}]);;websiteApp.controller("websiteAppController",["$scope","$rootScope","$timeout","websiteService","Facebook","$document","scroller","$window",function(a,b,c,d,e,f,g,h){a.bindHorizontalScroll=function(b,c){a.show_notifications||(b.preventDefault(),c>0?a.move_left(b):a.move_right(b),b.stopPropagation())},a.move_left=function(c){b.focused_book=null;var d=2e3,e=document.body.scrollWidth;if(c)if("keydown"==c.type||"wheel"==c.type)var f=h.pageXOffset,i=f*screen.width/e;else var f=c.pageX-c.screenX;else{var f=h.pageXOffset;d=1e3}a.progression_state={width:i+"px"};var j=.31*screen.width;g.scrollTo(f-j,0,d)},a.move_right=function(c){b.focused_book=null;var d=2e3,e=document.body.scrollWidth;if(c){var f=c.pageX;if("keydown"==c.type||"wheel"==c.type)var i=h.pageXOffset,j=i+2.5*screen.width>e,k=i*screen.width/e;else var i=c.pageX-(c.screenX-c.offsetX),j=f+screen.width>e}else{var i=h.pageXOffset,j=i+2.5*screen.width>e;d=1e3}a.progression_state={width:k+"px"},j&&(b.loading||(b.loading=!0,b.$broadcast("loadRecommendations")));var l=.31*screen.width;g.scrollTo(i+l,0,d)},a.scroll_one_page_right=function(a){var c=document.body.scrollWidth;if(a)var d=a.pageX-screen.width/2,e=a.pageX+screen.width>c;else{var d=h.pageXOffset;-screen.width/2;var e=h.pageXOffset;+screen.width>c}e&&b.$broadcast("loadRecommendations");var f=screen.width;g.scrollTo(d+f,0,2e3)},a.scroll_one_page_left=function(a){if(a)var b=a.pageX-screen.width/2;else var b=h.pageXOffset-screen.width/2;var c=screen.width;g.scrollTo(b-c,0,2e3)},a.showFeebackForm=function(){},a.authenticate=function(){var c=b.user;a.loading_icon=!0,d.authenticate(c).then(function(c){"success"==c.message&&(b.user.profile_status=c.profile_status,b.user.logged=!0,b.user.id=c.user_id,d.get_user_details().then(function(a){b.user.books=a.books}),d.get_notifications(b.user).then(function(b){a.notifications=b.notifications}))})},a.intent_login=function(){e.getLoginStatus(function(c){"connected"==c.status?(b.logged=!0,a.me()):a.login()})},a.login=function(){e.login(function(c){"connected"==c.status&&(b.logged=!0,a.me())})},a.me=function(){e.api("/me",function(c){a.$apply(function(){b.user=c,b.user.profile_status=0,b.user.thumb="https://scontent-b-kul.xx.fbcdn.net/hphotos-ash3/t1.0-9/66784_415130785223231_1615890777_n.jpg",b.user.logged=!0})})},a.logout=function(){e.logout(function(){a.$apply(function(){b.user={},b.logged=!1})})},a.show_uploader=function(){a.uploader=!0},_bind_feedback_form=function(){h.onmouseleave=function(){}},_load_recommendations=function(){var a=document.body.scrollWidth,c=event.pageX+screen.width>a;c&&b.$broadcast("loadRecommendations")},_get_book_details=function(c){filter="id="+c,d.get_book_details(filter).then(function(c){a.detailed_book.book=c,b.show_book=!0})},_bind_emit=function(){show_book_event=a.$on("expandBook",function(a,c,d,e,f){b.book_x=d,b.screen_x=e,b.total_x=f,_get_book_details(c),a.stopPropagation()})},_bind_auth_listeners=function(){a.$on("event:google-plus-signin-success",function(){}),a.$on("event:google-plus-signin-failure",function(){}),a.$on("Facebook:statusChange",function(b,c){"connected"==c.status&&a.$apply(function(){})}),a.$watch(function(){return e.isReady()},function(b){b&&(a.facebookReady=!0)})},_add_listeners=function(){i=a.$on("addToShelf",function(a,c,d){"BOOK"==c?b.user.books.read.push(d):"AUTHOR"==c?b.user.authors.follow.push(d):"READER"==c&&b.user.readers.follow.push(d),a.stopPropagation()}),j=a.$on("removeFromShelf",function(a,c,d){if("BOOK"==c){var e=b.user.books.read.indexOf(d);b.user.books.read.splice(e,1)}else if("AUTHOR"==c){var e=b.user.authors.follow.indexOf(d);b.user.authors.follow.splice(e,1)}else if("READER"==c){var e=b.user.readers.follow.indexOf(d);b.user.readers.follow.splice(e,1)}a.stopPropagation()}),k=a.$on("addToBookmarks",function(a,c,d){"BOOK"==c?b.user.books.bookmarked.push(d):"AUTHOR"==c&&b.user.authors.bookmarked.push(d),a.stopPropagation()}),l=a.$on("removeFromBookmarks",function(a,c,d){if("BOOK"==c){var e=b.user.books.bookmarked.indexOf(d);b.user.books.bookmarked.splice(e,1)}else if("AUTHOR"==c){var e=b.user.authors.bookmarked.indexOf(d);b.user.authors.bookmarked.splice(e,1)}a.stopPropagation()}),n=a.$on("moveRight",function(){m=c(function(){a.move_right()},1e3)})},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},_initiate_loading_page=function(){a.loading=!0,a.drop_icon=!1,a.show_login_form=!0,c(function(){a.loading=!1},3e3),c(function(){a.drop_icon=!0},1e3)},a.toggle_notifications=function(){a.show_notifications?(a.show_notifications=!1,a.notifications_seen=!0):a.show_notifications=!0},a.handle_keyboard_bindings=function(c){a.show_book?39==c.keyCode?(c.preventDefault(),$(".detailed_book").turn("next")):37==c.keyCode?(c.preventDefault(),$(".detailed_book").turn("previous")):27==c.keyCode&&(c.preventDefault(),b.show_book=!1):39==c.keyCode?(c.preventDefault(),a.move_right(c)):37==c.keyCode&&(c.preventDefault(),a.move_left(c)),c.stopPropagation();8==c.keyCode},a.search=function(){var c=event.currentTarget==event.srcElement&&!b.show_book;c&&($("body").css("white-space","normal"),a.website.searching=!0,b.keyCode=event.keyCode)},_init=function(){_initiate_loading_page(),a.more_filters=[],a.show_notifications=!1,a.notifications_seen=!1,a.test={time:1970},a.detailed_book={},b.initPage=3,b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1},a.website={},a.website.searching=!0,a.website.show_search_page=!0,_bind_emit(),_bind_feedback_form(),_bind_auth_listeners(),_add_listeners(),a.authenticate()};var i="",j="",k="",l="",m="",n="";_init()}]);