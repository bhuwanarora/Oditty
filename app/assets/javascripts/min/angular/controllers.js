websiteApp.controller("bookTimelineController",["$scope","$rootScope","$timeout","widgetService","$route","$routeParams","$interval",function(a,b,c,d){(_init=function(){d.get_moments().then(function(b){a.moments=b.moments})})()}]);;websiteApp.controller("recommendationsController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval","widgetService","scroller","websiteService","sharedService","$cookieStore","RecommendationUIConstants",function(a,b,c,d,e,f,g,h,i,j,k,l,m){a.handle_height_of_popup=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;e&&(a.ticker_popup_style={height:m.TickerPopupMaxHeight}),d&&b.stopPropagation()},a.show_interaction_box=function(){b.user.interact=!0,delete b.focused_book},a.handle_friends_grid_size=function(b,c){var d=angular.isDefined(b);if(d)var e=b.deltaY>0;else var e=c;e&&(a.column_heights={notifications_style:{"max-height":m.NotificationsMinHeight},friends_grid_style:{"max-height":m.FriendsGridMaxHeight,overflow:"auto"},show_filters:!1}),d&&b.stopPropagation()},a.reset=function(){a.panel_selected="",a.bookmark_selected=!1,a.read_selected=!1,_init_recommendations(),_get_recommendations()},a.stopSearching=function(a){b.searching=!1,a.currentTarget.text=""},a.hide_popups=function(){delete b.focused_book,delete b.ticker_popup},a.get_notifications=function(){a.$emit("getNotifications")},_load_icon=function(){a.drop_icon=!0,c(function(){a.drop_icon=!1},1e3)},_add_listeners=function(){o=a.$on("loadRecommendations",function(){a.read_selected||a.bookmark_selected?a.bookmark_selected?j.get_books_bookmarked(b.user.books.bookmarked.length).then(function(a){angular.forEach(a,function(a){var c=[];angular.forEach(b.labels,function(b){if(a[2].indexOf(b.name)>=0)var d={name:b.name,checked:!0};else var d={name:b.name,checked:!1};c.push(d)},c);var d={isbn:a[0],id:a[1],bookmark_status:!0,labels:c};this.push(d)},b.user.books.bookmarked)}):a.read_selected&&j.get_books_read(b.user.books.read.length).then(function(a){angular.forEach(a,function(a){var b={isbn:a[0],id:a[1],status:!0};this.push(b)},b.user.books.read)}):(b.filters.reset=!1,b.filters.reset_count=angular.isUndefined(b.filters.reset_count)?0:b.filters.reset_count+1,_get_recommendations())}),p=a.$on("reloadRecommendations",function(){b.filters.reset=!0,b.filters.reset_count=0,a.reset()})},_init_recommendations=function(){a.recommendations={books:[],readers:[],authors:[]}},_bind_destroy=function(){a.$on("$destroy",function(){c.cancel(n),c.cancel(q)})},_show_bookmark_tab=function(){a.bookmark_selected=!0,a.panel_selected=m.BookmarkPanel},_initialize_filters=function(){if(b.filters={},b.filters.more_filters=[],b.filters.other_filters={},"books"==f.type){b.filters.filter_type=m.BookTab;var c=angular.isDefined(f.filter_id),d=angular.isDefined(f.grid_id),e=angular.isDefined(f.trend_id),g=angular.isDefined(l.get("broadcast"));if(c)l.get("tab")==m.BookmarkPanel?(_show_bookmark_tab(),b.filters.label_id=f.filter_id,b.main_header=f.name):(b.filters.filter_id=f.filter_id,b.main_header=f.name);else if(e)b.filters.reset=!0,b.filters.reset_count=0,b.filters.trend_id=f.trend_id,b.main_header=f.name;else if(d)b.filters.filter_id=f.grid_id,b.main_header=f.name;else if(g){var h=(l.get("broadcast"),l.get("selectedItem")),i=l.get("type");b.filters.reset=!0,b.filters.reset_count=0,b.filters.other_filters[i]=h,b.hide_options=!0,l.remove("broadcast"),l.remove("selectedItem"),l.remove("type")}else delete b.main_header}else if("authors"==f.type)b.filters.filter_type=m.AuthorTab;else if("readers"==f.type)b.filters.filter_type=m.ReaderTab;else if(f.title){a.$routeParams.type="books",b.filters.reset=!0,b.filters.filter_type=m.BookTab,b.filters.other_filters.title=a.$routeParams.title,b.main_header=a.$routeParams.title,b.filters.other_filters.author_name=a.$routeParams.author;var j=angular.isDefined(a.$routeParams.book_id),k=angular.isDefined(a.$routeParams.status);k&&(b.filters.other_filters.show_all=a.$routeParams.status,b.filters.reset=!0,b.filters.reset_count=0),j&&(b.filters.other_filters.id=a.$routeParams.book_id)}else b.filters.filter_type=m.BookTab,a.show_notifications=!0},_update_recommendations=function(d){if(b.filters.filter_type==m.BookTab){if(d.recommendations.books.length>0)var e="INFO- "+d.recommendations.books.length+" books found.";else var e="INFO- "+d.recommendations.books.length+" book found.";var f=notify(b,e,c);if(a.$on("destroy",function(){c.cancel(f)}),b.loading){var g=10;if(0==d.recommendations.books.length){var e=m.ZeroBooksFound,f=notify(b,e,c);a.$on("destroy",function(){c.cancel(f)})}else{if(delete b.focused_book,a.recommendations.books.length>=g){a.recommendations.books=[a.recommendations.books[g-2],a.recommendations.books[g-1]];var f=c(function(){i.scrollTo(screen.width/2,0,3e3)},1e3);a.$on("destroy",function(){c.cancel(f)})}b.filters.other_filters.title?(a.bookmark_selected=!1,a.read_selected=!1,b.hide_options=!0,_set_books(d.recommendations.books)):_set_books(d.recommendations.books)}b.loading=!1}}else b.filters.filter_type==m.AuthorTab?a.recommendations.authors=a.recommendations.authors.length>=g?d.recommendations.authors:a.recommendations.authors.concat(d.recommendations.authors):b.filters.filter_type==m.ReaderTab?a.recommendations.readers=a.recommendations.readers.length>=g?d.recommendations.readers:a.recommendations.readers.concat(d.recommendations.readers):_set_books(a.recommendations.books.length>=g?d.recommendations.books:d.recommendations.books)},_set_books=function(c){if(a.bookmark_selected){b.user.books.bookmarked=[],angular.forEach(c,function(a){var b={isbn:a[0],id:a[1],external_thumb:a[2]};this.push(b)},b.user.books.bookmarked);var d=screen.width/b.user.books.bookmarked.length;a.block_style={width:d+"px"}}else{angular.forEach(c,function(a){var b={isbn:a[0],id:a[1],external_thumb:a[2]};this.push(b)},a.recommendations.books);var d=screen.width/(a.recommendations.books.length+6);a.block_style={width:d+"px"}}},_get_grids=function(){d.get_grid_books().then(function(b){for(var c=[],d="",e=0;e<b.length;e++){var f=d!=b[e][0];if(f){var g=""!=d;if(g){if(c.length>4){var h={grid_text:d,grid_books:c,is_grid:!0,id:grid_id},i=a.recommendations.books.length-2;a.recommendations.books.splice(i,0,h)}c=[]}d=b[e][0],grid_id=b[e][3]}var j={isbn:b[e][1],id:b[e][2],external_thumb:b[e][4]};c.push(j)}if(c.length>4){var h={grid_text:d,grid_books:c,is_grid:!0,id:grid_id},i=a.recommendations.books.length-2;a.recommendations.books.splice(i,0,h)}})},_push_recommendations=function(){var e=3e3;n=c(function(){d.push_recommendations().then(function(d){var e={grid_text:"Books becoming movies",grid_books:d,is_grid:!0};a.recommendations.books.splice(3,0,e);var f="INFO-Checkout Books becoming movies...";notify(b,f,c)})},e)},_init_analytics=function(){b.data=[]},_recordUserBehaviour=function(){var a=6e8;g(function(){b.data;_init_analytics()},a)},_get_recommendations=function(){b.loading=!0,d.get_recommendations().then(function(b){_update_recommendations(b);var c=angular.isDefined(b.recommendations.book)&&0==a.recommendations.books.length&&b.recommendations.book.length>2;c&&a.$emit("moveRight")});var c=(angular.isUndefined(b.filters.more_filters)||0==b.filters.more_filters.length)&&(angular.isUndefined(b.filters.other_filters)||"{}"==JSON.stringify(b.filters.other_filters));c&&_get_grids()},_handle_focused_book=function(){b.focused_book=a.recommendations.books.first},_get_friends=function(){h.get_friends(a.$routeParams.id).then(function(a){b.user.friends=[],angular.forEach(a,function(a){thumb=null==a[2]?"/assets/profile_pic.jpeg":a[2];var b={id:a[0],name:a[1],thumb:thumb,init_book_read_count:a[3],total_count:a[4],book_read_count:a[5],bookmark_count:a[6],fav_categories:a[7].join(", ")};this.push(b)},b.user.friends)})},_get_labels=function(){b.labels=[],d.get_labels().then(function(a){angular.isArray(a)&&a.length>0&&angular.forEach(a,function(a){null!=a[0]&&this.push({name:a[0].replace('"',""),id:a[1]})},b.labels)})},_init_user=function(){(angular.isUndefined(b.user)||angular.isUndefined(b.user.id))&&k.is_logged_in(a)},_init=function(){a.$routeParams=f;var d=1e4;a.drop_icon=!1,b.user.interact=!1,q=c(function(){_recordUserBehaviour()},d),a.searching=!1,_get_labels(),_initialize_filters(),_init_recommendations(),_add_listeners(),_init_analytics();var e=c(function(){_get_recommendations()},1e3);a.$on("destroy",function(){c.cancel(e)}),_bind_destroy(),_init_user(),_get_friends(),a.$emit("getNotifications")};var n="",o="",p="",q="";_init()}]);;websiteApp.controller("searchController",["$scope","$rootScope","websiteService","$timeout","$sce","recommendationService","$routeParams","$location","SearchUIConstants","WebsiteUIConstants","$cookieStore",function(a,b,c,d,e,f,g,h,i,j,k){a.update_filters=function(b,c){var d={type:b,custom_option:!0};switch(b){case i.Genre:var e={icon2:"icon-shapes"};break;case i.AuthorSearch:var e={icon2:"icon-pen",id:c};break;case i.Time:var e={icon2:"icon-clock"};break;case i.Year:var e={icon2:"icon-calendar"};break;case i.Country:var e={icon2:"icon-earth"}}d=angular.extend(d,e),angular.isUndefined(a.filters_added)&&(a.filters_added=[]),a.add_filters(d)},a.stop_horizontal_scroll=function(a){a.stopPropagation()},a.is_active_nest=function(b){var c=!1;return a.active_nest==b.name&&(c=!0),c},a.search_custom=function(b){if(a.custom_search==i.Genre){var d=b.keyCode==j.Enter;if(d)a.handle_selection_option(a.search_tag.currentItem,b);else{var e=b.keyCode==j.Backspace||j.Delete;if(e)var f=a.search_tag.custom_input;else var f=a.search_tag.custom_input+String.fromCharCode(b.keyCode);var g="q="+f+"&count=10";a.search_display=i.SearchingGenres,a.search_results=[],c.search_genres(g).then(function(b){b.length>0?(a.search_results=[],delete a.search_display,angular.forEach(b,function(a){var b={name:a[0],id:a[1],icon2:"icon-shapes",custom_option:!0,type:i.Genre};this.push(b)},a.search_results)):a.search_display=i.NoResultsFound})}}else if(a.custom_search==i.AuthorSearch){var d=b.keyCode==j.Enter;if(d)a.handle_selection_option(a.search_tag.currentItem,b);else{var e=b.keyCode==j.Backspace||j.Delete;if(e)var f=a.search_tag.custom_input;else var f=a.search_tag.custom_input+String.fromCharCode(b.keyCode);a.search_display=i.SearchingAuthor,a.search_results=[],c.search_authors(f).then(function(b){b.length>0?(a.search_results=[],delete a.search_display,angular.forEach(b,function(a){var b={name:a[0],id:a[1],icon2:"icon-pen",custom_option:!0,type:i.AuthorSearch};this.push(b)},a.search_results)):a.search_display=i.NoResultsFound})}}},a.reset_secondary_input_focus=function(){var b=d(function(){a.website.searching_custom=!1},200);a.$on("destroy",function(){d.cancel(b)})},a.select_next_option=function(c){if(a.active_base==i.BookSearch){var d=!1,e=!1;if(angular.forEach(a.base_book_options,function(b){d?(a.handle_selection_option(b,event),e=!0,d=!1):b.type!=c||e||(d=!0)}),m)e||h.path("/user/"+b.user.id+"/recommendations/books");else if(!e){var f=a.base_book_options[0];a.handle_selection_option(f,event)}}},a.handle_selection_option=function(e,g){if(e.level1_option){if(a.active_base==i.BookSearch)switch(a.show_compressed_base=!0,a.active_nest=e.name,a.search_results=[],a.hide_input_field=!0,a.show_secondary_input=!1,delete a.search_tag.custom_input,e.type){case i.Year:if(b.time_groups){a.search_results=[];var h=d(function(){a.search_results=b.time_groups},200);a.$on("destroy",function(){d.cancel(h)})}else f.get_time_groups().then(function(c){a.search_results=[],angular.forEach(c.times,function(a){var b=a[0].data,c=b.name,d={name:c,type:i.Year,label:b.range,icon2:"icon-calendar",custom_option:!0};this.push(d)},a.search_results),b.time_groups=a.search_results});break;case i.List:if(b.book_lists){a.search_results=[];var h=d(function(){a.search_results=b.book_lists},200);a.$on("destroy",function(){d.cancel(h)})}else f.get_book_lists().then(function(c){a.search_results=[],angular.forEach(c,function(a){var b={name:a[1],id:a[0],type:i.List,icon2:"icon-list",custom_option:!0};this.push(b)},a.search_results),b.book_lists=a.search_results});break;case i.Country:if(b.regions){a.search_results=[];var h=d(function(){a.search_results=b.regions},200);a.$on("destroy",function(){d.cancel(h)})}else f.get_countries().then(function(c){a.search_results=[],angular.forEach(c.countries,function(a){var b=angular.extend(a,{type:i.Country,icon2:"icon-earth",custom_option:!0});this.push(b)},a.search_results),b.regions=a.search_results});break;case i.Genre:if(a.search_tag.custom_input="",a.show_secondary_input=!0,a.custom_input_placeholder=i.GenrePlaceholder,a.custom_search=i.Genre,a.website.searching_custom=!0,angular.isDefined(b.genres)){a.search_results=[];var h=d(function(){a.search_results=b.genres},200);a.$on("destroy",function(){d.cancel(h)})}else{var j="q=''&count=10";c.search_genres(j).then(function(c){b.genres=[],angular.forEach(c,function(a){var b={name:a[0],id:a[1],icon2:"icon-shapes",custom_option:!0,type:i.Genre};this.push(b)},a.search_results),b.genres=a.search_results})}a.reset_secondary_input_focus();break;case i.AuthorSearch:if(a.search_tag.custom_input="",a.show_secondary_input=!0,a.custom_input_placeholder=i.AuthorPlaceholder,a.custom_search=i.AuthorSearch,a.website.searching_custom=!0,angular.isDefined(b.authors)){a.search_results=[];var h=d(function(){a.search_results=b.authors},200);a.$on("destroy",function(){d.cancel(h)})}else c.search_authors("").then(function(c){b.authors=[],angular.forEach(c,function(a){var b={name:a[0],id:a[1],icon2:"icon-pen",custom_option:!0,type:i.AuthorSearch};this.push(b)},a.search_results),b.authors=a.search_results});a.reset_secondary_input_focus();break;case i.Time:if(b.read_times){a.search_results=[];var h=d(function(){a.search_results=b.read_times},200)}else f.get_read_times().then(function(c){a.search_results=[],angular.forEach(c.read_times,function(a){var b=a[0].data,c=b.name,d=b.type,e={name:c,type:i.Time,icon2:"icon-clock",tag:d,custom_option:!0};this.push(e)},a.search_results),b.read_times=a.search_results});break;case i.Gender:a.search_results=[{name:i.MaleGender,icon:"icon-male"},{name:i.FemaleGender,icon:"icon-female"},{name:i.DontCareGender}];break;case i.Awards:break;case i.ComingSoon:a.coming_soon=!0}}else angular.isUndefined(a.filters_added)&&(a.filters_added=[]),a.filters_added.indexOf(e)<0&&a.add_filters(e);g.stopPropagation()},a.add_filters=function(c){var d=!0;if(d){switch(angular.forEach(a.filters_added,function(b){b.type==c.type&&(a.filters_added.splice(a.filters_added.indexOf(b),1),a.search_results.splice(0,0,b))}),m||angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),c.type){case i.Genre:var e=c.id;break;case i.AuthorSearch:var e=c.id;break;case i.Time:var e=c.tag;break;case i.Year:var e=c.name;break;case i.Country:var e=c.name;break;case i.BookSearch:if(m){var f=b.user.id;h.path(angular.isDefined(c.show_all)&&c.show_all?"/user/"+f+"/book/"+c.name+"/all/"+!0:"/user/"+f+"/book/"+c.name+"/author/"+c.author_name+"/id/"+c.id)}else{angular.isDefined(c.show_all)&&c.show_all?b.filters.other_filters.show_all=!0:(b.filters.other_filters.id=c.id,b.filters.other_filters.author_name=c.author_name),b.filters.other_filters.title=c.name;var g=!0}}m?k.put(c.type,c):(angular.isUndefined(g)&&(b.filters.other_filters[c.type]=e),b.filters.reset_count=0,b.filters.reset=!0,a.$emit("reloadRecommendations"))}angular.isUndefined(g)&&(a.filters_added.splice(0,0,c),a.search_results.splice(a.search_results.indexOf(c),1),a.select_next_option(c.type))},a._reset_filter=function(c){switch(c.type){case i.Time:angular.isDefined(b.read_times)&&b.read_times.splice(0,0,c);break;case i.Year:angular.isDefined(b.time_groups)&&b.time_groups.splice(0,0,c);break;case i.List:angular.isDefined(b.book_lists)&&b.book_lists.splice(0,0,c);break;case i.Genre:angular.isDefined(b.genres)&&b.genres.splice(0,0,c);break;case i.Country:angular.isDefined(b.regions)&&b.regions.splice(0,0,c)}m?k.remove(c.type):(delete b.filters.other_filters[c.type],a.$emit("reloadRecommendations"))},a.remove_filter=function(b,c){a._reset_filter(b),a.filters_added.splice(a.filters_added.indexOf(b),1),0==a.filters_added.length&&(a.handle_options(c),a.set_focus(200)),c.stopPropagation()},a.reset_filters=function(){angular.isDefined(a.filters_added)&&(angular.forEach(a.filters_added,function(b){a._reset_filter(b)}),a.filters_added=[])},a.set_base_search=function(){switch(a.active_base){case i.BookSearch:_init_book_search();break;case i.AuthorSearch:_init_author_search();break;case i.ReaderSearch:_init_reader_search()}},a.handle_base_selection=function(b){if(a.hide_input_field=!1,a.show_secondary_input=!1,a.reset_filters(),angular.isUndefined(b))a.set_base_search();else if(angular.isDefined(a.active_base)&&a.active_base==b.type)a.search_tag.placeholder=i.SearchPlaceholder,a.search_results=[],delete a.active_base;else{switch(b.name){case i.BookSearchLink:_init_book_search();break;case i.AuthorSearchLink:_init_author_search();break;case i.ReaderSearchLink:_init_reader_search()}a.active_base=b.type}a.website.searching=!0;d(function(){a.website.searching=!1},200);a.$on("destroy",function(){d.cancel(timeout_event)}),delete a.active_nest,delete a.search_tag.custom_input},a.is_active=function(b){var c=!1;return b.type==a.active_base&&(c=!0),c},a.is_current=function(b,c){return a.search_tag.current==b&&(a.search_tag.currentItem=c,c.show_all?a.search_tag.input=c.value:c.type==i.ComingSoon||c.level1_option||c.custom_option||(a.search_tag.input=c.name)),a.search_tag.current==b},a.set_current=function(b){a.search_tag.current=b},a.key_down=function(c){var d=c.keyCode==j.Backspace||c.keyCode==j.Delete,e=c.keyCode==j.KeyUp,f=c.keyCode==j.KeyDown,g=c.keyCode==j.KeyLeft,h=c.keyCode==j.KeyRight;if(e)angular.isUndefined(a.search_tag.current)?a.search_tag.current=0:a.set_current(0!=a.search_tag.current?a.search_tag.current-1:a.search_results.length-1);else if(f)angular.isUndefined(a.search_tag.current)?a.search_tag.current=0:a.set_current(a.search_tag.current!=a.search_results.length-1?a.search_tag.current+1:0);else if(d){var k=a.search_tag.input.trim(),l=angular.isDefined(a.search_tag.custom_input);delete a.search_display,delete a.search_tag.current,l?a.search_tag.custom_input.length>1?a.search_custom(c):a.custom_search==i.Genre?a.search_results=b.genres:a.custom_search==i.AuthorSearch&&(a.search_results=b.authors):k.length<=1?(a.search_tag.input="",a.search_results=[],a.search_ready=!1,a.set_base_search(),angular.isUndefined(a.active_base)&&(a.search_type=i.All),m||(delete b.filters.other_filters.title,delete b.filters.other_filters.show_all,delete b.filters.other_filters.author_name,delete b.filters.other_filters.id,a.$emit("reloadRecommendations"))):a.get_search_results(c)}else(g||h)&&c.stopPropagation()},a.close_login_box=function(){a.show_login_form=!1},a.highlight=function(a,b){var c="<span><i><b>$&</b></i></span>";return e.trustAsHtml(b.replace(new RegExp(a,"gi"),c))},_init_graph_search=function(){a.base_search_options=[{name:i.BookSearchLink,icon:"icon-book",type:i.BookSearch},{name:i.AuthorSearchLink,icon:"icon-pen",type:i.AuthorSearch},{name:i.ReaderSearchLink,icon:"icon-users",type:i.ReaderSearch}]},_init_book_search=function(){a.base_book_options=[{name:i.BookByGenreLink,level1_option:!0,type:i.Genre,icon:"icon-shapes",icon2:"icon-book"},{name:i.BookByAuthorLink,level1_option:!0,type:i.AuthorSearch,icon:"icon-pen",icon2:"icon-book"},{name:i.BookByReadingTimeLink,level1_option:!0,type:i.Time,icon:"icon-clock",icon2:"icon-book"},{name:i.BookByYearLink,level1_option:!0,type:i.Year,icon:"icon-calendar",icon2:"icon-book"},{name:i.BookByRegionLink,level1_option:!0,type:i.Country,icon:"icon-earth",icon2:"icon-book"}],a.search_results=a.base_book_options,a.search_tag.placeholder=i.BookSearchPlaceholder},_init_author_search=function(){a.search_results=[{name:i.ComingSoon,level1_option:!0,type:i.ComingSoon,icon2:"icon-pen"}],a.search_tag.placeholder=i.AuthorSearchPlaceholder},_init_reader_search=function(){a.search_results=[{name:i.ComingSoon,level1_option:!0,type:i.ComingSoon,icon2:"icon-user22"}],a.search_tag.placeholder=i.ReaderSearchPlaceholder},_handle_search_input=function(){var b=a.search_tag.input.trim();if(_init_graph_search(),a.search_ready=!0,angular.isUndefined(a.active_base)){var e=b.slice(0,1),f=e==i.Hash,g=e==i.AtTheRate,h=e==i.Plus,j=g||f||h;b.length>0&&_set_custom_search(g,f,h)}else b.length>0&&_set_custom_search();j&&(1==b.length&&(a.search_ready=!1),b=b.substring(1,b.length)),a.search_ready&&""!=b?c.search(b,a.search_type,a.search_tag.result_count).then(function(b){if(a.search_ready){var c=b.results.data;if(angular.forEach(c,function(a){var b={name:a[0],author_name:a[1],id:a[2],type:i.BookSearch};this.push(b)},a.search_results),0!=a.search_results.length){var e={name:"<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+a.search_tag.input+"</em>'</span>",show_all:!0,value:a.search_tag.input};a.search_results.push(e),delete a.search_display}else a.search_display=i.NoResultsFound;a.search_initiated=!1}d.cancel(l)}):(a.search_initiated=!1,_init_graph_search(),d.cancel(l))},_set_custom_search=function(b,c,d){a.search_results=[],angular.isUndefined(b)&&(a.active_base==i.AuthorSearch?b=!0:a.active_base==i.BookSearch&&(c=!0)),b?(a.search_type=i.AuthorSearch+", "+i.ReaderSearch,a.search_display=i.SearchingAuthorsAndReaders):c?(a.search_type=i.BookSearch,a.search_display=i.SearchingBooks):d?(a.search_type=i.TagSearch,a.search_display=i.SearchingTags):(a.search_type=i.SearchAll,a.search_display=i.SearchingWebsite)},a.get_search_results=function(b){if(a.search_initiated)_init_graph_search(),d.cancel(l),l=d(function(){_handle_search_input(b)},500);else{var c=b.keyCode==j.Enter;if(c)a.handle_selection_option(a.search_tag.currentItem,b);else{_init_graph_search();var e=String.fromCharCode(b.keyCode),f=a.search_tag.input.trim();if(f&&f.length>1){0==f.indexOf(i.Hash),0==f.indexOf(i.AtTheRate),0==f.indexOf(i.Plus)}else{e==i.Hash,e==i.AtTheRate,e==i.Plus}a.search_initiated=!0,l=d(function(){_handle_search_input(b)},500)}}},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},a.handle_options=function(c){g.type&&(b.hide_options&&((angular.isUndefined(a.search_tag.input)||0==a.search_tag.input.length)&&(a.hide_input_field=!1,_init_book_search()),a.show_secondary_input=!1,b.hide_options=!1,delete a.active_nest,delete a.active_base,delete a.search_tag.custom_input,a.active_base=i.BookSearch),c.stopPropagation())},a.reset_search_bar=function(c){b.hide_options=!0,a.hide_input_field=!1,c.stopPropagation()},_handle_search_page=function(){a.search_initiated=!1,a.search_type=i.All,a.show_login_form=!0,a.search_tag={},a.search_tag.search_placeholder=i.SearchPlaceholder;var d=angular.isDefined(b.filters)&&angular.isDefined(b.filters.other_filters)&&angular.isDefined(b.filters.other_filters.title);a.search_tag.input=d?b.filters.other_filters.title:"",a.search_tag.result_count=100,c.get_background_image().then(function(b){a.search_style={"background-image":'url("'+b.url+'")'}}),_init_graph_search(),b.hide_options=g.type?!0:!1},_get_trends=function(){angular.isUndefined(a.$routeParams)&&angular.isUndefined(a.trends)&&(a.trends=[],c.get_trending_topics().then(function(b){angular.forEach(b,function(a){var b={name:a[0],id:a[1]};this.push(b)},a.trends)}))},a.set_focus=function(b){var c=d(function(){a.website.searching=!0;d(function(){a.website.searching=!1},200)},b);a.$on("destroy",function(){d.cancel(c),d.cancel(reset_focus_param_timeout)})},_add_init_filters=function(){if(!m){switch(angular.isUndefined(a.filters_added)&&(a.filters_added=[]),!0){case angular.isDefined(k.get(i.Genre)):var c=k.get(i.Genre);b.filters.other_filters[i.Genre]=c.id,a.filters_added.push(c),k.remove(i.Genre);case angular.isDefined(k.get(i.AuthorSearch)):var c=k.get(i.AuthorSearch);b.filters.other_filters[i.AuthorSearch]=c.id,a.filters_added.push(c),k.remove(i.AuthorSearch);case angular.isDefined(k.get(i.Time)):var c=k.get(i.Time);b.filters.other_filters[i.Time]=c.tag,a.filters_added.push(c),k.remove(i.Time);case angular.isDefined(k.get(i.Year)):var c=k.get(i.Year);b.filters.other_filters[i.Year]=c.name,a.filters_added.push(c),k.remove(i.Year);case angular.isDefined(k.get(i.Country)):var c=k.get(i.Country);b.filters.other_filters[i.Country]=c,a.filters_added.push(c),k.remove(i.Country)}a.filters_added.length>0&&a.$emit("reloadRecommendations")}},_init=function(){a.website.searching=!1,m&&a.set_focus(3e3),_handle_search_page(),_init_book_search(),a.active_base=i.BookSearch,_get_trends(),a.$on("updateFilters",function(b,c,d){a.update_filters(c,d),b.preventDefault()}),_add_init_filters()};var l="",m=angular.isUndefined(g.type);_init()}]);;websiteApp.controller("timelineController",["$scope","$rootScope","$timeout","recommendationService","$route","$routeParams","$interval",function(){}]);;websiteApp.controller("loginController",["$scope","$rootScope","websiteService","Facebook","stropheService","$timeout","$cookieStore","LoginConstants",function(a,b,c,d,e,f,g,h){a.submit=function(b){var c=13==b.keyCode;c&&a.authenticate(!0)},a.authenticate=function(d){var g=b.user.email,i=b.user.password,j=new RegExp("^.{8,}$"),k=new RegExp("^(.)\\1{7,16}$"),l=new RegExp("^.{100,}$");a.error_message="";var m={email:g,password:i,old_user:d};a.loading_icon=!1;var n=function(c){a.error_message=c.message,b.user.profile_status=c.profile_status,b.user.logged=!0,b.user.id=c.user_id,a.loading_icon=!1;var d="INFO- Welcome back ",e=notify(b,d,f);a.$on("destroy",function(){f.cancel(e)}),_is_logged_in()},o=function(c){a.loading_icon=!1,a.error_message=c.data.message,b.user.password=null};b.user.email?b.user.password?j.test(b.user.password)||d?k.test(b.user.password)&&!d?a.error_message=h.ChooseAMoreSecurePassword:l.test(b.user.password)&&!d?a.error_message=h.MaximumPasswordLengthError:(a.loading_icon=!0,c.authenticate(m).then(n,o),e.start_connection()):a.error_message=h.PasswordLengthError:a.error_message=h.PasswordNotPresent:a.error_message=h.EmailNotPresent},_bind_auth_listeners=function(){a.$on("event:google-plus-signin-success",function(){}),a.$on("event:google-plus-signin-failure",function(){}),a.$on("Facebook:statusChange",function(b,c){c.status==h.FacebookLoginStatusCheck&&a.$apply(function(){})}),a.$watch(function(){return d.isReady()},function(b){b&&(a.facebookReady=!0)})},a.intent_login=function(){d.getLoginStatus(function(c){c.status==h.FacebookLoginStatusCheck?(b.logged=!0,a.me()):a.login()})},a.login=function(){d.login(function(c){c.status==h.FacebookLoginStatusCheck&&(b.logged=!0,a.me())})},a.me=function(){d.api("/me",function(d){c.handle_facebook_user(d),a.$apply(function(){b.user=d,b.user.profile_status=0,b.user.thumb=d.thumb,b.user.logged=!0})})},a.logout=function(){d.logout(function(){a.$apply(function(){b.user={},b.logged=!1})})},_is_logged_in=function(){c.get_user().then(function(a){a.logged_in&&(b.user.logged=!0,b.user.id=a.id,c.get_user_details().then(function(a){angular.extend(b.user,a)}),g.put("logged",!0),e.start_connection())})},(_init=function(){g.remove("tab"),_is_logged_in(),_bind_auth_listeners()})()}]);;websiteApp.controller("websiteAppController",["$scope","$rootScope","$timeout","websiteService","$document","scroller","$window","WebsiteUIConstants",function(a,b,c,d,e,f,g,h){a.bindHorizontalScroll=function(b,c){b.preventDefault(),c>0?a.move_left(b):a.move_right(b),b.stopPropagation()},_hide_popups=function(){b.user.collapsed_column=!0,delete b.focused_book,delete b.ticker_popup},a.move_left=function(b){_hide_popups();var d=2e3,e=(document.body.scrollWidth,g.pageXOffset),h=.35*screen.width;if(angular.isDefined(b))if("click"==b.type){a.delta_x=angular.isDefined(a.delta_x)?a.delta_x+h:h;var i=c(function(){f.scrollTo(e-a.delta_x,0,d),delete a.delta_x,c.cancel(i)},400)}else f.scrollTo(e-h,0,d);else f.scrollTo(e-h,0,d)},a.move_right=function(d){_hide_popups();var e=2e3,h=document.body.scrollWidth,i=g.pageXOffset,j=.35*screen.width,k=i+2.5*screen.width>h;if(k&&(b.loading||(b.loading=!0,b.$broadcast("loadRecommendations"))),angular.isDefined(d))if("click"==d.type){a.delta_x=angular.isDefined(a.delta_x)?a.delta_x+j:j;var l=c(function(){f.scrollTo(i+a.delta_x,0,e),delete a.delta_x,c.cancel(l)},400)}else f.scrollTo(i+j,0,e);else f.scrollTo(i+j,0,e)},a.scroll_one_page_right=function(a){var c=document.body.scrollWidth;if(a)var d=a.pageX-screen.width/2,e=a.pageX+screen.width>c;else{var d=g.pageXOffset;-screen.width/2;var e=g.pageXOffset;+screen.width>c}e&&b.$broadcast("loadRecommendations");var h=screen.width;f.scrollTo(d+h,0,2e3)},a.scroll_one_page_left=function(a){if(a)var b=a.pageX-screen.width/2;else var b=g.pageXOffset-screen.width/2;var c=screen.width;f.scrollTo(b-c,0,2e3)},a.showFeebackForm=function(){},a.show_uploader=function(){a.uploader=!0},_bind_feedback_form=function(){g.onmouseleave=function(){}},_load_recommendations=function(){var a=document.body.scrollWidth,c=event.pageX+screen.width>a;c&&b.$broadcast("loadRecommendations")},_get_book_details=function(c){filter="id="+c,d.get_book_details(filter).then(function(c){a.detailed_book.book=c,b.show_book=!0})},_bind_emit=function(){show_book_event=a.$on("expandBook",function(a,c,d,e,f){b.book_x=d,b.screen_x=e,b.total_x=f,_get_book_details(c),a.stopPropagation()})},_add_listeners=function(){j=a.$on("moveRight",function(){i=c(function(){a.move_right()},1e3)}),add_to_notifications=a.$on("addToNotifications",function(b,c){angular.isUndefined(a.notifications)&&_intro_notifications(),a.notifications.push(c),b.stopPropagation()}),get_notifications_event=a.$on("getNotifications",function(){if(angular.isDefined(a.notifications))var b=a.notifications.length;else var b=0;d.get_notifications(b).then(function(b){_intro_notifications(),a.notifications=b.notifications.concat(a.notifications)})}),k=a.$on("getLatestNotification",function(){d.get_latest_notification().then(function(b){a.notifications.push(b.notification)})})},_intro_notifications=function(){angular.isUndefined(a.notifications)&&(a.notifications=[])},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},_initiate_loading_page=function(){a.loading=!0,a.drop_icon=!1,a.show_login_form=!1,c(function(){a.loading=!1},3e3),c(function(){a.drop_icon=!0},1e3)},a.toggle_notifications=function(){a.show_notifications?(a.show_notifications=!1,a.notifications_seen=!0):a.show_notifications=!0},a.handle_keyboard_bindings=function(b){b.keyCode==h.KeyRight?(b.preventDefault(),a.move_right(b)):b.keyCode==h.KeyLeft&&(b.preventDefault(),a.move_left(b)),b.stopPropagation()},a.search=function(){var c=event.currentTarget==event.srcElement&&!b.show_book;c&&($("body").css("white-space","normal"),a.website.searching=!0,b.keyCode=event.keyCode)},_handle_socket_error=function(){},_init_notifications=function(){b.notification_active=!1},_init=function(){_initiate_loading_page(),a.more_filters=[],a.show_notifications=!0,a.notifications_seen=!1,angular.isDefined(b.focused_book)&&(b.focused_book.level2_option=""),a.website={},a.website.searching=!1,a.website.show_search_page=!0,_bind_emit(),_bind_feedback_form(),_add_listeners(),_handle_socket_error(),_init_notifications(),b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1};var d=c(function(){b.user.collapsed_column=!0},6e3);a.$on("destroy",function(){c.cancel(d)}),_detect_browser()},_detect_browser=function(){var a,b,c,d=(navigator.appVersion,navigator.userAgent),e=navigator.appName,f=""+parseFloat(navigator.appVersion),g=parseInt(navigator.appVersion,10),i=h.BrowserIncompatible;-1!=(b=d.indexOf("Opera"))?(alert(i),e="Opera",f=d.substring(b+6),-1!=(b=d.indexOf("Version"))&&(f=d.substring(b+8))):-1!=(b=d.indexOf("MSIE"))?(alert(i),e="Microsoft Internet Explorer",f=d.substring(b+5)):-1!=(b=d.indexOf("Chrome"))?(e="Chrome",f=d.substring(b+7)):-1!=(b=d.indexOf("Safari"))?(alert(i),e="Safari",f=d.substring(b+7),-1!=(b=d.indexOf("Version"))&&(f=d.substring(b+8))):-1!=(b=d.indexOf("Firefox"))?(alert(i),e="Firefox",f=d.substring(b+8)):(a=d.lastIndexOf(" ")+1)<(b=d.lastIndexOf("/"))&&(alert(i),e=d.substring(a,b),f=d.substring(b+1),e.toLowerCase()==e.toUpperCase()&&(e=navigator.appName)),-1!=(c=f.indexOf(";"))&&(f=f.substring(0,c)),-1!=(c=f.indexOf(" "))&&(f=f.substring(0,c)),g=parseInt(""+f,10),isNaN(g)&&(f=""+parseFloat(navigator.appVersion),g=parseInt(navigator.appVersion,10))};var i="",j="",k="";_init()}]);