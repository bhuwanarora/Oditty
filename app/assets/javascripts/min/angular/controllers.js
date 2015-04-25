homeApp.controller("appController",["$scope","$rootScope","$mdSidenav","$mdBottomSheet","$mdDialog","shelfService",function(a,b,c,d,e,f){a.stop_propagation=function(a){a.stopPropagation()},a.stopPropagation=function(){a.constant.show_book},a.show_rating=function(a){e.show({templateUrl:"assets/angular/html/shared/share.html",targetEvent:a}),a.stopPropagation()},a.toggle_notifications=function(b){a.show_notifications=a.show_notifications?!1:!0,b.stopPropagation()},a.close_popups=function(){a.show_notifications=!1},a.toggleLeft=function(a){c("left").toggle(),a.stopPropagation()},a.toggleRight=function(a){c("right").toggle(),a.stopPropagation()},a.show_share_bottom_sheet=function(a){d.show({templateUrl:"assets/angular/html/shared/social_bottom_sheet.html",controller:"shelfController",targetEvent:a})},a.stop_propagation=function(a){a.stopPropagation()};!function(){a.visible_search_bar=!0,a.info={},a.info.show_share=!1,a.data={selectedIndex:0},b.user={},f.get_all_shelves().then(function(a){b.labels=a})}()}]);;homeApp.controller("notificationController",["$scope","feedService",function(a,b){!function(){b.get_notifications().then(function(b){a.notifications=b})}();a.stop_propagation=function(a){a.stopPropagation()}}]);;homeApp.controller("searchController",["$scope","searchService","$location",function(a,b,c){a.show_search_bar=function(){a.visible_search_bar=!a.visible_search_bar},a.query_search=function(c){b.raw(c).then(function(b){if(a.search_results=b,a.did_you_mean=!1,angular.forEach(b,function(b){b.fuzzy&&(a.did_you_mean=!0)}),a.did_you_mean){var d={name:"Did you mean",labels:[]};a.search_results.splice(0,0,d)}var d={name:"Show all results",show_all:!0,labels:[],search_text:c};a.search_results.push(d)})},a.show_all_results=function(c,d){b.raw(c,d).then(function(b){a.all_results=b})},a.on_select=function(a){if(angular.isDefined(a)){var b=a.labels.indexOf("Book")>=0,c=a.labels.indexOf("Author")>=0,d="";b?d="/book?q="+a.id:c?d="/author?q="+a.id:a.show_all&&(d="/search?q="+a.search_text),""!=d&&(window.location.href=d)}},a.reload_results=function(a){switch(a){case"Book":break;case"Author":break;case"Community":break;case"Blog":break;case"Person":break;case"News":}};!function(){var b=function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b=new RegExp("[\\?&]"+a+"=([^&#]*)"),c=b.exec(location.search);return null===c?"":decodeURIComponent(c[1].replace(/\+/g," "))};a.search_results=[];var d=/[?&]([^=#]+)=([^&#]*)/g,e=d.exec(c.absUrl()),f=c.$$absUrl.indexOf("search")>=0;if(angular.isDefined(e)&&null!=e&&f){var g=b("q"),h=b("type");a.show_all_results(g,h),a.display_results_for=g}}()}]);;homeApp.controller("leftController",["$scope","$timeout","$mdSidenav","$log",function(a,b,c){a.close=function(){c("left").close()}}]);;homeApp.controller("rightController",["$scope","$timeout","$mdSidenav","$log",function(a,b,c){a.close=function(){c("right").close()}}]);;homeApp.controller("shelfController",["$scope","$mdBottomSheet","$mdToast","shelfService","$rootScope","sharedService",function(a,b,c,d,e,f){a.listItemClick=function(c){var d=a.items[c];b.hide(d)},a.toggle_bookmark=function(a,b){f.toggle_bookmark(a,b)},a.add_new_label=function(){var b=!1;angular.isUndefined(a.new_label)||""==a.new_label?alert("Enter a valid shelf."):(angular.forEach(e.labels,function(c){c.label_name.toLowerCase()==a.new_label.toLowerCase()&&(b=!0)}),b?(alert("Shelf already exists."),a.new_label=""):d.add_new_label(a.new_label))};!function(){a.toast_position={bottom:!1,top:!0,left:!1,right:!0}}()}]);;homeApp.controller("shareController",["$scope","$rootScope","$timeout","ShareOptions","$routeParams","$mdBottomSheet","statusService","WebsiteUIConstants","bookService","ColorConstants","sharedService",function(a,b,c,d,e,f,g,h,i,j,k){a.play_type_key=function(b){a.info.show_share&&(angular.isUndefined(a.current_track)||0==a.current_track?(a.current_track=1,document.getElementById("audiotag1").play()):1==a.current_track?(a.current_track=2,document.getElementById("audiotag2").play()):(a.current_track=0,document.getElementById("audiotag3").play()),b.stopPropagation())},a.show_share_options=function(b){f.show({templateUrl:"assets/angular/html/share/_share_options.html",controller:"optionsController",scope:a,preserveScope:!0,targetEvent:b}).then(function(){})},a.back=function(){a.info.show_share=!1,a.info.show_book_share=!1,event.stopPropagation()},a.search_books=function(b){a.info.loading=!0,a.searched_books=[],i.search_books(b,10).then(function(b){a.info.loading=!1,a.did_you_mean=!0,angular.forEach(b,function(a){var b=Math.floor(Math.random()*j.value.length);angular.isUndefined(a.fuzzy)&&(a=angular.extend(a,{color:j.value[b]}),this.push(a))},a.searched_books)})},a.add_book=function(c){b.active_shelf?(b.bookmark_object={id:c.id,type:"Book"},k.toggle_bookmark(b.active_shelf,!0),delete b.active_shelf,a.info.show_share=!1):a.info.book=c},a.show_share_page=function(){var b=function(){var b={};angular.isDefined(a.info.feelings)&&a.info.feelings.length>0&&(b=angular.extend(b,{feelings:a.info.feelings})),angular.isDefined(a.info.reading_status_value)&&(b=angular.extend(b,{reading_status_value:a.info.reading_status_value})),angular.isDefined(a.info.book)&&(b=angular.extend(b,{book_id:a.info.book.id})),angular.isDefined(a.info.mentioned_users_ids)&&a.info.mentioned_users_ids.length>0&&(b=angular.extend(b,{mentioned_users_ids:a.info.mentioned_users_ids})),angular.isDefined(a.info.mentioned_authors_ids)&&a.info.mentioned_authors_ids.length>0&&(b=angular.extend(b,{mentioned_authors_ids:a.info.mentioned_authors_ids})),angular.isDefined(a.info.hash_tags)&&a.info.hash_tags.length>0&&(b=angular.extend(b,{hash_tags:a.info.hash_tags})),angular.isDefined(a.info.status)&&a.info.status.length>0&&(b=angular.extend(b,{content:a.info.status})),angular.isDefined(a.info.wrapper_status)&&a.info.wrapper_status.length>0&&(b=angular.extend(b,{wrapper_content:a.info.wrapper_status})),angular.isDefined(a.info.book_exchange_status)&&(b=angular.extend(b,{book_exchange_status:a.info.book_exchange_status})),g.post_status(b),a.info.status="",a.info.wrapper_status="",a.type_icon_pressed={"margin-right":"60vw"},c(function(){a.type_icon_pressed={"margin-right":"0px"}},100)};a.info.show_share?b():a.info.show_share=!0},a.handle_text_input=function(b){var c={},d=function(){c=a._detect_key(b),""==a.info.status.trim()&&(a.is_new_word_initiation=!0);var d={string_array:a.info.status.split(" "),current_character:String.fromCharCode(b.keyCode),split_string_length:a.info.status.split(" ").length,old_string:a.info.status.split(" ").slice(0,a.info.status.split(" ").length-1).join(" "),current_element:a.info.status.split(" ").pop(),is_new_word_initiation:a.is_new_word_initiation,under_a_tag:a.hash_tagging,html_array:a.info.wrapper_status.split(" "),old_html:a.info.wrapper_status.split(" ").slice(0,a.info.status.split(" ").length-1).join(" "),current_html:a.info.wrapper_status.split(" ").pop(),hash_tagging:a.hash_tagging};return{backspace:function(){if(a.show_interaction_links=!0,1!=d.split_string_length&&(old_string=d.old_string+" ",old_html=d.old_html+" "),"#"==d.current_element)a.hash_tagging=!1,a.info.wrapper_status=d.old_html;else{var c=d.old_html.split("<a>").length!=d.old_html.split("</a>").length,e=">"==d.current_html[d.current_html.length-1],f=d.current_html.indexOf("<br/>")>=0,g=function(){d.html_array=d.old_html.split("<br/>"),d.split_string_length=d.html_array.length,d.old_html=d.html_array.slice(0,d.split_string_length-1).join("<br/>"),old_string=d.old_html.replace(/<br\/>/,"")},h=function(){d.html_array=d.old_html.split("<a>"),d.split_string_length=d.html_array.length,d.old_html=d.html_array.slice(0,d.split_string_length-1).join("<a>"),old_string=d.old_html.replace(/<a>/,"").replace(/<\/a>/,"")},i=function(){a.info.wrapper_status=d.old_html,a.info.status=d.old_string,a.is_new_word_initiation=!0,a.hash_tagging=!1,b.preventDefault()};if(f&&g(),c&&h(),d.hash_tagging||e)i();else{var j=a.info.wrapper_status;a.info.wrapper_status=j.substring(0,j.length-1)}a.info.status&&""!=a.info.status||(a.info.wrapper_status="")}b.stopPropagation()},enter:function(){a.info.hash_tags?(b.preventDefault(),a.handle_selection(a.currentItem)):(a.hash_tagging=!1,a.is_new_word_initiation=!0,a.info.wrapper_status=a.info.wrapper_status+"<br/>")},left:function(){},right:function(){},special_character:function(){var c={hash:3==String.fromCharCode(b.keyCode),plus:"="==String.fromCharCode(b.keyCode),at_the_rate:2==String.fromCharCode(b.keyCode)};if(d.is_new_word_initiation&&c.hash){var e="<a>#</a>";a.hash_tagging=!0,a.info.wrapper_status=a.info.wrapper_status+e}},alphabet:function(){if(" "==d.current_character)d.hash_tagging&&(d.current_element=d.current_element.slice(1),a.info.hash_tags.push(d.current_element)),a.hash_tagging=!1,a.info.wrapper_status=a.info.wrapper_status+d.current_character,delete a.search_for;else if(a.hash_tagging){var b=a.info.wrapper_status.split("</a>"),c=b.length;if(c>2){var e=b[c-2]+d.current_character+"</a>"+b[c-1];a.info.wrapper_status=b.slice(0,c-2).join("</a>")+"</a>"+e}else{var e=b[c-2]+d.current_character+"</a>"+b[c-1];a.info.wrapper_status=e}}else a.info.wrapper_status=a.info.wrapper_status+d.current_character;a.search_for,a.is_new_word_initiation=" "==d.current_character?!0:!1}}}();c.enter?d.enter():c.backspace_or_delete?d.backspace():c.left||c.right||c.up||c.down||(c.shift?d.special_character():c.command||d.alphabet()),b.stopPropagation()},a._detect_key=function(a){var b=a.keyCode==h.Backspace||a.keyCode==h.Delete,c=a.keyCode==h.KeyUp,d=a.keyCode==h.KeyDown,e=a.keyCode==h.KeyLeft,f=a.keyCode==h.KeyRight,g=a.keyCode==h.Enter,i=a.keyCode==h.LeftShift||a.keyCode==h.RightShift,j=a.keyCode==h.LeftCommand||a.keyCode==h.RightCommand;return{backspace_or_delete:b,up:c,down:d,left:e,right:f,enter:g,shift:i,command:j}},a.handle_selection=function(b){a.current=0;var c=a.info.status.split(" "),d=a.info.wrapper_status.split(" "),e=(String.fromCharCode(event.keyCode),c.length);if(1==e)var f=c.slice(0,e-1).join(" ").trim(),g=d.slice(0,e-1).join(" ").trim();else var f=c.slice(0,e-1).join(" ")+" ",g=d.slice(0,e-1).join(" ")+" ";c.pop(),d.pop(),a.hash_tagging;a.info.wrapper_status=g+"<a>"+b+"</a>",a.info.status=f+b,event.stopPropagation()},a.share_post=function(){var c=a.info.wrapper_status.replace(/<a>/,"<a>").replace(/<\/a>/,"</a>"),d={message:c,user:{name:b.user.name,thumb:b.user.thumb}};d=_add_labels_to_tweet(d);var e=a.selected_interact_book;d=_add_comment(d,e),angular.isDefined(b.focused_book)&&(0==b.focused_book.tweets.length?b.focused_book.tweets=b.focused_book.tweets.concat([d]):b.focused_book.tweets.push(d))};!function(){a.info.status="",a.info.hash_tags=[],a.info.wrapper_status=""}()}]);;homeApp.controller("optionsController",["$scope","$rootScope","$timeout","ShareOptions","$routeParams","$mdBottomSheet",function(a,b,c,d){!function(){a.share_options=d,a.data={selectedIndex:0}}();a.show_level1_options=function(b,e){a.first_option=b,delete a.second_option,delete a.level2_nested_options,delete a.info.book_exchange_status,delete a.info.feelings,a.data.selectedIndex=Math.min(a.data.selectedIndex+1,2),a.info.reading_status_value=e,a.loading=!0,angular.forEach(d.ReadingStage,function(d){if(angular.equals(d,b)){var e=c(function(){a.loading=!1,a.nested_options=b.nested_options},1e3);a.$on("destroy",function(){c.cancel(e)})}})},a.show_level2_options=function(b,d){if(delete a.info.feelings,a.second_option=b,a.data.selectedIndex=Math.min(a.data.selectedIndex+1,2),a.info.book_exchange_status=d,a.level2_loading=!0,angular.isDefined(a.second_option.search_book))delete a.level2_nested_options;else{c(function(){a.level2_loading=!1,a.level2_nested_options=a.second_option.value},1e3)}},a.post_status=function(b){a.info.feelings=[b.name]},a.previous=function(){a.data.selectedIndex=Math.max(a.data.selectedIndex-1,0)}}]);;homeApp.controller("profileController",["$scope","userService","$rootScope","WebsiteUIConstants","ColorConstants","$location","bookService",function(a,b,c,d,e,f,g){var h=function(c){b.get_detailed_info(c).then(function(b){if(0!=b.length){b=b[0];var c=[];angular.forEach(b.categories_id,function(a,c){var e=d.GenreAWS+b.categories_aws_key[c],f={root_category_id:a,root_category_name:b.categories_name[c],url:e,status:!0};this.push(f)},c);var f=[];angular.forEach(b.books_id,function(a,c){var d=Math.floor(Math.random()*e.value.length),f=e.value[d],g={color:f,book_id:a,title:b.books_title[c],author_name:b.books_author_name[c],isbn:b.books_isbn[c],random_style:{"background-color":f}};this.push(g)},f),a.profile_user=angular.extend(a.profile_user,b),a.profile_user=angular.extend(a.profile_user,{favourite_categories:c}),a.profile_user=angular.extend(a.profile_user,{influential_books:f})}})},i=function(c){var d=function(a){var b="";switch(a.label){case"BookmarkNode":b="Added to "+a.node.key;break;case"Listopia":break;case"CommunityNode":break;case"BlogNode":break;case"StatusNode":b=a.node.wrapper_content;break;case"EndorseNode":b="Endorsed this book.";break;case"RatingNode":b="Gave "+a.node.content+" rating on 10."}return b},f=function(){var b=[],c=function(a,b){var c=!1,d=0;return a.length>0&&angular.forEach(a,function(a,e){angular.isDefined(a.book)&&a.book.id==b&&(c=!0,d=e)}),{status:c,index:d}};angular.forEach(a.personal_feed,function(a){if(angular.isDefined(a.book)){var d=c(b,a.book.id);d.status?(delete a.book,b[d.index].data.push(a)):(angular.isDefined(a.book)&&(d={book:a.book},delete a.book,a=angular.extend(d,{data:[a]})),this.push(a))}else this.push(a)},b),a.personal_feed=b};b.get_personal_feed(c).then(function(b){a.personal_feed=[],angular.forEach(b,function(a){var b=Math.floor(Math.random()*e.value.length);angular.isDefined(a.book)&&(a.book=angular.extend(a.book,{color:e.value[b]})),this.push(a)},a.personal_feed),f(),angular.forEach(a.personal_feed,function(a){if(angular.isDefined(a.book))g.get_basic_book_details(a.book.id).then(function(b){a.book=angular.extend(a.book,b),angular.forEach(a.data,function(a){var b=d(a);a=angular.extend(a,{message:b})})});else{var b=d(a),c=angular.extend(a,{message:b});a.data=[c]}})})};a.write_reading_journey=function(){a.info.show_share=!0,a.info.show_book_share=!0},a.search_book=function(){},a.follow_user=function(){a.profile_user.status=!a.profile_user.status,b.follow(a.profile_user.id,a.profile_user.status)};!function(){a.profile_user={};var b=/[?&]([^=#]+)=([^&#]*)/g,d=b.exec(f.absUrl());if(angular.isDefined(d)&&null!=d){var e=d[2];a.info.my_profile=angular.isDefined(c.user)&&c.user.id==e?!0:!1}else{var e=a.profile_user.id;a.info.my_profile=!0}h(e),i(e)}()}]);;homeApp.controller("toastController",["$scope","$mdToast",function(a,b){a.closeToast=function(){b.hide()}}]);