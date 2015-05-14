homeApp.controller("shareController",["$scope","$rootScope","$timeout","ShareOptions","$routeParams","$mdBottomSheet","statusService","WebsiteUIConstants","bookService","ColorConstants","sharedService","Emotions",function(a,b,c,d,e,f,g,h,i,j,k,l){a.play_type_key=function(b){a.info.show_share&&(angular.isUndefined(a.current_track)||0==a.current_track?(a.current_track=1,document.getElementById("audiotag1").play()):1==a.current_track?(a.current_track=2,document.getElementById("audiotag2").play()):(a.current_track=0,document.getElementById("audiotag3").play()),b.stopPropagation())},a.deselect_book=function(){delete a.active_book,a.deselect_emotion(),delete a.related_info,delete a.info.status_books,a.show_relevant_books()},a.show_interesting_details=function(b){a.active_book=b,a.info.status_books=[b],a.info.loading=!0,i.get_interesting_info(b.book_id).then(function(b){a.related_info=[],angular.forEach(b[0].info,function(b){var c=b.labels[0],d=b.info.data,e=b.id;if("Author"==c){delete d.indexed_main_author_name,delete d.gr_url,delete d.search_index;var f={id:e,label:"Author"};d=angular.extend(d,f)}else if("Year"==c){var f={label:"Year"};d=angular.extend(d,f)}this.push(d),a.info.loading=!1},a.related_info)})},a.show_share_options=function(b){f.show({templateUrl:"assets/angular/html/share/_share_options.html",controller:"optionsController",scope:a,preserveScope:!0,targetEvent:b}).then(function(){})},a.back=function(){a.info.show_share=!1,a.info.show_book_share=!1,delete b.active_shelf,event.stopPropagation()},a.search_books=function(b){a.info.loading=!0,a.searched_books=[],i.search_books(b,10).then(function(b){a.info.loading=!1,a.did_you_mean=!0,angular.forEach(b,function(a){var b=Math.floor(Math.random()*j.value.length);angular.isUndefined(a.fuzzy)&&(a=angular.extend(a,{color:j.value[b]}),this.push(a))},a.searched_books)})},a.add_book=function(c){b.active_shelf?(b.bookmark_object={id:c.id||c.book_id,type:"Book"},k.toggle_bookmark(b.active_shelf,!1),delete b.active_shelf,a.info.show_share=!1):a.info.book=c},a.show_share_page=function(){var b=function(){var b={};angular.isDefined(a.info.feelings)&&a.info.feelings.length>0&&(b=angular.extend(b,{feelings:a.info.feelings})),angular.isDefined(a.info.reading_status_value)&&(b=angular.extend(b,{reading_status_value:a.info.reading_status_value})),angular.isDefined(a.info.book)&&(b=angular.extend(b,{book_id:a.info.book.id})),angular.isDefined(a.info.mentioned_users_ids)&&a.info.mentioned_users_ids.length>0&&(b=angular.extend(b,{mentioned_users_ids:a.info.mentioned_users_ids})),angular.isDefined(a.info.mentioned_authors_ids)&&a.info.mentioned_authors_ids.length>0&&(b=angular.extend(b,{mentioned_authors_ids:a.info.mentioned_authors_ids})),angular.isDefined(a.info.hash_tags)&&a.info.hash_tags.length>0&&(b=angular.extend(b,{hash_tags:a.info.hash_tags})),angular.isDefined(a.info.status)&&a.info.status.length>0&&(b=angular.extend(b,{content:a.info.status})),angular.isDefined(a.info.wrapper_status)&&a.info.wrapper_status.length>0&&(b=angular.extend(b,{wrapper_content:a.info.wrapper_status})),angular.isDefined(a.info.book_exchange_status)&&(b=angular.extend(b,{book_exchange_status:a.info.book_exchange_status})),0!=Object.keys(b).length&&(g.post_status(b),a.info.status="",a.info.wrapper_status="",a.type_icon_pressed={"margin-right":"60vw"},c(function(){a.type_icon_pressed={"margin-right":"0px"}},100))};a.info.show_share?b():a.info.show_share=!0},a.handle_text_input=function(b){var c={},d=function(){c=a._detect_key(b),""==a.info.status.trim()&&(a.is_new_word_initiation=!0);var d={string_array:a.info.status.split(" "),current_character:String.fromCharCode(b.keyCode),split_string_length:a.info.status.split(" ").length,old_string:a.info.status.split(" ").slice(0,a.info.status.split(" ").length-1).join(" "),current_element:a.info.status.split(" ").pop(),is_new_word_initiation:a.is_new_word_initiation,under_a_tag:a.hash_tagging,html_array:a.info.wrapper_status.split(" "),old_html:a.info.wrapper_status.split(" ").slice(0,a.info.status.split(" ").length-1).join(" "),current_html:a.info.wrapper_status.split(" ").pop(),hash_tagging:a.hash_tagging};return{backspace:function(){if(a.show_interaction_links=!0,1!=d.split_string_length&&(old_string=d.old_string+" ",old_html=d.old_html+" "),"#"==d.current_element)a.hash_tagging=!1,a.info.wrapper_status=d.old_html;else{var c=d.old_html.split("<a>").length!=d.old_html.split("</a>").length,e=">"==d.current_html[d.current_html.length-1],f=d.current_html.indexOf("<br/>")>=0,g=function(){d.html_array=d.old_html.split("<br/>"),d.split_string_length=d.html_array.length,d.old_html=d.html_array.slice(0,d.split_string_length-1).join("<br/>"),old_string=d.old_html.replace(/<br\/>/,"")},h=function(){d.html_array=d.old_html.split("<a>"),d.split_string_length=d.html_array.length,d.old_html=d.html_array.slice(0,d.split_string_length-1).join("<a>"),old_string=d.old_html.replace(/<a>/,"").replace(/<\/a>/,"")},i=function(){a.info.wrapper_status=d.old_html,a.info.status=d.old_string,a.is_new_word_initiation=!0,a.hash_tagging=!1,b.preventDefault()};if(f&&g(),c&&h(),d.hash_tagging||e)i();else{var j=a.info.wrapper_status;a.info.wrapper_status=j.substring(0,j.length-1)}a.info.status&&""!=a.info.status||(a.info.wrapper_status="")}b.stopPropagation()},enter:function(){a.info.hash_tags?(b.preventDefault(),a.handle_selection(a.currentItem)):(a.hash_tagging=!1,a.is_new_word_initiation=!0,a.info.wrapper_status=a.info.wrapper_status+"<br/>")},left:function(){},right:function(){},special_character:function(){var c={hash:3==String.fromCharCode(b.keyCode),plus:"="==String.fromCharCode(b.keyCode),at_the_rate:2==String.fromCharCode(b.keyCode)};if(d.is_new_word_initiation&&c.hash){var e="<a>#</a>";a.hash_tagging=!0,a.info.wrapper_status=a.info.wrapper_status+e}},alphabet:function(){if(" "==d.current_character)d.hash_tagging&&(d.current_element=d.current_element.slice(1),a.info.hash_tags.push(d.current_element)),a.hash_tagging=!1,a.info.wrapper_status=a.info.wrapper_status+d.current_character,delete a.search_for;else if(a.hash_tagging){var b=a.info.wrapper_status.split("</a>"),c=b.length;if(c>2){var e=b[c-2]+d.current_character+"</a>"+b[c-1];a.info.wrapper_status=b.slice(0,c-2).join("</a>")+"</a>"+e}else{var e=b[c-2]+d.current_character+"</a>"+b[c-1];a.info.wrapper_status=e}}else a.info.wrapper_status=a.info.wrapper_status+d.current_character;a.search_for,a.is_new_word_initiation=" "==d.current_character?!0:!1}}}();c.enter?d.enter():c.backspace_or_delete?d.backspace():c.left||c.right||c.up||c.down||(c.shift?d.special_character():c.command||d.alphabet()),b.stopPropagation()},a._detect_key=function(a){var b=a.keyCode==h.Backspace||a.keyCode==h.Delete,c=a.keyCode==h.KeyUp,d=a.keyCode==h.KeyDown,e=a.keyCode==h.KeyLeft,f=a.keyCode==h.KeyRight,g=a.keyCode==h.Enter,i=a.keyCode==h.LeftShift||a.keyCode==h.RightShift,j=a.keyCode==h.LeftCommand||a.keyCode==h.RightCommand;return{backspace_or_delete:b,up:c,down:d,left:e,right:f,enter:g,shift:i,command:j}},a.handle_selection=function(b){a.current=0;var c=a.info.status.split(" "),d=a.info.wrapper_status.split(" "),e=(String.fromCharCode(event.keyCode),c.length);if(1==e)var f=c.slice(0,e-1).join(" ").trim(),g=d.slice(0,e-1).join(" ").trim();else var f=c.slice(0,e-1).join(" ")+" ",g=d.slice(0,e-1).join(" ")+" ";c.pop(),d.pop(),a.hash_tagging;a.info.wrapper_status=g+"<a>"+b+"</a>",a.info.status=f+b,event.stopPropagation()},a.share_post=function(){var c=a.info.wrapper_status.replace(/<a>/,"<a>").replace(/<\/a>/,"</a>"),d={message:c,user:{name:b.user.name,thumb:b.user.thumb}};d=_add_labels_to_tweet(d);var e=a.selected_interact_book;d=_add_comment(d,e),angular.isDefined(b.focused_book)&&(0==b.focused_book.tweets.length?b.focused_book.tweets=b.focused_book.tweets.concat([d]):b.focused_book.tweets.push(d))},a.make_active=function(b){a.active_id=b,a.show_relevant_books()},a.init_reading_options=function(){a.reading_options=[{name:"What are you currently reading?",id:0,status:"Currently Reading",emotion_status:"white reading"},{name:"Which book do you plan to read?",id:1,status:"Planning to Read",emotion_status:"while planning to read"},{name:"Which book did you recently read?",id:2,status:"Recently Read",emotion_status:"after reading"}],a.reading_status_selected=!1,a.active_id=0,a.info.status_books=[],a.related_info=[],delete a.active_book,a.deselect_emotion()},a.show_relevant_books=function(){a.reading_status_selected=!0,angular.isUndefined(a.active_book)&&(a.info.status_books=[],k.get_popular_books(a,a.info.status_books))},a.toggle_options=function(){a.show_options=!a.show_options},a.set_emotion=function(b){a.active_emotion=b},a.deselect_emotion=function(){delete a.active_emotion};!function(){a.info.status="",a.info.hash_tags=[],a.info.wrapper_status="",a.init_reading_options(),a.emotions=l}()}]);