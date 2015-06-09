homeApp.controller("appController",["$scope","$rootScope","$mdSidenav","$mdBottomSheet","$mdDialog","shelfService","userService","$cookieStore","$timeout","$location",function(a,b,c,d,e,f,g,h,i,j){a.stop_propagation=function(a){a.stopPropagation()},a.show_signin_options=function(a){c("signup").toggle(),a.stopPropagation()},a.show_search_bar=function(){a.info.mobile_search=!a.info.mobile_search},a.show_rating=function(a){e.show({templateUrl:"assets/angular/html/shared/share.html",targetEvent:a}),a.stopPropagation()},a.toggle_notifications=function(b){a.show_notifications=!a.show_notifications,a.navigation_options=!1,b.stopPropagation()},a.close_popups=function(){a.show_notifications=!1,b.shelves_visible=!1,a.navigation_options=!1},a.toggleLeft=function(b){a.info.hide_signin?(c("left").toggle(),b.stopPropagation()):a.show_signin_options(b)},a.toggleRight=function(a){c("right").toggle(),a.stopPropagation()},a.stop_propagation=function(a){a.stopPropagation()},a.toggle_navigation_options=function(b){a.navigation_options=!a.navigation_options,a.show_notifications=!1,b.stopPropagation()};(function(){a.visible_search_bar=!0,a.info={},a.info.show_share=!1;var b=j.absUrl(),c=b.indexOf("communities")>0,d=b.indexOf("personalised_suggestions")>0,e=b.indexOf("infinity")>0;c?a.active_page=1:d?a.active_page=0:e?a.active_page=2:a.active_page=-1,a.random_set=-1,a.data={selectedIndex:0};a.search_results=[],""!=getCookie("logged")&&(a.info.hide_signin=!0)})()}]);;homeApp.controller("notificationController",["$scope","feedService","$timeout",function(a,b,c){(function(){a.info.loading=!0;var d=c(function(){b.get_notifications().then(function(b){a.info.loading=!1,a.notifications=b})},100);a.$on("destroy",function(){c.cancel(d)})})();a.stop_propagation=function(a){a.stopPropagation()}}]);;homeApp.controller("searchController",["$scope","searchService","$location",function(a,b,c){a.query_search=function(c){c.length>2?(a.info.loading=!0,params={q:c,count:4},b.raw(params).then(function(b){if(delete a.info.search_results,a.info.loading=!1,a.did_you_mean=!1,angular.forEach(b,function(b){b.fuzzy&&(a.did_you_mean=!0),b.first_name&&(b.name=b.first_name+" "+b.last_name)}),a.info.search_results=b,a.did_you_mean){var d={name:"Did you mean",labels:[]};a.info.search_results.splice(0,0,d)}if(b.length>0){var d={name:"Show all results",show_all:!0,labels:[],search_text:c};a.info.search_results.push(d)}})):a.info.search_results=[]},a.get_default_results=function(c){(angular.isUndefined(a.search_text)||""==a.search_text)&&b.get_top_searches().then(function(b){a.info.search_results=b}),c.stopPropagation()},a.on_select=function(b){if(delete a.info.search_results,angular.isDefined(b)){var c=b.labels.indexOf("Book")>=0,d=b.labels.indexOf("Author")>=0,e="User"==b.labels,f="Blog"==b.labels,g="News"==b.labels,h="Community"==b.labels,i="";c?i="/book?q="+b.id:d?i="/author?q="+b.id:e?i="/profile?q="+b.id:f?i=b.blog_url:g?i="/news?q="+b.id:h?i="/room?q="+b.id:b.show_all&&(i="/search?q="+b.search_text),""!=i&&(window.location.href=i)}};(function(){a.info.mobile_search=!0,a.info.search_results=[]})()}]);;homeApp.controller("leftController",["$scope","$timeout","$mdSidenav","$log",function(a,b,c,d){a.close=function(){c("left").close()}}]);;homeApp.controller("rightController",["$scope","$timeout","$mdSidenav","$log",function(a,b,c,d){a.close=function(){c("right").close()}}]);;homeApp.controller("shelfController",["$scope","$mdBottomSheet","$mdToast","shelfService","$rootScope","sharedService",function(a,b,c,d,e,f){a.listItemClick=function(c){var d=a.items[c];b.hide(d)},a.toggle_bookmark=function(a,b){f.toggle_bookmark(a,b,e.bookmark_object)},a.add_new_label=function(b){var c=!1;angular.isUndefined(a.new_label)||""==a.new_label?alert("Enter a valid shelf."):(angular.forEach(e.labels,function(b){b.label_name.toLowerCase()==a.new_label.toLowerCase()&&(c=!0)}),c?(alert("Shelf already exists."),a.new_label=""):d.add_new_label(a.new_label,b).then(function(b){angular.isUndefined(a.labels)&&(a.labels=[]),a.labels.push(b)}))},a.toggle_shelves=function(){a.show_all=!a.show_all};(function(){a.toast_position={bottom:!1,top:!0,left:!1,right:!0}})()}]);;homeApp.controller("buyController",["$scope","$rootScope","bookService","sharedService","$mdSidenav","$timeout",function(a,b,c,d,e,f){var g=function(){return""==getCookie("logged")||null==getCookie("logged")};(function(){a.info.loading=!0;var d=b.active_book.id||b.active_book.book_id;if(angular.isUndefined(a.book)&&(a.book=b.active_book),a.book_loading=!0,g())a.book_loading=!1,a.info.loading=!1;else{var e=f(function(){c.get_borrow_users(d).then(function(b){a.borrow_users=b,a.book_loading=!1,a.info.loading=!1})},100);a.$on("destroy",function(){f.cancel(e)})}})();a.notify_friends=function(){var a=""==getCookie("logged")||null==getCookie("logged");a&&e("signup").toggle()},a.toggle_bookmark=function(a){if(g())e("signup").toggle();else{var c=b.active_book.id||b.active_book.book_id,f={label_key:"IOwnThis"},h={type:"Book",id:c};d.toggle_bookmark(f,a,h)}}}]);;homeApp.controller("recommendController",["$scope","userService","$rootScope","WebsiteUIConstants","ColorConstants","networkService",function(a,b,c,d,e,f){a.toggle_recommend=function(){a.show_recommend=!a.show_recommend,angular.isUndefined(a.users_list)&&(a.info.share_loading=!0,f.get_followers().then(function(b){a.users_list=b,a.info.share_loading=!1}))}}]);;homeApp.controller("shareController",["$scope","$rootScope","$timeout","ShareOptions","$routeParams","$mdBottomSheet","statusService","WebsiteUIConstants","bookService","ColorConstants","sharedService","Emotions","$mdSidenav",function(a,b,c,d,e,f,g,h,i,j,k,l,m){a.play_type_key=function(b){a.mute||a.info.show_share&&(angular.isUndefined(a.current_track)||0==a.current_track?(a.current_track=1,document.getElementById("audiotag1").play()):1==a.current_track?(a.current_track=2,document.getElementById("audiotag2").play()):(a.current_track=0,document.getElementById("audiotag3").play()),b.stopPropagation())},a.mute_volume=function(){a.mute=!a.mute},a.set_pages=function(b,c){a.info.page_count=c,a.info.current_page=b,a.hide_page_count=!0},a.show_page_count=function(){a.hide_page_count=!1},a.toggle_buy=function(){a.hide_buy=!a.hide_buy},a.toggle_borrow=function(){a.hide_borrow=!a.hide_borrow},a.deselect_book=function(){delete a.info.page_count,delete a.info.current_page,delete a.active_book,delete b.active_book,a.deselect_emotion(),delete a.related_info,delete a.info.status_books,a.show_relevant_books()},a.show_interesting_details=function(c){angular.isUndefined(a.active_book)&&(a.active_book=c,a.info.book=c,b.active_book=c,a.info.status_books=[c])},a.show_share_options=function(b){f.show({templateUrl:"assets/angular/html/share/_share_options.html",controller:"optionsController",scope:a,preserveScope:!0,targetEvent:b}).then(function(a){})},a.back=function(c){a.info.show_share=!1,a.info.show_book_share=!1,delete b.active_shelf,event.stopPropagation()},a.handle_backspace=function(b){var c=a._detect_key(b);c.backspace_or_delete&&a.init_reading_options()},a.search_status_books=function(b){a.info.status_books=[],a.search_books(b,a.info.status_books)},a.search_books=function(b,c){angular.isUndefined(c)&&(a.searched_books=[],c=a.searched_books),a.info.share_loading=!0,i.search_books(b,10).then(function(b){a.info.share_loading=!1,a.did_you_mean=!0,angular.forEach(b,function(a){var b=Math.floor(Math.random()*j.value.length);angular.isUndefined(a.fuzzy)&&(a=angular.extend(a,{color:j.value[b]}),this.push(a))},c)})},a.add_book=function(c){if(b.active_shelf){var d={id:c.id||c.book_id,type:"Book"};k.toggle_bookmark(b.active_shelf,!1,d),delete b.active_shelf,a.info.show_share=!1}else a.info.book=c},a.post_status=function(){a.posting=!0,a.info.share_loading=!0;var b={};a.reading_status_selected&&a.active_book&&(a.active_emotion?(a.info.status="Feeling "+a.active_emotion.name+a.reading_options[a.active_id].emotion_status,a.info.wrapper_status="<span class='custom_title light_title'><span>Feeling "+a.active_emotion.name+"  </span><span>"+a.reading_options[a.active_id].emotion_status+"</span></span>"):(a.info.status=a.reading_options[a.active_id].status,a.info.wrapper_status="<span><span class='custom_title light_title'><span>"+a.reading_options[a.active_id].status+"</span></span>"),a.info.status=a.info.status+" "+a.active_book.title+" by "+a.active_book.author_name,a.info.wrapper_status=a.info.wrapper_status+"<span class='big_title bold_light_title'>"+a.active_book.title+" </span><span class='less_important'>by "+a.active_book.author_name+"</span>",a.info.current_page&&(a.info.status=a.info.status+" on page "+a.info.current_page,a.info.wrapper_status=a.info.wrapper_status+"<span> on page <b>"+a.info.current_page+"</b></span>"),a.info.page_count&&(a.info.status=a.info.status+"/"+a.info.page_count,a.info.wrapper_status=a.info.wrapper_status+"<span><b>/{{info.page_count}}</b>.</span>")),angular.isDefined(a.info.feelings)&&a.info.feelings.length>0&&(b=angular.extend(b,{feelings:a.info.feelings})),angular.isDefined(a.info.reading_status_value)&&(b=angular.extend(b,{reading_status_value:a.info.reading_status_value})),angular.isDefined(a.info.book)&&(b=angular.extend(b,{book_id:a.info.book.id||a.info.book.book_id})),angular.isDefined(a.info.mentioned_users_ids)&&a.info.mentioned_users_ids.length>0&&(b=angular.extend(b,{mentioned_users_ids:a.info.mentioned_users_ids})),angular.isDefined(a.info.mentioned_authors_ids)&&a.info.mentioned_authors_ids.length>0&&(b=angular.extend(b,{mentioned_authors_ids:a.info.mentioned_authors_ids})),angular.isDefined(a.info.hash_tags)&&a.info.hash_tags.length>0&&(b=angular.extend(b,{hash_tags:a.info.hash_tags})),angular.isDefined(a.info.status)&&a.info.status.length>0&&(b=angular.extend(b,{content:a.info.status})),angular.isDefined(a.info.wrapper_status)&&a.info.wrapper_status.length>0&&(b=angular.extend(b,{wrapper_content:a.info.wrapper_status})),angular.isDefined(a.info.book_exchange_status)&&(b=angular.extend(b,{book_exchange_status:a.info.book_exchange_status})),angular.isDefined(a.info.page_count)&&(b=angular.extend(b,{total_page_count:a.info.page_count})),angular.isDefined(a.info.current_page)&&(b=angular.extend(b,{current_page:a.info.current_page})),0!=Object.keys(b).length&&(g.post_status(b).then(function(){a.posting=!1,a.info.share_loading=!1}),a.info.status="",a.info.wrapper_status="",a.type_icon_pressed={"margin-right":"60vw"},c(function(){a.type_icon_pressed={"margin-right":"0px"}},100))},a.show_share_page=function(b){var c=""==getCookie("logged")||null==getCookie("logged");c?m("signup").toggle():a.info.show_share?a.post_status():a.info.show_share=!0},a.handle_text_input=function(b){var c={},d=function(){c=a._detect_key(b),""==a.info.status.trim()&&(a.is_new_word_initiation=!0);var d={string_array:a.info.status.split(" "),current_character:String.fromCharCode(b.keyCode),split_string_length:a.info.status.split(" ").length,old_string:a.info.status.split(" ").slice(0,a.info.status.split(" ").length-1).join(" "),current_element:a.info.status.split(" ").pop(),is_new_word_initiation:a.is_new_word_initiation,under_a_tag:a.hash_tagging,html_array:a.info.wrapper_status.split(" "),old_html:a.info.wrapper_status.split(" ").slice(0,a.info.status.split(" ").length-1).join(" "),current_html:a.info.wrapper_status.split(" ").pop(),hash_tagging:a.hash_tagging};return{backspace:function(){if(a.show_interaction_links=!0,1!=d.split_string_length&&(old_string=d.old_string+" ",old_html=d.old_html+" "),"#"==d.current_element)a.hash_tagging=!1,a.info.wrapper_status=d.old_html;else{var c=d.old_html.split("<a>").length!=d.old_html.split("</a>").length,e=">"==d.current_html[d.current_html.length-1],f=d.current_html.indexOf("<br/>")>=0,g=function(){d.html_array=d.old_html.split("<br/>"),d.split_string_length=d.html_array.length,d.old_html=d.html_array.slice(0,d.split_string_length-1).join("<br/>"),old_string=d.old_html.replace(/<br\/>/,"")},h=function(){d.html_array=d.old_html.split("<a>"),d.split_string_length=d.html_array.length,d.old_html=d.html_array.slice(0,d.split_string_length-1).join("<a>"),old_string=d.old_html.replace(/<a>/,"").replace(/<\/a>/,"")},i=function(){a.info.wrapper_status=d.old_html,a.info.status=d.old_string,a.is_new_word_initiation=!0,a.hash_tagging=!1,b.preventDefault()};if(f&&g(),c&&h(),d.hash_tagging||e)i();else{var j=a.info.wrapper_status;a.info.wrapper_status=j.substring(0,j.length-1)}a.info.status&&""!=a.info.status||(a.info.wrapper_status="")}b.stopPropagation()},enter:function(){a.info.hash_tags?(b.preventDefault(),a.handle_selection(a.currentItem)):(a.hash_tagging=!1,a.is_new_word_initiation=!0,a.info.wrapper_status=a.info.wrapper_status+"<br/>")},left:function(){},right:function(){},special_character:function(){var c={hash:3==String.fromCharCode(b.keyCode),plus:"="==String.fromCharCode(b.keyCode),at_the_rate:2==String.fromCharCode(b.keyCode)};if(d.is_new_word_initiation&&c.hash){var e="<a>#</a>";a.hash_tagging=!0,a.info.wrapper_status=a.info.wrapper_status+e}},alphabet:function(){if(" "==d.current_character)d.hash_tagging&&(d.current_element=d.current_element.slice(1),a.info.hash_tags.push(d.current_element)),a.hash_tagging=!1,a.info.wrapper_status=a.info.wrapper_status+d.current_character,delete a.search_for;else if(a.hash_tagging){var b=a.info.wrapper_status.split("</a>"),c=b.length;if(c>2){var e=b[c-2]+d.current_character+"</a>"+b[c-1];a.info.wrapper_status=b.slice(0,c-2).join("</a>")+"</a>"+e}else{var e=b[c-2]+d.current_character+"</a>"+b[c-1];a.info.wrapper_status=e}}else a.info.wrapper_status=a.info.wrapper_status+d.current_character;a.search_for," "==d.current_character?a.is_new_word_initiation=!0:a.is_new_word_initiation=!1}}}();c.enter?d.enter():c.backspace_or_delete?d.backspace():c.left||c.right||c.up||c.down||(c.shift?d.special_character():c.command||d.alphabet()),b.stopPropagation()},a._detect_key=function(a){var b=a.keyCode==h.Backspace||a.keyCode==h.Delete,c=a.keyCode==h.KeyUp,d=a.keyCode==h.KeyDown,e=a.keyCode==h.KeyLeft,f=a.keyCode==h.KeyRight,g=a.keyCode==h.Enter,i=a.keyCode==h.LeftShift||a.keyCode==h.RightShift,j=a.keyCode==h.LeftCommand||a.keyCode==h.RightCommand;return{backspace_or_delete:b,up:c,down:d,left:e,right:f,enter:g,shift:i,command:j}},a.handle_selection=function(b){a.current=0;var c=a.info.status.split(" "),d=a.info.wrapper_status.split(" "),e=(String.fromCharCode(event.keyCode),c.length);if(1==e)var f=c.slice(0,e-1).join(" ").trim(),g=d.slice(0,e-1).join(" ").trim();else var f=c.slice(0,e-1).join(" ")+" ",g=d.slice(0,e-1).join(" ")+" ";c.pop(),d.pop(),a.hash_tagging;a.info.wrapper_status=g+"<a>"+b+"</a>",a.info.status=f+b,event.stopPropagation()},a.share_post=function(){var c=a.info.wrapper_status.replace(/<a>/,"<a>").replace(/<\/a>/,"</a>"),d={message:c,user:{name:b.user.name,thumb:b.user.thumb}};d=_add_labels_to_tweet(d);var e=a.selected_interact_book;d=_add_comment(d,e),angular.isDefined(b.focused_book)&&(0==b.focused_book.tweets.length?b.focused_book.tweets=b.focused_book.tweets.concat([d]):b.focused_book.tweets.push(d))},a.make_active=function(c){delete b.active_book,a.active_id=c,a.info.reading_status_value=c,a.show_relevant_books()},a.init_reading_options=function(){(angular.isUndefined(a.reading_options)||3!=a.reading_options.length)&&(a.reading_options=[{name:"Which Book do you plan to Read?",id:0,status:"Planning to Read",emotion_status:"while planning to read"},{name:"What are you Currently Reading?",id:1,status:"Currently Reading",emotion_status:"while reading"},{name:"Which Book did you Recently Read?",id:2,status:"Recently Read",emotion_status:"after reading"}]),a.reading_status_selected=!1,a.active_id=0,a.info.status_books=[],a.related_info=[],delete a.active_book,delete b.active_book,a.deselect_emotion()},a.show_relevant_books=function(){if(a.reading_status_selected=!0,angular.isUndefined(a.active_book)){a.info.status_books=[],a.info.share_loading=!0;var b=[{title:"The Giver",description:"Jonas' world is perfect. Everything is under control. There is no war or fear or pain. There are no choices. Every person is assigned a role in the Community. When Jonas turns twelve, he is singled out to receive special training from The Giver. The Giver alone holds the memories of the true pain and pleasure of life. Now, it is time for Jonas to receive the truth. There is no turning back.",isbn:"0385732554,9780385732550",author_name:"Lois Lowry",author_id:390175,degree:369,base_rating:4.11,base_ratings_count:746618,base_reviews_count:30671,labels:"Book",id:2364530},{title:"The Awakening",description:"This story of a woman's struggle with oppressive social structures received much public contempt at its first release; put aside because of initial controversy, the novel gained popularity in the 1960s, some six decades after its first publication, and has since remained a favorite of many readers. Chopin's depiction of a married woman, bound to her family and with no way to assert a fulfilling life of her own, has become a foundation for feminism and a classic account of gender crises in the late Victorian era.",isbn:"0543898083,9780543898081",author_name:"Kate Chopin",author_id:389970,degree:363,base_rating:3.6,base_ratings_count:2368,base_reviews_count:108,labels:"Book",id:389969},{title:"Harry Potter and the Half-Blood Prince",description:"The war against Voldemort is not going well; even the Muggle governments are noticing. Ron scans the obituary pages of the Daily Prophet, looking for familiar names. Dumbledore is absent from Hogwarts for long stretches of time, and the Order of the Phoenix has already suffered losses. And yet, as with all wars, life goes on. Sixth-year students learn to Apparateâand lose a few eyebrows in the process. Teenagers flirt and fight and fall in love. Classes are never straightforward, though Harry receives some extraordinary help from the mysterious Half-Blood Prince.So it's the home front that takes center stage in the multilayered sixth installment of the story of Harry Potter. Here at Hogwarts, Harry will search for the full and complex story of the boy who became Lord Voldemortâand thereby find what may be his only vulnerability.",isbn:"0439785960,9780439785969",author_name:"J. K. Rowling",author_id:390054,degree:359,base_rating:4.47,base_ratings_count:1088335,base_reviews_count:15638,labels:"Book",id:395599},{title:"Eclipse",description:"In the dead silence, all the details suddenly fell into place for me with a burst of intuition.Something Edward didn't want me to know. Something Jacob wouldn't have kept from me...It was never going to end, was it?As Seattle is ravaged by a string of mysterious killings and a malicious vampire continues her quest for revenge, Bella once again finds herself surrounded by danger. In the midst of it all, she is forced to choose between her love for Edward and her friendship with Jacob - knowing that her decision has the potential to ignite the ageless struggle between vampire and werewolf. With her graduation quickly approaching, Bella has one more decision to make: life or death. But which is which?",isbn:"0316160202,9780316160209",author_name:"Stephenie Meyer",author_id:395656,degree:358,base_rating:3.73,base_ratings_count:1054,base_reviews_count:161,labels:"Book",id:395892}];a.info.share_loading=!1,a.info.status_books=b}},a.toggle_options=function(){a.show_options=!a.show_options;var b=function(){var b=book.book_id||book.id;i.get_interesting_info(b).then(function(b){a.related_info=[],angular.isDefined(b[0])&&angular.forEach(b[0].info,function(b){var c=b.labels[0],d=b.info.data,e=b.id;if("Author"==c){delete d.indexed_main_author_name,delete d.gr_url,delete d.search_index;var f={id:e,label:"Author"};d=angular.extend(d,f)}else if("Year"==c){var f={label:"Year"};d=angular.extend(d,f)}this.push(d),a.info.share_loading=!1},a.related_info)})};if(angular.isUndefined(a.related_info)){a.info.share_loading=!0;var d=c(b(),100);a.$on("destroy",function(){c.cancel(d)})}},a.set_emotion=function(b){a.active_emotion=b,angular.isUndefined(a.info.feelings)&&(a.info.feelings=[]),a.info.feelings.push(b.name)},a.deselect_emotion=function(){delete a.active_emotion};(function(){a.info.status="",a.info.hash_tags=[],a.info.wrapper_status="",a.init_reading_options(),a.emotions=l})()}]);;homeApp.controller("optionsController",["$scope","$rootScope","$timeout","ShareOptions","$routeParams","$mdBottomSheet",function(a,b,c,d,e,f){(function(){a.share_options=d,a.data={selectedIndex:0}})();a.show_level1_options=function(b,e,f){a.first_option=b,delete a.second_option,delete a.level2_nested_options,delete a.info.book_exchange_status,delete a.info.feelings,a.data.selectedIndex=Math.min(a.data.selectedIndex+1,2),a.info.reading_status_value=e,a.loading=!0,angular.forEach(d.ReadingStage,function(d){if(angular.equals(d,b)){var e=c(function(){a.loading=!1,a.nested_options=b.nested_options},1e3);a.$on("destroy",function(){c.cancel(e)})}})},a.show_level2_options=function(b,d,e){if(delete a.info.feelings,a.second_option=b,a.data.selectedIndex=Math.min(a.data.selectedIndex+1,2),a.info.book_exchange_status=d,a.level2_loading=!0,angular.isDefined(a.second_option.search_book))delete a.level2_nested_options;else{c(function(){a.level2_loading=!1,a.level2_nested_options=a.second_option.value},1e3)}},a.post_status=function(b,c){a.info.feelings=[b.name]},a.previous=function(){a.data.selectedIndex=Math.max(a.data.selectedIndex-1,0)}}]);;homeApp.controller("profileController",["$scope","userService","$rootScope","WebsiteUIConstants","ColorConstants","$location","bookService","newsService","$mdDialog","infinityService","$timeout","sharedService",function(a,b,c,d,e,f,g,h,i,j,k,l){var m=function(){b.get_user_details(a.active_user_id).then(function(b){a.profile_user=b})};a.get_feed=function(){if(a.info.selectedIndex=1,!a.info.loading){var c=[],d=a.active_user_id;a.info.loading=!0;var f=function(a){var b="";switch(a.label){case"BookmarkNode":b="Added to "+a.node.key;break;case"Listopia":break;case"CommunityNode":break;case"BlogNode":break;case"StatusNode":b=a.node.wrapper_content;break;case"EndorseNode":b="Endorsed this book.";break;case"RatingNode":b="Gave "+a.node.content+" rating on 10.";break;case"FollowsNode":b="Joined community."}return b},g=function(){var a=[],b=function(a,b){var c=!1,d=0;return a.length>0&&angular.forEach(a,function(a,e){angular.isDefined(a.book)&&a.book.id==b&&(c=!0,d=e)}),{status:c,index:d}};angular.forEach(c,function(c){if(angular.isDefined(c.book)){var d=b(a,c.book.id);d.status?(delete c.book,a[d.index].data.push(c)):(angular.isDefined(c.book)&&(d={book:c.book},delete c.book,c=angular.extend(d,{data:[c]})),this.push(c))}else this.push(c)},a),c=a};angular.isUndefined(a.personal_feed)&&(a.personal_feed=[]);var h=a.personal_feed.length;b.get_personal_feed(d,h).then(function(b){b.length>0&&(angular.forEach(b,function(a){var b=Math.floor(Math.random()*e.value.length);angular.isDefined(a.book)&&(a.book=angular.extend(a.book,{color:e.value[b]})),this.push(a)},c),g(),angular.forEach(c,function(a){if(angular.isDefined(a.book))angular.forEach(a.data,function(a){var b=f(a);a=angular.extend(a,{message:b})});else if(angular.isDefined(a.community)){var b=f(a);c=angular.extend(a,{message:b})}else{var b=f(a),c=angular.extend(a,{message:b});a.data=[c]}})),a.info.loading=!1,a.personal_feed=a.personal_feed.concat(c)})}},a.follow_user=function(){a.profile_user.status=!a.profile_user.status,b.follow(a.profile_user.id,a.profile_user.status)};a.show_book_dialog=function(b,d){l.show_book_dialog(c,a,b,d)};(function(){a.info.books=[],a.profile_user={},a.info.embed_share=!0;var d=/[?&]([^=#]+)=([^&#]*)/g,e=d.exec(f.absUrl());if(angular.isDefined(e)&&null!=e){a.active_user_id=e[2],angular.isDefined(c.user)?(a.profile_user={id:a.active_user_id},c.user.id==a.active_user_id?a.info.my_profile=!0:(a.info.my_profile=!1,a.hide_follow_links=!0)):(a.info.my_profile=!1,a.hide_follow_links=!0);var g=k(function(){m()},100);a.$on("destroy",function(){k.cancel(g)})}else if(a.info.my_profile=!0,angular.isUndefined(c.user)){var g=k(function(){b.get_user_details().then(function(b){c.user=b,a.profile_user=c.user,a.active_user_id=a.profile_user.id})},100);a.$on("destroy",function(){k.cancel(g)})}else a.profile_user=c.user,a.active_user_id=a.profile_user.id;var h=k(function(){a.get_feed()},100);a.$on("destroy",function(){k.cancel(h)})})()}]);;homeApp.controller("toastController",["$scope","$mdToast",function(a,b){a.closeToast=function(){b.hide()}}]);;homeApp.controller("specificBookController",["$scope","$rootScope","$timeout","bookService","$mdToast","$location","$mdSidenav","ColorConstants",function(a,b,c,d,e,f,g,h){a.toggle_endorse=function(){i()?g("signup").toggle():(a.book.endorse_status?a.book.endorse_status=!1:a.book.endorse_status=!0,d.endorse_book(b.active_book.book_id,a.book.endorse_status),e.show({controller:"toastController",templateUrl:"assets/angular/html/shared/toast/endorse_action.html",hideDelay:6e3,position:a.getToastPosition()}))};var i=function(){return""==getCookie("logged")||null==getCookie("logged")};a.show_share_bottom_sheet=function(a){g("right_share").toggle()},a.getToastPosition=function(){return Object.keys(a.toast_position).filter(function(b){return a.toast_position[b]}).join(" ")},a.rate_book=function(a){i()?g("signup").toggle():d.rate_book(a.book_id,a.user_rating)},a.load_sample_read=function(){};var j=function(){var e=/[?&]([^=#]+)=([^&#]*)/g,g=e.exec(f.absUrl());if(angular.isUndefined&&(a.data={}),a.data.selectedIndex=0,null!=g)var i=g[2];if(angular.isDefined(b.active_book))if(angular.isDefined(b.active_book.id))var j=b.active_book.id;else var j=b.active_book.book_id;else var j=i;var k="id="+j;a.book_loading=!0;var l=c(function(){a.info.loading=!0,d.get_book_details(k).then(function(c){if(angular.isDefined(c)&&null!=c){var d=null!=c.endorse_status,e=null!=c.status,f=Math.floor(Math.random()*h.value.length),g={endorse_status:d,status:e,color:h.value[f]};angular.isDefined(b.active_book)?a.book=angular.extend(b.active_book,c):a.book=c,a.book=angular.extend(a.book,g),b.active_book=a.book}a.book_loading=!1,a.info.loading=!1}),d.update_visited(j)},1e3);a.$on("destroy",function(){c.cancel(l)}),a.toast_position={bottom:!1,top:!0,left:!1,right:!0},a.constant={show_book:!0}};j()}]);;homeApp.controller("timelineController",["$scope","$rootScope","bookService","$location","userService","$mdDialog",function(a,b,c,d,e,f){a.write_reading_journey_for=function(){a.info.book=b.active_book,a.info.show_share=!0,a.info.show_book_share=!0,f.hide()},a.get_feed=function(){a.book_loading=!0,a.info.loading=!0,angular.isUndefined(a.book_feed)&&(a.book_feed=[]);var b=a.book_feed.length,d=function(a){var b="";switch(a.label){case"BookmarkNode":b="Added to "+a.node.key;break;case"Listopia":break;case"CommunityNode":break;case"BlogNode":break;case"StatusNode":b=a.node.wrapper_content;break;case"EndorseNode":b="Endorsed this book.";break;case"RatingNode":b="Gave "+a.node.content+" rating on 10."}return b},f=function(){var b=[],c=function(a,b){var c=!1,d=0;return a.length>0&&angular.forEach(a,function(a,e){angular.isDefined(a.user)&&a.user.id==b&&(c=!0,d=e)}),{status:c,index:d}};angular.forEach(a.book_feed,function(a){if(angular.isDefined(a.user)){var d=c(b,a.user.id);d.status?(delete a.user,b[d.index].data.push(a)):(angular.isDefined(a.user)&&(d={user:a.user},delete a.user,a=angular.extend(d,{data:[a]})),this.push(a))}else this.push(a)},b),a.book_feed=b};c.get_feed(a.book_id,b).then(function(b){a.book_feed=b,f(),angular.forEach(a.book_feed,function(a){if(angular.isDefined(a.user))e.get_user_details(a.user.id).then(function(b){a.user=angular.extend(a.user,b),angular.forEach(a.data,function(a){var b=d(a);a=angular.extend(a,{message:b})})});else{var b=d(a),c=angular.extend(a,{message:b});a.data=[c]}}),a.book_loading=!1,a.info.loading=!1})};(function(){var c=/[?&]([^=#]+)=([^&#]*)/g,e=c.exec(d.absUrl());if(null!=e)var f=e[2];if(angular.isDefined(b.active_book))var g=b.active_book.book_id||b.active_book.id;else var g=f;a.book_id=g,a.get_feed()})()}]);;homeApp.controller("realVirtualityController",["$scope","$rootScope","bookService",function(a,b,c){(function(){var d=b.active_book.book_id;a.book_loading=!0,a.info.loading=!0,c.get_real_news(d).then(function(b){a.book_loading=!1,a.info.loading=!1,a.communities=b,a.active_community=b[0]})})()}]);