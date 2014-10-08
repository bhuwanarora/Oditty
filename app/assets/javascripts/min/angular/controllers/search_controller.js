websiteApp.controller("searchController",["$scope","$rootScope","websiteService","$timeout","$sce","recommendationService","$routeParams","$location","SearchUIConstants","WebsiteUIConstants","$cookieStore",function(a,b,c,d,e,f,g,h,i,j,k){a._update_filters=function(b,c){var d=a._get_option_json(b,c);b==i.AuthorSearch&&(d=angular.extend(c,d)),angular.isUndefined(a.filters_added)&&(a.filters_added=[]),a.add_filters(d)},a._get_option_json=function(a){var b={type:a,custom_option:!0};switch(a){case i.Genre:var c={icon2:"icon-tag"};break;case i.AuthorSearch:var c={icon2:"icon-pen"};break;case i.Time:var c={icon2:"icon-clock"};break;case i.Year:var c={icon2:"icon-calendar"};break;case i.Country:var c={icon2:"icon-earth"}}return b=angular.extend(b,c)},a.stop_horizontal_scroll=function(a){a.stopPropagation()},a.is_active_nest=function(b){var c=!1;return a.active_nest==b.name&&(c=!0),c},a.search_custom=function(b){a.shift_search_to_top();var c=a._detect_key(b);if(c.keyEnter)a.handle_selection_option(a.search_tag.currentItem,b);else{if(c.backspace_or_delete)var d=a.search_tag.custom_input;else var d=a.search_tag.custom_input+String.fromCharCode(b.keyCode);a.search_results=[],a.custom_search==i.Genre?a._search_genres(d):a.custom_search==i.AuthorSearch&&a._search_authors(d)}},a.hide_popups=function(a){b.popups={},a.stopPropagation()},a._reset_results=function(){a.search_results=[],delete a.search_display},a._search_genres=function(b){var d="q="+b+"&count=10";a.search_display=i.SearchingGenres,a._reset_results(),c.search_genres(d).then(function(b){b.length>0?angular.forEach(b,function(b){var c=a._get_option_json(i.Genre);c=angular.extend(c,{name:b[0],id:b[1]}),this.push(c)},a.search_results):a.search_display=i.NoResultsFound})},a._search_authors=function(b){a.search_display=i.SearchingAuthor,a._reset_results(),c.search_authors("q="+b).then(function(b){b.length>0?(a.search_results=[],delete a.search_display,angular.forEach(b,function(b){var c=a._get_option_json(i.AuthorSearch);c=angular.extend(c,{name:b[0],id:b[1]}),this.push(c)},a.search_results)):a.search_display=i.NoResultsFound})},a.reset_secondary_input_focus=function(){var b=d(function(){a.website.searching_custom=!1},200);a.$on("destroy",function(){d.cancel(b)})},a._find_next_option=function(b,c){var d=!1,e=!1;return angular.forEach(a.base_book_options,function(f){filter_already_selected=!1,d&&b.indexOf(f.type)<0?(m&&a.base_book_options.length==a.filters_added.length&&a.show_books(),a.handle_selection_option(f,event),e=!0,d=!1):f.type!=c||e||(d=!0)}),e},a._handle_next_link_not_executed=function(b,c){var d=a.base_book_options.length>a.filters_added.length;if(d){var e="";angular.forEach(a.base_book_options,function(a){b.indexOf(a.type)<0&&""==e&&(e=a)}),a.handle_selection_option(e,c)}else a.show_books()},a.select_next_option=function(b){if(a.active_base==i.BookSearch){var c=[];angular.forEach(a.filters_added,function(a){c.push(a.type)},c);var d=a._find_next_option(c,b);if(m)d||a._handle_next_link_not_executed(c,event);else if(!d){var e=a.base_book_options[0];a.handle_selection_option(e,event)}}},a.handle_search_request=function(b){m?a.show_books():a.handle_options(b)},a.show_books=function(){h.path("/user/"+b.user.id+"/recommendations/books")},a._handle_year_selection=function(){a.custom_input_placeholder=i.YearPlaceholder,b.time_groups?(a.search_results=[],a._filters_added()?a.search_results=b.time_groups:a._add_years()):f.get_time_groups().then(function(c){a.search_results=[],b.time_groups=[],c=c.times,angular.forEach(c,function(b){var c=b[0].data,d=c.name,e=a._get_option_json(i.Year);e=angular.extend(e,{name:d,label:c.range}),this.push(e)},b.time_groups),a._add_years()})},a._filters_added=function(){return angular.isDefined(a.filters_added)&&a.filters_added.length>0},a._handle_list_selection=function(){if(b.book_lists)if(a.search_results=[],a._filters_added())a.search_results=b.book_lists;else{var c=d(function(){a.search_results=b.book_lists},200);a.$on("destroy",function(){d.cancel(c)})}else f.get_book_lists().then(function(c){a.search_results=[],angular.forEach(c,function(b){var c=a._get_option_json(i.List);c=angular.extend(c,{name:b[1],id:b[0]}),this.push(c)},a.search_results),b.book_lists=a.search_results})},a._handle_country_selection=function(){a.custom_input_placeholder=i.CountryPlaceholder,b.regions?(a.search_results=[],a._filters_added()?a.search_results=b.regions:a._add_countries()):f.get_countries().then(function(c){a.search_results=[],b.regions=[],angular.forEach(c.countries,function(b){var c=a._get_option_json(i.Country);c=angular.extend(b,c),this.push(c)},b.regions),a._add_countries()})},a._handle_genre_selection=function(){if(a.custom_input_placeholder=i.GenrePlaceholder,a.custom_search=i.Genre,a.search_tag.result_count=50,angular.isDefined(b.genres))a.search_results=[],a._filters_added()?a.search_results=b.genres:a._add_genres();else{var d="q=''&count=10";c.search_genres(d).then(function(c){a.search_results=[],b.genres=[],angular.forEach(c,function(b){var c=k.get(i.Genre),d=angular.isDefined(c)&&c.id!=b[1]||angular.isUndefined(c);if(d){var e=a._get_option_json(i.Genre);e=angular.extend(e,{name:b[0],id:b[1],icon:b[2]}),this.push(e)}},b.genres),a._add_genres()})}},a._handle_author_selection=function(){a.custom_input_placeholder=i.AuthorPlaceholder,a.custom_search=i.AuthorSearch;var d=0;angular.isDefined(a.filters_added)&&angular.forEach(a.filters_added,function(a){a.type==i.Genre&&(d=a.id)}),angular.isUndefined(b.authors)&&(b.authors={});var e=0==d&&angular.isDefined(b.authors.genre_filter_id)||0!=d&&(angular.isUndefined(b.authors.genre_filter_id)||b.authors.genre_filter_id!=d),f=angular.isDefined(b.authors.data)&&!e;f?(a.search_results=[],a._filters_added()?a.search_results=b.authors.data:a._add_authors()):c.search_authors("genre_id="+d).then(function(c){0!=d&&(b.authors.genre_filter_id=d),a.search_results=[],b.authors.data=[],angular.forEach(c,function(b){var c=k.get(i.AuthorSearch),d=angular.isDefined(c)&&c.id!=b[1]||angular.isUndefined(c);if(d){var e=a._get_option_json(i.AuthorSearch);e=angular.extend(e,{name:b[0],id:b[1]}),this.push(e)}},b.authors.data),a._add_authors()})},a._handle_time_selection=function(){b.read_times?(a.search_results=[],a._filters_added()?a.search_results=b.read_times:a._add_read_times()):f.get_read_times().then(function(c){a.search_results=[],b.read_times=[],angular.forEach(c.read_times,function(b){var c=b[0].data,d=c.name,e=c.type,f=a._get_option_json(i.Time);f=angular.extend(f,{name:d,tag:e}),this.push(f)},b.read_times),a._add_read_times()})},a.handle_selection_option=function(b,c){if(a.shift_search_to_top(),a._set_base_selection(),a.search_tag.result_count=10,b.level1_option){if(a.active_base==i.BookSearch){switch(a.show_compressed_base=!0,a.active_nest=b.name,a.hide_input_field=!0,a.show_secondary_input=!0,a.search_tag.custom_input="",a.website.searching_custom=!0,a.search_results=[],delete a.custom_search,delete a.search_display,a.remove_active_state(),b.type){case i.Year:a._handle_year_selection();break;case i.List:a._handle_list_selection();break;case i.Country:a._handle_country_selection();break;case i.Genre:a._handle_genre_selection();break;case i.AuthorSearch:a._handle_author_selection();break;case i.Time:a.custom_input_placeholder=i.TimePlaceholder,a._handle_time_selection();break;case i.Gender:a.search_results=[{name:i.MaleGender,icon:"icon-male"},{name:i.FemaleGender,icon:"icon-female"},{name:i.DontCareGender}];break;case i.Awards:break;case i.ComingSoon:a.coming_soon=!0}a.reset_secondary_input_focus()}}else angular.isUndefined(a.filters_added)&&(a.filters_added=[]),a.filters_added.indexOf(b)<0&&a.add_filters(b);c.stopPropagation()},a._add_authors=function(){var c=d(function(){a.search_results=b.authors.data},200);a._destroy_timeout(c)},a._add_genres=function(){var c=d(function(){a.search_results=b.genres},200);a._destroy_timeout(c)},a._add_read_times=function(){var c=d(function(){a.search_results=b.read_times},200);a._destroy_timeout(c)},a._add_countries=function(){var c=d(function(){a.search_results=b.regions},200);a._destroy_timeout(c)},a._add_years=function(){var c=d(function(){a.search_results=b.time_groups},200);a._destroy_timeout(c)},a._destroy_timeout=function(b){a.$on("destroy",function(){d.cancel(b)})},a._set_active_type=function(b){angular.forEach(a.base_book_options,function(a){a.type==b&&(a.active=!0)})},a._remove_active_type=function(b){angular.forEach(a.base_book_options,function(a){a.type==b&&delete a.active})},a.add_filters=function(c){switch(angular.forEach(a.filters_added,function(b){b.type==c.type&&(a.filters_added.splice(a.filters_added.indexOf(b),1),a.search_results.splice(0,0,b))}),m||angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),a._set_active_type(c.type),c.type){case i.Genre:var d=c.id;break;case i.AuthorSearch:var d=c.id;break;case i.Time:var d=c.tag;break;case i.Year:var d=c.name;break;case i.Country:var d=c.name;break;case i.BookSearch:b.hide_options=!0;break;case i.ReaderSearch:h.path("/reader/"+c.id+"/profile");break;case i.TextSearch:b.hide_options=!0}var e=c.type!=i.BookSearch;m?angular.isDefined(c.type)&&(k.put(c.type,c),(c.type==i.BookSearch||c.type==i.TextSearch)&&a.handle_search_request()):r?(k.put(c.type,c),a.show_books()):(e&&angular.isDefined(c.type)?(a._reset_recommendations(),b.filters.other_filters[c.type]=d,k.put(c.type,c)):a._set_filter_for_book_search(c),a.$emit("reloadRecommendations")),e&&(a.filters_added.splice(0,0,c),a.search_results.splice(a.search_results.indexOf(c),1),a.select_next_option(c.type))},a._set_filter_for_book_search=function(c){angular.isDefined(c.show_all)&&c.show_all?a._all_text_search_results(c):(a._reset_recommendations(),b.filters.other_filters.id=c.id)},a._reset_recommendations=function(){angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),delete b.filters.other_filters.show_all,delete b.filters.other_filters.title,delete b.filters.other_filters.id,b.filters.reset_count=0,b.filters.reset=!0},a._all_text_search_results=function(c){a._reset_recommendations(),b.filters.other_filters.show_all=!0,b.filters.other_filters.title=c.value},a._reset_filter=function(c){switch(c.type){case i.Time:angular.isDefined(b.read_times)&&b.read_times.splice(0,0,c);break;case i.Year:angular.isDefined(b.time_groups)&&b.time_groups.splice(0,0,c);break;case i.List:angular.isDefined(b.book_lists)&&b.book_lists.splice(0,0,c);break;case i.AuthorSearch:angular.isDefined(b.authors)&&angular.isDefined(b.authors.data)&&b.authors.data.splice(0,0,c);break;case i.Genre:angular.isDefined(b.genres)&&(angular.isDefined(b.authors)&&angular.isDefined(b.authors.genre_filter_id)&&delete b.authors.genre_filter_id,b.genres.splice(0,0,c));break;case i.Country:angular.isDefined(b.regions)&&b.regions.splice(0,0,c);break;case i.BookSearch:a._clear_book_search_filters()}k.remove(c.type),m||(delete b.filters.other_filters[c.type],delete b.filters.other_filters.show_all,delete b.filters.other_filters.title,delete b.filters.other_filters.id,a.$emit("reloadRecommendations"))},a.remove_filter=function(b,c){a._reset_filter(b),a.filters_added.splice(a.filters_added.indexOf(b),1),0==a.filters_added.length&&(a.handle_options(c),a.set_focus(200)),angular.forEach(a.base_book_options,function(d){d.type==b.type&&(a.handle_selection_option(d,c),delete d.active)}),c.stopPropagation()},a.reset_filters=function(){angular.isDefined(a.filters_added)&&(angular.forEach(a.filters_added,function(b){a._reset_filter(b)}),a.filters_added=[]),angular.isDefined(b.filters)&&angular.isDefined(b.filters.other_filters)&&a._clear_book_search_filters()},a.set_base_search=function(){switch(a.active_base){case i.BookSearch:a._init_book_search();break;case i.AuthorSearch:a._init_author_search();break;case i.ReaderSearch:a._init_reader_search()}},a.reset_base_selection=function(){a.search_tag.placeholder=i.SearchPlaceholder,a.search_results=[],delete a.active_base,k.remove("base_search")},a.handle_base_selection=function(b){if(a.hide_input_field=!1,a.show_secondary_input=!1,a.reset_filters(),a.search_tag.input="",delete a.search_display,angular.isUndefined(b))a.set_base_search();else if(angular.isDefined(a.active_base)&&a.active_base==b.type)a.reset_base_selection();else{switch(b.name){case i.BookSearchLink:a._init_book_search();break;case i.AuthorSearchLink:a._init_author_search();break;case i.ReaderSearchLink:a._init_reader_search()}a.active_base=b.type}a.website.searching=!0;d(function(){a.website.searching=!1},200);a.$on("destroy",function(){d.cancel(timeout_event)}),delete a.active_nest,delete a.search_tag.custom_input},a.is_active=function(b){var c=!1;return b.type==a.active_base&&(c=!0),c},a.is_current=function(b,c){return _set_input_field=function(){c.show_all?a.search_tag.input=c.value:c.type==i.ComingSoon||c.level1_option||c.custom_option||(a.search_tag.input=c.name)},a.search_tag.current==b&&(a.search_tag.currentItem=c),a.search_tag.current==b},a.set_current=function(b){a.search_tag.current=b},a._detect_key=function(a){var b=a.keyCode==j.Backspace||a.keyCode==j.Delete,c=a.keyCode==j.KeyUp,d=a.keyCode==j.KeyDown,e=a.keyCode==j.KeyLeft,f=a.keyCode==j.KeyRight,g=a.keyCode==j.Enter;return{backspace_or_delete:b,keyUp:c,keyDown:d,keyLeft:e,keyRight:f,keyEnter:g}},a._handle_key_up=function(){angular.isUndefined(a.search_tag.current)?a.search_tag.current=0:a.set_current(0!=a.search_tag.current?a.search_tag.current-1:a.search_results.length-1)},a._handle_key_down=function(){angular.isUndefined(a.search_tag.current)?a.search_tag.current=0:a.set_current(a.search_tag.current!=a.search_results.length-1?a.search_tag.current+1:0)},a._handle_backspace_or_delete_in_custom_search=function(c){c.length<=1?a.custom_search==i.Genre?a.search_results=b.genres:a.custom_search==i.AuthorSearch&&(a.search_results=b.authors.data):a.search_custom(event)},a._handle_backspace_or_delete_in_main_search=function(c){if(c.length<=1){a.search_tag.input="",a.search_ready=!1,a.set_base_search(),angular.isUndefined(a.active_base)&&(a.search_type=i.All);var d=angular.isDefined(b.filters.other_filters)&&(angular.isDefined(b.filters.other_filters.title)||angular.isDefined(b.filters.other_filters.id))&&!m;d&&(a._clear_book_search_filters(),a.$emit("reloadRecommendations"))}else a.get_search_results(event)},a._handle_backspace_or_delete=function(){var b=angular.isDefined(a.search_tag.custom_input);if(b)var c=a.search_tag.custom_input.trim();else var c=a.search_tag.input.trim();delete a.search_display,a.remove_active_state(),b?a._handle_backspace_or_delete_in_custom_search(c):a._handle_backspace_or_delete_in_main_search(c)},a.key_down=function(b){var c=a._detect_key(b);m||a.handle_options(b),c.keyUp?a._handle_key_up():c.keyDown?a._handle_key_down():c.backspace_or_delete?a._handle_backspace_or_delete():(c.keyLeft||c.keyRight)&&b.stopPropagation()},a._clear_book_search_filters=function(){delete b.filters.other_filters.title,delete b.filters.other_filters.show_all,delete b.filters.other_filters.id},a.close_login_box=function(){a.show_login_form=!1},a.highlight=function(a,b){var c="<span><i><b>$&</b></i></span>";return e.trustAsHtml(b.replace(new RegExp(a,"gi"),c))},a.remove_active_state=function(){delete a.search_tag.current},a._init_graph_search=function(){a.base_search_options=[{name:i.BookSearchLink,icon:"icon-book",type:i.BookSearch},{name:i.AuthorSearchLink,icon:"icon-pen",type:i.AuthorSearch},{name:i.ReaderSearchLink,icon:"icon-users",type:i.ReaderSearch}]},a._init_book_search=function(){a.base_book_options=[{name:i.BookByGenreLink,level1_option:!0,type:i.Genre,icon:"icon-tag",icon2:"icon-book"},{name:i.BookByReadingTimeLink,level1_option:!0,type:i.Time,icon:"icon-clock",icon2:"icon-book"},{name:i.BookByYearLink,level1_option:!0,type:i.Year,icon:"icon-calendar",icon2:"icon-book"},{name:i.BookByAuthorLink,level1_option:!0,type:i.AuthorSearch,icon:"icon-pen",icon2:"icon-book"}],a.search_results=a.base_book_options,m&&k.put("base_search",i.BookSearchLink)},a._init_author_search=function(){a.search_results=[{name:i.ComingSoon,level1_option:!0,type:i.ComingSoon,icon2:"icon-pen"}],a.search_tag.placeholder=i.AuthorSearchPlaceholder,m&&k.put("base_search",i.AuthorSearchLink)},a._init_reader_search=function(){a.search_results=[{name:i.ComingSoon,level1_option:!0,type:i.ComingSoon,icon2:"icon-user22"}],a.search_tag.placeholder=i.ReaderSearchPlaceholder,m&&k.put("base_search",i.ReaderSearchLink)},a._add_book_in_results=function(b){angular.forEach(b,function(a){var b={name:a[0],author_name:a[1],id:a[2],type:i.BookSearch,icon2:"icon-book"};this.push(b)},a.search_results)},a._add_author_in_results=function(b){angular.forEach(b,function(a){var b={name:a[0],id:a[2],type:i.AuthorSearch,icon2:"icon-pen"};this.push(b)},a.search_results)},a._add_reader_in_results=function(b){angular.forEach(b,function(a){var b={name:a[0],id:a[2],type:i.ReaderSearch,icon2:"icon-users"};this.push(b)},a.search_results)},a._add_mixed_type_results=function(b){angular.forEach(b,function(a){if(a[3].indexOf(i.BookLabel)>=0)var b={name:a[0],author_name:a[1],id:a[2],type:i.BookSearch,label:i.BookSearch};else if(a[3].indexOf(i.AuthorLabel)>=0)var b={name:a[0],id:a[2],type:i.AuthorSearch,label:i.AuthorSearch};else if(a[3].indexOf(i.ReaderLabel)>=0)var b={name:a[0],id:a[2],type:i.ReaderSearch,label:i.ReaderSearch};this.push(b)},a.search_results)},a._handle_search_input=function(){var b=a.search_tag.input.trim();if(a.search_ready=!0,angular.isUndefined(a.active_base)){var d=b.slice(0,1),e=d==i.Hash,f=d==i.AtTheRate,g=d==i.Plus,h=f||e||g;b.length>0&&a._set_custom_search(f,e,g)}else b.length>0&&a._set_custom_search();h&&(1==b.length&&(a.search_ready=!1),b=b.substring(1,b.length)),a.search_ready&&""!=b?b.length<3?a.search_display=i.TypeMore:(a.search_type=i.SearchAll,c.search(b,a.search_type,a.search_tag.result_count).then(function(b){if(a.search_ready){a.search_results=[];var c=b.results.data;if(a._add_mixed_type_results(c),a.search_results.length==a.search_tag.result_count){var d=a._get_search_text_item();a.search_results.push(d),delete a.search_display}else 0!=a.search_results.length?delete a.search_display:a.search_display=i.NoResultsFound;a.search_initiated=!1}})):(a.search_initiated=!1,a.set_base_search())},a._get_search_text_item=function(){return{name:"<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+a.search_tag.input+"</em>'</span>",show_all:!0,value:a.search_tag.input,type:i.TextSearch}},a._set_custom_search=function(b,c,d){a.search_results=[],angular.isUndefined(b)&&(a.active_base==i.AuthorSearch?b=!0:a.active_base==i.BookSearch?c=!0:a.active_base==i.ReaderSearch&&(d=!0)),a.search_type=i.SearchAll,a.search_display=i.SearchingWebsite},a.get_search_results=function(b){var c=350;a.search_results=[],a.shift_search_to_top();var e=b.keyCode==j.Enter;if(e){var f=angular.isUndefined(a.search_tag.currentItem);if(f){var g=a._get_search_text_item();m?(k.put(g.type,g),a.handle_search_request()):(a._all_text_search_results(g),a.$emit("reloadRecommendations"))}else a.handle_selection_option(a.search_tag.currentItem,b)}else if(a.search_initiated)d.cancel(l),l=d(function(){a._handle_search_input(b)},c);else{var h=String.fromCharCode(b.keyCode),n=a.search_tag.input.trim();if(n&&n.length>1){0==n.indexOf(i.Hash),0==n.indexOf(i.AtTheRate),0==n.indexOf(i.Plus)}else{h==i.Hash,h==i.AtTheRate,h==i.Plus}a.search_initiated=!0,l=d(function(){a._handle_search_input(b)},c)}},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},a.handle_options=function(c){m?a.shift_search_to_top():(b.hide_options&&((angular.isUndefined(a.search_tag.input)||0==a.search_tag.input.length)&&(a.hide_input_field=!1,a._init_book_search()),a.show_secondary_input=!1,b.hide_options=!1,b.user.collapsed_column=!0,b.user.collapsed_filters=!0,b.user.collapsed_friends=!0,b.user.collapsed_trends=!0,b.user.collapsed_lists=!0,b.user.collapsed_left_column=!0,b.popups={},b.popups.left_panel_width={width:j.LeftPanelMinWidth},delete b.focused_book,b.popups.left_panel_width={},b.style={},delete a.active_nest,delete a.active_base,delete a.search_tag.custom_input,a.active_base=i.BookSearch),c.stopPropagation()),a._set_base_selection()},a._set_base_selection=function(){angular.isUndefined(a.active_base)&&a.handle_base_selection(a.base_search_options[0])},a.shift_search_to_top=function(){m&&(a.trending_panel_style={"max-height":"26vh"},a.search_panel_style={top:"26%"})},a.reset_search_bar=function(c){b.hide_options=!0,a.hide_input_field=!1,delete b.user.faded_wrapper,c.stopPropagation()},a._handle_search_page=function(){a.search_initiated=!1,a.search_type=i.All,a.show_login_form=!0,a.search_tag={},a.search_tag.search_placeholder=i.SearchPlaceholder;var c=angular.isDefined(b.filters)&&angular.isDefined(b.filters.other_filters)&&angular.isDefined(b.filters.other_filters.title);a.search_tag.input=c?b.filters.other_filters.title:"",a.search_tag.result_count=10,a._init_graph_search(),m&&(a._set_cover_photo(),b.user.logged&&a.set_focus(3e3),a._set_base_search(),a._add_trends_as_notifications()),b.hide_options=g.type?!0:!1},a._set_cover_photo=function(){c.get_background_image().then(function(b){var c=j.CoverPhotoCDN+b+".jpg";a.search_style={"background-image":'url("'+c+'")'},k.put("coverImage",c)})},a._add_trends_as_notifications=function(){(angular.isUndefined(b.trending_feed)||0==b.trending_feed.length)&&c.get_trending_topics().then(function(a){b.trending_feed=[],angular.forEach(a,function(a){var b={name:a[0],id:a[1],message:a[2],url:a[3],title:a[4],thumb:a[7],large_image:a[5],keywords:a[8]};this.push(b)},b.trending_feed)})},a._add_trends_on_search_page=function(){a.trending_feed=[],c.get_trending_topics().then(function(b){angular.forEach(b,function(a){var b={name:a[0],id:a[1],thumb:a[6],keywords:a[8],large_image:a[5]};this.push(b)},a.trends)})},a.set_focus=function(b){var c=d(function(){a.website.searching=!0;d(function(){a.website.searching=!1},200)},b);a.$on("destroy",function(){d.cancel(c),d.cancel(reset_focus_param_timeout)})},a._init_genre_filter=function(){var c=k.get(i.Genre);angular.isDefined(c)&&(m||(angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),b.filters.other_filters[i.Genre]=c.id),a._set_active_type(c.type),a.filters_added.push(c))},a._init_author_filter=function(){var c=k.get(i.AuthorSearch);angular.isDefined(c)&&(m||(angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),b.filters.other_filters[i.AuthorSearch]=c.id),a._set_active_type(c.type),a.filters_added.push(c))},a._init_time_filter=function(){var c=k.get(i.Time);angular.isDefined(c)&&(m||(angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),b.filters.other_filters[i.Time]=c.tag),a._set_active_type(c.type),a.filters_added.push(c))},a._init_year_filter=function(){var c=k.get(i.Year);angular.isDefined(c)&&(m||(angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),b.filters.other_filters[i.Year]=c.name),a._set_active_type(c.type),a.filters_added.push(c))},a._init_country_filter=function(){var c=k.get(i.Country);angular.isDefined(c)&&(m||(angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),b.filters.other_filters[i.Country]=c.name),a._set_active_type(c.type),a.filters_added.push(c))},a._init_book_filter=function(){var b=k.get(i.BookSearch);angular.isDefined(b)&&(m?k.remove(i.BookSearch):(a._set_filter_for_book_search(b),a._set_active_type(b.type),a.filters_added.push(b)))},a._init_text_filter=function(){var b=k.get(i.TextSearch);angular.isDefined(b)&&(m?k.remove(i.TextSearch):(a._set_filter_for_book_search(b),a.filters_added.push(b)))},a._add_init_filters=function(){angular.isUndefined(a.filters_added)&&(a.filters_added=[]),a._init_genre_filter(),a._init_author_filter(),a._init_time_filter(),a._init_year_filter(),a._init_country_filter(),a._init_book_filter(),a._init_text_filter(),m||a.$emit("reloadRecommendations")},a._clear_filter_cookies=function(){k.remove(i.Genre),k.remove(i.AuthorSearch),k.remove(i.Time),k.remove(i.Year),k.remove(i.Country),k.remove(i.BookSearch)},a._get_ten_random_books=function(){f.get_random_books().then(function(b){a.random_books=[],angular.forEach(b,function(a){var b={id:a[0],isbn:a[1]};this.push(b)},a.random_books);for(var c=window_width/(b.length+2),d=window_width/(b.length-2),e=0,f=0;f<b.length;f++){var g=Math.random()*(d-c)+c;g>window_width-e&&(g=window_width-e),a.random_books[f]=angular.extend(a.random_books[f],{width:g,left:e}),e=e+g+5}})},a.set_book_width=function(a){return{width:a.width+"px",left:a.left+"px"}},a.increase_height=function(){m&&(a.trending_panel_style={"max-height":"50vh"},a.search_panel_style={top:"50%"})},a._set_base_search=function(){a._init_book_search(),a.search_tag.placeholder=i.SearchPlaceholder},a._init=function(){a.website.searching=!1,a.filters_added=[],a._handle_search_page(),m||a._init_book_search(),a.$on("updateFilters",function(b,c,d){a._update_filters(c,d),b.preventDefault()}),s||m?a._add_init_filters():r?a.$emit("reloadRecommendations"):a._clear_filter_cookies(),m||(b.book_lists=[],f.get_book_lists().then(function(c){angular.forEach(c,function(b){var c=a._get_option_json(i.List);c=angular.extend(c,{name:b[1],id:b[0],count:b[2]}),this.push(c)},b.book_lists)}))};var l="",m=angular.isUndefined(g.type),n=angular.isDefined(g.filter_id),o=angular.isDefined(g.label_id),p=angular.isDefined(g.grid_id),q=angular.isDefined(g.trend_id),r=n||p||q||o,s=!(m||r);a._init()}]);