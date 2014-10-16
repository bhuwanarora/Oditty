websiteApp.directive("moreFilters",["$rootScope","$timeout",function(){return{restrict:"E",controller:["$scope","recommendationService","websiteService","RecommendationUIConstants",function(a,b,c,d){a.handle_left_columns=function(){a.column_heights={show_filters:!0,notifications_style:{"max-height":d.NotificationsMinHeight},friends_grid_style:{height:d.FriendsGridMinHeight}}},a.stop_click_propagation=function(a){a.stopPropagation()},a.toggle_menu=function(){a.show_menu?(a.show_menu=!1,a.filter_expanded=!1):(a.show_menu=!0,a.filter_expanded=!0)}}],templateUrl:"/assets/angular/views/unused/more_filters.html"}}]),websiteApp.directive("notificationLink",function(){return{restrict:"E",templateUrl:"/assets/angular/views/unused/notification_link.html"}}),websiteApp.directive("tickerPopup",function(){return{restrict:"E",templateUrl:"/assets/angular/views/left_panel/shared/ticker_popup.html"}}),websiteApp.directive("filter",["$rootScope","$timeout","$routeParams",function(a,b,c){return{restrict:"E",scope:{filter:"=data",url:"@",hideIcon:"@",textClass:"@",iconClass:"@"},controller:["$scope",function(d){_initialise_filters=function(c){if(d.filter){var e=d.filter.id,f=d.filter.name,g=e==parseInt(d.$routeParams.label_id),h=e==parseInt(d.$routeParams.trend_id),i=e==parseInt(d.$routeParams.grid_id);if(g||h||i){if(d.active=!0,-1==a.filters[c].indexOf(e)){a.filters[c].push(e);var j="SUCCESS-'"+f+"' added to filters.",k=notify(a,j,b);d.$on("destroy",function(){b.cancel(k)})}}else d.active=!1}},_add_listeners=function(){d.$on("resetFilter",function(){d.active&&(d.active=!1)})},(_init=function(){d.$routeParams=c,_initialise_filters("more_filters"),_add_listeners()})()}],templateUrl:"/assets/angular/views/left_panel/partials/filter.html"}}]),websiteApp.directive("header",["$timeout","$rootScope",function(a,b){return{restrict:"E",controller:["$scope",function(c){c.toggle_notification_popup=function(){var a=function(){delete b.focused_book,delete b.ticker_popup,b.popups={},b.user.collapsed_friends=!0,b.user.collapsed_left_column=!0,b.user.collapsed_column=!0,b.user.collapsed_lists=!0,b.user.collapsed_filters=!0,b.user.collapsed_trends=!0,b.user.interact=!1},d=function(){a(),b.popups.show_notifications_popup=!0};angular.isDefined(b.popups)&&angular.isDefined(b.popups.show_notifications_popup)&&b.popups.show_notifications_popup?b.popups.show_notifications_popup=!1:d(),c.hide_notification_circle=!0,event.stopPropagation()},_add_listeners=function(){c.$on("gamifyCount",function(d,e,f){if(c.initiate_counting)c.count=c.count+e;else{c.initiate_counting=!0,c.count=e;var g=a(function(){c.is_additive=f,b.user.total_count=f?b.user.total_count+c.count:b.user.total_count-c.count,c.initiate_counting=!1;var d=a(function(){c.count=!1},3e3);c.$on("destroy",function(){a.cancel(d)})},200);c.$on("destroy",function(){a.cancel(g)})}})},(_init=function(){c.count=!1,_add_listeners()})()}],templateUrl:"/assets/angular/views/header/show.html"}}]),websiteApp.directive("navbar",["scroller","$rootScope","websiteService","$timeout","$cookieStore","RecommendationUIConstants","WebsiteUIConstants",function(a,b,c,d,e,f,g){return{restrict:"E",controller:["$scope",function(a){a.toggle_bookmarked=function(d){var f=function(){b.user.show_profile=!1,delete b.focused_book,delete b.ticker_popup};if(f(),!a.bookmark_selected){a.panel_selected="BOOKMARK",e.put("tab",a.panel_selected),a.bookmark_selected=!0,a.read_selected=!1;var g=0;c.get_books_bookmarked(g).then(function(a){angular.isArray(a)&&(b.user.books={},b.user.books.bookmarked=[],angular.forEach(a,function(a){var c=[];angular.forEach(b.labels,function(b){if(a[2].indexOf(b.name)>=0)var d={name:b.name,checked:!0};else var d={name:b.name,checked:!1};c.push(d)},c);var d={isbn:a[0],id:a[1],bookmark_status:!0,labels:c};this.push(d)},b.user.books.bookmarked))})}d.stopPropagation()},a.toggle_recommendations=function(){var c=function(){delete b.focused_book,delete b.ticker_popup,b.user.show_profile=!1};c(),(a.bookmark_selected||a.read_selected)&&(a.read_selected=!1,a.bookmark_selected=!1,a.panel_selected="",e.put("tab",a.panel_selected),a.reset())},a.toggle_read=function(){if(_close_all_popups=function(){b.user.show_profile=!1,delete b.focused_book,delete b.ticker_popup},_close_all_popups(),!a.read_selected){a.glowShelf=!1,a.bookmark_selected=!1,a.read_selected=!0,a.panel_selected="READ",e.put("tab",a.panel_selected);var d=0;c.get_books_read(d).then(function(a){b.user.books={},b.user.books.read=[],angular.forEach(a,function(a){var b={isbn:a[0],id:a[1],status:!0};this.push(b)},b.user.books.read)})}},a.reset_filter=function(b,c,d,e){var f="timeGroup"==d||"readingTime"==d||"country"==d;if(c){if(f){var g={name:"<span class='icon-loop'></span><span>&nbsp;Reset</span>"};a.advance_filter_changed(g,d)}else a.clear_filter(e,d),a.genre="";b.stopPropagation()}else f||(a.handle_left_columns(),_handle_filter_selection(d))},_handle_filter_selection=function(b){if("genre"==b){a.show_lists=!1,a.genre_selected=!0;var c=d(function(){a.genre_selected=!1},1e3);a.$on("destroy",function(){d.cancel(c)})}if("author"==b){a.show_lists=!1,a.author_selected=!0;var c=d(function(){a.author_selected=!1},500);a.$on("destroy",function(){d.cancel(c)})}},a.handle_notification_ticker_size=function(c,d){var e=angular.isDefined(c);if(e)var g=c.deltaY>0;else var g=d;g&&(a.column_heights={notifications_style:{"max-height":f.NotificationsMaxHeight},friends_grid_style:{height:f.FriendsGridMinHeight},show_filters:!1}),delete b.ticker_popup,e&&c.stopPropagation()},a.goto_info_card=function(a){angular.isDefined(a)&&(b.user.profile_status=a),b.user.compressed_info=!1,b.user.collapsed_column=!0,b.user.collapsed_filters=!0,b.user.collapsed_friends=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!0,b.user.collapsed_left_column=!0,b.popups.left_panel_width={width:g.LeftPanelMinWidth}},a.toggle_footer=function(){a.compact_footer=!0},_init_shelf=function(){a.read_selected=!1,(angular.isUndefined(a.bookmark_selected)||!a.bookmark_selected)&&(a.bookmark_selected=!1)},_add_listeners=function(){open_shelf_event=a.$on("showBookReadShelf",function(){a.read_selected=!0,event.stopPropagation()})},_init_left_column=function(){a.show_lists=!1,a.column_heights={notifications_style:{"max-height":f.NotificationsMinHeight},friends_grid_style:{height:f.FriendsGridMinHeight},show_filters:!0}},(_init=function(){_init_left_column(),_init_shelf(),a.compact_footer=window.innerWidth<1e3?!0:!1,a.genre_selected=!1,a.author_selected=!1,a.column_heights={show_filters:!1}})()}],templateUrl:"/assets/angular/views/cover/navbar.html"}}]),websiteApp.directive("rate",["$rootScope","$timeout","widgetService","sharedService",function(a,b,c,d){return{restrict:"E",scope:{rate_object:"=data"},controller:["$scope",function(e){e.show_if_rated=function(a){e.temp_rating=e.rate_object.user_rating,e.rate_object.user_rating=parseInt(a)+1,e.ready_to_rate=!0},e.reset_rating=function(){e.ready_to_rate=!1,e.rate_object.user_rating=e.temp_rating},_add_notification=function(){var b=a.user.email;angular.isDefined(a.user.name)&&(b=a.user.name);var c="<span>gave "+e.rate_object.user_rating+"/10 stars to&nbsp;</span><span class='site_color'>"+e.rate_object.title+"</span>",d={thumb:a.user.thumb,message:c,timestamp:(new Date).getTime(),book:{id:e.rate_object.id,title:e.rate_object.title,author_name:e.rate_object.author_name,isbn:e.rate_object.isbn},user:{id:a.user.id,name:b}};e.$emit("addToNotifications",d)},_gamify=function(){e.rate_object.rated||e.$emit("gamifyCount",10,!0)},e.mark_as_rated=function(f,g){_gamify(),e.rate_object.rated=!0,e.rate_object.user_rating=parseInt(f)+1,e.temp_rating=parseInt(f)+1;var h=notify(a,"SUCCESS-Thanks, This will help us to recommend you better books.",b);e.$on("destroy",function(){b.cancel(h)});var i={id:e.rate_object.id,data:e.rate_object.user_rating};(angular.isUndefined(e.rate_object.status)||!e.rate_object.status)&&d.mark_as_read(e,e.rate_object,g),c.rate_this_book(i),_add_notification(),g.stopPropagation()},e.is_active=function(a){var b=!1;if(e.rate_object){var c=parseInt(a)+1;c<=e.rate_object.user_rating&&(b=!0)}return b}}],templateUrl:"/assets/angular/views/shared/rate.html"}}]),websiteApp.directive("bookGrid",["recommendationService","$rootScope",function(a,b){return{restrict:"E",scope:{grid:"=data"},controller:["$scope",function(a){(_init=function(){a.user_id=b.user.id})()}],templateUrl:"/assets/angular/views/home/partials/book_grid.html"}}]),websiteApp.directive("gettingStarted",["$rootScope","$timeout","sharedService","websiteService","WebsiteUIConstants","scroller","RecommendationUIConstants","Facebook","SearchUIConstants",function(a,b,c,d,e,f,g,h,i){return{restrict:"E",controller:["$scope","websiteService",function(d,f){d.fb_books=function(){if(a.user.fb_data_fetched)a.user.interact=!1;else{d.fb_status=g.FetchingData;var b=function(a){var b=[];return a=a.results.data,angular.forEach(a,function(a){var b={name:a[0],author_name:a[1],id:a[2],type:i.BookSearch,label:i.BookSearch};this.push(b)},b),b},c=function(a){f.search(a.name,g.BookTab,10).then(function(c){var e={title:a.name,created_time:a.created_time};d.fb_status=g.BooksFound;var f=b(c);e=angular.extend(e,{books:f}),d.app_books.push(e)})};h.api("/me/books",function(a){a&&!a.error?(d.fb_status=g.DatabaseConnect,d.app_books=[],angular.forEach(a.data,function(a){c(a)})):d.fb_status=g.FetchingError})}},d.mark_as_read=function(a,b){angular.isDefined(a.id)&&(c.bookmark_book(d,a,b,g.InfluentialBooks),c.mark_as_read(d,a,b))},d.close_edit_profile=function(b){a.user.compressed_info=!0,d.popular_books=[],b.stopPropagation()},d.stop_propagation=function(a){a.stopPropagation()},d.save_genre=function(a){var b={genre:a.id,status:!0};f.save_user_info(b)},d.remove_genre=function(a){var b={genre:a.id,status:!1};f.save_user_info(b)},d.search_info_card=function(a,c){var f=a.keyCode==e.KeyUp,g=a.keyCode==e.KeyDown,h=a.keyCode==e.KeyLeft,i=a.keyCode==e.KeyRight,k=a.keyCode==e.Enter,l=a.keyCode==e.Backspace,m=!(f||g||k||h||i);if(m){if("BOOK"==c)var n=d.info.search_book.length>3;else var n=d.info.search_author.length>3;n?(d.popular_books=[{title:"Searching..."}],b.cancel(j),j=b(function(){d.handle_search_input(c)},300)):l?"BOOK"==c?(d.popular_books=[],d.get_popular_books()):(d.popular_authors=[],d.get_popular_authors()):d.popular_books=[{title:"Type more characters..."}]}a.stopPropagation()},d._fetch_book_results=function(a){var b=d.popular_books.length,c=function(){d.all_results_found=!0,d.popular_books.push({title:"All results fetched. "+d.popular_books.length+" books found for <span class='site_color'>"+d.info.search_book+"</span>"})};f.search_books(d.info.search_book,b).then(function(b){if(angular.isDefined(a)&&(d.popular_books=[]),b=b.results,0!=b.length)angular.forEach(b,function(a){var b=null!=a[4],c={isbn:a[0],id:a[1],title:a[2],author_name:a[3],status:b,user_rating:a[5]};this.push(c)},d.popular_books),10!=b.length&&c();else{var e=angular.isUndefined(all_results_found)||!all_results_found;0==d.popular_books.length?e&&(d.all_results_found=!0,d.popular_books=[{title:"No results found..."}]):e&&c()}d.loading=!1})},d.handle_search_input=function(a){d.loading=!0,"BOOK"==a?(d.all_results_found=!1,d.popular_books=[],d._fetch_book_results(!0)):f.search_authors("q="+d.info.search_author).then(function(a){d.popular_authors=[],0!=a.length?angular.forEach(a,function(a){var b={name:a[0]};this.push(b)},d.popular_authors):d.popular_authors=[{title:"No results found..."}],d.loading=!1})},d._get_genres=function(){(angular.isUndefined(d.info.genres)||0==d.info.genres.length)&&(d.info.genres=[],f.get_genres().then(function(a){angular.forEach(a,function(a){var b=null!=a[3],c={name:a[0],id:a[1],icon:a[2],status:b};this.push(c)},d.info.genres)}))},_handle_info_card_bindings=function(b){1==a.user.profile_status?b._get_genres():2==a.user.profile_status?b.get_popular_books():3==a.user.profile_status?navigator.geolocation?navigator.geolocation.getCurrentPosition(function(c){var d=c.coords.latitude,e=c.coords.longitude;a.user.latitude=d,a.user.longitude=e,b.set_location()}):x.innerHTML="Geolocation is not supported by this browser.":4==a.user.profile_status&&b.fb_books()},_get_info_data=function(){f.get_info_data().then(function(a){d.book_counts=a.reading_count_list,d.user_book_count=d.book_counts[0]})},d.edit_books_read=function(){d.goto_info_card(),a.user.profile_status=2,d.get_popular_books()},d.edit_genres_like=function(){d.goto_info_card(),a.user.profile_status=1,d._get_genres()},d.edit_authors_read=function(){d.goto_info_card(),a.user.profile_status=3,d.get_popular_authors()},d.get_popular_authors=function(){var a=d.popular_authors.length,b=!d.loading;b&&(d.loading=!0,f.get_popular_authors(a).then(function(a){angular.forEach(a,function(a){var b={name:a[0]};this.push(b)},d.popular_authors),d.loading=!1}))},d.get_popular_books=function(){var a=d.popular_books.length,b=!d.loading&&(angular.isUndefined(d.info.search_book)||d.info.search_book.length<1);b?(d.loading=!0,f.get_popular_books(a).then(function(a){angular.forEach(a,function(a){var b=null!=a[4],c={isbn:a[0],id:a[1],title:a[2],author_name:a[3],user_rating:a[5],status:b};this.push(c)},d.popular_books),d.loading=!1})):(angular.isUndefined(all_results_found)||!all_results_found)&&d._fetch_book_results()},d.prev_profile_state=function(){0!=a.user.profile_status?a.user.profile_status=a.user.profile_status-1:a.user.compressed_info=!0,_handle_info_card_bindings(d)},d.next_profile_state=function(){4!=a.user.profile_status?a.user.profile_status=a.user.profile_status+1:a.user.compressed_info=!0,_handle_info_card_bindings(d)},d.stop_horizontal_scroll=function(a){a.stopPropagation()},d.user_profile_changed=function(a){var b={profile:a.name};f.save_user_info(b)},d.add_book=function(){},d.add_author=function(){},d.set_user_name=function(){if(angular.isDefined(a.user.name)&&a.user.name.length>0){var b={name:a.user.name};f.save_user_info(b)}},d.set_email=function(){if(angular.isDefined(a.user.email)&&a.user.email.length>0){var b={email:a.user.email};f.save_user_info(b)}},d.set_gender=function(){if(a.user.gender){var b={gender:a.user.gender};f.save_user_info(b)}},d.set_init_book_read_count=function(){if(a.user.init_book_read_count){var b={init_book_read_count:a.user.init_book_read_count};f.save_user_info(b)}},d.set_init_book_written_count=function(){if(a.user.init_book_written_count){var b={init_book_written_count:a.user.init_book_written_count};f.save_user_info(b)}},d.set_location=function(){if(a.user.latitude){var b={latitude:a.user.latitude,longitude:a.user.longitude};f.save_user_info(b)}},d.set_date_of_birth=function(){var b={selectedYear:a.user.selectedYear,selectedMonth:a.user.selectedMonth,selectedDay:a.user.selectedDay};f.save_user_info(b)};var j="";(_init=function(){if(a.user.profile_status=0,_get_info_data(),d.popular_books=[],d.popular_authors=[],d.loading=!1,d.info={search_book:"",search_author:"",genres:[]},d.profileOptions=[{name:"Reader"},{name:"Author"},{name:"Publisher"},{name:"Editor"}],angular.isUndefined(a.user.ask_info)&&a.user.ask_info){a.user.compressed_info=!1;var b={ask_info:!1};f.save_user_info(b)}else a.user.compressed_info=!0;d.profileSelected={name:"Reader"},d.info_card_width=350,d.info_card_ratio=1.34})()}],templateUrl:"/assets/angular/views/getting_started/show.html"}}]);var facebook_invite=function(){FB.ui({method:"apprequests",message:"Your Message diaolog"})};