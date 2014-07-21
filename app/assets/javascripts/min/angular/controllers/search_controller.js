websiteApp.controller("searchController",["$scope","$rootScope","websiteService","$timeout","$sce","recommendationService","$routeParams","$location",function(a,b,c,d,e,f,g,h){_show_search_result=function(c,d){var e=b.user.id,f=angular.isUndefined(g.type);angular.isUndefined(b.filters)&&(b.filters={other_filters:{}}),d?f?h.path("/user/"+e+"/book/"+c+"/all/"+!0):(a.search_tag.input=c,b.filters.other_filters.title=c,b.filters.other_filters.author_name=null,b.filters.other_filters.show_all=!0,a.$emit("reloadRecommendations")):f?h.path("/user/"+e+"/book/"+c.name+"/author/"+c.author_name+"/id/"+c.id):(a.search_tag.input=c.name,b.filters.other_filters.title=c.name,b.filters.other_filters.author_name=c.author_name,b.filters.other_filters.id=c.id,a.$emit("reloadRecommendations"))},_handle_graph_search=function(){a.hide_search_page()},_search_by=function(c){if(!c)var c=a.search_type;if(a.search_level1){if(a.search_level1){if(a.search_level2=!0,a.search_results=[],"YEAR"==c){a.year_search=!0;b.time_groups?a.search_results=b.time_groups:f.get_time_groups().then(function(c){a.search_results=[],angular.forEach(c.times,function(a){var b=a[0].data,c=b.name+" ("+b.range+")",d={name:c,custom_option:!0,type:"timeGroup"};this.push(d)},a.search_results),b.time_groups=a.search_results})}else if("LIST"==c){a.list_search=!0}else if("COUNTRY"==c){a.country_search=!0;b.regions?a.search_results=b.regions:f.get_countries().then(function(c){a.search_results=c.countries,b.regions=a.search_results})}else if("GENRE"==c){a.genre_search=!0}else if("AUTHOR"==c){a.author_search=!0}else if("TIME"==c){a.time_search=!0;b.read_times?a.search_results=b.read_times:f.get_read_times().then(function(c){a.search_results=[],angular.forEach(c.read_times,function(a){var b=a[0].data,c=b.name,d={name:c,custom_option:!0,type:"readingTime"};this.push(d)},a.search_results),b.read_times=a.search_results})}else if("GENDER"==c){a.gender_search=!0;a.search_results=[{name:"Male",custom_option:!0,icon:"icon-male"},{name:"Female",custom_option:!0,icon:"icon-female"},{name:"I don't care",custom_option:!0}]}else if("AWARDS"==c){a.awards_search=!0}a.search_tag.placeholder="Select a category"}}else a.search_level1=!0,-1!=c.indexOf("BOOK")?(a.search_display="Searching Books...",a.search_type="[BOOK]",a.book_search=!0,a.author_search=!1,a.reader_search=!1,a.search_tag.placeholder="Search Books...",_init_book_search()):-1!=c.indexOf("AUTHOR")?(a.search_display="Searching Authors...",a.search_type="[AUTHOR]",a.author_search=!0,a.reader_search=!1,a.book_search=!1,a.search_tag.placeholder="Search Authors...",_init_author_search()):-1!=c.indexOf("READER")&&(a.search_display="Searching Readers...",a.search_type="[READER]",a.reader_search=!0,a.book_search=!1,a.author_search=!1,a.search_tag.placeholder="Search Readers...",_init_reader_search())},a.handle_selection=function(c){var d=c.name,e=c.graph_option,f=c.custom_option,g=c.type,h=c.show_all;h?_show_search_result(a.search_tag.input,!0):f?(a.search_level1?a.search_level2&&(_handle_input_focus(),b.$broadcast("filterChange",{name:d},g),b.hide_options=!0,a.search_tag.input=d):(_handle_input_focus(),a.search_type=g),_search_by(g),a.search_tag.input=""):(a.search_tag.selected_result=!0,e?(_handle_graph_search(d),a.search_tag.input=""):_show_search_result(c)),event.stopPropagation()},a.hide_search_page=function(c){var e=a.logged;e?($("body").css("white-space","nowrap"),a.website.searching=!1,a.website.show_search_page=!1,b.$broadcast("initPage",c),a.loading=!0,d(function(){a.loading=!1},2e3)):a.show_login_form=!0},a.is_current=function(b,c){return a.search_tag.current==b&&(a.search_tag.currentItem=c),a.search_tag.current==b},a.set_current=function(b){a.search_tag.current=b},_navigate_options=function(){var b=13==event.keyCode;b&&a.handle_selection(a.search_tag.currentItem)},a.key_up=function(){var b=38==event.keyCode,c=40==event.keyCode;b&&a.set_current(0!=a.search_tag.current?a.search_tag.current-1:a.search_results.length-1),c&&a.set_current(a.search_tag.current!=a.search_results.length-1?a.search_tag.current+1:0)},a.key_down=function(b){var c=8==b.keyCode||46==b.keyCode;if(c){var d=_get_search_input(b);d.length<=1?d.length<1&&a.search_level1&&!a.search_level2?(a.clear_search_level1_var(b),b.preventDefault()):d.length<1&&a.search_level2?(a.clear_search_level2_var(b),b.preventDefault()):_init_search():a.get_search_results(b)}},a.clear_search_level1_var=function(c){a.clear_search_level2_var(c),a.search_level1=!1,a.book_search=!1,a.author_search=!1,a.reader_search=!1,b.hide_options=!1,_handle_input_focus(),_init_graph_search(),c.stopPropagation()},_handle_input_focus=function(){a.website.searching=!0;var b=d(function(){a.website.searching=!1},200);a.$on("destroy",function(){d.cancel(b)})},a.close_login_box=function(){a.show_login_form=!1},a.clear_search_level2_var=function(c){a.search_level1=!1,a.search_level2=!1,a.year_search=!1,a.list_search=!1,a.country_search=!1,a.genre_search=!1,a.author_search=!1,a.time_search=!1,a.gender_search=!1,a.awards_search=!1,b.hide_options=!1,_search_by(),_handle_input_focus(),c.stopPropagation()},a.highlight=function(a,b){var c="<span><i><b>$&</b></i></span>";return e.trustAsHtml(b.replace(new RegExp(a,"gi"),c))},_init_graph_search=function(){a.search_level1?(a.search_level1=!1,_search_by()):(a.search_tag.placeholder="Search...",a.search_results=[{name:"Search a Book",icon:"icon-book",custom_option:!0,type:"BOOK",graph_option:!0},{name:"Search an Author",icon:"icon-pen",custom_option:!0,type:"AUTHOR",graph_option:!0},{name:"Search a Reader",icon:"icon-users",custom_option:!0,type:"READER",graph_option:!0}])},_init_book_search=function(){a.search_results=[{name:"Find Books by Era",custom_option:!0,type:"YEAR",icon:"icon-calendar"},{name:"Find Books by Reading Time",custom_option:!0,type:"TIME",icon:"icon-clock"},{name:"Find Books by Author's Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Books by Genre",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Get popular lists of Books",custom_option:!0,type:"LIST",icon:"icon-list"},{name:"Get Books by Author",custom_option:!0,type:"AUTHOR",icon:"icon-pen"}]},_init_author_search=function(){a.search_results=[{name:"Find Authors by Era",custom_option:!0,type:"YEAR",icon:"icon-clock"},{name:"Find Authors by Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Authors by Awards",custom_option:!0,type:"AWARDS",icon:"icon-trophy"},{name:"Find Authors by Genre",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Get popular lists of Authors",custom_option:!0,type:"LIST",icon:"icon-list"}]},_init_reader_search=function(){a.search_results=[{name:"Find Readers by Region",custom_option:!0,type:"COUNTRY",icon:"icon-earth"},{name:"Find Readers by their Taste",custom_option:!0,type:"GENRE",icon:"icon-shapes"},{name:"Find Readers by Gender",custom_option:!0,type:"GENDER",icon:"icon-male icon-female"},{name:"Get popular lists of Readers",custom_option:!0,type:"LIST",icon:"icon-list"}]},_init_search=function(){_init_graph_search(),a.search_level1||a.search_level2||(a.search_type="[ALL]",a.search_display="Searching reader's door...")},_handle_search_input=function(b){var e=_get_search_input(b);_init_graph_search(),a.search_ready=!0;{var f=e.slice(0,1),g="#"==f,h="@"==f,j="+"==f,k=h||g||j;e.length}_set_custom_search(h,g,j),k&&(1==e.length&&(a.search_ready=!1),e=e.substring(1,e.length)),a.search_ready&&""!=e?c.search(e,a.search_type,a.search_tag.result_count).then(function(b){a.search_results=[];var c=b.results.data;if(angular.forEach(c,function(a){var b={name:a[0],author_name:a[1],id:a[2]};this.push(b)},a.search_results),0!=a.search_results.length){var e={name:"<span class='icon-list'></span><span>&nbsp;&nbsp;Show all results for '<em>"+a.search_tag.input+"</em>'</span>",show_all:!0};a.search_results.push(e)}a.search_initiated=!1,d.cancel(i)}):(a.search_initiated=!1,_init_graph_search(),d.cancel(i))},_get_search_input=function(){return a.search_tag.input.trim()},_set_custom_search=function(b,c,d){b?(a.search_type="['AUTHOR', 'READER']",a.search_display="Searching authors and readers..."):c?(a.search_type="['BOOK']",a.search_display="Searching books..."):d&&(a.search_type="['TAG']",a.search_display="Searching book categories...")},a.get_search_results=function(b,c){if(c){if(a.search_initiated=!0,"BOOK"==c)var e=!0,f=!1,g=!1;else if("AUTHOR"==c)var h="@",e=!1,f=!0,g=!1;_set_custom_search(f,e,g)}else if(_init_graph_search(),a.search_initiated)d.cancel(i);else{if(!h){var h=String.fromCharCode(b.keyCode);_navigate_options()}var j=_get_search_input(b);if(j&&j.length>1)var e=0==j.indexOf("#"),f=0==j.indexOf("@"),g=0==j.indexOf("+");else var e="#"==h,f="@"==h,g="+"==h;a.search_initiated=!0,_set_custom_search(f,e,g)}i=d(function(){_handle_search_input(b)},500)},a.toggle_login_panel=function(){a.show_login_form=a.show_login_form?!1:!0},a.handle_options=function(){g.type&&(b.hide_options&&(b.hide_options=!1),event.stopPropagation())},_handle_search_page=function(){a.search_initiated=!1,a.search_display="Searching reader's door...",a.search_type="[ALL]",a.show_login_form=!0,a.search_tag={},a.search_tag.search_placeholder="Search...",a.search_tag.current=0,a.search_tag.input=angular.isDefined(b.filters)&&angular.isDefined(b.filters.other_filters)?b.filters.other_filters.title:"",a.search_tag.result_count=5,a.website.searching=!1,a.website.show_search_page=!0,c.get_background_image().then(function(b){a.search_style={"background-image":'url("'+b.url+'")'}}),_init_graph_search(),b.hide_options=g.type?!0:!1},_get_trends=function(){angular.isUndefined(a.$routeParams)&&angular.isUndefined(a.trends)&&c.get_trending_topics().then(function(b){a.trends=b})},_init=function(){_handle_search_page(),_get_trends()};var i="";_init()}]);