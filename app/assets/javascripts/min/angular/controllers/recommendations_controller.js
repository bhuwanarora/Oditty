websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller","websiteService","sharedService","$cookieStore","RecommendationUIConstants",function(a,b,c,d,e,f,g,h,i,j,k,l,m){a.handle_height_of_popup=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;e&&(a.ticker_popup_style={height:m.TickerPopupMaxHeight}),d&&b.stopPropagation()},a.show_interaction_box=function(){b.user.interact=!0,delete b.focused_book},a.handle_friends_grid_size=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;e&&(a.column_heights={notifications_style:{"max-height":m.NotificationsMinHeight},friends_grid_style:{"max-height":m.FriendsGridMaxHeight,overflow:"auto"},show_filters:!1}),d&&b.stopPropagation()},a.reset=function(){var b=angular.isDefined(a.filters.other_filters)&&(angular.isDefined(a.filters.other_filters.id)||angular.isDefined(a.filters.other_filters.title));b&&(a.panel_selected="",a.bookmark_selected=!1,a.read_selected=!1),_init_recommendations(),_get_recommendations()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){b.hide_options=!0,delete b.focused_book,delete b.ticker_popup},a.get_notifications=function(){a.$emit("getNotifications")},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){o=a.$on("loadRecommendations",function(){a.read_selected||a.bookmark_selected?a.bookmark_selected?j.get_books_bookmarked(b.user.books.bookmarked.length).then(function(a){angular.forEach(a,function(a){var c=[];angular.forEach(b.labels,function(b){if(a[2].indexOf(b.name)>=0)var d={name:b.name,checked:!0};else var d={name:b.name,checked:!1};c.push(d)},c);var d={isbn:a[0],id:a[1],bookmark_status:!0,labels:c};this.push(d)},b.user.books.bookmarked)}):a.read_selected&&j.get_books_read(b.user.books.read.length).then(function(a){angular.forEach(a,function(a){var b={isbn:a[0],id:a[1],status:!0};this.push(b)},b.user.books.read)}):(b.filters.reset=!1,b.filters.reset_count=angular.isUndefined(b.filters.reset_count)?0:b.filters.reset_count+1,_get_recommendations())}),p=a.$on("reloadRecommendations",function(){b.filters.reset=!0,b.filters.reset_count=0,a.reset()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(n),c.cancel(q)})},_show_bookmark_tab=function(){a.bookmark_selected=!0,a.panel_selected=m.BookmarkPanel},_initialize_filters=function(){if(b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type){b.filters.filter_type=m.BookTab;var c=angular.isDefined(f.filter_id),d=angular.isDefined(f.grid_id),e=angular.isDefined(f.trend_id),g=angular.isDefined(l.get("broadcast"));if(c)l.get("tab")==m.BookmarkPanel?(_show_bookmark_tab(),b.filters.label_id=f.filter_id,b.main_header=f.name):(b.filters.filter_id=f.filter_id,b.main_header=f.name);else if(e)b.filters.reset=!0,b.filters.reset_count=0,b.filters.trend_id=f.trend_id,b.main_header=f.name;else if(d)b.filters.filter_id=f.grid_id,b.main_header=f.name;else if(g){var h=(l.get("broadcast"),l.get("selectedItem")),i=l.get("type");b.filters.reset=!0,b.filters.reset_count=0,b.filters.other_filters[i]=h,b.hide_options=!0,l.remove("broadcast"),l.remove("selectedItem"),l.remove("type")}else delete b.main_header}else if("authors"==f.type)b.filters.filter_type=m.AuthorTab;else if("readers"==f.type)b.filters.filter_type=m.ReaderTab;else if(f.title){a.$routeParams.type="books",b.filters.reset=!0,b.filters.filter_type=m.BookTab,b.filters.other_filters.title=a.$routeParams.title,b.main_header=a.$routeParams.title,b.filters.other_filters.author_name=a.$routeParams.author;var j=angular.isDefined(a.$routeParams.book_id),k=angular.isDefined(a.$routeParams.status);k&&(b.filters.other_filters.show_all=a.$routeParams.status,b.filters.reset=!0,b.filters.reset_count=0),j&&(b.filters.other_filters.id=a.$routeParams.book_id)}else b.filters.filter_type=m.BookTab,a.show_notifications=!0},_update_recommendations=function(d){if(b.filters.filter_type==m.BookTab){if(d.recommendations.books.length>0)var e="INFO- "+d.recommendations.books.length+" books found.";else var e="INFO- "+d.recommendations.books.length+" book found.";var f=notify(b,e,c);if(a.$on("destroy",function(){c.cancel(f)}),b.loading){var g=10;if(0==d.recommendations.books.length){var e=m.ZeroBooksFound,f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})}else{if(delete b.focused_book,a.recommendations.books.length>=g){a.recommendations.books=[a.recommendations.books[g-2],a.recommendations.books[g-1]];var f=c(function(){i.scrollTo(screen.width/2,0,3e3)},1e3);a.$on("destroy",function(){c.cancel(f)})}b.filters.other_filters.title?(a.bookmark_selected=!1,a.read_selected=!1,b.hide_options=!0,_set_books(d.recommendations.books)):_set_books(d.recommendations.books)}b.loading=!1}}else b.filters.filter_type==m.AuthorTab?a.recommendations.authors=a.recommendations.authors.length>=g?d.recommendations.authors:a.recommendations.authors.concat(d.recommendations.authors):b.filters.filter_type==m.ReaderTab?a.recommendations.readers=a.recommendations.readers.length>=g?d.recommendations.readers:a.recommendations.readers.concat(d.recommendations.readers):_set_books(a.recommendations.books.length>=g?d.recommendations.books:d.recommendations.books)},_set_books=function(c){if(a.bookmark_selected){b.user.books.bookmarked=[],angular.forEach(c,function(a){var b={isbn:a[0],id:a[1],external_thumb:a[2]};this.push(b)},b.user.books.bookmarked);var d=screen.width/b.user.books.bookmarked.length;a.block_style={width:d+"px"}}else{angular.forEach(c,function(a){var b={isbn:a[0],id:a[1],external_thumb:a[2]};this.push(b)},a.recommendations.books);var d=screen.width/(a.recommendations.books.length+6);a.block_style={width:d+"px"}}},_get_grids=function(){d.get_grid_books().then(function(b){for(var c=[],d="",e=0;e<b.length;e++){var f=d!=b[e][0];if(f){var g=""!=d;if(g){if(c.length>4){var h={grid_text:d,grid_books:c,is_grid:!0,id:grid_id},i=a.recommendations.books.length-2;a.recommendations.books.splice(i,0,h)}c=[]}d=b[e][0],grid_id=b[e][3]}var j={isbn:b[e][1],id:b[e][2],external_thumb:b[e][4]};c.push(j)}if(c.length>4){var h={grid_text:d,grid_books:c,is_grid:!0,id:grid_id},i=a.recommendations.books.length-2;a.recommendations.books.splice(i,0,h)}})},_push_recommendations=function(){var e=3e3;n=c(function(){d.push_recommendations().then(function(d){var e={grid_text:"Books becoming movies",grid_books:d,is_grid:!0};a.recommendations.books.splice(3,0,e);var f="INFO-Checkout Books becoming movies...";notify(b,f,c)})},e)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.loading=!0,d.get_recommendations().then(function(a){_update_recommendations(a)});var a=(angular.isUndefined(b.filters.more_filters)||0==b.filters.more_filters.length)&&(angular.isUndefined(b.filters.other_filters)||"{}"==JSON.stringify(b.filters.other_filters));a&&_get_grids()},_handle_focused_book=function(){b.focused_book=a.recommendations.books.first},_get_friends=function(){h.get_friends(a.$routeParams.id).then(function(a){b.user.friends=[],angular.forEach(a,function(a){thumb=null==a[2]?"/assets/profile_pic.jpeg":a[2];var b={id:a[0],name:a[1],thumb:thumb,init_book_read_count:a[3],total_count:a[4],book_read_count:a[5],bookmark_count:a[6],fav_categories:a[7].join(", ")};this.push(b)},b.user.friends)})},_get_labels=function(){b.labels=[],d.get_labels().then(function(a){angular.isArray(a)&&a.length>0&&angular.forEach(a,function(a){null!=a[0]&&this.push({name:a[0].replace('"',""),id:a[1]})},b.labels)})},_init_user=function(){(angular.isUndefined(b.user)||angular.isUndefined(b.user.id))&&k.is_logged_in(a)},_init=function(){a.$routeParams=f;var d=1e4;a.drop_icon=!1,b.user.interact=!1,q=c(function(){_recordUserBehaviour()},d),a.searching=!1,_get_labels(),_initialize_filters(),_init_recommendations(),_add_listeners(),_init_analytics();var e=c(function(){_get_recommendations()},1e3);a.$on("destroy",function(){c.cancel(e)}),_bind_destroy(),_init_user(),_get_friends(),a.$emit("getNotifications")};var n="",o="",p="",q="";_init()}]);