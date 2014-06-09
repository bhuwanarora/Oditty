websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller",function(a,b,c,d,e,f,g,h,i){a.toggle_bookmarked=function(b){a.bookmark_selected||(a.panel_selected="BOOKMARK",a.bookmark_selected=!0,a.read_selected=!1,a.glowBookmark=!1),b.stopPropagation()},a.toggle_recommendations=function(){(a.bookmark_selected||a.read_selected)&&(a.read_selected=!1,a.bookmark_selected=!1,a.panel_selected="",a.reset())},a.reset=function(){_init_recommendations(),_get_recommendations()},a.toggle_read=function(){a.read_selected||(a.glowShelf=!1,a.bookmark_selected=!1,a.read_selected=!0,a.panel_selected="READ")},a.toggle_more_filters=function(b){a.show_more_filters=1==a.show_more_filters?!1:!0,b.stopPropagation()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){b.hide_options=!0,b.focused_book=null,a.show_more_filters=!1},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){k=a.$on("loadRecommendations",function(){b.filters.reset=!1,b.filters.reset_count=void 0==b.filters.reset_count?0:b.filters.reset_count+1,_get_recommendations()}),l=a.$on("reloadRecommendations",function(){b.filters.reset=!0,b.filters.reset_count=0,a.reset()}),n=a.$on("showBookReadShelf",function(){a.read_selected=!0,event.stopPropagation()}),glow_shelf_event=a.$on("glowShelf",function(){a.glowShelf=!0,event.stopPropagation()}),glow_bookmark_event=a.$on("glowBookmark",function(){a.glowBookmark=!0,event.stopPropagation()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(j),c.cancel(m)})},_init_shelf=function(){a.read_selected=!1,a.bookmark_selected=!1},_init_notifications=function(){b.notification_active=!1},_initialize_filters=function(){a.show_more_filters=!1,b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type?b.filters.filter_type="BOOK":"authors"==f.type?b.filters.filter_type="AUTHOR":"readers"==f.type?b.filters.filter_type="READER":(b.filters.filter_type="BOOK",a.show_notifications=!0),f.filter_id&&(a.show_more_filters=!0)},_update_recommendations=function(d){if("BOOK"==b.filters.filter_type){var e="INFO- "+d.recommendations.books.length+" books found.",f=notify(b,e,c);if(a.$on("destroy",function(){c.cancel(f)}),b.loading){var g=30;if(0==d.recommendations.books.length){var e="ALERT- Reset the filters couldn't find more books.",f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})}else{if(a.recommendations.books.length>=g){a.recommendations.books=[a.recommendations.books[g-2],a.recommendations.books[g-1]];var f=c(function(){i.scrollTo(screen.width/2,0,3e3)},1e3);a.$on("destroy",function(){c.cancel(f)})}b.filters.other_filters.title?(a.bookmark_selected=!1,a.read_selected=!1,a.$emit("moveRight"),b.hide_options=!0,a.recommendations.books=d.recommendations.books,b.focused_book=a.recommendations.books[0]):a.recommendations.books=a.recommendations.books.concat(d.recommendations.books)}b.loading=!1}}else"AUTHOR"==b.filters.filter_type?a.recommendations.authors=a.recommendations.authors.length>=30?d.recommendations.authors:a.recommendations.authors.concat(d.recommendations.authors):"READER"==b.filters.filter_type?a.recommendations.readers=a.recommendations.readers.length>=30?d.recommendations.readers:a.recommendations.readers.concat(d.recommendations.readers):a.recommendations.books=a.recommendations.books.length>=30?d.recommendations.books:a.recommendations.books.concat(d.recommendations.books)},_push_recommendations=function(){var a=3e3;j=c(function(){d.push_recommendations().then(function(a){b.message_type="Notification",b.message="We think you like Hermann Hesse, and here is his best read.",_update_recommendations(a)})},a)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.loading=!0,d.get_recommendations().then(function(a){_update_recommendations(a)})},_get_filters=function(){d.get_filters().then(function(b){a.more_filters=a.more_filters.concat(b.filters)})},_handle_focused_book=function(){b.focused_book=a.recommendations.books.first},_get_friends=function(){h.get_friends(a.$routeParams.id).then(function(a){b.user.friends=a.friends})},_get_labels=function(){d.get_labels().then(function(a){b.labels=a.labels})},_init=function(){a.$routeParams=f;var d=1e4;a.drop_icon=!1,b.show_book=!1,m=c(function(){_recordUserBehaviour()},d),a.searching=!1,_get_filters(),_get_labels(),_init_recommendations(),_add_listeners(),_init_notifications(),_init_analytics(),_init_shelf(),_initialize_filters(),_get_recommendations(),_bind_destroy(),_handle_focused_book(),_get_friends()};var j="",k="",l="",m="",n="";_init()}]);