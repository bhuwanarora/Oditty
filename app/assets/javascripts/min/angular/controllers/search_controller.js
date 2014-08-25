websiteApp.controller("searchController",["$scope","$rootScope","websiteService","$timeout","$sce","recommendationService","$routeParams","$location","SearchUIConstants","WebsiteUIConstants","$cookieStore",function(a,b,c,d,e,f,g,h,i,j,k){a.update_filters=function(b,c){var d={type:b,custom_option:!0};switch(b){case i.Genre:var e={icon2:"icon-shapes"};break;case i.AuthorSearch:var e={icon2:"icon-pen",id:c};break;case i.Time:var e={icon2:"icon-clock"};break;case i.Year:var e={icon2:"icon-calendar"};break;case i.Country:var e={icon2:"icon-earth"}}d=angular.extend(d,e),angular.isUndefined(a.filters_added)&&(a.filters_added=[]),a.add_filters(d)},a.stop_horizontal_scroll=function(a){a.stopPropagation()},a.is_active_nest=function(b){var c=!1;return a.active_nest==b.name&&(c=!0),c},a.search_custom=function(b){if(a.custom_search==i.Genre){var d=b.keyCode==j.Enter;if(d)a.handle_selection_option(a.search_tag.currentItem,b);else{var e=b.keyCode==j.Backspace||j.Delete;if(e)var f=a.search_tag.custom_input;else var f=a.search_tag.custom_input+String.fromCharCode(b.keyCode);var g="q="+f+"&count=10";a.search_display=i.SearchingGenres,a.search_results=[],c.search_genres(g).then(function(b){b.length>0?(a.search_results=[],delete a.search_display,angular.forEach(b,function(a){var b={name:a[0],id:a[1],icon2:"icon-shapes",custom_option:!0,type:i.Genre};this.push(b)},a.search_results)):a.search_display=i.NoResultsFound})}}else if(a.custom_search==i.AuthorSearch){var d=b.keyCode==j.Enter;if(d)a.handle_selection_option(a.search_tag.currentItem,b);else{var e=b.keyCode==j.Backspace||j.Delete;if(e)var f=a.search_tag.custom_input;else var f=a.search_tag.custom_input+String.fromCharCode(b.keyCode);a.search_display=i.SearchingAuthor,a.search_results=[],c.search_authors(f).then(function(b){b.length>0?(a.search_results=[],delete a.search_display,angular.forEach(b,function(a){var b={name:a[0],id:a[1],icon2:"icon-pen",custom_option:!0,type:i.AuthorSearch};this.push(b)},a.search_results)):a.search_display=i.NoResultsFound})}}},a.filter_by=function(b){var c=!1;return a.show_secondary_input?a.search_tag.custom_input.indexOf(b)>0&&(c=!0):a.search_tag.input.indexOf(b)>0&&(c=!0),c},a.reset_secondary_input_focus=function(){var b=d(function(){a.website.searching_custom=!1},200);a.$on("destroy",function(){d.cancel(b)})},a.select_next_option=function(b){if(a.active_base==i.BookSearch){var c=!1,d=!1,e=[];if(angular.forEach(a.filters_added,function(a){e.push(a.type)},e),angular.forEach(a.base_book_options,function(f){filter_already_selected=!1,c&&e.indexOf(f.type)<0?(m&&a.base_book_options.length==a.filters_added.length&&a.show_books(),a.handle_selection_option(f,event),d=!0,c=!1):f.type!=b||d||(c=!0)}),m){if(!d){var f=a.base_book_options.length>a.filters_added.length;if(f){var g="";angular.forEach(a.base_book_options,function(a){e.indexOf(a.type)<0&&""==g&&(g=a)}),a.handle_selection_option(g,event)}else a.show_books()}}else if(!d){var h=a.base_book_options[0];a.handle_selection_option(h,event)}}},a.show_books=function(){h.path("/user/"+b.user.id+"/recommendations/books")},a.handle_selection_option=function(e,g){if(e.level1_option){if(a.active_base==i.BookSearch){switch(a.show_compressed_base=!0,a.active_nest=e.name,a.search_results=[],a.hide_input_field=!0,a.show_secondary_input=!0,a.search_tag.custom_input="",a.website.searching_custom=!0,delete a.custom_search,e.type){case i.Year:if(a.custom_input_placeholder=i.YearPlaceholder,b.time_groups){a.search_results=[];var h=d(function(){a.search_results=b.time_groups},200);a.$on("destroy",function(){d.cancel(h)})}else f.get_time_groups().then(function(c){a.search_results=[],angular.forEach(c.times,function(a){var b=a[0].data,c=b.name,d={name:c,type:i.Year,label:b.range,icon2:"icon-calendar",custom_option:!0};this.push(d)},a.search_results),b.time_groups=a.search_results});break;case i.List:if(b.book_lists){a.search_results=[];var h=d(function(){a.search_results=b.book_lists},200);a.$on("destroy",function(){d.cancel(h)})}else f.get_book_lists().then(function(c){a.search_results=[],angular.forEach(c,function(a){var b={name:a[1],id:a[0],type:i.List,icon2:"icon-list",custom_option:!0};this.push(b)},a.search_results),b.book_lists=a.search_results});break;case i.Country:if(a.custom_input_placeholder=i.CountryPlaceholder,b.regions){a.search_results=[];var h=d(function(){a.search_results=b.regions},200);a.$on("destroy",function(){d.cancel(h)})}else f.get_countries().then(function(c){a.search_results=[],angular.forEach(c.countries,function(a){var b=angular.extend(a,{type:i.Country,icon2:"icon-earth",custom_option:!0});this.push(b)},a.search_results),b.regions=a.search_results});break;case i.Genre:if(a.custom_input_placeholder=i.GenrePlaceholder,a.custom_search=i.Genre,angular.isDefined(b.genres)){a.search_results=[];var h=d(function(){a.search_results=b.genres},200);a.$on("destroy",function(){d.cancel(h)})}else{var j="q=''&count=10";c.search_genres(j).then(function(c){b.genres=[],angular.forEach(c,function(a){var b={name:a[0],id:a[1],icon2:"icon-shapes",custom_option:!0,type:i.Genre};this.push(b)},a.search_results),b.genres=a.search_results})}break;case i.AuthorSearch:if(a.custom_input_placeholder=i.AuthorPlaceholder,a.custom_search=i.AuthorSearch,angular.isDefined(b.authors)){a.search_results=[];var h=d(function(){a.search_results=b.authors},200);a.$on("destroy",function(){d.cancel(h)})}else c.search_authors("").then(function(c){b.authors=[],angular.forEach(c,function(a){var b={name:a[0],id:a[1],icon2:"icon-pen",custom_option:!0,type:i.AuthorSearch};this.push(b)},a.search_results),b.authors=a.search_results});break;case i.Time:if(a.custom_input_placeholder=i.TimePlaceholder,b.read_times){a.search_results=[];var h=d(function(){a.search_results=b.read_times},200)}else f.get_read_times().then(function(c){a.search_results=[],angular.forEach(c.read_times,function(a){var b=a[0].data,c=b.name,d=b.type,e={name:c,type:i.Time,icon2:"icon-clock",tag:d,custom_option:!0};this.push(e)},a.search_results),b.read_times=a.search_results});break;case i.Gender:a.search_results=[{name:i.MaleGender,icon:"icon-male"},{name:i.FemaleGender,icon:"icon-female"},{name:i.DontCareGender}];break;case i.Awards:break;case i.ComingSoon:a.coming_soon=!0}a.reset_secondary_input_focus()}}else angular.isUndefined(a.filters_added)&&(a.filters_added=[]),a.filters_added.indexOf(e)<0&&a.add_filters(e);g.stopPropagation()},a.add_filters=function(c){switch(angular.forEach(a.filters_added,function(b){b.type==c.type&&(a.filters_added.splice(a.filters_added.indexOf(b),1),a.search_results.splice(0,0,b))}),m||angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),c.type){case i.Genre:var d=c.id;break;case i.AuthorSearch:var d=c.id;break;case i.Time:var d=c.tag;break;case i.Year:var d=c.name;break;case i.Country:var d=c.name;break;case i.BookSearch:if(m){var e=b.user.id;h.path(angular.isDefined(c.show_all)&&c.show_all?"/user/"+e+"/book/"+c.name+"/all/"+!0:"/user/"+e+"/book/"+c.id)}else angular.isDefined(c.show_all)&&c.show_all?(b.filters.other_filters.show_all=!0,b.filters.other_filters.title=c.name):b.filters.other_filters.id=c.id,b.hide_options=!0}var f=!(c.type==i.BookSearch);m?k.put(c.type,c):p||o||n?(k.put(c.type,c),a.show_books()):(f&&(b.filters.other_filters[c.type]=d),b.filters.reset_count=0,b.filters.reset=!0,a.$emit("reloadRecommendations")),f&&(a.filters_added.splice(0,0,c),a.search_results.splice(a.search_results.indexOf(c),1),a.select_next_option(c.type))},a._reset_filter=function(c){switch(c.type){case i.Time:angular.isDefined(b.read_times)&&b.read_times.splice(0,0,c);break;case i.Year:angular.isDefined(b.time_groups)&&b.time_groups.splice(0,0,c);break;case i.List:angular.isDefined(b.book_lists)&&b.book_lists.splice(0,0,c);break;case i.AuthorSearch:angular.isDefined(b.authors)&&b.authors.splice(0,0,c);break;case i.Genre:angular.isDefined(b.genres)&&b.genres.splice(0,0,c);break;case i.Country:angular.isDefined(b.regions)&&b.regions.splice(0,0,c)}k.remove(c.type),m||(delete b.filters.other_filters[c.type],a.$emit("reloadRecommendations"))},a.remove_filter=function(b,c){a._reset_filter(b),a.filters_added.splice(a.filters_added.indexOf(b),1),0==a.filters_added.length&&(a.handle_options(c),a.set_focus(200)),angular.forEach(a.base_book_options,function(d){d.type==b.type&&a.handle_selection_option(d,c)}),c.stopPropagation()},a.reset_filters=function(){angular.isDefined(a.filters_added)&&(angular.forEach(a.filters_added,function(b){a._reset_filter(b)}),a.filters_added=[])},a.set_base_search=function(){switch(a.active_base){case i.BookSearch:_init_book_search();break;case i.AuthorSearch:_init_author_search();break;case i.ReaderSearch:_init_reader_search()}},a.handle_base_selection=function(b){if(a.hide_input_field=!1,a.show_secondary_input=!1,a.reset_filters(),angular.isUndefined(b))a.set_base_search();else if(angular.isDefined(a.active_base)&&a.active_base==b.type)a.search_tag.placeholder=i.SearchPlaceholder,a.search_results=[],delete a.active_base;else{switch(b.name){case i.BookSearchLink:_init_book_search();break;case i.AuthorSearchLink:_init_author_search();break;case i.ReaderSearchLink:_init_reader_search()}a.active_base=b.type}a.website.searching=!0;d(function(){a.website.searching=!1},200);a.$on("destroy",function(){d.cancel(timeout_event)}),delete a.active_nest,delete a.search_tag.custom_input},a.is_active=function(b){var c=!1;return b.type==a.active_base&&(c=!0),c},a.is_current=function(b,c){return a.search_tag.current==b&&(a.search_tag.currentItem=c,c.show_all?a.search_tag.input=c.value:c.type==i.ComingSoon||c.level1_option||c.custom_option||(a.search_tag.input=c.name)),a.search_tag.current==b},a.set_current=function(b){a.search_tag.current=b},a.key_down=function(c){var d=c.keyCode==j.Backspace||c.keyCode==j.Delete,e=c.keyCode==j.KeyUp,f=c.keyCode==j.KeyDown,g=c.keyCode==j.KeyLeft,h=c.keyCode==j.KeyRight;if(e)angular.isUndefined(a.search_tag.current)?a.search_tag.current=0:a.set_current(0!=a.search_tag.current?a.search_tag.current-1:a.search_results.length-1);else if(f)angular.isUndefined(a.search_tag.current)?a.search_tag.current=0:a.set_current(a.search_tag.current!=a.search_results.length-1?a.search_tag.current+1:0);else if(d){var k=a.search_tag.input.trim(),l=angular.isDefined(a.search_tag.custom_input);delete a.search_display,delete a.search_tag.current,l?a.search_tag.custom_input.length>1?a.search_custom(c):a.custom_search==i.Genre?a.search_results=b.genres:a.custom_search==i.AuthorSearch&&(a.search_results=b.authors):k.length<=1?(a.search_tag.input="",a.search_results=[],a.search_ready=!1,a.set_base_search(),angular.isUndefined(a.active_base)&&(a.search_type=i.All),m||(delete b.filters.other_filters.title,delete b.filters.other_filters.show_all,delete b.filters.other_filters.author_name,delete b.filters.other_filters.id,a.$emit("reloadRecommendations"))):a.get_search_results(c)}else(g||h)&&c.stopPropagation()},a.close_login_box=function(){a.show_login_form=!1},a.highlight=function(a,b){var c="<span><i><b>$&</b></i></span>";return e.trustAsHtml(b.replace(new RegExp(a,"gi"),c))},_init_graph_search=function(){a.base_search_options=[{name:i.BookSearchLink,icon:"icon-book",type:i.BookSearch},{name:i.AuthorSearchLink,icon:"icon-pen",type:i.AuthorSearch},{name:i.ReaderSearchLink,icon:"icon-users",type:i.ReaderSearch}]},_init_book_search=function(){a.base_book_options=[{name:i.BookByGenreLink,level1_option:!0,type:i.Genre,icon:"icon-shapes",icon2:"icon-book"},{name:i.BookByAuthorLink,level1_option:!0,type:i.AuthorSearch,icon:"icon-pen",icon2:"icon-book"},{name:i.BookByReadingTimeLink,level1_option:!0,type:i.Time,icon:"icon-clock",icon2:"icon-book"},{name:i.BookByYearLink,level1_option:!0,type:i.Year,icon:"icon-calendar",icon2:"icon-book"},{name:i.BookByRegionLink,level1_option:!0,type:i.Country,icon:"icon-earth",icon2:"icon-book"}],a.search_results=a.base_book_options,a.search_tag.placeholder=i.BookSearchPlaceholder},_init_author_search=function(){a.search_results=[{name:i.ComingSoon,level1_option:!0,type:i.ComingSoon,icon2:"icon-pen"}],a.search_tag.placeholder=i.AuthorSearchPlaceholder},_init_reader_search=function(){a.search_results=[{name:i.ComingSoon,level1_option:!0,type:i.ComingSoon,icon2:"icon-user22"}],a.search_tag.placeholder=i.ReaderSearchPlaceholder},_handle_search_input=function(){var b=a.search_tag.input.trim();if(_init_graph_search(),a.search_ready=!0,angular.isUndefined(a.active_base)){var e=b.slice(0,1),f=e==i.Hash,g=e==i.AtTheRate,h=e==i.Plus,j=g||f||h;b.length>0&&_set_custom_search(g,f,h)}else b.length>0&&_set_custom_search();j&&(1==b.length&&(a.search_ready=!1),b=b.substring(1,b.length)),a.search_ready&&""!=b?c.search(b,a.search_type,a.search_tag.result_count).then(function(b){if(a.search_ready){var c=b.results.data;if(angular.forEach(c,function(a){var b={name:a[0],author_name:a[1],id:a[2],type:i.BookSearch};this.push(b)},a.search_results),0!=a.search_results.length){var e={name:"<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+a.search_tag.input+"</em>'</span>",show_all:!0,value:a.search_tag.input};a.search_results.push(e),delete a.search_display}else a.search_display=i.NoResultsFound;a.search_initiated=!1}d.cancel(l)}):(a.search_initiated=!1,_init_graph_search(),d.cancel(l))},_set_custom_search=function(b,c,d){a.search_results=[],angular.isUndefined(b)&&(a.active_base==i.AuthorSearch?b=!0:a.active_base==i.BookSearch&&(c=!0)),b?(a.search_type=i.AuthorSearch+", "+i.ReaderSearch,a.search_display=i.SearchingAuthorsAndReaders):c?(a.search_type=i.BookSearch,a.search_display=i.SearchingBooks):d?(a.search_type=i.TagSearch,a.search_display=i.SearchingTags):(a.search_type=i.SearchAll,a.search_display=i.SearchingWebsite)},a.get_search_results=function(b){if(a.search_initiated)_init_graph_search(),d.cancel(l),l=d(function(){_handle_search_input(b)},500);else{var c=b.keyCode==j.Enter;if(c)a.handle_selection_option(a.search_tag.currentItem,b);else{_init_graph_search();var e=String.fromCharCode(b.keyCode),f=a.search_tag.input.trim();if(f&&f.length>1){0==f.indexOf(i.Hash),0==f.indexOf(i.AtTheRate),0==f.indexOf(i.Plus)}else{e==i.Hash,e==i.AtTheRate,e==i.Plus}a.search_initiated=!0,l=d(function(){_handle_search_input(b)},500)}}},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},a.handle_options=function(c){g.type&&(b.hide_options&&((angular.isUndefined(a.search_tag.input)||0==a.search_tag.input.length)&&(a.hide_input_field=!1,_init_book_search()),a.show_secondary_input=!1,b.hide_options=!1,delete a.active_nest,delete a.active_base,delete a.search_tag.custom_input,a.active_base=i.BookSearch),c.stopPropagation())},a.reset_search_bar=function(c){b.hide_options=!0,a.hide_input_field=!1,c.stopPropagation()},_handle_search_page=function(){a.search_initiated=!1,a.search_type=i.All,a.show_login_form=!0,a.search_tag={},a.search_tag.search_placeholder=i.SearchPlaceholder;var d=angular.isDefined(b.filters)&&angular.isDefined(b.filters.other_filters)&&angular.isDefined(b.filters.other_filters.title);a.search_tag.input=d?b.filters.other_filters.title:"",a.search_tag.result_count=100,c.get_background_image().then(function(b){a.search_style={"background-image":'url("'+b.url+'")'}}),_init_graph_search(),b.hide_options=g.type?!0:!1},_get_trends=function(){m?(a.trends=[],c.get_trending_topics().then(function(b){angular.forEach(b,function(a){var b={name:a[0],id:a[1],thumb:a[6],keywords:a[8]};this.push(b)},a.trends)})):c.get_trending_topics().then(function(b){var c=[];angular.forEach(b,function(a){var b={name:a[0],id:a[1],message:a[2],url:a[3],title:a[4],thumb:a[7],large_image:a[5],keywords:a[8]};this.push(b)},c),a.$emit("addToNotifications",c)})},a.set_focus=function(b){var c=d(function(){a.website.searching=!0;d(function(){a.website.searching=!1},200)},b);a.$on("destroy",function(){d.cancel(c),d.cancel(reset_focus_param_timeout)})},_add_init_filters=function(){if(angular.isUndefined(a.filters_added)&&(a.filters_added=[]),angular.isDefined(k.get(i.Genre))){var c=k.get(i.Genre);m||(b.filters.other_filters[i.Genre]=c.id),a.filters_added.push(c)}if(angular.isDefined(k.get(i.AuthorSearch))){var c=k.get(i.AuthorSearch);m||(b.filters.other_filters[i.AuthorSearch]=c.id),a.filters_added.push(c)}if(angular.isDefined(k.get(i.Time))){var c=k.get(i.Time);m||(b.filters.other_filters[i.Time]=c.tag),a.filters_added.push(c)}if(angular.isDefined(k.get(i.Year))){var c=k.get(i.Year);m||(b.filters.other_filters[i.Year]=c.name),a.filters_added.push(c)}if(angular.isDefined(k.get(i.Country))){var c=k.get(i.Country);m||(b.filters.other_filters[i.Country]=c.name),a.filters_added.push(c)}!m&&a.filters_added.length>0&&a.$emit("reloadRecommendations")},_clear_filter_cookies=function(){k.remove(i.Genre),k.remove(i.AuthorSearch),k.remove(i.Time),k.remove(i.Year),k.remove(i.Country)},_init=function(){a.website.searching=!1,a.filters_added=[],m&&a.set_focus(3e3),_handle_search_page(),_init_book_search(),a.active_base=i.BookSearch,_get_trends(),a.$on("updateFilters",function(b,c,d){a.update_filters(c,d),b.preventDefault()}),q||m?_add_init_filters():_clear_filter_cookies()};var l="",m=angular.isUndefined(g.type),n=angular.isDefined(g.filter_id),o=angular.isDefined(g.grid_id),p=angular.isDefined(g.trend_id),q=!(m||n||o||p);_init()}]);