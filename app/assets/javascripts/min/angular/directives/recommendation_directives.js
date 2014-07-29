websiteApp.directive("moreFilters",["$rootScope","$timeout",function(a,b){return{restrict:"E",controller:["$scope","recommendationService","websiteService",function(c,d,e){_init=function(){c.show_menu=!1,c.countryOptions=[],c.show_lists=!1,c.handle_left_columns(),c.$on("filterChange",function(a,b,d){"country"==d?c.countrySelected=b:"timeGroup"==d?c.timeSelected=b:"readingTime"==d&&(c.readTimeSelected=b),c.advance_filter_changed(b,d)}),d.get_countries().then(function(a){c.countryOptions=_reset_json(),c.countryOptions=c.countryOptions.concat(a.countries)}),d.get_time_groups().then(function(a){c.timeOptions=_reset_json(),angular.forEach(a.times,function(a){var b=a[0].data,c=b.name+" ("+b.range+")",d={name:c};this.push(d)},c.timeOptions)}),d.get_read_times().then(function(a){c.readTimeOptions=_reset_json(),angular.forEach(a.read_times,function(a){var b=a[0].data,c=b.name,d={name:c,custom_option:!0,type:"readingTime"};this.push(d)},c.readTimeOptions)}),_init_dropdown_filters(),_collapse_dropdown_menu()},_reset_json=function(){return[{name:"<span class='icon-loop'></span><span>&nbsp;Reset</span>"}]},_collapse_dropdown_menu=function(){c.filter_expanded=!0;b(function(){c.filter_expanded=!1},3e3)},_country_init=function(){return{name:"<span class='icon-earth filter_icon green'></span><span>&nbsp;&nbsp;&nbsp;Books by Region</span>"}},_time_init=function(){return{name:"<span class='icon-calendar filter_icon magenta'></span><span>&nbsp;&nbsp;&nbsp;Books by Era</span>"}},_read_time_init=function(){return{name:"<span class='icon-clock filter_icon cyan'></span><span>&nbsp;&nbsp;&nbsp;Books by Reading Time</span>"}},_init_dropdown_filters=function(){c.countrySelected=_country_init(),c.timeSelected=_time_init(),c.readTimeSelected=_read_time_init()},c.handle_left_columns=function(){c.column_heights={show_filters:!0,notifications_style:{"max-height":"110px"},friends_grid_style:{height:"75px"}}},c.clear_filter=function(d,e){a.filters.other_filters[e]=null;var f="SUCCESS-"+e+" filter removed",g=notify(a,f,b);c.$on("destroy",function(){b.cancel(g)}),c.$emit("reloadRecommendations")},c.advance_filter_changed=function(d,e){if("<span class='icon-loop'></span><span>&nbsp;Reset</span>"==d.name){var f="SUCCESS-"+e+" filter has been reset.";delete a.filters.other_filters[e],"country"==e?c.countrySelected=_country_init():"timeGroup"==e?c.timeSelected=_time_init():"readingTime"==e&&(c.readTimeSelected=_read_time_init())}else{var f="SUCCESS-"+d.name+" added to filters.";a.filters.other_filters[e]=d.name}var g=notify(a,f,b);c.$on("destroy",function(){b.cancel(g)}),c.$emit("reloadRecommendations")},c.reset_filters=function(){_init_dropdown_filters(),c.$broadcast("resetFilter"),a.filters.more_filters=[],a.filters.other_filters={},c.$emit("reloadRecommendations");var d="SUCCESS-All filters removed.<br/> You can add filters to look for particular books.",e=notify(a,d,b);c.$on("destroy",function(){b.cancel(e)})},c.stop_click_propagation=function(a){a.stopPropagation()},_reload_page=function(){},c.show_genre_options=function(a,b){if(b)var e=b+String.fromCharCode(event.keyCode);else var e=String.fromCharCode(event.keyCode);var a="q="+e+"&filter="+a;d.get_genres(a).then(function(a){c.genres=[],angular.forEach(a.genres.data,function(a){var b={name:a[0],id:a[1]};this.push(b)},c.genres)})},c.on_genre_selection=function(d){c.genre=d,a.filters.other_filters.genre=d;var e="SUCCESS-'"+d+"' added to filters.",f=notify(a,e,b);c.$emit("reloadRecommendations"),c.$on("destroy",function(){b.cancel(f)})},c.show_author_options=function(a,b){if(b)var d=b+String.fromCharCode(event.keyCode);else var d=String.fromCharCode(event.keyCode);e.search(d,"AUTHOR",3).then(function(a){c.authors=[],angular.forEach(a.results.data,function(a){var b={name:a[0],id:a[1]};this.push(b)},c.authors)})},c.on_author_selection=function(d){c.author=d,a.filters.other_filters.author=d;var e="SUCCESS-'"+d+"' added to filters.",f=notify(a,e,b);c.$emit("reloadRecommendations"),c.$on("destroy",function(){b.cancel(f)})},c.toggle_menu=function(){c.show_menu?(c.show_menu=!1,c.filter_expanded=!1):(c.show_menu=!0,c.filter_expanded=!0)},_init()}],templateUrl:"/assets/angular/widgets/partials/more_filters.html"}}]),websiteApp.directive("notificationLink",function(){return{restrict:"E",templateUrl:"/assets/angular/widgets/partials/notification_link.html"}}),websiteApp.directive("tickerPopup",function(){return{restrict:"E",templateUrl:"/assets/angular/widgets/partials/ticker_popup.html"}}),websiteApp.directive("filter",["$rootScope","$timeout","$routeParams",function(a,b,c){return{restrict:"E",scope:{filter:"=data"},controller:["$scope",function(d){_initialise_filters=function(c){if(d.filter){var e=d.filter.id,f=d.filter.name;if(e==parseInt(d.$routeParams.filter_id)){if(d.active=!0,-1==a.filters[c].indexOf(e)){a.filters[c].push(e);var g="SUCCESS-'"+f+"' added to filters.",h=notify(a,g,b);d.$on("destroy",function(){b.cancel(h)})}}else d.active=!1}},_add_listeners=function(){d.$on("resetFilter",function(){d.active&&(d.active=!1)})},(_init=function(){d.$routeParams=c,_initialise_filters("more_filters"),_add_listeners()})()}],templateUrl:"/assets/angular/widgets/partials/filter.html"}}]),websiteApp.directive("mainHeader",["$timeout","$rootScope",function(a,b){return{restrict:"E",controller:["$scope",function(c){_add_listeners=function(){c.$on("gamifyCount",function(d,e,f){if(c.initiate_counting)c.count=c.count+e;else{c.initiate_counting=!0,c.count=e;var g=a(function(){c.is_additive=f,b.user.total_count=f?b.user.total_count+c.count:b.user.total_count-c.count,c.initiate_counting=!1;var d=a(function(){c.count=!1},3e3);c.$on("destroy",function(){a.cancel(d)})},200);c.$on("destroy",function(){a.cancel(g)})}})},(_init=function(){c.count=!1,_add_listeners()})()}],templateUrl:"/assets/angular/widgets/partials/main_header.html"}}]),websiteApp.directive("recommendationFooter",["scroller","$rootScope","websiteService","$timeout",function(a,b,c,d){return{restrict:"E",controller:["$scope",function(e){e.toggle_bookmarked=function(a){if(!e.bookmark_selected){e.panel_selected="BOOKMARK",e.bookmark_selected=!0,e.read_selected=!1;var d=0;c.get_books_bookmarked(d).then(function(a){angular.isArray(a)&&(b.user.books.bookmarked=[],angular.forEach(a,function(a){var c=[];angular.forEach(b.labels,function(b){if(a[2].indexOf(b.name)>=0)var d={name:b.name,checked:!0};else var d={name:b.name,checked:!1};c.push(d)},c);var d={isbn:a[0],id:a[1],bookmark_status:!0,labels:c};this.push(d)},b.user.books.bookmarked))})}a.stopPropagation()},e.toggle_recommendations=function(){(e.bookmark_selected||e.read_selected)&&(e.read_selected=!1,e.bookmark_selected=!1,e.panel_selected="",e.reset())},e.toggle_read=function(){if(!e.read_selected){e.glowShelf=!1,e.bookmark_selected=!1,e.read_selected=!0,e.panel_selected="READ";var a=0;c.get_books_read(a).then(function(a){b.user.books.read=[],angular.forEach(a,function(a){var b={isbn:a[0],id:a[1],status:!0};this.push(b)},b.user.books.read)})}},e.reset_filter=function(a,b,c,d){var f="timeGroup"==c||"readingTime"==c||"country"==c;if(b){if(f){var g={name:"<span class='icon-loop'></span><span>&nbsp;Reset</span>"};e.advance_filter_changed(g,c)}else e.clear_filter(d,c),e.genre="";a.stopPropagation()}else f||(e.handle_left_columns(),_handle_filter_selection(c))},_handle_filter_selection=function(a){if("genre"==a){e.show_lists=!1,e.genre_selected=!0;var b=d(function(){e.genre_selected=!1},1e3);e.$on("destroy",function(){d.cancel(b)})}if("author"==a){e.show_lists=!1,e.author_selected=!0;var b=d(function(){e.author_selected=!1},500);e.$on("destroy",function(){d.cancel(b)})}},e.handle_notification_ticker_size=function(a,c){var d=angular.isDefined(a);if(d)var f=a.deltaY>0;else var f=c;e.column_heights=f?{notifications_style:{"max-height":"225px"},friends_grid_style:{height:"75px"},show_filters:!1}:{notifications_style:{"max-height":"110px"},friends_grid_style:{height:"75px"},show_filters:!1},b.ticker_popup=null,d&&a.stopPropagation()},e.goto_info_card=function(){a.scrollTo(0,0,2e3)},e.toggle_footer=function(){e.compact_footer=!0},_init_shelf=function(){e.read_selected=!1,(angular.isUndefined(e.bookmark_selected)||!e.bookmark_selected)&&(e.bookmark_selected=!1)},_add_listeners=function(){open_shelf_event=e.$on("showBookReadShelf",function(){e.read_selected=!0,event.stopPropagation()})},_init_left_column=function(){e.show_lists=!1,e.column_heights={notifications_style:{"max-height":"110px"},friends_grid_style:{height:"75px"},show_filters:!0}},(_init=function(){_init_left_column(),_init_shelf(),e.compact_footer=window.innerWidth<1e3?!0:!1,e.genre_selected=!1,e.author_selected=!1,e.column_heights={show_filters:!1}})()}],templateUrl:"/assets/angular/widgets/partials/recommendation_footer.html"}}]),websiteApp.directive("bookGrid",["recommendationService","$rootScope",function(a,b){return{restrict:"E",scope:{grid:"=data"},controller:["$scope",function(a){(_init=function(){a.user_id=b.user.id})()}],templateUrl:"/assets/angular/widgets/partials/book_grid.html"}}]),websiteApp.directive("infoCard",["$rootScope","$timeout","sharedService",function(a,b,c){return{restrict:"E",controller:["$scope","websiteService",function(b,d){b.mark_as_read=function(a,d){c.mark_as_read(b,a,d)},b.search_books=function(a){var c=38==a.keyCode,e=40==a.keyCode,f=8==a.keyCode,g=13==a.keyCode,h=!(c||e||f||g);if(h){if(b.search_book)var i=b.popular_books.length,j=b.search_book+String.fromCharCode(a.keyCode);else{var i=0;b.popular_books=[];var j=String.fromCharCode(a.keyCode)}b.loading||(b.loading=!0,d.search_books(j,i).then(function(a){a=a.results,0!=a.length&&angular.forEach(a,function(a){var b={isbn:a[0],id:a[1],title:a[2],author_name:a[3],status:!1};this.push(b)},b.popular_books),b.loading=!1}))}},_get_genres=function(){(angular.isUndefined(b.genres)||0==b.genres.length)&&(b.genres=[],d.get_genres().then(function(a){angular.forEach(a,function(a){var b={name:a[0],id:a[1],icon:a[2]};this.push(b)},b.genres)}))},_profile_status_colors=function(){var b=a.user.profile_status;0==b?a.user.profile_status_color="#4374e0":1==b?a.user.profile_status_color="#65b045":2==b?a.user.profile_status_color="#d73d32":3==b?a.user.profile_status_color="#11a9cc":4==b?a.user.profile_status_color="#981b48":5==b?a.user.profile_status_color="#7e3794":6==b?a.user.profile_status_color="#4374e0":7==b?a.user.profile_status_color="#981b48":8==b&&(a.user.profile_status_color="#981b48")},_handle_info_card_bindings=function(b){3==a.user.profile_status?b.get_popular_books():2==a.user.profile_status?_get_genres():4==a.user.profile_status?b.get_popular_authors():6==a.user.profile_status&&(navigator.geolocation?navigator.geolocation.getCurrentPosition(function(c){var d=c.coords.latitude,e=c.coords.longitude;a.user.latitude=d,a.user.longitude=e,b.set_location()}):x.innerHTML="Geolocation is not supported by this browser.")},_get_info_data=function(){d.get_info_data().then(function(a){b.book_counts=a.reading_count_list,b.user_book_count=b.book_counts[0]})},b.edit_books_read=function(){b.goto_info_card(),a.user.profile_status=3,b.get_popular_books(),b.compressed_info=!1},b.get_popular_authors=function(){var a=b.popular_authors.length;b.loading||(b.loading=!0,d.get_popular_authors(a).then(function(a){angular.forEach(a,function(a){var b={name:a[0]};this.push(b)},b.popular_authors),b.loading=!1}))},b.get_popular_books=function(){var a=b.popular_books.length;b.loading||(b.loading=!0,d.get_popular_books(a).then(function(a){angular.forEach(a,function(a){var b=null!=a[4],c={isbn:a[0],id:a[1],title:a[2],author_name:a[3],status:b};this.push(c)},b.popular_books),b.loading=!1}))},b.prev_profile_state=function(){a.user.profile_status=0!=a.user.profile_status?a.user.profile_status-1:8,_handle_info_card_bindings(b),_profile_status_colors()},b.next_profile_state=function(){a.user.profile_status=8!=a.user.profile_status?a.user.profile_status+1:0,_handle_info_card_bindings(b),_profile_status_colors()},b.stop_horizontal_scroll=function(a){a.stopPropagation()},b.update_profile=function(){var b=13==event.keyCode;if(b){var c=a.user.profile_status;0==c&&(d.update_profile(a.user),a.user.profile_status=a.user.profile_status+1,_profile_status_colors())}},b.user_profile_changed=function(a){var b={profile:a.name};d.save_user_info(b)},b.add_book=function(){},b.add_author=function(){},b.get_search_results=function(a,c,e){e?e+=String.fromCharCode(a.keyCode):e=String.fromCharCode(a.keyCode),d.search(e,c,3).then(function(a){b.search_results=b.search_results.concat(a.results)})},b.set_user_name=function(){if(a.user.name.length>0){var b={name:a.user.name};d.save_user_info(b)}},b.set_gender=function(){if(a.user.gender){var b={gender:a.user.gender};d.save_user_info(b)}},b.set_init_book_read_count=function(){if(a.user.init_book_read_count){var b={init_book_read_count:a.user.init_book_read_count};d.save_user_info(b)}},b.set_init_book_written_count=function(){if(a.user.init_book_written_count){var b={init_book_written_count:a.user.init_book_written_count};d.save_user_info(b)}},b.set_location=function(){if(a.user.latitude){var b={latitude:a.user.latitude,longitude:a.user.longitude};d.save_user_info(b)}},b.set_date_of_birth=function(){var b={selectedYear:a.user.selectedYear,selectedMonth:a.user.selectedMonth,selectedDay:a.user.selectedDay};d.save_user_info(b)},(_init=function(){a.user.profile_status=0,_profile_status_colors(),_get_info_data(),b.popular_books=[],b.popular_authors=[],b.loading=!1,b.profileOptions=[{name:"Reader"},{name:"Author"},{name:"Publisher"},{name:"Editor"}],b.compressed_info=!1,b.profileSelected={name:"Reader"},b.info_card_width=350,b.info_card_ratio=1.34})()}],templateUrl:"/assets/angular/widgets/base/widget/info_card.html"}}]);