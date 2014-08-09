websiteApp.controller("searchController",["$scope","$rootScope","websiteService","$timeout","$sce","recommendationService","$routeParams","$location","SearchUIConstants","WebsiteUIConstants","$cookieStore",function(a,b,c,d,e,f,g,h,i,j,k){_show_search_result=function(c,d){var e=b.user.id,f=angular.isUndefined(g.type);angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),d?f?h.path("/user/"+e+"/book/"+c+"/all/"+!0):(a.search_tag.input=c,b.filters.other_filters.title=c,delete b.filters.other_filters.author_name,delete b.filters.other_filters.id,b.filters.other_filters.show_all=!0,a.$emit("reloadRecommendations")):f?h.path("/user/"+e+"/book/"+c.name+"/author/"+c.author_name+"/id/"+c.id):(a.search_tag.input=c.name,b.filters.other_filters.title=c.name,b.filters.other_filters.author_name=c.author_name,b.filters.other_filters.id=c.id,delete b.filters.other_filters.show_all,a.$emit("reloadRecommendations"))},_handle_graph_search=function(){a.hide_search_page()},_search_by=function(c){if(!c)var c=a.search_type;a.search_level1?a.search_level1&&(a.search_level2=!0,a.search_results=[],c==i.Year?(a.year_search=!0,b.time_groups?a.search_results=b.time_groups:f.get_time_groups().then(function(c){a.search_results=[],angular.forEach(c.times,function(a){var b=a[0].data,c=b.name,d={name:c,custom_option:!0,type:"timeGroup",label:b.range};this.push(d)},a.search_results),b.time_groups=a.search_results})):c==i.List?(a.list_search=!0,b.book_lists?a.search_results=b.book_lists:f.get_book_lists().then(function(c){a.search_results=[],angular.forEach(c,function(a){var b={name:a[1],id:a[0],custom_option:!0,type:i.List};this.push(b)},a.search_results),b.book_lists=a.search_results})):c==i.Country?(a.country_search=!0,b.regions?a.search_results=b.regions:f.get_countries().then(function(c){a.search_results=c.countries,b.regions=a.search_results})):c==i.Genre?a.genre_search=!0:c==i.AuthorSearch?a.author_search=!0:c==i.Time?(a.time_search=!0,b.read_times?a.search_results=b.read_times:f.get_read_times().then(function(c){a.search_results=[],angular.forEach(c.read_times,function(a){var b=a[0].data,c=b.name,d={name:c,custom_option:!0,type:"readingTime"};this.push(d)},a.search_results),b.read_times=a.search_results})):c==i.Gender?(a.gender_search=!0,a.search_results=[{name:i.MaleGender,custom_option:!0,icon:"icon-male"},{name:i.FemaleGender,custom_option:!0,icon:"icon-female"},{name:i.DontCareGender,custom_option:!0}]):c==i.Awards?a.awards_search=!0:c==i.ComingSoon&&(a.coming_soon=!0),a.search_tag.placeholder=i.LevelTwoPlaceHolder):(a.search_level1=!0,-1!=c.indexOf(i.BookSearch)?(a.search_display=i.SearchingBooks,a.search_type=i.BookSearch,a.book_search=!0,a.author_search=!1,a.reader_search=!1,a.search_tag.placeholder=i.BookSearchPlaceholder,_init_book_search()):-1!=c.indexOf(i.AuthorSearch)?(a.search_display=i.SearchingAuthors,a.search_type=i.AuthorSearch,a.author_search=!0,a.reader_search=!1,a.book_search=!1,a.search_tag.placeholder=i.AuthorSearchPlaceholder,_init_author_search()):-1!=c.indexOf(i.ReaderSearch)&&(a.search_display=i.SearchingReaders,a.search_type=i.ReaderSearch,a.reader_search=!0,a.book_search=!1,a.author_search=!1,a.search_tag.placeholder=i.ReaderSearchPlaceholder,_init_reader_search()))},a.stop_horizontal_scroll=function(a){a.stopPropagation()},a.handle_selection=function(c){var d=c.name,e=c.graph_option,f=c.custom_option,j=c.type,l=c.show_all;if(l)_show_search_result(a.search_tag.input,!0);else if(f)if(a.search_level1)if(a.search_level2){var m=angular.isUndefined(g.type),n=b.user.id;j==i.List?h.path("/user/"+n+"/grid/books/id/"+c.id+"/name/"+c.name):m?(h.path("/user/"+n+"/recommendations/books"),k.put("broadcast","filterChange"),k.put("selectedItem",d),k.put("type",j)):(_handle_input_focus(),b.$broadcast("filterChange",{name:d},j),b.hide_options=!0,a.search_tag.input=d)}else _search_by(j),a.search_tag.input="";else _handle_input_focus(),a.search_type=j,_search_by(j),a.search_tag.input="";else a.search_tag.selected_result=!0,e?(_handle_graph_search(d),a.search_tag.input=""):_show_search_result(c);event.stopPropagation()},a.hide_search_page=function(c){var e=a.logged;e?($("body").css("white-space","nowrap"),a.website.searching=!1,a.website.show_search_page=!1,b.$broadcast("initPage",c),a.loading=!0,d(function(){a.loading=!1},2e3)):a.show_login_form=!0},a.is_current=function(b,c){return a.search_tag.current==b&&(a.search_tag.currentItem=c),a.search_tag.current==b},a.set_current=function(b){a.search_tag.current=b},a.key_down=function(b){var c=b.keyCode==j.Backspace||b.keyCode==j.Delete,d=b.keyCode==j.KeyUp,e=b.keyCode==j.KeyDown;if(d)a.set_current(0!=a.search_tag.current?a.search_tag.current-1:a.search_results.length-1);else if(e)a.set_current(a.search_tag.current!=a.search_results.length-1?a.search_tag.current+1:0);else if(c){var f=_get_search_input(b);f.length<=1?f.length<1&&a.search_level1&&!a.search_level2?(a.clear_search_level1_var(b),b.preventDefault()):f.length<1&&a.search_level2?(a.clear_search_level2_var(b),b.preventDefault()):_init_search():a.get_search_results(b)}},a.clear_search_level1_var=function(c){a.clear_search_level2_var(c),a.search_level1=!1,a.book_search=!1,a.author_search=!1,a.reader_search=!1,a.search_tag.input="",b.hide_options=!1,_handle_input_focus(),_init_graph_search(),c.stopPropagation()},_handle_input_focus=function(){a.website.searching=!0;var b=d(function(){a.website.searching=!1},200);a.$on("destroy",function(){d.cancel(b)})},a.close_login_box=function(){a.show_login_form=!1},a.clear_search_level2_var=function(c){a.search_level1=!1,a.search_level2=!1,a.year_search=!1,a.list_search=!1,a.country_search=!1,a.genre_search=!1,a.author_search=!1,a.time_search=!1,a.gender_search=!1,a.awards_search=!1,a.coming_soon=!1,b.hide_options=!1,a.search_tag.input="",_search_by(),_handle_input_focus(),c.stopPropagation()},a.highlight=function(a,b){var c="<span><i><b>$&</b></i></span>";return e.trustAsHtml(b.replace(new RegExp(a,"gi"),c))},_init_graph_search=function(){a.search_level1?(a.search_level1=!1,_search_by()):(a.search_tag.placeholder=i.SearchPlaceholder,a.search_results=[{name:i.BookSearchLink,icon:"icon-book",custom_option:!0,type:i.BookSearch,graph_option:!0},{name:i.AuthorSearchLink,icon:"icon-pen",custom_option:!0,type:i.AuthorSearch,graph_option:!0},{name:i.ReaderSearchLink,icon:"icon-users",custom_option:!0,type:i.ReaderSearch,graph_option:!0}])},_init_book_search=function(){a.search_results=[{name:i.BookByYearLink,custom_option:!0,type:i.Year,icon:"icon-calendar",icon2:"icon-book"},{name:i.BookByReadingTimeLink,custom_option:!0,type:i.Time,icon:"icon-clock",icon2:"icon-book"},{name:i.BookByRegionLink,custom_option:!0,type:i.Country,icon:"icon-earth",icon2:"icon-book"},{name:i.BookListsLink,custom_option:!0,type:i.List,icon:"icon-list",icon2:"icon-book"}]},_init_author_search=function(){a.search_results=[{name:i.AuthorByYearLink,custom_option:!0,type:i.Year,icon:"icon-clock",icon2:"icon-pen"},{name:i.AuthorByRegionLink,custom_option:!0,type:i.Country,icon:"icon-earth",icon2:"icon-pen"},{name:i.AuthorByAwardsLink,custom_option:!0,type:i.Awards,icon:"icon-trophy",icon2:"icon-pen"},{name:i.AuthorsByGenreLink,custom_option:!0,type:i.Genre,icon:"icon-shapes",icon2:"icon-pen"},{name:i.AuthorListsLink,custom_option:!0,type:i.List,icon:"icon-list",icon2:"icon-pen"}],a.search_results=[{name:i.ComingSoon,custom_option:!0,type:i.ComingSoon,icon2:"icon-pen"}]},_init_reader_search=function(){a.search_results=[{name:i.ReaderByRegionLink,custom_option:!0,type:i.Country,icon:"icon-earth",icon2:"icon-user22"},{name:i.ReaderByTasteLink,custom_option:!0,type:i.Genre,icon:"icon-shapes",icon2:"icon-user22"},{name:i.ReaderByGenderLink,custom_option:!0,type:i.Gender,icon:"icon-male icon-female",icon2:"icon-user22"},{name:i.ReaderListsLink,custom_option:!0,type:i.List,icon:"icon-list",icon2:"icon-user22"}],a.search_results=[{name:i.ComingSoon,custom_option:!0,type:i.ComingSoon,icon2:"icon-user22"}]},_init_search=function(){_init_graph_search(),a.search_level1||a.search_level2||(a.search_type=i.All,a.search_display=i.SearchingWebsite)},_handle_search_input=function(b){var e=_get_search_input(b);_init_graph_search(),a.search_ready=!0;{var f=e.slice(0,1),g=f==i.Hash,h=f==i.AtTheRate,j=f==i.Plus,k=h||g||j;e.length}_set_custom_search(h,g,j),k&&(1==e.length&&(a.search_ready=!1),e=e.substring(1,e.length)),a.search_ready&&""!=e?c.search(e,a.search_type,a.search_tag.result_count).then(function(b){a.search_results=[];var c=b.results.data;if(angular.forEach(c,function(a){var b={name:a[0],author_name:a[1],id:a[2]};this.push(b)},a.search_results),0!=a.search_results.length){var e={name:"<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+a.search_tag.input+"</em>'</span>",show_all:!0};a.search_results.push(e)}a.search_initiated=!1,d.cancel(l)}):(a.search_initiated=!1,_init_graph_search(),d.cancel(l))},_get_search_input=function(){return a.search_tag.input.trim()},_set_custom_search=function(b,c,d){b?(a.search_type=i.AuthorSearch+", "+i.ReaderSearch,a.search_display=i.SearchingAuthorsAndReaders):c?(a.search_type=i.BookSearch,a.search_display=i.SearchingBooks):d&&(a.search_type=i.TagSearch,a.search_display=i.SearchingTags)},a.get_search_results=function(b,c){var e=angular.isDefined(c);if(e){if(a.search_initiated=!0,c==i.BookSearch)var f=!0,g=!1,h=!1;else if(c==i.AuthorSearch)var k=i.AtTheRate,f=!1,g=!0,h=!1;_set_custom_search(g,f,h),l=d(function(){_handle_search_input(b)},500)}else if(a.search_initiated)_init_graph_search(),d.cancel(l),l=d(function(){_handle_search_input(b)},500);else{var m=b.keyCode==j.Enter;if(m)a.handle_selection(a.search_tag.currentItem);else{_init_graph_search();var k=String.fromCharCode(b.keyCode),n=_get_search_input(b);if(n&&n.length>1)var f=0==n.indexOf(i.Hash),g=0==n.indexOf(i.AtTheRate),h=0==n.indexOf(i.Plus);else var f=k==i.Hash,g=k==i.AtTheRate,h=k==i.Plus;a.search_initiated=!0,_set_custom_search(g,f,h),l=d(function(){_handle_search_input(b)},500)}}},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},a.handle_options=function(){g.type&&(b.hide_options&&(b.hide_options=!1),event.stopPropagation())},_handle_search_page=function(){a.search_initiated=!1,a.search_display=i.SearchingWebsite,a.search_type=i.All,a.show_login_form=!0,a.search_tag={},a.search_tag.search_placeholder=i.SearchPlaceholder,a.search_tag.current=0;var d=angular.isDefined(b.filters)&&angular.isDefined(b.filters.other_filters)&&angular.isDefined(b.filters.other_filters.title);a.search_tag.input=d?b.filters.other_filters.title:"",a.search_tag.result_count=100,a.website.searching=!1,a.website.show_search_page=!0,c.get_background_image().then(function(b){a.search_style={"background-image":'url("'+b.url+'")'}}),_init_graph_search(),b.hide_options=g.type?!0:!1},_get_trends=function(){angular.isUndefined(a.$routeParams)&&angular.isUndefined(a.trends)&&(a.trends=[],c.get_trending_topics().then(function(b){angular.forEach(b,function(a){var b={name:a[0],id:a[1]};this.push(b)},a.trends)}))},_init=function(){_handle_search_page(),_get_trends()};var l="";_init()}]);