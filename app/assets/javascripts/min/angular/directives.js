websiteApp.directive("moreFilters",["$rootScope","$timeout",function(a,b){return{restrict:"E",controller:["$scope","recommendationService","websiteService",function(c,d,e){_init=function(){c.show_menu=!1,c.countryOptions=[],d.get_countries().then(function(a){c.countryOptions=[{name:"Reset"}],c.countryOptions=c.countryOptions.concat(a.countries)}),d.get_time_groups().then(function(a){c.timeOptions=[{name:"Reset"}];for(var b=0;b<a.times.length;b++){var d=a.times[b][0].data,e=d.name+" ("+d.range+")",f={name:e};c.timeOptions=c.timeOptions.concat([f])}}),d.get_read_times().then(function(a){c.readTimeOptions=[{name:"Reset"}],c.readTimeOptions=c.readTimeOptions.concat(a.read_times)}),_init_dropdown_filters(),_collapse_dropdown_menu()},_collapse_dropdown_menu=function(){c.filter_expanded=!0;b(function(){c.filter_expanded=!1},3e3)},_init_dropdown_filters=function(){c.countrySelected={name:"Filter books by Region"},c.timeSelected={name:"Filter books by Era"},c.readTimeSelected={name:"Filter books by Reading Time"}},c.clear_filter=function(d,e){a.filters.other_filters[e]=null;var f="SUCCESS-"+e+" filter removed",g=notify(a,f,b);c.$on("destroy",function(){b.cancel(g)}),c.$emit("reloadRecommendations")},c.advance_filter_changed=function(d,e){if("Reset"==d.name){var f="SUCCESS-"+e+" filter has been reset.";delete a.filters.other_filters[e],"country"==e?c.countrySelected={name:"Filter books by Region"}:"timeGroup"==e?c.timeSelected={name:"Filter books by Era"}:"readingTime"==e&&(c.readTimeSelected={name:"Filter books by Reading Time"})}else{var f="SUCCESS-"+d.name+" added to filters.";a.filters.other_filters[e]=d.name}var g=notify(a,f,b);c.$on("destroy",function(){b.cancel(g)}),c.$emit("reloadRecommendations")},c.reset_filters=function(){_init_dropdown_filters(),c.$broadcast("resetFilter"),a.filters.more_filters=[],a.filters.other_filters={},c.$emit("reloadRecommendations");var d="SUCCESS-All filters removed.<br/> You can add filters to look for particular books.",e=notify(a,d,b);c.$on("destroy",function(){b.cancel(e)})},c.stop_click_propagation=function(a){a.stopPropagation()},_reload_page=function(){},c.show_genre_options=function(a,b){if(b)var e=b+String.fromCharCode(event.keyCode);else var e=String.fromCharCode(event.keyCode);var a="q="+e+"&filter="+a;d.get_genres(a).then(function(a){c.genres=[];for(var b=0;b<a.genres.data.length;b++)c.genres.push(a.genres.data[b][0].data)})},c.on_genre_selection=function(d){c.genre=d,a.filters.other_filters.genre=d;var e="SUCCESS-'"+d+"' added to filters.",f=notify(a,e,b);c.$emit("reloadRecommendations"),c.$on("destroy",function(){b.cancel(f)})},c.show_author_options=function(a,b){if(b)var d=b+String.fromCharCode(event.keyCode);else var d=String.fromCharCode(event.keyCode);e.search(d,"AUTHOR",3).then(function(a){c.authors=[];for(var b=0;b<a.results.data.length;b++){var d={name:a.results.data[b][0]};c.authors.push(d)}})},c.on_author_selection=function(d){c.author=d,a.filters.other_filters.author=d;var e="SUCCESS-'"+d+"' added to filters.",f=notify(a,e,b);c.$emit("reloadRecommendations"),c.$on("destroy",function(){b.cancel(f)})},c.toggle_menu=function(){c.show_menu?(c.show_menu=!1,c.filter_expanded=!1):(c.show_menu=!0,c.filter_expanded=!0)},_init()}],templateUrl:"/assets/angular/widgets/partials/more_filters.html"}}]),websiteApp.directive("notificationLink",function(){return{restrict:"E",templateUrl:"assets/angular/widgets/partials/notification_link.html"}}),websiteApp.directive("filter",["$rootScope","$timeout","$routeParams",function(a,b,c){return{restrict:"E",scope:{filter:"=data"},controller:["$scope",function(d){_initialise_filters=function(c){if(d.filter){var e=d.filter.id,f=d.filter.name;if(e==parseInt(d.$routeParams.filter_id)){d.active=!0,a.filters[c].push(e);var g="SUCCESS-'"+f+"' added to filters.",h=notify(a,g,b);d.$on("destroy",function(){b.cancel(h)})}else d.active=!1}},_add_listeners=function(){d.$on("resetFilter",function(){d.active&&(d.active=!1)})},(_init=function(){d.$routeParams=c,_initialise_filters("more_filters"),_add_listeners()})()}],templateUrl:"/assets/angular/widgets/partials/filter.html"}}]),websiteApp.directive("recommendationFooter",["scroller",function(a){return{restrict:"E",controller:["$scope",function(b){b.compact_footer=window.innerWidth<1e3?!0:!1,b.goto_info_card=function(){a.scrollTo(0,0,2e3)},b.toggle_footer=function(){b.compact_footer=!0}}],templateUrl:"/assets/angular/widgets/partials/recommendation_footer.html"}}]);;websiteApp.directive("infoCard",["$rootScope","$timeout",function(a,b){return{restrict:"E",controller:["$scope","websiteService",function(c,d){_get_genres=function(){d.get_genres().then(function(a){c.genres=a.genres})},_profile_status_colors=function(){var b=a.user.profile_status;0==b?a.user.profile_status_color="#4374e0":1==b?a.user.profile_status_color="#65b045":2==b?a.user.profile_status_color="#d73d32":3==b?a.user.profile_status_color="#11a9cc":4==b?a.user.profile_status_color="#981b48":5==b?a.user.profile_status_color="#7e3794":6==b?a.user.profile_status_color="#4374e0":7==b?a.user.profile_status_color="#981b48":8==b&&(a.user.profile_status_color="#981b48")},_handle_info_card_bindings=function(){6==a.user.profile_status?navigator.geolocation?navigator.geolocation.getCurrentPosition(function(b){var c=b.coords.latitude,d=b.coords.longitude;a.user.latitude=c,a.user.longitude=d}):x.innerHTML="Geolocation is not supported by this browser.":4==a.user.profile_status||2==a.user.profile_status&&_get_genres()},_get_info_data=function(){d.get_info_data().then(function(a){c.book_counts=a.reading_count_list,c.user_book_count=c.book_counts[0]})},_init=function(){a.user.profile_status=0,_profile_status_colors(),_get_info_data(),c.profileOptions=[{name:"Reader"},{name:"Author"},{name:"Publisher"},{name:"Editor"}],c.gender="Male",c.profileSelected={name:"Reader"}},c.prev_profile_state=function(){a.user.profile_status=0!=a.user.profile_status?a.user.profile_status-1:8,_handle_info_card_bindings(c),_profile_status_colors()},c.next_profile_state=function(){a.user.profile_status=8!=a.user.profile_status?a.user.profile_status+1:0,_handle_info_card_bindings(c),_profile_status_colors()},c.stop_horizontal_scroll=function(a){a.stopPropagation()},c.update_profile=function(){var b=13==event.keyCode;if(b){var c=a.user.profile_status;0==c&&(d.update_profile(a.user),a.user.profile_status=a.user.profile_status+1,_profile_status_colors())}},c.user_profile_changed=function(a){if("Reader"==a.name||"Author"==a.name){c.show_loading_bar=!0;{b(function(){c.show_loading_bar=!1,c.ask_book_count=!0},1e3)}}},c.add_book=function(){},c.add_author=function(){},c.get_search_results=function(a,b,e){e?e+=String.fromCharCode(a.keyCode):e=String.fromCharCode(a.keyCode),d.search(e,b,3).then(function(a){c.search_results=c.search_results.concat(a.results)})},_init()}],templateUrl:"/assets/angular/widgets/base/widget/info_card.html"}}]),websiteApp.directive("toggle",function(){return{restrict:"E",scope:{obj:"=data"},controller:["$scope",function(a){a.toggle=function(){a.active=a.active?!1:!0}}],templateUrl:"/assets/angular/widgets/partials/toggle.html"}}),websiteApp.directive("track",["$rootScope",function(a){return{restrict:"A",link:["scope","element","attrs",function(b,c){c.bind("mouseleave",function(a){_record_details(a)}),c.bind("mouseenter",function(a){_record_details(a)}),c.bind("click",function(a){_record_details(a)}),_record_details=function(b){node_name=b.currentTarget.nodeName,time_stamp=b.timeStamp,thousand_milliseconds=1e5,time_stamp=thousand_milliseconds*(time_stamp%thousand_milliseconds/thousand_milliseconds),action_type=b.type,"A"==node_name&&(node_name=b.currentTarget.href),id=b.currentTarget.id,uid=node_name+":"+id,array=id.split("-"),containsCategory=array.length>1,containsCategory?(category=array[0],book_id=array[1]):(category="",book_id=""),data_json=[{time_stamp:time_stamp,action_type:action_type,node_name:node_name,uid:uid,category:category,book_id:book_id}],a.data=a.data.concat(data_json)}}]}}]),websiteApp.directive("horizontalScroller",function(){return{restrict:"E",templateUrl:"/assets/angular/widgets/base/horizontal_scroller.html"}}),websiteApp.directive("setFocus",["$timeout","$parse","$rootScope",function(a,b,c){return{link:["scope","element","attrs",function(d,e,f){var g=b(f.setFocus);d.$watch(g,function(b){b===!0&&a(function(){e[0].value=String.fromCharCode(c.keyCode),e[0].focus()})})}]}}]),websiteApp.directive("typeAhead",["$timeout","$sce",function(a){return{restrict:"E",scope:{items:"=",prompt:"@",title:"@",id:"@",custom:"@",customOptions:"@",subtitle:"@",model:"=",onSelect:"&",autoPopulate:"&",onClear:"&"},link:["scope","elem","attrs",function(){}],controller:["$scope","$sce","recommendationService",function(b,c){b.is_current=function(a,c){return b.current==a&&(b.currentItem=c),b.current==a},b.set_current=function(a){b.current=a},b.navigate_options=function(){var a=13==event.keyCode;a&&b.handle_selection(b.currentItem)},b.key_up=function(){var a=38==event.keyCode,c=40==event.keyCode,d=8==event.keyCode;a?b.set_current(0!=b.current?b.current-1:b.filtered.length-1):c?b.set_current(b.current!=b.filtered.length-1?b.current+1:0):d&&(void 0==b.model||""==b.model)&&b.onClear()},_init=function(){b.current=0,b.selected=!0,b.name=""},b.focus_on_input=function(){},b.auto_populate=function(){b.autoPopulate()},b.highlight=function(a,b){return c.trustAsHtml(b.replace(new RegExp(a,"gi"),'<span style="font-weight:bold;">$&</span>'))},b.remove_filter=function(){b.model="",b.onClear()},b.handle_selection=function(c){b.model=c.toUpperCase(),b.current=0,b.selected=!0,a(function(){b.onSelect()},200)},_init()}],templateUrl:"assets/angular/widgets/partials/type_ahead.html"}}]),websiteApp.directive("message",function(){return{restrict:"E",controller:["$scope",function(a){a.close_message=function(){"Allow your webcam. Swipe Left|Right to look for more books."==a.message?a.message='Just "START TYPING" anytime to search.':a.message_closed=!0},_init_motion_adaption=function(){},(_init=function(){a.message_closed=!0})()}],templateUrl:"assets/angular/widgets/partials/message.html"}}),websiteApp.directive("notification",function(){return{restrict:"E",scope:{notification:"=data"},templateUrl:"assets/angular/widgets/partials/notification.html"}}),websiteApp.directive("compile",["$compile",function(a){return["scope","element","attrs",function(b,c,d){var e=b.$watch(function(a){return a.$eval(d.compile)},function(d){c.html(d),a(c.contents())(b),e()})}]}]),websiteApp.directive("searchBar",function(){return{restrict:"E",templateUrl:"assets/angular/widgets/partials/search_bar.html"}});;var screen_width=screen.width,width=screen_width*(1220/1320)-150,height=screen.height*(864/1064)-100,page_numbers={content:1,first_sentence:2,characters:3,quotes:4,themes:5,subject_places:6,movies_based:7,tags:8,readers:9,news:10,reviews:11,discussions:12,about_author:13};websiteApp.directive("dock",["$rootScope","$timeout",function(){return{restrict:"E",controller:["$scope",function(a){a.turn_page=function(b){a.$emit("turnPage",b)}}],templateUrl:"/assets/angular/widgets/partials/dock.html"}}]),websiteApp.directive("flipbook",["$rootScope","$timeout","scroller",function(a,b,c){return{restrict:"E",replace:!0,compile:["tElement","tAttrs","transclude",function(){var a=width*(10/1320),b=height*(20/1064),d=width/2+a,e=height+b;return _set_elements_height=function(){var a=height-7*b;$(".elements").css("height",a)},_set_depth=function(){$(".depth").css("height",e-b/2)},_set_pre_css=function(){$(".own-size").css("width",d),$(".own-size").css("height",e),$(".back-side").addClass("fixed"),$("#backCoverFold").css("width",d),$("#backCoverFold").css("height",e),$(".author_thumb").css("width",width/2-a),$(".author_thumb").css("height",height-6*b),_set_depth(),_set_elements_height()},_set_post_css=function(){$(".front-side").addClass("fixed"),$("#coverImage").css("width",d),$("#coverImage").css("height",e),$("#frontCoverFold").css("width",d),$("#frontCoverFold").css("height",e),$(".detailed_book").css("position","fixed"),_set_depth()},_update_depth=function(a,b){var c=a.turn("page"),d=a.turn("pages"),e=16*Math.min(1,2*c/d);b=b||c,$(".detailed_book .p2 .depth").css(b>3?{width:e,left:20-e}:{width:0}),e=16*Math.min(1,2*(d-c)/d),$(".detailed_book .p17 .depth").css(d-3>b?{width:e,right:20-e}:{width:0})},_add_listeners_to_content_page=function(a){a.on("click","[data-page]",function(b){var c=page_numbers[$(b.target).data("page")];a.turn("page",c)})},_add_listeners_to_comment_box=function(a){a.on("click",".post_comment",function(){var a=$($(this).parent()),b=a.siblings(".comment_big_box");a.hide(),b.show(),b.find("input").focus()})},_add_listeners_to_post_comment_discussion_page=function(a,b){a.on("keypress",".discussions .comment_box",function(a){if(10==a.which||13==a.which){var d=$(this),e=d.parent().parent().parent().parent(),f=(e.parent().scope().$index,{comment:d.val(),timestamp:"Just now",user:{},nested:!0}),g=e.scope().discussion.nested;if(g)var h=e.scope().$parent.$index;else var h=e.scope().$index;var i=b.detailed_book.book.discussions[h].comments,j=null==i;b.$apply(function(){j?b.detailed_book.book.discussions[h].comments=[f]:b.detailed_book.book.discussions[h].comments.push(f)});var k=d.parent().siblings(".footer");if(k.show(),d.val(""),d.parent().hide(),g)var l=d.parent().parent().parent().parent().parent().parent().children().last();else var l=d.parent().parent().parent().parent().parent().children(".nested_comments").children().last();var m=$(".discussions .elements")[0];c.scrollToElement(l,0,4e3,m)}})},_add_listeners_to_post_comment_review_page=function(a,b){a.on("keypress",".reviews .comment_box",function(a){if(10==a.which||13==a.which){var d=$(this),e=d.parent().parent().parent().parent(),f=(e.parent().parent().hasClass("elements"),e.parent().parent().parent().parent().scope()),g=f.$index,h={comment:d.val(),timestamp:"Just now",user:{},nested:!0},i=e.scope().discussion.nested;if(i)var j=e.scope().$parent.$index;else var j=e.scope().$index;var k=b.detailed_book.book.reviews[g].comments[j].comments,l=null==k;b.$apply(function(){l?b.detailed_book.book.reviews[g].comments[j].comments=[h]:b.detailed_book.book.reviews[g].comments[j].comments.push(h)});var m=d.parent().siblings(".footer");if(m.show(),d.val(""),d.parent().hide(),i)var n=d.parent().parent().parent().parent().parent().parent().children().last();else var n=d.parent().parent().parent().parent().parent().children(".nested_comments").children().last();var o=$(".reviews .elements")[0];c.scrollToElement(n,0,4e3,o)}})},_add_listeners_to_review_header=function(a){a.on("click",".review .header",function(){var a=$(this),b=a.siblings(),d=$(".reviews .elements")[0];c.scrollToElement(a,0,3e3,d),"block"==b.css("display")?b.css("display","none"):b.show()})},_add_listeners_to_like_buttons=function(a){a.on("click",".like",function(){var a=$(this);if(a.hasClass("like_selected"))a.removeClass("like_selected");else{var b=a.siblings(".dislike");a.addClass("like_selected"),b.removeClass("dislike_selected")}})},_add_listeners_to_dislike_buttons=function(a){a.on("click",".dislike",function(){var a=$(this);if(a.hasClass("dislike_selected"))a.removeClass("dislike_selected");else{var b=a.siblings(".like");a.addClass("dislike_selected"),b.removeClass("like_selected")}})},_add_listeners_to_close_book=function(a,b){a.on("click",".close_book",function(){b.destroy_book()})},_add_listeners_to_write_review=function(a){a.on("click",".write_review",function(){$(".reviews .elements").hide(),$(".reviews .text_editor").show(),$(".close_review").css("display","block"),$(".write_review").hide()})},_add_listeners_to_close_review=function(a){a.on("click",".close_review",function(){$(".reviews .elements").show(),$(".reviews .text_editor").hide(),$(".close_review").hide(),$(".write_review").css("display","block")})},_add_listeners_to_book_tag=function(a){a.on("click",".book_tag",function(){var a=($(this).children(".tag_quotes"),$(".loading_icon")),b=$(this).find(".loading_icon");a.hide(),$(".tag_quotes").hide(),b.css("display","block")})},_bind_text_editor=function(){var a=$(".text_editor").children();a.jqte({focus:function(){scope.$apply(function(){a.parents(".jqte").find(".jqte_toolbar").show(),a.parents(".jqte").click(function(){a.parents(".jqte").find(".jqte_toolbar").show()})})},blur:function(){scope.$apply(function(){a.parents(".jqte").find(".jqte_toolbar").hide()})},change:function(){scope.$apply(function(){ngModel.$setViewValue(a.parents(".jqte").find(".jqte_editor")[0].innerHTML)})}}),a.parents(".jqte").find(".jqte_toolbar").hide()},_bind_popover_click_handler=function(a){a.on("click",".user_tooltip .footer .follow",function(){event.stopPropagation()})},{pre:function(a,b){_add_listeners_to_content_page(b,a),_add_listeners_to_comment_box(b,a),_add_listeners_to_post_comment_discussion_page(b,a),_add_listeners_to_post_comment_review_page(b,a),_add_listeners_to_review_header(b,a),_add_listeners_to_like_buttons(b,a),_add_listeners_to_dislike_buttons(b,a),_add_listeners_to_close_book(b,a),_add_listeners_to_write_review(b,a),_add_listeners_to_close_review(b,a),_add_listeners_to_book_tag(b,a),_set_pre_css(),_bind_text_editor()},post:function(a,b){b.turn({width:width,height:height,display:"single",when:{turning:function(a,b){{var c=$(this);c.turn("page"),c.turn("pages")}_update_depth(c,b),b>=2?$(".detailed_book .p2").hasClass("fixed")||$(".detailed_book .p2").addClass("fixed"):$(".detailed_book .p2").removeClass("fixed"),b<c.turn("pages")?$(".detailed_book .p17").hasClass("fixed")||$(".detailed_book .p17").addClass("fixed"):$(".detailed_book .p17").removeClass("fixed")},turned:function(a,b){{var c=$(this);c.turn("pages")}_update_depth(c)}}}),_set_post_css()}}}],controller:["$scope",function(c){c.is_even=function(a){var b=!1;return a%2==0&&(b=!0),b},c.is_image=function(a){var b=!1;return"img"==a&&(b=!0),b},c.peel=function(){$(".detailed_book").turn("peel","br")},c.remove_peel=function(){$(".detailed_book").turn("peel",!1)},c.zoom_in=function(){},c.destroy_book=function(){a.show_book=!1},c.share_quote=function(){},_click_outside_close=function(){$(".close_book").click(function(b){$(".detailed_book").hide(),$(".book_footer").hide(),$(".fade_cover").hide(),a.show_book=!1,b.stopPropagation()})},_set_css=function(){var b=$(".detailed_book");b.show();{var c=a.book_x,d=a.screen_x;a.total_x}if(c>d){var e=c-d;b.css("margin-left",e+"px")}},_add_listeners=function(){a.$on("turnPage",function(a,b){var c=page_numbers[b];$(".detailed_book").turn("page",c),a.stopPropagation()})},(_init=function(){_set_css(),_add_listeners(),_click_outside_close(),b(function(){var b=$(".detailed_book"),c=a.initPage;b.turn("page",c),$($(".review .content")[0]).css("display","block")},1e3)})()}],templateUrl:"/assets/angular/widgets/partials/book.html"}}]),websiteApp.directive("discussion",function(){return{restrict:"E",scope:{discussion:"=data",index:"=index"},compile:["tElement","tAttrs","transclude",function(){show_nested_discussion=function(){scope.discussion.id}}],controller:["$scope",function(a){a.is_even=function(a){var b=!1;return a%2==0&&(b=!0),b}}],templateUrl:"/assets/angular/widgets/partials/book/discussion.html"}}),websiteApp.directive("angularte",function(){return{restrict:"A",require:"^ngModel",link:["scope","element","attrs","ngModel",function(a,b,c,d){$(function(){b.jqte({focus:function(){a.$apply(function(){b.parents(".jqte").find(".jqte_toolbar").show(),b.parents(".jqte").click(function(){b.parents(".jqte").find(".jqte_toolbar").show()})})},blur:function(){a.$apply(function(){b.parents(".jqte").find(".jqte_toolbar").hide()})},change:function(){a.$apply(function(){d.$setViewValue(b.parents(".jqte").find(".jqte_editor")[0].innerHTML)})}}),b.parents(".jqte").find(".jqte_toolbar").hide()}),d.$render=function(){b.parents(".jqte").find(".jqte_editor")[0]&&(b.parents(".jqte").find(".jqte_editor")[0].innerHTML=d.$viewValue||"")}}]}}),websiteApp.directive("reviews",function(){return{restrict:"E",templateUrl:"assets/angular/widgets/partials/book/reviews.html"}});;function zoomin_book(a,b,c,d){c.initPage=d,a.zoomin_book=!0;var e=event.currentTarget.offsetParent.offsetLeft+event.currentTarget.offsetWidth,f=event.screenX,g=event.currentTarget.offsetParent.offsetParent.scrollWidth;a.$emit("expandBook",a.book.id,e,f,g);var h=b(function(){a.zoomin_book=!1},3e3);a.$on("destroy",function(){b.cancel(h)})}websiteApp.directive("book",["widgetService","$rootScope",function(a,b){return{restrict:"E",scope:{book:"=data"},controller:["$scope",function(a){a.hover=function(){a.hovered=!0},a.mouseout=function(){a.hovered=!1},a.show_focused_tooltip=function(c){if(b.focused_book!=a.book){b.focused_book=a.book;var d=c.currentTarget.offsetParent.offsetParent.offsetLeft-c.pageX+c.clientX,e=screen.width-(d+c.currentTarget.offsetParent.scrollWidth),f=d;e>f?e>400?(d=d+c.currentTarget.offsetParent.scrollWidth-c.currentTarget.offsetLeft,b.focused_book.reposition_tooltip={left:d+"px"}):b.focused_book.reposition_tooltip={right:"0px"}:f>400?(d=screen.width-d,b.focused_book.reposition_tooltip={right:d+"px"}):b.focused_book.reposition_tooltip={left:"0px"}}else b.focused_book=null;c.stopPropagation()},(_init=function(){var b=(a.book.id,Math.floor(20*Math.random())+1+"px"),c=Math.floor(50*Math.random())+1+"px",d=Math.random()<.5,e=Math.random()<.5;e&&(c="-"+c),d&&(b="-"+b)})()}],templateUrl:"/assets/angular/widgets/base/book/book_widget.html"}}]),websiteApp.directive("bookNavbar",["$rootScope","$timeout",function(a,b){return{restrict:"E",controller:["$scope",function(c){c.show_book=function(d){zoomin_book(c,b,a,d)}}],templateUrl:"/assets/angular/widgets/base/book/book_navbar.html"}}]),websiteApp.directive("listDropdown",function(){return{restrict:"E",controller:function(){},templateUrl:"app/assets/javascripts/angular/widgets/base/book/list_dropdown.html"}}),websiteApp.directive("bookBookmark",["$rootScope","$timeout","widgetService",function(a,b,c){return{restrict:"E",controller:["$scope",function(d){d.toggle_bookmarked=function(e){var f=d.book.bookmark_status,g=d.book.title,h=d.book.author_name;if(1==f){d.book.bookmark_status=0;var i="SUCCESS-"+g+" by "+h+" has been removed from your bookmark shelf.";d.$emit("removeFromBookmarks","BOOK",d.book)}else{d.book.bookmark_status=1;var i="SUCCESS-"+g+" by "+h+" has been added to your bookmark shelf.";d.$emit("addToBookmarks","BOOK",d.book),a.$broadcast("glowBookmark")}var j=notify(a,i,b);d.$on("destroy",function(){b.cancel(j)}),c.bookmark("BOOK",d.book.id,d.book.bookmark_status),e.stopPropagation()}}],templateUrl:"/assets/angular/widgets/base/book/bookmark.html"}}]),websiteApp.directive("bookInteract",["websiteService",function(a){return{restrict:"E",controller:["$scope",function(b){_init=function(){b.setStatus()},b.setStatus=function(a){b.read=1==a?!0:!1},b.show_bookmark_options=function(a){a.stopPropagation()},b.handle_selection=function(a){var c=$(".comment_box").val().split(" "),d=$(".comment_box").siblings().html().split(" "),e=(String.fromCharCode(event.keyCode),c.length);if(1==e)var f=c.slice(0,e-1).join(" ").trim(),g=d.slice(0,e-1).join(" ").trim();else var f=c.slice(0,e-1).join(" ")+" ",g=d.slice(0,e-1).join(" ")+" ";c.pop(),d.pop(),8==event.keyCode,b.hash_tagging;$(".comment_box").siblings().html(g+" <b>"+a+"</b>"),$(".comment_box").val(f+" "+a),b.hash_tags=null},b.set_current=function(){},b.handle_backspace=function(a){var c=$(a.currentTarget).val().split(" "),d=$(a.currentTarget).siblings().html().split(" "),e=(String.fromCharCode(a.keyCode),c.length);if(1==e)var f=c.slice(0,e-1).join(" "),g=d.slice(0,e-1).join(" ");else var f=c.slice(0,e-1).join(" ")+" ",g=d.slice(0,e-1).join(" ")+" ";var h=c.pop(),i=d.pop(),j=8==a.keyCode,k=b.hash_tagging;if(j){if("#"==h)b.hash_tagging=!1,b.hash_tags=[],$(a.currentTarget).siblings().html(g);else if(k)$(a.currentTarget).siblings().html(g),$(a.currentTarget).val(f),b.hash_tagging=!1,b.hash_tags=[],a.preventDefault();else{var l=">"==i[i.length-1];if(l)$(a.currentTarget).siblings().html(g),$(a.currentTarget).val(f),b.hash_tags=[],a.preventDefault();else{var m=$(a.currentTarget).siblings().html();$(a.currentTarget).siblings().html(m.substring(0,m.length-1))}}$(a.currentTarget).val()&&""!=$(a.currentTarget).val()||$(a.currentTarget).siblings().html("")}a.stopPropagation()},b.handle_hash_tags=function(c){{var d=$(c.currentTarget).val().split(" "),e=String.fromCharCode(c.keyCode),f=d.length,g=(d.slice(0,f-1).join(" "),d.pop()),h=""==g;b.hash_tagging}if(h&&"#"==e){var i="<b>"+e+"</b>";b.hash_tagging=!0,$(c.currentTarget).siblings().append(i)}else if(h&&"+"==e){var i="<b>"+e+"</b>";b.hash_tagging=!0,$(c.currentTarget).siblings().append(i),b.search_for="TAGS"}else if(h&&"@"==e){var i="<b>"+e+"</b>";b.hash_tagging=!0,$(c.currentTarget).siblings().append(i),b.search_for="[AUTHORS, READERS]"}else" "==e?(b.hash_tagging=!1,$(c.currentTarget).siblings().append(e),b.search_for=null):b.hash_tagging?$(c.currentTarget).siblings().find("b:last").append(e):$(c.currentTarget).siblings().append(e);b.search_for&&(string_to_be_searched=g.slice(1,g.length)+""+e,a.search(string_to_be_searched.trim(),b.search_for,3).then(function(a){b.hash_tags=a.results})),c.stopPropagation()},_init()}],templateUrl:"/assets/angular/widgets/base/book/interact_widget.html"}}]),websiteApp.directive("rate",["$rootScope","$timeout","widgetService",function(a,b,c){return{restrict:"E",scope:{rate_object:"=data"},controller:["$scope",function(d){d.show_if_rated=function(a){d.temp_rating=d.rate_object.user_rating,d.rate_object.user_rating=parseInt(a)+1,d.ready_to_rate=!0},d.reset_rating=function(){d.ready_to_rate=!1,d.rate_object.user_rating=d.temp_rating},d.mark_as_rated=function(e,f){d.rate_object.rated=!0,d.rate_object.user_rating=parseInt(e)+1,d.temp_rating=parseInt(e)+1;var g=notify(a,"SUCCESS-Thanks, This will help us to recommend you better books.",b);d.$on("destroy",function(){b.cancel(g)}),c.rate_this_book(d.rate_object.id,d.rate_object.user_rating),f.stopPropagation()},d.is_active=function(a){var b=!1;if(d.rate_object){var c=parseInt(a)+1;c<=d.rate_object.user_rating&&(b=!0)}return b}}],templateUrl:"/assets/angular/widgets/base/book/rate.html"}}]),websiteApp.directive("focusedBook",["$rootScope","$timeout","widgetService",function(a,b,c){return{restrict:"E",controller:["$scope",function(d){d.stop_propagation=function(a){a.stopPropagation()},d.close_focused_tooltip=function(){a.focused_book=null},d.own_this_book=function(){if(d.have_this_book){d.have_this_book=!1;var e="SUCCESS-Are you sure, you don't have a copy of "+d.focused_book.title+"? <br/>Your friends might be looking for this book."}else{d.have_this_book=!0;var e="SUCCESS-Thanks, Your friends will now know that you own a copy of "+d.focused_book.title}var f=d.focused_book.id,g=notify(a,e,b);c.own_this_book(f,d.have_this_book),d.$on("destroy",function(){b.cancel(g)})},d.record_read_time=function(e){d.focused_book.read_timer=e;{var f="SUCCESS-Thanks we have recorded your approximate time to read "+d.focused_book.title+". <br/> This will help us to recommend you books according to your reading skills.";notify(a,f,b)}c.record_time(d.focused_book.id,e),d.$on("destroy",function(){b.cancel("timeout_event")})},d.is_timer=function(a){var b=!1;return d.focused_book.read_timer==a&&(b=!0),b},d.close_interaction_box=function(){a.focused_book.interact=!1,d.hash_tags=[]},d.stop_horizontal_scroll=function(a){a.stopPropagation()}}],templateUrl:"/assets/angular/widgets/base/book/focused_book.html"}}]),websiteApp.directive("interactionBox",["$rootScope","$timeout","widgetService",function(){return{restrict:"E",controller:["$scope",function(a){a.stop_propagation=function(a){a.stopPropagation()},_init()}],templateUrl:"assets/angular/widgets/base/book/interaction_box.html"}}]),websiteApp.directive("bookTags",["$rootScope","$timeout",function(a,b){return{restrict:"E",controller:["$scope",function(c){c.show_book=function(d){zoomin_book(c,b,a,d)}}],templateUrl:"/assets/angular/widgets/base/book/book_tags.html"}}]),websiteApp.directive("recommend",["$rootScope","$timeout","widgetService",function(a,b,c){return{restrict:"E",scope:{recommend_object:"=data"},controller:["$scope",function(d){d.select_thumb=function(a){var b="true"==a.currentTarget.dataset.selected;b?(a.currentTarget.dataset.selected=!1,a.currentTarget.style.border="2px solid transparent"):(a.currentTarget.dataset.selected=!0,a.currentTarget.style.border="2px solid")},d.recommend=function(){var e=d.recommend_object.title,f=d.recommend_object.author_name;if(d.recommend_object.recommended){d.recommend_object.recommended=!1;var g="SUCCESS-"+e+" by "+f+" has been recommended to selected friends.",h=notify(a,g,b);d.$on("destroy",function(){b.cancel(h)}),c.recommend("BOOK",d.recommend_object.id,d.recommend_object.recommended)}else d.recommend_object.recommended=!0},(_init=function(){d.user={},d.user.friends=a.user.friends})()}],templateUrl:"/assets/angular/widgets/base/book/recommend.html"}}]),websiteApp.directive("markAsRead",["$rootScope","$timeout","widgetService",function(a,b,c){return{restrict:"E",controller:["$scope",function(d){d.markAsRead=function(e){var f=d.book.title,g=d.book.author_name;if(d.book.status){d.book.status=0,d.$emit("removeFromShelf","BOOK",d.book);var h="ADVISE-Book "+f+" by "+g+" has been removed from your Read Shelf.<br/> You can mark as read again."}else{d.book.status=1,d.$emit("addToShelf","BOOK",d.book),a.$broadcast("glowShelf");var h="ADVISE-Book "+f+" by "+g+" has been added to your Read Shelf.<br/> Also please rate this book.";d.$on("destroy",function(){b.cancel(i),b.cancel(glow_event)})}var i=notify(a,h,b);c.mark_as_read(d.book.id,d.read),e.stopPropagation()}}],templateUrl:"/assets/angular/widgets/base/book/mark_as_read.html"}}]);var global_display_timer=0;;websiteApp.directive("author",["$rootScope","widgetService",function(a){return{restrict:"E",scope:{author:"=data"},controller:["$scope",function(b){b.hover=function(){b.hovered=!0},b.mouseout=function(){b.hovered=!1},b.show_focused_tooltip=function(c){if(a.focused_author!=b.author){a.focused_author=b.author;var d=c.currentTarget.offsetParent.offsetParent.offsetLeft-c.pageX+c.clientX,e=screen.width-(d+c.currentTarget.offsetParent.scrollWidth),f=d;e>f?e>400?(d=d+c.currentTarget.offsetParent.scrollWidth-c.currentTarget.offsetLeft,a.focused_author.reposition_tooltip={left:d+"px",top:"60px"}):a.focused_author.reposition_tooltip={right:"0px",top:"60px"}:f>400?(d=screen.width-d,a.focused_author.reposition_tooltip={right:d+"px",top:"60px"}):a.focused_author.reposition_tooltip={left:"0px",top:"60px"}}else a.focused_author=null;c.stopPropagation()},(_init=function(){b.active_author_filter=!0})()}],templateUrl:"/assets/angular/widgets/base/author/author_widget.html"}}]),websiteApp.directive("focusedAuthor",["$rootScope","$timeout","widgetService",function(a){return{restrict:"E",controller:["$scope",function(b){b.stop_propagation=function(a){a.stopPropagation()},b.close_focused_tooltip=function(){a.focused_author=null},b.close_interaction_box=function(){b.focused_author.interact=!1,b.hash_tags=[]},b.stop_horizontal_scroll=function(a){a.stopPropagation()}}],templateUrl:"/assets/angular/widgets/base/author/focused_author.html"}}]),websiteApp.directive("authorBookmark",["$rootScope","$timeout","widgetService",function(a,b,c){return{restrict:"E",controller:["$scope",function(d){d.toggle_bookmarked=function(e){var f=d.author.bookmark_status,g=d.author.name;if(1==f){d.author.bookmark_status=0;var h="SUCCESS-Author "+g+" has been removed from your bookmark shelf.";d.$emit("removeFromBookmarks","AUTHOR",d.author)}else{d.author.bookmark_status=1;var h="SUCCESS-AUTHOR "+g+" has been added to your bookmark shelf.";d.$emit("addToBookmarks","AUTHOR",d.author),a.$broadcast("glowBookmark")}var i=notify(a,h,b);d.$on("destroy",function(){b.cancel(i)}),c.bookmark("AUTHOR",d.author.id,d.author.bookmark_status),e.stopPropagation()}}],templateUrl:"/assets/angular/widgets/base/author/bookmark.html"}}]),websiteApp.directive("authorInteract",["websiteService",function(a){return{restrict:"E",controller:["$scope",function(b){_init=function(){b.setStatus()},b.setStatus=function(a){b.read=1==a?!0:!1},b.handle_selection=function(){},b.set_current=function(){},b.handle_backspace=function(a){var c=$(a.currentTarget).val().split(" "),d=$(a.currentTarget).siblings().html().split(" "),e=(String.fromCharCode(a.keyCode),c.length);if(1==e)var f=c.slice(0,e-1).join(" "),g=d.slice(0,e-1).join(" ");else var f=c.slice(0,e-1).join(" ")+" ",g=d.slice(0,e-1).join(" ")+" ";var h=c.pop(),i=d.pop(),j=8==a.keyCode,k=b.hash_tagging;if(j){if("#"==h)b.hash_tagging=!1,b.hash_tags=[],$(a.currentTarget).siblings().html(g);else if(k)$(a.currentTarget).siblings().html(g),$(a.currentTarget).val(f),b.hash_tagging=!1,b.hash_tags=[],a.preventDefault();else{var l=">"==i[i.length-1];if(l)$(a.currentTarget).siblings().html(g),$(a.currentTarget).val(f),b.hash_tags=[],a.preventDefault();else{var m=$(a.currentTarget).siblings().html();$(a.currentTarget).siblings().html(m.substring(0,m.length-1))}}$(a.currentTarget).val()&&""!=$(a.currentTarget).val()||$(a.currentTarget).siblings().html("")}a.stopPropagation()},b.handle_hash_tags=function(c){{var d=$(c.currentTarget).val().split(" "),e=String.fromCharCode(c.keyCode),f=d.length,g=(d.slice(0,f-1).join(" "),d.pop()),h=""==g;b.hash_tagging}if(h&&"#"==e){var i="<b>"+e+"</b>";b.hash_tagging=!0,$(c.currentTarget).siblings().append(i)}else if(h&&"+"==e){var i="<b>"+e+"</b>";b.hash_tagging=!0,$(c.currentTarget).siblings().append(i),b.search_for="TAGS"}else if(h&&"@"==e){var i="<b>"+e+"</b>";b.hash_tagging=!0,$(c.currentTarget).siblings().append(i),b.search_for="[AUTHORS, authorS]"}else" "==e?(b.hash_tagging=!1,$(c.currentTarget).siblings().append(e),b.search_for=null):b.hash_tagging?$(c.currentTarget).siblings().find("b:last").append(e):$(c.currentTarget).siblings().append(e);b.search_for&&(string_to_be_searched=g.slice(1,g.length)+""+e,a.search(string_to_be_searched.trim(),b.search_for,3).then(function(a){b.hash_tags=a.results})),c.stopPropagation()}}],templateUrl:"/assets/angular/widgets/base/author/author_interact.html"}}]);;websiteApp.directive("reader",["$rootScope","widgetService",function(a){return{restrict:"E",scope:{reader:"=data"},controller:["$scope",function(b){b.hover=function(){b.hovered=!0},b.mouseout=function(){b.hovered=!1},b.show_focused_tooltip=function(c){if(a.focused_reader!=b.reader){a.focused_reader=b.reader;var d=c.currentTarget.offsetParent.offsetParent.offsetLeft-c.pageX+c.clientX,e=screen.width-(d+c.currentTarget.offsetParent.scrollWidth),f=d;e>f?e>400?(d=d+c.currentTarget.offsetParent.scrollWidth-c.currentTarget.offsetLeft,a.focused_reader.reposition_tooltip={left:d+"px",top:"60px"}):a.focused_reader.reposition_tooltip={right:"0px",top:"60px"}:f>400?(d=screen.width-d,a.focused_reader.reposition_tooltip={right:d+"px",top:"60px"}):a.focused_reader.reposition_tooltip={left:"0px",top:"60px"}}else a.focused_reader=null;c.stopPropagation()},(_init=function(){b.active_reader_filter=!0})()}],templateUrl:"/assets/angular/widgets/base/reader/reader_widget.html"}}]),websiteApp.directive("focusedReader",["$rootScope","$timeout","widgetService",function(a){return{restrict:"E",controller:["$scope",function(b){b.stop_propagation=function(a){a.stopPropagation()},b.close_focused_tooltip=function(){a.focused_reader=null},b.close_interaction_box=function(){b.focused_reader.interact=!1,b.hash_tags=[]},b.stop_horizontal_scroll=function(a){a.stopPropagation()}}],templateUrl:"/assets/angular/widgets/base/reader/focused_reader.html"}}]),websiteApp.directive("messageBox",function(){return{restrict:"E",controller:["$scope",function(a){a.close_message_box=function(){a.reader.show_message_box=!1}}],templateUrl:"/assets/angular/widgets/base/reader/message_box.html"}}),websiteApp.directive("readerInteract",["websiteService",function(){return{restrict:"E",controller:["$scope",function(a){a.toggle_message_box=function(){a.reader.show_message_box=a.reader.show_message_box?!1:!0}}],templateUrl:"/assets/angular/widgets/base/reader/reader_interact.html"}}]);;websiteApp.directive("category",function(){return{restrict:"E",scope:{widget:"@"},controller:["$scope",function(a){a.initVerticalText=function(){var b="book"==a.widget,c="reader"==a.widget,d="author"==a.widget;if(b)var e=a.$parent.book;else if(c)var e=a.$parent.reader;else if(d)var e=a.$parent.author;if(e){var f=e.category.name;f&&(a.nameArray=f.split("")),a.rating=e.rating}}}],templateUrl:"/assets/angular/widgets/base/widget/category.html"}}),websiteApp.directive("messageApp",["websiteService",function(){return{restrict:"E",controller:["$scope",function(a){a.send_message=function(){}}],templateUrl:"/assets/angular/widgets/base/widget/message_app.html"}}]),websiteApp.directive("follow",["$rootScope","$timeout","widgetService",function(a,b,c){return{restrict:"E",controller:["$scope",function(d){d.toggle_follow=function(){if(d.reader){var e=d.reader.name;if(d.reader.follow){d.reader.follow=!1,d.$emit("removeFromShelf","READER",d.reader);var f="SUCCESS-Reader "+e+" has been removed from your follow list."}else{d.reader.follow=!0,d.$emit("addToShelf","READER",d.reader);var f="SUCCESS-You are now following "+e+"."}var g=notify(a,f,b);c.follow(d.reader.id,"READER",d.reader.follow)}else if(d.author){var h=d.author.name;if(d.author.follow){d.author.follow=!1,d.$emit("removeFromShelf","AUTHOR",d.author),c.follow(d.author.id,"AUTHOR",d.author.follow);var f="SUCCESS-Author "+h+" has been removed from your follow list."}else{d.author.follow=!0,d.$emit("addToShelf","AUTHOR",d.author);var f="SUCCESS-You are now following Author "+h+"."}var g=notify(a,f,b);c.follow(d.author.id,"AUTHOR",d.author.follow)}g&&d.$on("destroy",function(){b.cancel(g)})}}],templateUrl:"/assets/angular/widgets/base/widget/follow.html"}}]),websiteApp.directive("widgetThumb",["$timeout","$rootScope",function(a){return{restrict:"E",controller:["$scope",function(b){b.show_images=function(){var c=500;2500==global_display_timer?global_display_timer=c:global_display_timer+=c;var d=a(function(){if(b.book)var a=b.book;else if(b.author)var a=b.author;else if(b.reader)var a=b.reader;a&&(b.thumb_style={background:"url('"+a.thumb.url+"')"})},global_display_timer);b.$on("destroy",function(){a.cancel(d)})},_get_obj=function(){if(b.book)var a=b.book;else if(b.author)var a=b.author;else if(b.reader)var a=b.reader;return a},(_init=function(){var a=_get_obj();a&&(b.thumb_style={"background-color":a.thumb.background_color}),b.show_images()})()}],templateUrl:"/assets/angular/widgets/base/widget/widget_thumb.html"}}]);