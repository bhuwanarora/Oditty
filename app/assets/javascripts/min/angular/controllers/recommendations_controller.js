websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller","websiteService",function(a,b,c,d,e,f,g,h,i,j){a.handle_height_of_popup=function(b){a.ticker_popup_style=b.deltaY>0?{height:"62vh"}:{height:"42vh"},b.stopPropagation()},a.handle_friends_grid_size=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;a.column_heights=e?{notifications_style:{"max-height":"110px"},friends_grid_style:{"max-height":"120px",overflow:"auto"},show_filters:!1}:{notifications_style:{"max-height":"110px"},friends_grid_style:{height:"75px"},show_filters:!1},d&&b.stopPropagation()},a.reset=function(){_init_recommendations(),_get_recommendations()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){b.hide_options=!0,b.focused_book=null,b.ticker_popup=null},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){l=a.$on("loadRecommendations",function(){a.read_selected||a.bookmark_selected?a.bookmark_selected?j.get_books_bookmarked(b.user.books.bookmarked.length).then(function(a){angular.forEach(a,function(a){var c=[];angular.forEach(b.labels,function(b){if(a[2].indexOf(b.name)>=0)var d={name:b.name,checked:!0};else var d={name:b.name,checked:!1};c.push(d)},c);var d={isbn:a[0],id:a[1],bookmark_status:!0,labels:c};this.push(d)},b.user.books.bookmarked)}):a.read_selected&&j.get_books_read(b.user.books.read.length).then(function(a){angular.forEach(a,function(a){var b={isbn:a[0],id:a[1],status:!0};this.push(b)},b.user.books.read)}):(b.filters.reset=!1,b.filters.reset_count=angular.isUndefined(b.filters.reset_count)?0:b.filters.reset_count+1,_get_recommendations())}),m=a.$on("reloadRecommendations",function(){b.filters.reset=!0,b.filters.reset_count=0,a.reset()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(k),c.cancel(n)})},_show_bookmark_tab=function(){a.bookmark_selected=!0,a.panel_selected="BOOKMARK"},_initialize_filters=function(){if(b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type){b.filters.filter_type="BOOK";var c=angular.isDefined(f.filter_id),d=angular.isDefined(f.trend_id);c?(_show_bookmark_tab(),b.filters.filter_id=f.filter_id):d&&(b.filters.reset=!0,b.filters.reset_count=0,b.filters.trend_id=f.trend_id,b.main_header=f.name)}else if("authors"==f.type)b.filters.filter_type="AUTHOR";else if("readers"==f.type)b.filters.filter_type="READER";else if(f.title){a.$routeParams.type="books",b.filters.reset=!0,b.filters.filter_type="BOOK",b.filters.other_filters.title=a.$routeParams.title,b.main_header=a.$routeParams.title,b.filters.other_filters.author_name=a.$routeParams.author;var e=angular.isDefined(a.$routeParams.book_id),g=angular.isDefined(a.$routeParams.status);g&&(b.filters.other_filters.show_all=a.$routeParams.status,b.filters.reset=!0,b.filters.reset_count=0),e&&(b.filters.other_filters.id=a.$routeParams.book_id)}else b.filters.filter_type="BOOK",a.show_notifications=!0},_update_recommendations=function(d){if("BOOK"==b.filters.filter_type){if(d.recommendations.books.length>0)var e="INFO- "+d.recommendations.books.length+" books found.";else var e="INFO- "+d.recommendations.books.length+" book found.";var f=notify(b,e,c);if(a.$on("destroy",function(){c.cancel(f)}),b.loading){var g=30;if(0==d.recommendations.books.length){var e="ALERT- Reset the filters couldn't find more books.",f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})}else{if(b.focused_book=null,a.recommendations.books.length>=g){a.recommendations.books=[a.recommendations.books[g-2],a.recommendations.books[g-1]];var f=c(function(){i.scrollTo(screen.width/2,0,3e3)},1e3);a.$on("destroy",function(){c.cancel(f)})}b.filters.other_filters.title?(a.bookmark_selected=!1,a.read_selected=!1,b.hide_options=!0,_set_books(d.recommendations.books)):_set_books(d.recommendations.books)}b.loading=!1}}else"AUTHOR"==b.filters.filter_type?a.recommendations.authors=a.recommendations.authors.length>=30?d.recommendations.authors:a.recommendations.authors.concat(d.recommendations.authors):"READER"==b.filters.filter_type?a.recommendations.readers=a.recommendations.readers.length>=30?d.recommendations.readers:a.recommendations.readers.concat(d.recommendations.readers):_set_books(a.recommendations.books.length>=30?d.recommendations.books:d.recommendations.books)},_set_books=function(c){if(a.bookmark_selected){b.user.books.bookmarked=[],angular.forEach(c,function(a){var b={isbn:a[0],id:a[1]};this.push(b)},b.user.books.bookmarked);var d=screen.width/b.user.books.bookmarked.length;a.block_style={width:d+"px"}}else{angular.forEach(c,function(a){var b={isbn:a[0],id:a[1]};this.push(b)},a.recommendations.books);var d=screen.width/(a.recommendations.books.length+4);a.block_style={width:d+"px"}}},_push_recommendations=function(){var e=3e3;k=c(function(){d.push_recommendations().then(function(d){var e={grid_text:"Books becoming movies",grid_books:d,is_grid:!0};a.recommendations.books.splice(3,0,e);var f="INFO-Checkout Books becoming movies...";notify(b,f,c)})},e)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.loading=!0,d.get_recommendations().then(function(a){_update_recommendations(a)})},_get_filters=function(){d.get_filters().then(function(b){a.more_filters=a.more_filters.concat(b.filters)})},_handle_focused_book=function(){b.focused_book=a.recommendations.books.first},_get_friends=function(){h.get_friends(a.$routeParams.id).then(function(a){b.user.friends=a.friends})},_get_labels=function(){b.labels=[],d.get_labels().then(function(a){angular.isArray(a)&&a.length>0&&angular.forEach(a,function(a){null!=a[0]&&this.push({name:a[0].replace('"',""),id:a[1]})},b.labels)})},_init=function(){a.$routeParams=f;var d=1e4;a.drop_icon=!1,b.show_book=!1,n=c(function(){_recordUserBehaviour()},d),a.searching=!1,_get_filters(),_get_labels(),_initialize_filters(),_init_recommendations(),_add_listeners(),_init_analytics();var e=c(function(){_get_recommendations()},1e3);a.$on("destroy",function(){c.cancel(e)}),_push_recommendations(),_bind_destroy(),_get_friends()};var k="",l="",m="",n="";_init()}]);