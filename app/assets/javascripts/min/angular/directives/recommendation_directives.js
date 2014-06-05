websiteApp.directive("moreFilters",["$rootScope","$timeout",function(a,b){return{restrict:"E",controller:["$scope","recommendationService","websiteService",function(c,d,e){_init=function(){c.show_menu=!1,c.countryOptions=[],d.get_countries().then(function(a){c.countryOptions=[{name:"Reset"}],c.countryOptions=c.countryOptions.concat(a.countries)}),d.get_time_groups().then(function(a){c.timeOptions=[{name:"Reset"}];for(var b=0;b<a.times.length;b++){var d=a.times[b][0].data,e=d.name+" ("+d.range+")",f={name:e};c.timeOptions=c.timeOptions.concat([f])}}),d.get_read_times().then(function(a){c.readTimeOptions=[{name:"Reset"}],c.readTimeOptions=c.readTimeOptions.concat(a.read_times)}),_init_dropdown_filters(),_collapse_dropdown_menu()},_collapse_dropdown_menu=function(){c.filter_expanded=!0;b(function(){c.filter_expanded=!1},3e3)},_init_dropdown_filters=function(){c.countrySelected={name:"Filter books by Region"},c.timeSelected={name:"Filter books by Era"},c.readTimeSelected={name:"Filter books by Reading Time"}},c.clear_filter=function(d,e){a.filters.other_filters[e]=null;var f="SUCCESS-"+e+" filter removed",g=notify(a,f,b);c.$on("destroy",function(){b.cancel(g)}),c.$emit("reloadRecommendations")},c.advance_filter_changed=function(d,e){if("Reset"==d.name){var f="SUCCESS-"+e+" filter has been reset.";delete a.filters.other_filters[e],"country"==e?c.countrySelected={name:"Filter books by Region"}:"timeGroup"==e?c.timeSelected={name:"Filter books by Era"}:"readingTime"==e&&(c.readTimeSelected={name:"Filter books by Reading Time"})}else{var f="SUCCESS-"+d.name+" added to filters.";a.filters.other_filters[e]=d.name}var g=notify(a,f,b);c.$on("destroy",function(){b.cancel(g)}),c.$emit("reloadRecommendations")},c.reset_filters=function(){_init_dropdown_filters(),c.$broadcast("resetFilter"),a.filters.more_filters=[],a.filters.other_filters={},c.$emit("reloadRecommendations");var d="SUCCESS-All filters removed.<br/> You can add filters to look for particular books.",e=notify(a,d,b);c.$on("destroy",function(){b.cancel(e)})},c.stop_click_propagation=function(a){a.stopPropagation()},_reload_page=function(){},c.show_genre_options=function(a,b){if(b)var e=b+String.fromCharCode(event.keyCode);else var e=String.fromCharCode(event.keyCode);var a="q="+e+"&filter="+a;d.get_genres(a).then(function(a){c.genres=[];for(var b=0;b<a.genres.data.length;b++)c.genres.push(a.genres.data[b][0].data)})},c.on_genre_selection=function(d){c.genre=d,a.filters.other_filters.genre=d;var e="SUCCESS-'"+d+"' added to filters.",f=notify(a,e,b);c.$emit("reloadRecommendations"),c.$on("destroy",function(){b.cancel(f)})},c.show_author_options=function(a,b){if(b)var d=b+String.fromCharCode(event.keyCode);else var d=String.fromCharCode(event.keyCode);e.search(d,"AUTHOR",3).then(function(a){c.authors=[];for(var b=0;b<a.results.data.length;b++){var d={name:a.results.data[b][0]};c.authors.push(d)}})},c.on_author_selection=function(d){c.author=d,a.filters.other_filters.author=d;var e="SUCCESS-'"+d+"' added to filters.",f=notify(a,e,b);c.$emit("reloadRecommendations"),c.$on("destroy",function(){b.cancel(f)})},c.toggle_menu=function(){c.show_menu?(c.show_menu=!1,c.filter_expanded=!1):(c.show_menu=!0,c.filter_expanded=!0)},_init()}],templateUrl:"/assets/angular/widgets/partials/more_filters.html"}}]),websiteApp.directive("notificationLink",function(){return{restrict:"E",templateUrl:"assets/angular/widgets/partials/notification_link.html"}}),websiteApp.directive("filter",["$rootScope","$timeout","$routeParams",function(a,b,c){return{restrict:"E",scope:{filter:"=data"},controller:["$scope",function(d){_initialise_filters=function(c){if(d.filter){var e=d.filter.id,f=d.filter.name;if(e==parseInt(d.$routeParams.filter_id)){d.active=!0,a.filters[c].push(e);var g="SUCCESS-'"+f+"' added to filters.",h=notify(a,g,b);d.$on("destroy",function(){b.cancel(h)})}else d.active=!1}},_add_listeners=function(){d.$on("resetFilter",function(){d.active&&(d.active=!1)})},(_init=function(){d.$routeParams=c,_initialise_filters("more_filters"),_add_listeners()})()}],templateUrl:"/assets/angular/widgets/partials/filter.html"}}]),websiteApp.directive("recommendationFooter",["scroller",function(a){return{restrict:"E",controller:["$scope",function(b){b.compact_footer=window.innerWidth<1e3?!0:!1,b.goto_info_card=function(){a.scrollTo(0,0,2e3)},b.toggle_footer=function(){b.compact_footer=!0}}],templateUrl:"/assets/angular/widgets/partials/recommendation_footer.html"}}]);