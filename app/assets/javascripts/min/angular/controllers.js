homeApp.controller("appController",["$scope","$rootScope","$mdSidenav","$mdDialog","shelfService","userService","$cookieStore","$timeout","$location","feedService","$filter","Facebook","websiteService","$mdBottomSheet",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){a.stop_propagation=function(a){a.stopPropagation()},a.invite_friends=function(a){d.show({templateUrl:"assets/angular/html/shared/invite.html",clickOutsideToClose:!0,hasBackdrop:!1,targetEvent:a,scope:b,preserveScope:!0}),a.stopPropagation()},a.show_signin_options=function(a){c("signup").toggle(),a.stopPropagation()},a.show_apps=function(){c("apps").toggle(),event.stopPropagation()},a.show_search_bar=function(){a.info.mobile_search=!a.info.mobile_search},a.show_indexes=function(b,c){a.book=b;var e=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.room.rating||(deleteCookie("todo"),f.update_todo_key("room/rating")))};e(),d.show({templateUrl:"assets/angular/html/shared/rating.html",clickOutsideToClose:!0,hasBackdrop:!1,targetEvent:c,scope:a,preserveScope:!0}),c.stopPropagation()},a.toggle_notifications=function(b){a.info.notifications_seen=!0,a.info.loading=!0;var d=h(function(){j.get_notifications().then(function(b){a.info.loading=!1,a.notifications=[],angular.forEach(b,function(a){k("timestamp")(a.created_at,"date:'h:mm a, dd MMM'");switch(a.label){case"FollowsNode":a.message="<div layout-padding><div><a href='/profile?id="+a.data.user.id+"'>"+a.data.user.name+"</a><span> started following you.</span></div></div>";break;case"RecommendNode":a.message="<div layout-padding><div><span><a href='/profile?id="+a.data.user.id+"'>"+a.data.user.name+"</a> recommended you <a href='/book?id="+a.data.book.id+"'>"+a.data.book.title+"</a><span><span>&nbsp;by&nbsp;<a href='/author?id="+a.data.author.id+"'>"+a.data.author.name+"</a></span>.</div></div>";break;case"BorrowNode":a.message="<div layout-padding><div><a href='/profile?id="+a.data.user.id+"'>"+a.data.user.name+"</a><span> is looking to borrow </span><span><a href='/book?id="+a.data.book.id+"'>"+a.data.book.title+"</a></span><span>&nbsp;by&nbsp;<a href='/author?id="+a.data.author.id+"'>"+a.data.author.name+"</a></span></div></div>"}this.push(a)},a.notifications)})},100);a.$on("destroy",function(){h.cancel(d)}),c("notifications").toggle(),a.navigation_options=!1,b.stopPropagation()},a.close_popups=function(c){a.show_notifications=!1,b.shelves_visible=!1,a.navigation_options=!1,angular.isUndefined(c)&&(a.info.status_state=!1)},a.toggleLeft=function(a){c("left").toggle(),a.stopPropagation()},a.toggleRight=function(a){c("right").toggle(),a.stopPropagation()},a.stop_propagation=function(a){a.stopPropagation()},a.logout=function(){a.$on("Facebook:statusChange",function(a,b){FB.logout()}),window.location.href="/signup"},a.toggle_navigation_options=function(b){a.navigation_options=!a.navigation_options,a.show_notifications=!1,b.stopPropagation()};var o=function(){var c=h(function(){angular.isUndefined(b.user)||angular.isUndefined(b.user.id)?f.get_user_details().then(function(c){angular.equals(c,{})&&""!=getCookie("logged")?(deleteCookie("logged"),a.info.hide_signin=!1):(b.user=c,p())}):p()},100);a.$on("destroy",function(){h.cancel(c)})},p=function(){var c=function(){l.api("me/picture?redirect=false&type=large",function(a){angular.isDefined(a)&&a.url!=b.user.image_url&&m.save_user_info(a)})};a.$on("Facebook:statusChange",function(a,b){c()})};a.fetch_todos=function(){f.get_todos("home").then(function(b){a.todo=b,setCookie("todo",JSON.stringify(b))})},a.show_full_todos=function(b){a.flatten_todo=JSON.flatten(a.todo),d.show({templateUrl:"assets/angular/html/todo/list.html",clickOutsideToClose:!0,hasBackdrop:!0,targetEvent:b,scope:a,preserveScope:!0}),b.stopPropagation()},a.show_quiz=function(b){a.key=b},a.handle_icons=function(){"/spaces"==window.location.pathname?a.info.pr_spaces=!0:"/books"==window.location.pathname?a.info.pr_books=!0:"/authors"==window.location.pathname?a.info.pr_authors=!0:"/products"==window.location.pathname?a.info.pr_products=!0:"/news_group"==window.location.pathname?a.info.pr_news=!0:"/quiz"==window.location.pathname?a.info.pr_quizzes=!0:"/games"==window.location.pathname?a.info.pr_games=!0:"/search"==window.location.pathname?a.info.pr_search=!0:"/rooms"==window.location.pathname&&(a.info.pr_rooms=!0)};(function(){a.visible_search_bar=!0,a.info={search_ready:!1},a.info.show_share=!1;i.absUrl();if(a.search_results=[],""!=getCookie("logged")){a.info.hide_signin=!0,o();var b=getCookie("todo");b?a.todo=JSON.parse(b):a.fetch_todos()}a.data={selectedIndex:0},a.key=3,a.handle_icons()})()}]);;homeApp.controller("notificationController",["$scope","feedService","$timeout",function(a,b,c){a.stop_propagation=function(a){a.stopPropagation()}}]);;homeApp.controller("searchController",["$scope","searchService","$location",function(a,b,c){a.query_search=function(c){c.length>2?(a.info.loading=!0,params={q:c,count:4},b.raw(params).then(function(b){if(delete a.info.search_results,a.info.loading=!1,a.did_you_mean=!1,angular.forEach(b,function(b){b.fuzzy&&(a.did_you_mean=!0),b.first_name&&(b.name=b.first_name+" "+b.last_name)}),a.info.search_results=b,a.did_you_mean){var d={name:"Did you mean",labels:[]};a.info.search_results.splice(0,0,d)}if(b.length>0){var d={name:"Show all results",show_all:!0,labels:[],search_text:c};a.info.search_results.push(d)}})):angular.isUndefined(c)||""==c?angular.isUndefined(a.top_searches)?b.get_top_results().then(function(b){a.info.search_results=b,a.top_searches=b}):a.info.search_results=a.top_searches:a.info.search_results=[]},a.get_default_results=function(c,d){(angular.isUndefined(c)||""==c)&&(angular.isUndefined(a.top_searches)?b.get_top_results().then(function(b){a.info.search_results=b,a.top_searches=b}):a.info.search_results=a.top_searches),d.stopPropagation()},a.on_select=function(b){if(delete a.info.search_results,angular.isDefined(b)){var c=b.labels.indexOf("Book")>=0,d=b.labels.indexOf("Author")>=0,e="User"==b.labels,f="Blog"==b.labels,g="News"==b.labels,h="Community"==b.labels,i="";c?i="/book?q="+b.id:d?i="/author?q="+b.id:e?i="/profile?q="+b.id:f?i=b.blog_url:g?i="/news?q="+b.id:h?i="/room?q="+b.id:b.show_all&&(i="/search?q="+b.search_text),""!=i&&(window.location.href=i)}};(function(){a.info.mobile_search=!0,a.info.search_results=[],a.info.search_ready=!0})()}]);;homeApp.controller("leftController",["$scope","$timeout","$mdSidenav","$log",function(a,b,c,d){a.close=function(){c("left").close()}}]);;homeApp.controller("rightController",["$scope","$timeout","$mdSidenav","$log",function(a,b,c,d){a.close=function(){c("right").close()}}]);;homeApp.controller("shelfController",["$scope","$mdBottomSheet","$mdToast","shelfService","$rootScope","sharedService",function(a,b,c,d,e,f){a.listItemClick=function(c){var d=a.items[c];b.hide(d)},a.toggle_bookmark=function(b,c){f.toggle_bookmark(b,c,e.bookmark_object,a)},a.add_new_label=function(b){var f={bottom:!1,top:!0,left:!1,right:!0},g=function(){return Object.keys(f).filter(function(a){return f[a]}).join(" ")},h=!1;angular.isUndefined(a.new_label)||""==a.new_label?alert("Enter a valid shelf."):(angular.forEach(e.labels,function(b){b.label_name.toLowerCase()==a.new_label.toLowerCase()&&(h=!0)}),h?(alert("Shelf already exists."),a.new_label=""):d.add_new_label(a.new_label,b).then(function(b){angular.isUndefined(a.labels)&&(a.labels=[]),a.labels.push(b),c.show({controller:"toastController",templateUrl:"assets/angular/html/shared/toast/bookmark_action.html",hideDelay:3e3,position:g()})})),delete a.new_label},a.toggle_shelves=function(){a.show_all=!a.show_all};(function(){a.toast_position={bottom:!1,top:!0,left:!1,right:!0},a.bookmark_object=e.bookmark_object})()}]);;homeApp.controller("buyController",["$scope","$rootScope","bookService","sharedService","$mdSidenav","$timeout","$sce","$location",function(a,b,c,d,e,f,g,h){var i=function(){return""==getCookie("logged")||null==getCookie("logged")};a.notify_friends=function(){var d=""==getCookie("logged")||null==getCookie("logged");if(d)e("signup").toggle();else{var f=b.active_book.id||b.active_book.book_id;a.info.loading||(a.info.loading=!0,c.send_borrow_notification(f).then(function(){a.info.loading=!1,a.hide_link=!0}))}},a.toggle_bookmark=function(c){if(i())e("signup").toggle();else{var f=b.active_book.id||b.active_book.book_id,g={label_key:"IOwnThis"},h={type:"Book",id:f};d.toggle_bookmark(g,c,h,a)}},a.get_prices_and_reviews=function(b){angular.isUndefined(a.prices)&&(a.prices=[]),angular.forEach(b.prices,function(a){null!=a&&this.push(a)},a.prices),angular.isDefined(a.reviews)||(a.reviews=b.reviews,angular.isDefined(a.reviews)&&(a.reviews.user_review_iframe=g.trustAsResourceUrl(a.reviews.user_review_iframe)))};(function(){if(angular.isDefined(b.active_book)){var d=b.active_book.id||b.active_book.book_id,e=b.active_book.isbn;if(angular.isUndefined(a.book)&&(a.book=b.active_book),!i()){var g=f(function(){c.get_borrow_users(d).then(function(b){a.borrow_users=b})},100);a.$on("destroy",function(){f.cancel(g)})}if(null!=e){var j=f(function(){c.all_prices(e).then(function(b){a.get_prices_and_reviews(b)})},100),k=f(function(){a.loading_buy_options=!0,c.more_prices(e).then(function(b){a.get_prices_and_reviews(b),a.loading_buy_options=!1})},100);a.$on("destroy",function(){f.cancel(j),f.cancel(k)})}}else h.path("/book/timeline")})()}]);;homeApp.controller("recommendController",["$scope","networkService","$timeout","$mdSidenav",function(a,b,c,d){a.toggle_recommend=function(){a.show_recommend=!a.show_recommend,angular.isUndefined(a.users_list)&&a.search_friends("")},a.search_friends=function(c){a.info.share_loading=!0,b.search_friends(c).then(function(b){a.users_list=b,a.info.share_loading=!1})};var e=function(){return""==getCookie("logged")||null==getCookie("logged")};a.show_signin=function(){d("signup").toggle()};(function(){if(e())a.sign_in=!0;else{var b=c(function(){a.toggle_recommend()},100);a.$on("destroy",function(){c.cancel(b)})}})()}]);;homeApp.controller("shareController",["$scope","$rootScope","$timeout","ShareOptions","$routeParams","$mdBottomSheet","statusService","WebsiteUIConstants","bookService","ColorConstants","sharedService","Emotions","$mdSidenav",function(a,b,c,d,e,f,g,h,i,j,k,l,m){a.play_type_key=function(b){a.mute||a.info.show_share&&(angular.isUndefined(a.current_track)||0==a.current_track?(a.current_track=1,document.getElementById("audiotag1").play()):1==a.current_track?(a.current_track=2,document.getElementById("audiotag2").play()):(a.current_track=0,document.getElementById("audiotag3").play()),b.stopPropagation())},a.mute_volume=function(){a.mute=!a.mute},a.set_pages=function(b,c){a.info.page_count=c,a.info.current_page=b,a.hide_page_count=!0},a.show_page_count=function(){a.hide_page_count=!1},a.toggle_buy=function(){a.hide_buy=!a.hide_buy},a.toggle_borrow=function(){a.hide_borrow=!a.hide_borrow},a.deselect_book=function(){delete a.info.page_count,delete a.info.current_page,delete a.selected_book,a.deselect_emotion(),delete a.related_info,delete a.info.status_books,a.info.status_books=[],a.show_relevant_books()},a.show_interesting_details=function(c){angular.isUndefined(a.selected_book)&&(a.selected_book=c,a.info.book=c,a.info.status_books=[c],angular.isUndefined(b.active_book)&&(b.active_book=c,a.setting_rootscope=!0))},a.show_share_options=function(b){f.show({templateUrl:"assets/angular/html/share/_share_options.html",controller:"optionsController",scope:a,preserveScope:!0,targetEvent:b}).then(function(a){})},a.back=function(c){a.info.show_share=!1,a.info.show_book_share=!1,delete b.active_shelf,a.setting_rootscope&&delete b.active_book,event.stopPropagation()},a.handle_backspace=function(b){var c=a._detect_key(b);c.backspace_or_delete&&a.init_reading_options()},a.search_status_books=function(b){a.info.status_books=[],a.search_books(b,a.info.status_books)},a.search_books=function(b,c){angular.isUndefined(c)&&(a.searched_books=[],c=a.searched_books),a.info.share_loading=!0,i.search_books(b,10).then(function(b){a.info.share_loading=!1,a.did_you_mean=!0,angular.forEach(b,function(a){var b=Math.floor(Math.random()*j.value.length);angular.isUndefined(a.fuzzy)&&(a=angular.extend(a,{color:j.value[b]}),this.push(a))},c)})},a.add_book=function(c){if(b.active_shelf){var d={id:c.id||c.book_id,type:"Book"};k.toggle_bookmark(b.active_shelf,!1,d,a),delete b.active_shelf,a.info.show_share=!1}else a.info.book=c};var n=function(){return""==getCookie("logged")||null==getCookie("logged")};a.post_status=function(){if(n())m("signup").toggle();else{a.posting=!0,a.info.share_loading=!0;var b={};a.reading_status_selected&&a.selected_book&&(a.info.wrapper_status="",a.info.status=a.info.status||"",a.active_emotion?(a.info.status=a.info.status+" Feeling "+a.active_emotion.name+" "+a.reading_options[a.active_id].emotion_status,a.info.wrapper_status=a.info.wrapper_status+"<span class='custom_title light_title'><span>Feeling "+a.active_emotion.name+"  </span><span>"+a.reading_options[a.active_id].emotion_status+"</span></span>"):(a.info.status=a.info.status+" "+a.reading_options[a.active_id].status,a.info.wrapper_status=a.info.wrapper_status+"<span><span class='custom_title light_title'><span>"+a.reading_options[a.active_id].status+"</span></span>"),a.info.status=a.info.status+" "+a.selected_book.title+" by "+a.selected_book.author_name,a.info.wrapper_status=a.info.wrapper_status+"<span class='big_title bold_light_title'>"+a.selected_book.title+" </span><span class='less_important'>by "+a.selected_book.author_name+"</span>",a.info.current_page&&(a.info.status=a.info.status+" on page "+a.info.current_page,a.info.wrapper_status=a.info.wrapper_status+"<span> on page <b>"+a.info.current_page+"</b></span>"),a.info.page_count&&(a.info.status=a.info.status+"/"+a.info.page_count,a.info.wrapper_status=a.info.wrapper_status+"<span><b>/{{info.page_count}}</b>.</span>")),angular.isDefined(a.info.feelings)&&a.info.feelings.length>0&&(b=angular.extend(b,{feelings:a.info.feelings})),angular.isDefined(a.info.reading_status_value)&&(b=angular.extend(b,{reading_status_value:a.info.reading_status_value})),angular.isDefined(a.info.book)&&(b=angular.extend(b,{book_id:a.info.book.id||a.info.book.book_id})),angular.isDefined(a.info.mentioned_users_ids)&&a.info.mentioned_users_ids.length>0&&(b=angular.extend(b,{mentioned_users_ids:a.info.mentioned_users_ids})),angular.isDefined(a.info.mentioned_authors_ids)&&a.info.mentioned_authors_ids.length>0&&(b=angular.extend(b,{mentioned_authors_ids:a.info.mentioned_authors_ids})),angular.isDefined(a.info.hash_tags)&&a.info.hash_tags.length>0&&(b=angular.extend(b,{hash_tags:a.info.hash_tags})),angular.isDefined(a.info.status)&&a.info.status.length>0&&(b=angular.extend(b,{content:a.info.status})),angular.isDefined(a.info.wrapper_status)&&a.info.wrapper_status.length>0&&(b=angular.extend(b,{wrapper_content:a.info.wrapper_status})),angular.isDefined(a.info.book_exchange_status)&&(b=angular.extend(b,{book_exchange_status:a.info.book_exchange_status})),angular.isDefined(a.info.page_count)&&(b=angular.extend(b,{total_page_count:a.info.page_count})),angular.isDefined(a.info.current_page)&&(b=angular.extend(b,{current_page:a.info.current_page})),0!=Object.keys(b).length?(g.post_status(b).then(function(){a.posting=!1,a.info.share_loading=!1,window.location.reload()}),a.info.status="",a.info.wrapper_status="",a.type_icon_pressed={"margin-right":"60vw"},c(function(){a.type_icon_pressed={"margin-right":"0px"}},100),a.make_status_inactive()):(a.posting=!0,a.info.share_loading=!0)}},a.show_share_page=function(b,c){var d=""==getCookie("logged")||null==getCookie("logged");d?m("signup").toggle():a.info.show_share?a.post_status():(a.info.show_share=!0,angular.isDefined(status)&&(a.info.reading_status_value=c))},a.handle_text_input=function(b){var c={},d=function(){c=a._detect_key(b),""==a.info.status.trim()&&(a.is_new_word_initiation=!0);var d={string_array:a.info.status.split(" "),current_character:String.fromCharCode(b.keyCode),split_string_length:a.info.status.split(" ").length,old_string:a.info.status.split(" ").slice(0,a.info.status.split(" ").length-1).join(" "),current_element:a.info.status.split(" ").pop(),is_new_word_initiation:a.is_new_word_initiation,under_a_tag:a.hash_tagging,html_array:a.info.wrapper_status.split(" "),old_html:a.info.wrapper_status.split(" ").slice(0,a.info.status.split(" ").length-1).join(" "),current_html:a.info.wrapper_status.split(" ").pop(),hash_tagging:a.hash_tagging};return{backspace:function(){if(a.show_interaction_links=!0,1!=d.split_string_length&&(old_string=d.old_string+" ",old_html=d.old_html+" "),"#"==d.current_element)a.hash_tagging=!1,a.info.wrapper_status=d.old_html;else{var c=d.old_html.split("<a>").length!=d.old_html.split("</a>").length,e=">"==d.current_html[d.current_html.length-1],f=d.current_html.indexOf("<br/>")>=0,g=function(){d.html_array=d.old_html.split("<br/>"),d.split_string_length=d.html_array.length,d.old_html=d.html_array.slice(0,d.split_string_length-1).join("<br/>"),old_string=d.old_html.replace(/<br\/>/,"")},h=function(){d.html_array=d.old_html.split("<a>"),d.split_string_length=d.html_array.length,d.old_html=d.html_array.slice(0,d.split_string_length-1).join("<a>"),old_string=d.old_html.replace(/<a>/,"").replace(/<\/a>/,"")},i=function(){a.info.wrapper_status=d.old_html,a.info.status=d.old_string,a.is_new_word_initiation=!0,a.hash_tagging=!1,b.preventDefault()};if(f&&g(),c&&h(),d.hash_tagging||e)i();else{var j=a.info.wrapper_status;a.info.wrapper_status=j.substring(0,j.length-1)}a.info.status&&""!=a.info.status||(a.info.wrapper_status="")}b.stopPropagation()},enter:function(){a.info.hash_tags?(b.preventDefault(),a.handle_selection(a.currentItem)):(a.hash_tagging=!1,a.is_new_word_initiation=!0,a.info.wrapper_status=a.info.wrapper_status+"<br/>")},left:function(){},right:function(){},special_character:function(){var c={hash:3==String.fromCharCode(b.keyCode),plus:"="==String.fromCharCode(b.keyCode),at_the_rate:2==String.fromCharCode(b.keyCode)};if(d.is_new_word_initiation&&c.hash){var e="<a>#</a>";a.hash_tagging=!0,a.info.wrapper_status=a.info.wrapper_status+e}},alphabet:function(){if(" "==d.current_character)d.hash_tagging&&(d.current_element=d.current_element.slice(1),a.info.hash_tags.push(d.current_element)),a.hash_tagging=!1,a.info.wrapper_status=a.info.wrapper_status+d.current_character,delete a.search_for;else if(a.hash_tagging){var b=a.info.wrapper_status.split("</a>"),c=b.length;if(c>2){var e=b[c-2]+d.current_character+"</a>"+b[c-1];a.info.wrapper_status=b.slice(0,c-2).join("</a>")+"</a>"+e}else{var e=b[c-2]+d.current_character+"</a>"+b[c-1];a.info.wrapper_status=e}}else a.info.wrapper_status=a.info.wrapper_status+d.current_character;a.search_for," "==d.current_character?a.is_new_word_initiation=!0:a.is_new_word_initiation=!1}}}();c.enter?d.enter():c.backspace_or_delete?d.backspace():c.left||c.right||c.up||c.down||(c.shift?d.special_character():c.command||d.alphabet()),b.stopPropagation()},a._detect_key=function(a){var b=a.keyCode==h.Backspace||a.keyCode==h.Delete,c=a.keyCode==h.KeyUp,d=a.keyCode==h.KeyDown,e=a.keyCode==h.KeyLeft,f=a.keyCode==h.KeyRight,g=a.keyCode==h.Enter,i=a.keyCode==h.LeftShift||a.keyCode==h.RightShift,j=a.keyCode==h.LeftCommand||a.keyCode==h.RightCommand;return{backspace_or_delete:b,up:c,down:d,left:e,right:f,enter:g,shift:i,command:j}},a.handle_selection=function(b){a.current=0;var c=a.info.status.split(" "),d=a.info.wrapper_status.split(" "),e=(String.fromCharCode(event.keyCode),c.length);if(1==e)var f=c.slice(0,e-1).join(" ").trim(),g=d.slice(0,e-1).join(" ").trim();else var f=c.slice(0,e-1).join(" ")+" ",g=d.slice(0,e-1).join(" ")+" ";c.pop(),d.pop(),a.hash_tagging;a.info.wrapper_status=g+"<a>"+b+"</a>",a.info.status=f+b,event.stopPropagation()},a.share_post=function(){var c=a.info.wrapper_status.replace(/<a>/,"<a>").replace(/<\/a>/,"</a>"),d={message:c,user:{name:b.user.name,thumb:b.user.thumb}};d=_add_labels_to_tweet(d);var e=a.selected_interact_book;d=_add_comment(d,e),angular.isDefined(b.focused_book)&&(0==b.focused_book.tweets.length?b.focused_book.tweets=b.focused_book.tweets.concat([d]):b.focused_book.tweets.push(d))},a.stop_propagation=function(a){a.stopPropagation()},a.make_status_active=function(b){a.info.status_state=!0,angular.isDefined(b)&&b.stopPropagation()},a.make_text_active=function(){a.text_selected=!0,a.init_reading_options()},a.make_status_inactive=function(b){a.make_text_active(),a.info.status_state=!1,angular.isDefined(b)&&b.stopPropagation()},a.make_active=function(b){delete a.selected_book,a.text_selected=!1,a.active_id=b,a.info.reading_status_value=b,a.show_relevant_books(),a.make_status_active()},a.init_reading_options=function(){(angular.isUndefined(a.reading_options)||3!=a.reading_options.length)&&(a.reading_options=[{name:"Planning to Read",id:0,status:"Planning to Read",emotion_status:"while planning to read",icon:"visibility",active_class:"green_color"},{name:"Currently Reading",id:1,status:"Currently Reading",emotion_status:"while reading",icon:"local_library",active_class:"yellow_color"},{name:"Recently Read",id:2,status:"Recently Read",emotion_status:"after reading",icon:"school",active_class:"red_color"}]),a.reading_status_selected=!1,delete a.active_id,delete a.info.reading_status_value,delete a.info.book,a.info.status_books=[],a.related_info=[],delete a.selected_book,a.deselect_emotion()},a.show_relevant_books=function(){a.reading_status_selected=!0,angular.isUndefined(a.selected_book)&&0==a.info.status_books.length&&(a.info.status_books=[],a.info.share_loading=!0,i.get_top_searches().then(function(b){a.info.share_loading=!1,a.info.status_books=b}))},a.toggle_options=function(){a.show_options=!a.show_options;var b=function(){var b=book.book_id||book.id;i.get_interesting_info(b).then(function(b){a.related_info=[],angular.isDefined(b[0])&&angular.forEach(b[0].info,function(b){var c=b.labels[0],d=b.info.data,e=b.id;if("Author"==c){delete d.indexed_main_author_name,delete d.gr_url,delete d.search_index;var f={id:e,label:"Author"};d=angular.extend(d,f)}else if("Year"==c){var f={label:"Year"};d=angular.extend(d,f)}this.push(d),a.info.share_loading=!1},a.related_info)})};if(angular.isUndefined(a.related_info)){a.info.share_loading=!0;var d=c(b(),100);a.$on("destroy",function(){c.cancel(d)})}},a.set_emotion=function(b){a.active_emotion=b,angular.isUndefined(a.info.feelings)&&(a.info.feelings=[]),a.info.feelings.push(b.name)},a.deselect_emotion=function(){delete a.active_emotion};(function(){a.text_selected=!0,a.info.status="",a.info.hash_tags=[],a.info.wrapper_status="",angular.isDefined(b.active_book)&&a.show_interesting_details(b.active_book),a.init_reading_options(),angular.isDefined(b.active_book)&&(a.selected_book=b.active_book),a.emotions=l,angular.isDefined(a.info.reading_status_value)&&a.make_active(a.info.reading_status_value)})()}]);;homeApp.controller("optionsController",["$scope","$rootScope","$timeout","ShareOptions","$routeParams","$mdBottomSheet",function(a,b,c,d,e,f){a.show_level1_options=function(b,e,f){a.first_option=b,delete a.second_option,delete a.level2_nested_options,delete a.info.book_exchange_status,delete a.info.feelings,a.data.selectedIndex=Math.min(a.data.selectedIndex+1,2),a.info.reading_status_value=e,a.loading=!0,angular.forEach(d.ReadingStage,function(d){if(angular.equals(d,b)){var e=c(function(){a.loading=!1,a.nested_options=b.nested_options},1e3);a.$on("destroy",function(){c.cancel(e)})}})},a.show_level2_options=function(b,d,e){if(delete a.info.feelings,a.second_option=b,a.data.selectedIndex=Math.min(a.data.selectedIndex+1,2),a.info.book_exchange_status=d,a.level2_loading=!0,angular.isDefined(a.second_option.search_book))delete a.level2_nested_options;else{c(function(){a.level2_loading=!1,a.level2_nested_options=a.second_option.value},1e3)}},a.post_status=function(b,c){a.info.feelings=[b.name]},a.previous=function(){a.data.selectedIndex=Math.max(a.data.selectedIndex-1,0)};(function(){a.share_options=d,a.data={selectedIndex:0}})()}]);;homeApp.controller("profileController",["$scope","userService","$rootScope","WebsiteUIConstants","ColorConstants","$location","bookService","newsService","$mdDialog","infinityService","$timeout","sharedService","$mdSidenav","$mdBottomSheet",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){a.show_todo_list=function(b){n.show({templateUrl:"assets/angular/html/todo/profile.html",scope:a,preserveScope:!0,targetEvent:b})},a.hide_bottomsheet=function(a){n.hide()},a.toggle_genres=function(){a.show_genres=!a.show_genres},a.get_active_class=function(a){var b=""==f.path().substr(1,a.length+1)&&"profile/feed"==a;return f.path().substr(1,a.length+1)==a||b?"bold red_color":"grey_color"},a.get_feed=function(){a.info.selectedIndex=1;var c="/profile/followers"==f.path(),d="/profile/followings"==f.path(),e="/profile/books"==f.path(),g="/profile/news"==f.path(),h="/profile/history"==f.path(),i="/profile/rooms"==f.path(),j=!(c||d||e||g||h||i||h);if(!a.info.loading&&j){var k=a.active_user_id;a.info.loading=!0;var l=function(a){var b="";switch(a.label){case"BookmarkNode":b="Added to "+a.node.key;break;case"Listopia":break;case"CommunityNode":break;case"BlogNode":break;case"StatusNode":b=a.node.wrapper_content;break;case"EndorseNode":b="Endorsed this book.";break;case"RatingNode":b="Gave "+a.node.content+" rating on 10.";break;case"FollowsNode":angular.isDefined(a.community)?b="Joined a room.":angular.isDefined(a.author)?b="Started following an Author.":angular.isDefined(a.friend)&&(b="Started following.");break;case"RecommendNode":b="Recommended this book to a friend."}return b};angular.isUndefined(a.personal_feed)&&(a.personal_feed=[]);var m=a.personal_feed.length;b.get_personal_feed(k,m).then(function(b){b.length>0&&angular.forEach(b,function(a){if(angular.isDefined(a.book)){var b=l(a);a=angular.extend(a,{message:b})}else if(angular.isDefined(a.community)){var b=l(a);a=angular.extend(a,{message:b})}else{var b=l(a);a=angular.extend(a,{message:b})}}),a.info.loading=!1,a.personal_feed=a.personal_feed.concat(b)})}};var o=function(){return""==getCookie("logged")||null==getCookie("logged")};a.follow_user=function(){o()?m("signup").toggle():(a.profile_user.status=!a.profile_user.status,b.follow(a.profile_user.id,a.profile_user.status))};a.show_book_dialog=function(b,d){l.show_book_dialog(c,a,b,d)};var p=function(){var b=!1;return a.active_user_id==c.user.id?(b=!0,a.info.my_profile=!0,a.hide_follow_links=!1):(a.info.my_profile=!1,a.hide_follow_links=!0),b},q=function(){var c=p();c?t():b.get_user_details(a.active_user_id).then(function(b){a.profile_user=b,r()})},r=function(){var b=a.profile_user.image_url||"/assets/user_profile.jpg";a.profile_wrapper={"background-image":b}},s=function(d){a.active_user_id=d[2],angular.isDefined(c.user)?q():b.get_user_details().then(function(a){c.user=a,q()})},t=function(){a.profile_user=c.user,a.active_user_id=a.profile_user.id,r()},u=function(){if(a.info.my_profile=!0,a.hide_follow_links=!1,angular.isUndefined(c.user)){var d=k(function(){b.get_user_details().then(function(a){c.user=a,t()})},100);a.$on("destroy",function(){k.cancel(d)})}else t();w()},v=function(){var b=k(function(){a.get_feed()},100);a.$on("destroy",function(){k.cancel(b)})},w=function(){var b=getCookie("todo");b&&(b=JSON.flatten(JSON.parse(b)));var c=0;angular.forEach(b,function(a,b){a&&(c+=1)}),a.profile_progress=Math.round(100*(c/15))};(function(){a.profile_user={},a.info.embed_share=!0;var b=/[?&]([^=#]+)=([^&#]*)/g,c=b.exec(f.absUrl());angular.isDefined(c)&&null!=c?s(c):u(),v(),a.is_profile=!0})()}]);;homeApp.controller("toastController",["$scope","$mdToast",function(a,b){a.closeToast=function(){b.hide()}}]);;homeApp.controller("specificBookController",["$scope","$rootScope","$timeout","bookService","$mdToast","$location","$mdSidenav","ColorConstants","$mdBottomSheet","userService",function(a,b,c,d,e,f,g,h,i,j){a.toggle_endorse=function(){k()?g("signup").toggle():(a.book.endorse_status?a.book.endorse_status=!1:a.book.endorse_status=!0,d.endorse_book(b.active_book.book_id,a.book.endorse_status),e.show({controller:"toastController",templateUrl:"assets/angular/html/shared/toast/endorse_action.html",hideDelay:6e3,position:a.getToastPosition()}))},a.hide_bottomsheet=function(a){i.hide()},a.show_todo_list=function(b){i.show({templateUrl:"assets/angular/html/todo/book.html",scope:a,preserveScope:!0,targetEvent:b})};var k=function(){return""==getCookie("logged")||null==getCookie("logged")};a.show_share_bottom_sheet=function(a){g("right_share").toggle()},a.getToastPosition=function(){return Object.keys(a.toast_position).filter(function(b){return a.toast_position[b]}).join(" ")},a.rate_book=function(a){k()?g("signup").toggle():d.rate_book(a.book_id,a.user_rating)},a.load_sample_read=function(){},a.get_active_class=function(a){var b=""==f.path().substr(1,a.length+1)&&"book/buyandreview"==a;return f.path().substr(1,a.length+1)==a||b?"bold red_color":"grey_color"};var l=function(){var e=/[?&]([^=#]+)=([^&#]*)/g,g=e.exec(f.absUrl());if(null!=g)var h=g[2];if(angular.isDefined(b.active_book))if(angular.isDefined(b.active_book.id))var i=b.active_book.id;else var i=b.active_book.book_id;else var i=h;var j="id="+i;a.book_loading=!0;var k=c(function(){a.info.loading=!0,d.get_book_details(j).then(function(c){if(angular.isDefined(c)&&null!=c){var d=null!=c.endorse_status,e=null!=c.status,f={endorse_status:d,status:e};angular.isDefined(b.active_book)?a.book=angular.extend(b.active_book,c):a.book=c,a.book=angular.extend(a.book,f),b.active_book=a.book,a.info.book=a.book}a.book_loading=!1,a.info.loading=!1}),d.update_visited(i)},100);a.$on("destroy",function(){c.cancel(k)}),a.toast_position={bottom:!1,top:!0,left:!1,right:!0},a.is_book=!0,a.constant={show_book:!0}};l()}]);;homeApp.controller("timelineController",["$scope","$rootScope","bookService","$location","userService","$mdDialog","$mdSidenav","$timeout",function(a,b,c,d,e,f,g,h){var i=function(){return""==getCookie("logged")||null==getCookie("logged")};a.write_reading_journey_for=function(){i()?g("signup").toggle():(a.info.show_share=!0,f.hide())},a.get_feed=function(){angular.isUndefined(a.book_feed)&&(a.book_feed=[]);var d=a.book_feed.length,f=function(a){var c="";switch(a.label){case"BookmarkNode":c=a.node.key?"Added to "+a.node.key:"Added "+b.active_book.title+" to a Shelf.";break;case"Listopia":break;case"CommunityNode":break;case"BlogNode":break;case"StatusNode":c=a.node.wrapper_content;break;case"EndorseNode":c="Endorsed this book.";break;case"RatingNode":c="Gave "+a.node.content+" rating on 10.";break;case"RecommendNode":c="Recommended this book to a friend."}return c};c.get_feed(a.book_id,d).then(function(b){a.book_feed=b,angular.forEach(a.book_feed,function(a){var b=f(a);if(a=angular.extend(a,{message:b}),angular.isDefined(a.user))e.get_user_details(a.user.id).then(function(b){a.user=angular.extend(a.user,b)});else{var b=f(a);a=angular.extend(a,{message:b})}})})};(function(){var c=/[?&]([^=#]+)=([^&#]*)/g,e=c.exec(d.absUrl());if(null!=e)var f=e[2];if(angular.isDefined(b.active_book))var g=b.active_book.book_id||b.active_book.id;else var g=f;a.book_id=g;var i=h(function(){a.get_feed()},100);a.$on("destroy",function(){h.cancel(i)})})()}]);;homeApp.controller("realVirtualityController",["$scope","$rootScope","bookService","$location","userService",function(a,b,c,d,e){(function(){if(angular.isDefined(b.active_book)){var e=b.active_book.book_id;c.get_real_news(e).then(function(b){null!=b&&(a.communities=b.communities,a.active_community=a.communities[0],a.active_community.news=b.news)})}else d.path("/book/timeline")})();a.load_news=function(){var b=a.active_community.id;if(angular.isUndefined(a.active_community.news)){a.active_community.news=[];var d=0}var d=a.active_community.news.length;a.book_loading=!0,a.info.loading=!0,c.get_community_news(b,d).then(function(b){a.book_loading=!1,a.info.loading=!1,a.active_community.news=a.active_community.news.concat(b)})}}]);;homeApp.controller("testimonialsController",["$scope","websiteService","$rootScope","$mdSidenav",function(a,b,c,d){a.get_testimonials=function(){if(!a.info.loading){a.info.loading=!0,angular.isUndefined(a.testimonials)&&(a.testimonials=[]);var c=a.testimonials.length;b.get_testimonials(c).then(function(b){a.info.loading=!1,a.testimonials=a.testimonials.concat(b)})}},a.save_testimonial=function(e){angular.isDefined(c.user)&&angular.isDefined(c.user.id)?angular.isDefined(a.info.new_testimonial)&&a.info.new_testimonial.length>10?(b.add_testimonial(a.info.new_testimonial),delete a.info.new_testimonial,window.location.reload()):alert("Explain a bit more..."):d("signup").toggle()};(function(){a.info.new_testimonial="",a.get_testimonials()})()}]);