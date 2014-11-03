websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller","websiteService","sharedService","$cookieStore","RecommendationUIConstants","$location","IntroConstants","WebsiteUIConstants",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){a.handle_height_of_popup=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;e&&(a.ticker_popup_style={height:m.TickerPopupMaxHeight}),d&&b.stopPropagation()},a.show_all_friends=function(){a._get_friends(30)},a._set_likes=function(a,b){angular.forEach(b[0],function(a,c){this.push({id:b[1][c],name:a,icon:b[2][c]})},a)},a._set_influential_books=function(a,b){angular.forEach(b[4],function(a,c){this.push({isbn:b[3][c],id:a,title:b[5][c],author_name:b[6][c]})},a)},a._get_user_profile_info=function(c){var d=function(b){angular.isUndefined(b.detailed_info)&&j.get_detailed_info(c).then(function(c){b.detailed_info=!0,b.likes=[],b.influential_books=[],a._set_likes(b.likes,c),a._set_influential_books(b.influential_books,c)})};c==b.user.id?(d(b.user),a.fetch_new_feed()):(d(b.reader),a.fetch_new_feed(b.reader.id))},a.toggle_profile=function(c,d){var e=function(){a.hide_popups(),b.user.show_profile=!1},f=function(){a.hide_popups(),b.user.show_profile=!0,a._get_user_profile_info(c)};angular.isUndefined(b.user.show_profile)||!b.user.show_profile?f():e(),angular.isDefined(d)&&(d.preventDefault(),d.stopPropagation())},a.get_news_feed=function(c){a.expand_left_panel(),b.user.collapsed_column=!1,b.user.collapsed_left_column=!1,a.fetch_new_feed(c)},a.show_friends_list=function(){a.expand_left_panel(),b.user.collapsed_friends=!1,b.user.collapsed_left_column=!1,a._get_friends(20)},a.fetch_new_feed=function(b){var c=!0,d=!1;a.$emit("getNotifications",d,b,c)},a.collapse_left_panel=function(){b.popups.left_panel_width={width:p.LeftPanelMinWidth}},a.expand_left_panel=function(){a.hide_popups(),b.user.interact=!1,b.popups.left_panel_width={width:"34%"}},a.toggle_settings_popup=function(c){var d=function(){a.hide_popups(),b.user.interact=!1,b.popups.settings_popup=!0};angular.isUndefined(b.popups.settings_popup)?d():b.popups.settings_popup?b.popups.settings_popup=!1:d(),c.stopPropagation()},a.logout=function(){k.logout()},a.show_interaction_box=function(c){a.hide_popups(),b.user.interact=!0;var d=!1,e=!0;a.$emit("getNotifications",d,c,e)},a.show_trending_options=function(c){a.hide_popups(),b.user.interact=!0;var d=!0;a.$emit("getNotifications",d,b.user.id),c.stopPropagation()},a.handle_friends_grid_size=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;e&&(a.column_heights={notifications_style:{"max-height":m.NotificationsMinHeight},friends_grid_style:{"max-height":m.FriendsGridMaxHeight,overflow:"auto"},show_filters:!1}),d&&b.stopPropagation()},a.reset=function(){a.panel_selected="",a.bookmark_selected=!1,a.read_selected=!1,_init_recommendations(),_get_recommendations()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){delete b.ticker_popup,b.user.interact||delete b.focused_book,b.user.collapsed_column=!0,b.user.collapsed_filters=!0,b.user.collapsed_friends=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!0,b.user.collapsed_left_column=!0,b.popups={},b.popups.left_panel_width={width:p.LeftPanelMinWidth}},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){r=a.$on("loadRecommendations",function(){var d=function(){b.filters.reset=!1,b.filters.reset_count=angular.isUndefined(b.filters.reset_count)?0:b.filters.reset_count+1,_get_recommendations()},e=function(){j.get_books_bookmarked(b.user.books.bookmarked.length).then(function(d){var e=500;angular.forEach(d,function(d){var f=[];angular.forEach(b.labels,function(a){if(d[2].indexOf(a.name)>=0)var b={name:a.name,checked:!0};else var b={name:a.name,checked:!1};f.push(b)},f);var g={isbn:d[0],id:d[1],bookmark_status:!0,labels:f};e+=500;var h=c(function(){b.user.books.bookmarked.push(g)},e);a._destroy_event(h)})})},f=function(){j.get_books_read(b.user.books.read.length).then(function(a){angular.forEach(a,function(a){var b={isbn:a[0],id:a[1],status:!0};this.push(b)},b.user.books.read)})};a.read_selected||a.bookmark_selected?a.bookmark_selected?e():a.read_selected&&f():d()}),s=a.$on("reloadRecommendations",function(c){b.filters.reset=!0,b.filters.reset_count=0,a.reset(),c.stopPropagation()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(q),c.cancel(t)})},a._show_bookmark_tab=function(){a.bookmark_selected=!0,a.panel_selected=m.BookmarkPanel},a._initialize_filters=function(){var c=function(){b.user.collapsed_filters=!0,b.user.collapsed_friends=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!0,b.user.collapsed_column=!0,b.user.show_profile=!1,b.user.collapsed_left_column=!0},d=function(){b.filters.filter_id=f.filter_id,b.main_header=f.name,b.user.main_header={color:"white","text-shadow":"none"},b.user.main_header_background={"background-color":"#918fb5"}},e=function(){b.filters.label_id=f.label_id,b.main_header=f.name,c(),b.user.main_header={color:"white","text-shadow":"none"},b.user.main_header_background={"background-color":"#E2B503"}},g=function(){b.filters.filter_id=f.grid_id,b.main_header=f.name,c(),b.user.main_header={color:"white","text-shadow":"none"},b.user.main_header_background={"background-color":"#918fb5"}},h=function(){var a=function(a){return"#user/"+b.user.id+"/trending/books/id/"+a.id+"/name/"+a.name},d=function(c){0==c?(b.prev_link=a(b.trending_feed[b.trending_feed.length-1]),b.next_link=a(b.trending_feed[c+1])):c==b.trending_feed.length-1?(b.prev_link=a(b.trending_feed[c-1]),b.next_link=a(b.trending_feed[0])):(b.prev_link=a(b.trending_feed[c-1]),b.next_link=a(b.trending_feed[c+1]))};b.filters.reset=!0,b.filters.reset_count=0,b.filters.trend_id=f.trend_id,b.main_header=f.name;var e=0;angular.isDefined(b.trending_feed)&&angular.forEach(b.trending_feed,function(a,c){a.id==f.trend_id&&(b.main_topic=a,e=c)}),d(e),c(),b.user.main_header={color:"white","text-shadow":"none"},b.user.main_header_background={"background-color":"#dd4b39"}},i=function(){delete b.user.main_header,delete b.user.main_header_background,delete b.main_header,delete b.main_topic,delete b.filters.filter_id,delete b.filters.trend_id,delete b.filters.label_id},j=function(){b.user.main_header={color:"white","text-shadow":"none"},b.user.main_header_background={"background-color":"#427fed"},a.$routeParams.type="books",b.filters.reset=!0,b.filters.reset_count=0,b.filters.filter_type=m.BookTab,b.main_header="Back to recommendations",b.filters.other_filters.id=a.$routeParams.book_id},k=function(){b.user.main_header={color:"white","text-shadow":"none"},b.user.main_header_background={"background-color":"#427fed"},a.$routeParams.type="books",b.filters.reset=!0,b.filters.filter_type=m.BookTab,b.filters.other_filters.title=a.$routeParams.title,b.main_header=a.$routeParams.title;var c=angular.isDefined(a.$routeParams.status);c&&(b.filters.other_filters.show_all=a.$routeParams.status,b.filters.reset=!0,b.filters.reset_count=0)};if(b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type){b.filters.filter_type=m.BookTab;var l=angular.isDefined(f.filter_id),n=angular.isDefined(f.label_id),o=angular.isDefined(f.grid_id),p=angular.isDefined(f.trend_id);l?d():n?e():p?h():o?g():i()}else"authors"==f.type?b.filters.filter_type=m.AuthorTab:"readers"==f.type?b.filters.filter_type=m.ReaderTab:f.book_id?j():f.title?k():(b.filters.filter_type=m.BookTab,a.show_notifications=!0)},_update_recommendations=function(d){if(b.filters.filter_type==m.BookTab){var e=function(){if(d.recommendations.books.length>1)var e="INFO- "+d.recommendations.books.length+" books found. Scroll to see more books.";else if(d.recommendations.books.length>=0)var e="INFO- "+d.recommendations.books.length+" book found.";var f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})},f=function(){var d=m.ZeroBooksFound,e=notify(b,d,c);a.$on("destroy",function(){c.cancel(e)})},g=function(b){a.recommendations.books=[a.recommendations.books[b-2],a.recommendations.books[b-1]];var d=c(function(){i.scrollTo(window_width/4,0,200)},200);a.$on("destroy",function(){c.cancel(d)})},h=function(){a.bookmark_selected=!1,a.read_selected=!1,b.hide_options=!0,a._set_books(d.recommendations.books)};if(e(),b.user.loading){var j=20;if(0==d.recommendations.books.length)f();else{a.hide_popups(),b.user.interact=!1;var k=a.recommendations.books.length>=j,l=angular.isDefined(b.filters.other_filters.id||b.filters.other_filters.title);k&&g(j),l?h():a._set_books(d.recommendations.books)}b.user.loading=!1}}else b.user.loading&&(a._set_books(a.recommendations.books.length>=j?d.recommendations.books:d.recommendations.books),b.user.loading=!1);angular.isDefined(b.user)?b.user.faded_wrapper={opacity:"0.5"}:b.user={faded_wrapper:{opacity:"0.5"}}},a._destroy_event=function(b){a.$on("destroy",function(){c.cancel(b)})},a._set_books=function(d){var e=function(a){return{isbn:a[0],id:a[1],external_thumb:a[2]}},f=function(){b.user.books.bookmarked=[];var f=200;angular.forEach(d,function(d){f+=200;var g=c(function(){b.user.books.bookmarked.push(e(d))},f);a._destroy_event(g)});var g=window_width/b.user.books.bookmarked.length;a.block_style={width:g+"px"}},g=function(a){return angular.isUndefined(a)||null==a||""==a},h=function(){var b=[],e=200;angular.forEach(d,function(d){var f={isbn:d[0],id:d[1],external_thumb:d[2]},h=g(d[0]);if(h){if(f=angular.extend(f,{no_thumb:!0}),3==b.length){e+=200;var i=c(function(){a.recommendations.books.push({book_array:b,is_book_array:!0})},e);a._destroy_event(i),b=[]}b.push(f)}else e+=200,c(function(){a.recommendations.books.push(f)},e),a._destroy_event(i)}),0!=b.length&&a.recommendations.books.push({book_array:b,is_book_array:!0});var f=window_width/(a.recommendations.books.length+6);a.block_style={width:f+"px"}};a.bookmark_selected?f():h()},_get_grids=function(){d.get_grid_books().then(function(b){for(var c=[],d="",e=0;e<b.length;e++){var f=d!=b[e][0];if(f){var g=""!=d;if(g){if(c.length>4){var h={grid_text:d,grid_books:c,is_grid:!0,id:grid_id},i=a.recommendations.books.length-2;a.recommendations.books.splice(i,0,h)}c=[]}d=b[e][0],grid_id=b[e][3]}var j={isbn:b[e][1],id:b[e][2],external_thumb:b[e][4]};c.push(j)}if(c.length>4){var h={grid_text:d,grid_books:c,is_grid:!0,id:grid_id},i=a.recommendations.books.length-2;a.recommendations.books.splice(i,0,h)}})},_push_recommendations=function(){var e=3e3;q=c(function(){d.push_recommendations().then(function(d){var e={grid_text:"Books becoming movies",grid_books:d,is_grid:!0};a.recommendations.books.splice(3,0,e);var f="INFO-Check out Books becoming movies...";notify(b,f,c)})},e)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.user.loading=!0,d.get_recommendations().then(function(a){_update_recommendations(a)});angular.isUndefined(b.filters.other_filters.title)&&angular.isUndefined(b.filters.other_filters.id),a.recommendations.books.length>=4},a._handle_focused_book=function(){var c=function(a){return{isbn:a[0],id:a[1],external_thumb:a[2]}};angular.isDefined(a.recommendations.books.is_book_array)&&a.recommendations.books.is_book_array?1==a.recommendations.books.book_array.length&&(b.focused_book=c(a.recommendations.books.first)):b.focused_book=c(a.recommendations.books.first)},a.get_notifications=function(c){if(b.user.show_profile){var d=!1;a.$emit("getNotifications",d,c)}},a._get_friends=function(a){var c=function(a,b){angular.forEach(b,function(a){thumb=null==a[2]?"/assets/profile_pic.jpeg":a[2];var b={id:a[0],name:a[1],thumb:thumb,init_book_read_count:a[3],total_count:a[4],book_read_count:a[5],bookmark_count:a[6],fav_categories:a[7].join(", ")};this.push(b)},a)};if(angular.isUndefined(b.reader))k.set_friends();else{var d=angular.isDefined(b.reader.friends)?b.reader.friends.length:0;(angular.isUndefined(b.reader.friends)||!b.reader.all_friends_shown)&&h.get_friends(b.reader.id,a,d).then(function(d){a>d.length&&(b.reader.all_friends_shown=!0),angular.isUndefined(b.reader.friends)&&(b.reader.friends=[]),c(b.reader.friends,d)})}},a._init_user=function(){(angular.isUndefined(b.user)||angular.isUndefined(b.user.id))&&k.is_logged_in(a)},a._init_reader=function(){k.get_user(a.$routeParams.id)},a._basic_init=function(){a.grid_view=!1,b.popups={settings_popup:!1,show_notifications_popup:!1};var d=1e4;a.drop_icon=!1,b.user=angular.extend(b.user,{collapsed_trends:!0,collapsed_friends:!0,collapsed_filters:!0,collapsed_lists:!0,collapsed_column:!0,collapsed_left_column:!0,locked:!1,interact:!1}),t=c(function(){_recordUserBehaviour()},d),a.searching=!1,_add_listeners(),_init_analytics(),_bind_destroy(),a.cover_image={"background-image":'url("'+l.get("coverImage")+'")'},a._init_user()},_init=function(){if(b.user.logged)if(a._basic_init(),a.$routeParams=f,delete b.reader,"profile"==a.$routeParams.type){b.user.show_profile=!1;var c=a.$routeParams.id;b.reader={},b.reader.id=c,a.toggle_profile(c),a._init_reader(),k.set_labels(c),a.placeholder="Write on timeline...",b.user.main_header={color:"white","text-shadow":"none"},b.user.main_header_background={"background-color":"#65b045"}}else _init_recommendations(),k.set_labels(),a._initialize_filters(),a.placeholder=p.Share;else b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1}},a.getting_started_tour_options={steps:[{element:"#shelves",intro:o.Shelves,position:"right"},{element:"#friendsList",intro:o.Friends,position:"right"},{element:"#newsFeed",intro:o.NewsFeed,position:"right"},{element:"#listopia",intro:o.Listopia,position:"right"},{element:"#trendingList",intro:o.Trending,position:"right"},{element:"#share",intro:o.Share,position:"bottom"},{element:"#recommendationFooter",intro:o.ShelvesTab,position:"bottom"}],showStepNumbers:!1,exitOnOverlayClick:!0,exitOnEsc:!0,nextLabel:"<strong>Next</strong>",prevLabel:"<span>Previous</span>",skipLabel:"Exit",doneLabel:"<strong>Thanks</strong>"},a.should_auto_start=function(){return!1};var q="",r="",s="",t="";_init()}]);