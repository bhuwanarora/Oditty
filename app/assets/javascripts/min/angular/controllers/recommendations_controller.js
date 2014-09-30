websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller","websiteService","sharedService","$cookieStore","RecommendationUIConstants","$location","IntroConstants","WebsiteUIConstants",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){a.handle_height_of_popup=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;e&&(a.ticker_popup_style={height:m.TickerPopupMaxHeight}),d&&b.stopPropagation()},a.show_all_friends=function(){a._get_friends(30)},a._set_likes=function(a,b){angular.forEach(b[0],function(a,c){this.push({id:b[1][c],name:a,icon:b[2][c]})},a)},a._set_influential_books=function(a,b){angular.forEach(b[4],function(a,c){this.push({isbn:b[3][c],id:a,title:b[5][c],author_name:b[6][c]})},a)},a._get_user_profile_info=function(c){var d=function(b){angular.isUndefined(b.detailed_info)&&j.get_detailed_info(c).then(function(c){b.detailed_info=!0,b.likes=[],b.influential_books=[],a._set_likes(b.likes,c),a._set_influential_books(b.influential_books,c)})};c==b.user.id?(d(b.user),a.fetch_new_feed(),a._fetch_trending_options()):(d(b.reader),a.fetch_new_feed(b.reader.id))},a.toggle_profile=function(c,d,e){if(_hide_profile=function(){b.user.show_profile=!1,delete b.ticker_popup},_show_profile=function(){b.user.show_profile=!0,a._get_user_profile_info(c),a._get_friends(2),delete b.focused_book,delete b.ticker_popup},angular.isDefined(e))e>0?_show_profile():_hide_profile();else{var f=angular.isUndefined(b.user.show_profile)&&c!=b.user.id;f||b.user.show_profile&&!angular.isUndefined(b.user.show_profile)?_hide_profile():_show_profile()}angular.isDefined(d)&&(d.preventDefault(),d.stopPropagation())},a.get_news_feed=function(c){b.user.collapsed_column=!1,b.user.collapsed_left_column=!1,b.user.collapsed_filters=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!0,b.user.collapsed_friends=!0,a.expand_left_panel(),a.fetch_new_feed(c)},a.show_friends_list=function(){b.user.collapsed_friends=!1,b.user.collapsed_left_column=!1,b.user.collapsed_column=!0,b.user.collapsed_lists=!0,b.user.collapsed_filters=!0,b.user.collapsed_trends=!0,a.expand_left_panel(),a._get_friends(20)},a.fetch_new_feed=function(b){var c=!0,d=!1;a.$emit("getNotifications",d,b,c)},a.collapse_left_panel=function(){b.popups.left_panel_width={width:"15%"}},a.expand_left_panel=function(){b.popups.left_panel_width={width:"34%"}},a.toggle_settings_popup=function(a){var c=function(){b.popups={},delete b.focused_book,b.popups.settings_popup=!0};angular.isUndefined(b.popups.settings_popup)?c():b.popups.settings_popup?b.popups.settings_popup=!1:c(),a.stopPropagation()},a.logout=function(){k.logout()},a._expanded_notifications=function(){b.user.interact=!0,delete b.focused_book,delete b.ticker_popup,b.user.collapsed_column=!0,b.user.collapsed_trends=!0,b.user.collapsed_left_column=!0,b.popups.left_panel_width={width:"15%"}},a.show_interaction_box=function(b){a._expanded_notifications();var c=!1,d=!0;a.$emit("getNotifications",c,b,d)},a.show_trending_options=function(){a._expanded_notifications(),a._fetch_trending_options()},a._fetch_trending_options=function(){var c=!0;a.$emit("getNotifications",c,b.user.id)},a.handle_friends_grid_size=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;e&&(a.column_heights={notifications_style:{"max-height":m.NotificationsMinHeight},friends_grid_style:{"max-height":m.FriendsGridMaxHeight,overflow:"auto"},show_filters:!1}),d&&b.stopPropagation()},a.reset=function(){a.panel_selected="",a.bookmark_selected=!1,a.read_selected=!1,_init_recommendations(),_get_recommendations()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){delete b.focused_book,delete b.ticker_popup,b.user.collapsed_column=!0,b.user.collapsed_filters=!0,b.user.collapsed_friends=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!0,b.user.collapsed_left_column=!0,b.popups={}},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){r=a.$on("loadRecommendations",function(){var c=function(){b.filters.reset=!1,b.filters.reset_count=angular.isUndefined(b.filters.reset_count)?0:b.filters.reset_count+1,_get_recommendations()},d=function(){j.get_books_bookmarked(b.user.books.bookmarked.length).then(function(a){angular.forEach(a,function(a){var c=[];angular.forEach(b.labels,function(b){if(a[2].indexOf(b.name)>=0)var d={name:b.name,checked:!0};else var d={name:b.name,checked:!1};c.push(d)},c);var d={isbn:a[0],id:a[1],bookmark_status:!0,labels:c};this.push(d)},b.user.books.bookmarked)})},e=function(){j.get_books_read(b.user.books.read.length).then(function(a){angular.forEach(a,function(a){var b={isbn:a[0],id:a[1],status:!0};this.push(b)},b.user.books.read)})};a.read_selected||a.bookmark_selected?a.bookmark_selected?d():a.read_selected&&e():c()}),s=a.$on("reloadRecommendations",function(c){b.filters.reset=!0,b.filters.reset_count=0,a.reset(),c.stopPropagation()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(q),c.cancel(t)})},a._show_bookmark_tab=function(){a.bookmark_selected=!0,a.panel_selected=m.BookmarkPanel},a._initialize_filters=function(){var c=function(){b.filters.filter_id=f.filter_id,b.main_header=f.name},d=function(){b.filters.label_id=f.label_id,b.main_header=f.name,b.user.collapsed_filters=!1,b.user.collapsed_friends=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!0,b.user.collapsed_column=!0,a.expand_left_panel(),b.user.collapsed_left_column=!1},e=function(){b.filters.filter_id=f.grid_id,b.main_header=f.name,b.user.collapsed_filters=!0,b.user.collapsed_friends=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!1,b.user.collapsed_column=!0,a.expand_left_panel(),b.user.collapsed_left_column=!1},g=function(){b.filters.reset=!0,b.filters.reset_count=0,b.filters.trend_id=f.trend_id,b.main_header=f.name,b.user.collapsed_filters=!0,b.user.collapsed_friends=!0,b.user.collapsed_trends=!1,b.user.collapsed_lists=!0,b.user.collapsed_column=!0,a.expand_left_panel(),b.user.show_profile=!1,b.user.collapsed_left_column=!1},h=function(){delete b.main_header,delete b.filters.filter_id,delete b.filters.trend_id,delete b.filters.label_id};if(b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type){b.filters.filter_type=m.BookTab;var i=angular.isDefined(f.filter_id),j=angular.isDefined(f.label_id),k=angular.isDefined(f.grid_id),l=angular.isDefined(f.trend_id);i?c():j?d():l?g():k?e():h()}else if("authors"==f.type)b.filters.filter_type=m.AuthorTab;else if("readers"==f.type)b.filters.filter_type=m.ReaderTab;else if(f.book_id)a.$routeParams.type="books",b.filters.reset=!0,b.filters.filter_type=m.BookTab,b.filters.other_filters.id=a.$routeParams.book_id;else if(f.title){a.$routeParams.type="books",b.filters.reset=!0,b.filters.filter_type=m.BookTab,b.filters.other_filters.title=a.$routeParams.title,b.main_header=a.$routeParams.title;var n=angular.isDefined(a.$routeParams.status);n&&(b.filters.other_filters.show_all=a.$routeParams.status,b.filters.reset=!0,b.filters.reset_count=0)}else b.filters.filter_type=m.BookTab,a.show_notifications=!0},_update_recommendations=function(d){if(b.filters.filter_type==m.BookTab){if(d.recommendations.books.length>1)var e="INFO- "+d.recommendations.books.length+" books found. Scroll to see more books.";else if(d.recommendations.books.length>=0)var e="INFO- "+d.recommendations.books.length+" book found.";var f=notify(b,e,c);if(a.$on("destroy",function(){c.cancel(f)}),b.loading){var g=10;if(0==d.recommendations.books.length){var e=m.ZeroBooksFound,f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})}else{if(delete b.focused_book,a.recommendations.books.length>=g){a.recommendations.books=[a.recommendations.books[g-2],a.recommendations.books[g-1]];var f=c(function(){i.scrollTo(window_width/4,0,2e3)},200);a.$on("destroy",function(){c.cancel(f)})}b.filters.other_filters.title?(a.bookmark_selected=!1,a.read_selected=!1,b.hide_options=!0,_set_books(d.recommendations.books)):_set_books(d.recommendations.books)}b.loading=!1}}else b.filters.filter_type==m.AuthorTab?a.recommendations.authors=a.recommendations.authors.length>=g?d.recommendations.authors:a.recommendations.authors.concat(d.recommendations.authors):b.filters.filter_type==m.ReaderTab?a.recommendations.readers=a.recommendations.readers.length>=g?d.recommendations.readers:a.recommendations.readers.concat(d.recommendations.readers):_set_books(a.recommendations.books.length>=g?d.recommendations.books:d.recommendations.books)},_set_books=function(c){if(a.bookmark_selected){b.user.books.bookmarked=[],angular.forEach(c,function(a){var b={isbn:a[0],id:a[1],external_thumb:a[2]};this.push(b)},b.user.books.bookmarked);var d=window_width/b.user.books.bookmarked.length;a.block_style={width:d+"px"}}else{angular.forEach(c,function(a){var b={isbn:a[0],id:a[1],external_thumb:a[2]};this.push(b)},a.recommendations.books);var d=window_width/(a.recommendations.books.length+6);a.block_style={width:d+"px"}}},_get_grids=function(){d.get_grid_books().then(function(b){for(var c=[],d="",e=0;e<b.length;e++){var f=d!=b[e][0];if(f){var g=""!=d;if(g){if(c.length>4){var h={grid_text:d,grid_books:c,is_grid:!0,id:grid_id},i=a.recommendations.books.length-2;a.recommendations.books.splice(i,0,h)}c=[]}d=b[e][0],grid_id=b[e][3]}var j={isbn:b[e][1],id:b[e][2],external_thumb:b[e][4]};c.push(j)}if(c.length>4){var h={grid_text:d,grid_books:c,is_grid:!0,id:grid_id},i=a.recommendations.books.length-2;a.recommendations.books.splice(i,0,h)}})},_push_recommendations=function(){var e=3e3;q=c(function(){d.push_recommendations().then(function(d){var e={grid_text:"Books becoming movies",grid_books:d,is_grid:!0};a.recommendations.books.splice(3,0,e);var f="INFO-Check out Books becoming movies...";notify(b,f,c)})},e)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.loading=!0,d.get_recommendations().then(function(a){_update_recommendations(a)});var c=angular.isUndefined(b.filters.other_filters.title)&&angular.isUndefined(b.filters.other_filters.id),e=a.recommendations.books.length>=4;c&&e&&_get_grids()},_handle_focused_book=function(){b.focused_book=a.recommendations.books.first},a._get_friends=function(a){var c=function(a,b){angular.forEach(b,function(a){thumb=null==a[2]?"/assets/profile_pic.jpeg":a[2];var b={id:a[0],name:a[1],thumb:thumb,init_book_read_count:a[3],total_count:a[4],book_read_count:a[5],bookmark_count:a[6],fav_categories:a[7].join(", ")};this.push(b)},a)};if(angular.isUndefined(b.reader)){var d=angular.isDefined(b.user.friends)?b.user.friends.length:0;(angular.isUndefined(b.user.friends)||!b.user.all_friends_shown)&&h.get_friends(b.user.id,a,d).then(function(d){a>d.length&&(b.user.all_friends_shown=!0),angular.isUndefined(b.user.friends)&&(b.user.friends=[]),c(b.user.friends,d)})}else{var d=angular.isDefined(b.reader.friends)?b.reader.friends.length:0;(angular.isUndefined(b.reader.friends)||!b.reader.all_friends_shown)&&h.get_friends(b.reader.id,a,d).then(function(d){a>d.length&&(b.reader.all_friends_shown=!0),angular.isUndefined(b.reader.friends)&&(b.reader.friends=[]),c(b.reader.friends,d)})}},a._get_labels=function(a){d.get_labels(a).then(function(a){b.labels=[],angular.isArray(a)&&a.length>0&&angular.forEach(a,function(a){null!=a[0]&&this.push({name:a[0].replace('"',""),id:a[1]})},b.labels)})},a._init_user=function(){(angular.isUndefined(b.user)||angular.isUndefined(b.user.id))&&k.is_logged_in(a)},a._init_reader=function(){k.get_user(a.$routeParams.id)},a._basic_init=function(){a.grid_view=!1,b.popups={settings_popup:!1,show_notifications_popup:!1};var d=1e4;a.drop_icon=!1,b.user=angular.extend(b.user,{collapsed_trends:!0,collapsed_friends:!0,collapsed_filters:!0,collapsed_lists:!0,collapsed_column:!0,collapsed_left_column:!0,interact:!1}),t=c(function(){_recordUserBehaviour()},d),a.searching=!1,_add_listeners(),_init_analytics(),_bind_destroy(),a.cover_image={"background-image":'url("'+l.get("coverImage")+'")'},a._init_user()},_init=function(){if(b.user.logged)if(a._basic_init(),a.$routeParams=f,delete b.reader,"profile"==a.$routeParams.type){var c=a.$routeParams.id;b.reader={},b.reader.id=c,a.toggle_profile(c),a._init_reader(),a._get_labels(c),a.placeholder="Write on timeline..."}else _init_recommendations(),a._get_labels(),a._initialize_filters(),a.placeholder=p.Share;else b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1},n.path("/search")},a.getting_started_tour_options={steps:[{element:"#shelves",intro:o.Shelves,position:"right"},{element:"#friendsList",intro:o.Friends,position:"right"},{element:"#newsFeed",intro:o.NewsFeed,position:"right"},{element:"#listopia",intro:o.Listopia,position:"right"},{element:"#trendingList",intro:o.Trending,position:"right"},{element:"#share",intro:o.Share,position:"bottom"},{element:"#editProfile",intro:o.Profile,position:"bottom"},{element:"#recommendationFooter",intro:o.ShelvesTab,position:"bottom"}],showStepNumbers:!1,exitOnOverlayClick:!0,exitOnEsc:!0,nextLabel:"<strong>Next</strong>",prevLabel:"<span>Previous</span>",skipLabel:"Exit",doneLabel:"<strong>Thanks</strong>"},a.should_auto_start=function(){return!1};var q="",r="",s="",t="";_init()}]);