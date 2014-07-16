websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller",function(a,b,c,d,e,f,g,h,i){a.handle_height_of_popup=function(b){a.ticker_popup_style=b.deltaY>0?{height:"62vh"}:{height:"42vh"},b.stopPropagation()},a.handle_friends_grid_size=function(){a.column_heights=event.deltaY>0?{notifications_style:{height:"110px"},friends_grid_style:{"max-height":"120px",overflow:"auto"},show_filters:!1}:{notifications_style:{height:"110px"},friends_grid_style:{height:"75px"},show_filters:!1},event.stopPropagation()},a.reset=function(){_init_recommendations(),_get_recommendations()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){b.hide_options=!0,b.focused_book=null,b.ticker_popup=null},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){k=a.$on("loadRecommendations",function(){a.read_selected||a.bookmark_selected||(b.filters.reset=!1,b.filters.reset_count=angular.isUndefined(b.filters.reset_count)?0:b.filters.reset_count+1,_get_recommendations())}),l=a.$on("reloadRecommendations",function(){b.filters.reset=!0,b.filters.reset_count=0,a.reset()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(j),c.cancel(m)})},_initialize_filters=function(){a.show_more_filters=!0,b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type?b.filters.filter_type="BOOK":"authors"==f.type?b.filters.filter_type="AUTHOR":"readers"==f.type?b.filters.filter_type="READER":f.title?(a.$routeParams.type="books",b.filters.reset=!0,b.filters.filter_type="BOOK",b.filters.other_filters.title=a.$routeParams.title,b.filters.other_filters.author_name=a.$routeParams.author):(b.filters.filter_type="BOOK",a.show_notifications=!0),f.filter_id&&(a.show_more_filters=!0)},_update_recommendations=function(d){if("BOOK"==b.filters.filter_type){var e="INFO- "+d.recommendations.books.length+" books found.",f=notify(b,e,c);if(a.$on("destroy",function(){c.cancel(f)}),b.loading){var g=30;if(0==d.recommendations.books.length){var e="ALERT- Reset the filters couldn't find more books.",f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})}else{if(a.recommendations.books.length>=g){a.recommendations.books=[a.recommendations.books[g-2],a.recommendations.books[g-1]],b.focused_book=null;var f=c(function(){i.scrollTo(screen.width/2,0,3e3)},1e3);a.$on("destroy",function(){c.cancel(f)})}b.filters.other_filters.title?(a.bookmark_selected=!1,a.read_selected=!1,b.hide_options=!0,_set_books(d.recommendations.books),b.focused_book=a.recommendations.books[0],b.focused_book.tweets=[]):_set_books(d.recommendations.books)}b.loading=!1}}else"AUTHOR"==b.filters.filter_type?a.recommendations.authors=a.recommendations.authors.length>=30?d.recommendations.authors:a.recommendations.authors.concat(d.recommendations.authors):"READER"==b.filters.filter_type?a.recommendations.readers=a.recommendations.readers.length>=30?d.recommendations.readers:a.recommendations.readers.concat(d.recommendations.readers):_set_books(a.recommendations.books.length>=30?d.recommendations.books:d.recommendations.books)},_set_books=function(b){angular.forEach(b,function(a){var b={isbn:a[0],id:a[1]};this.push(b)},a.recommendations.books)},_push_recommendations=function(){var a=3e3;j=c(function(){d.push_recommendations().then(function(a){b.message_type="Notification",b.message="We think you like Hermann Hesse, and here is his best read.",_update_recommendations(a)})},a)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.loading=!0,d.get_recommendations().then(function(a){_update_recommendations(a)})},_get_filters=function(){d.get_filters().then(function(b){a.more_filters=a.more_filters.concat(b.filters)})},_handle_focused_book=function(){b.focused_book=a.recommendations.books.first},_get_friends=function(){h.get_friends(a.$routeParams.id).then(function(a){b.user.friends=a.friends})},_get_labels=function(){b.labels=[],d.get_labels().then(function(a){angular.forEach(a,function(a){this.push({name:a[0].replace('"',"")})},b.labels)})},_init=function(){a.$routeParams=f;var d=1e4;a.drop_icon=!1,b.show_book=!1,m=c(function(){_recordUserBehaviour()},d),a.searching=!1,_get_filters(),_get_labels(),_initialize_filters(),_init_recommendations(),a.$routeParams.title&&_get_recommendations(),_add_listeners(),_init_analytics(),_bind_destroy(),_get_friends()};var j="",k="",l="",m="";_init()}]);