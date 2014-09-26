websiteApp.directive("siteLogo",[function(){return{restrict:"E",templateUrl:"/assets/angular/views/unused/site_logo.html"}}]),websiteApp.directive("userThumb",[function(){return{restrict:"E",templateUrl:"/assets/angular/views/unused/user_thumb.html"}}]),websiteApp.directive("toggle",function(){return{restrict:"E",scope:{obj:"=data",onSelect:"&",onDeselect:"&"},controller:["$scope",function(a){a.toggle=function(){a.obj.status?(a.obj.status=!1,a.onDeselect()):(a.obj.status=!0,a.onSelect())}}],templateUrl:"/assets/angular/views/getting_started/shared/toggle.html"}}),websiteApp.directive("track",["$rootScope",function(a){return{restrict:"A",link:function(){_record_details=function(b){node_name=b.currentTarget.nodeName,time_stamp=b.timeStamp,thousand_milliseconds=1e5,time_stamp=thousand_milliseconds*(time_stamp%thousand_milliseconds/thousand_milliseconds),action_type=b.type,"A"==node_name&&(node_name=b.currentTarget.href),id=b.currentTarget.id,uid=node_name+":"+id,array=id.split("-"),containsCategory=array.length>1,containsCategory?(category=array[0],book_id=array[1]):(category="",book_id=""),data_json=[{time_stamp:time_stamp,action_type:action_type,node_name:node_name,uid:uid,category:category,book_id:book_id}],a.data=a.data.concat(data_json)}}}}]),websiteApp.directive("horizontalScroller",function(){return{restrict:"E",templateUrl:"/assets/angular/views/unused/horizontal_scroller.html"}}),websiteApp.directive("setFocus",["$timeout","$parse","$rootScope",function(a,b,c){return{link:function(d,e,f){var g=b(f.setFocus);d.$watch(g,function(b){1==b&&a(function(){c.keyCode&&(e[0].value=String.fromCharCode(c.keyCode)),e[0].focus()})})}}}]),websiteApp.directive("typeAhead",["$timeout","$sce","$document",function(a){return{restrict:"E",scope:{items:"=",prompt:"@",title:"@",id:"@",custom:"@",iconClass:"@",customOptions:"@",focusWhen:"=",subtitle:"@",model:"=",itemId:"=",onSelect:"&",autoPopulate:"&",onClear:"&"},link:function(){},controller:["$scope","$sce","recommendationService","WebsiteUIConstants",function(b,c,d,e){b.is_current=function(a,c){return b.current==a&&(b.currentItem=c.name,b.currentItemId=c.id),b.current==a},b.set_current=function(a){b.current=a},b.navigate_options=function(){var a=event.keyCode==e.Enter;a&&b.handle_selection(b.currentItem,b.currentItemId)},b.key_up=function(){var a=event.keyCode==e.KeyUp,c=event.keyCode==e.KeyDown,d=event.keyCode==e.Backspace;a?b.set_current(0!=b.current?b.current-1:b.filtered.length-1):c?b.set_current(b.current!=b.filtered.length-1?b.current+1:0):d&&(angular.isUndefined(b.model)||""==b.model)&&(b.filtered=[],b.onClear())},_init=function(){b.current=0,b.selected=!0,b.name=""},b.focus_on_input=function(){},b.auto_populate=function(){b.autoPopulate()},b.highlight=function(a,b){return angular.isDefined(b)&&angular.isDefined(a)?c.trustAsHtml(b.replace(new RegExp(a,"gi"),'<span style="font-weight:bold;">$&</span>')):void 0},b.remove_filter=function(){b.model="",b.onClear()},b.handle_selection=function(c,d){angular.isDefined(d)?(b.itemId=d,b.model=c.toUpperCase()):(b.itemId=c.id,b.model=c.name.toUpperCase()),b.current=0,b.selected=!0,a(function(){b.onSelect()},200)},_init()}],templateUrl:"/assets/angular/views/unused/type_ahead.html"}}]),websiteApp.directive("message",function(){return{restrict:"E",controller:["$scope",function(a){a.close_message=function(){"Allow your webcam. Swipe Left|Right to look for more books."==a.message?a.message='Just "START TYPING" anytime to search.':a.message_closed=!0},_init_motion_adaption=function(){},(_init=function(){a.message_closed=!0})()}],templateUrl:"/assets/angular/views/unused/message.html"}}),websiteApp.directive("notification",["$rootScope","$timeout","$location","$routeParams",function(a,b,c,d){return{restrict:"E",scope:{notification:"=data"},controller:["$scope",function(e){e.toggle_ticker_popup=function(d,f){var g=angular.isDefined(f.title);if(g)c.path("/user/"+a.user.id+"/trending/books/id/"+f.id+"/name/"+f.name);else{var h=null==a.ticker_popup;if(h)angular.isDefined(e.notification.book)&&null!=e.notification.book.id&&(a.ticker_popup=e.notification.book,delete a.focused_book);else if(a.ticker_popup==e.notification.book)delete a.ticker_popup;else{delete a.ticker_popup;var i=b(function(){angular.isDefined(e.notification.book.id)&&null!=e.notification.book.id&&(a.ticker_popup=e.notification.book)},200);e.$on("destroy",function(){b.cancel(i)})}}d.stopPropagation()},_get_arrow_position=function(a){var b=90,c=17;return a.y>b&&a.y<b+54||(a.y>b+54&&a.y<b+108?c+=54:a.y>b+108&&a.y<b+162?c+=108:a.y>b+162&&a.y<b+216?c+=162:a.y>b+216&&a.y<b+270&&(c+=216)),c},e.show_ticker_popup=function(){a.ticker_popup=e.notification.book},(_init=function(){e.$routeParams=d})()}],templateUrl:"/assets/angular/views/left_panel/partials/notification.html"}}]),websiteApp.directive("compile",["$compile",function(a){return["scope","element","attrs",function(b,c,d){var e=b.$watch(function(a){return a.$eval(d.compile)},function(d){c.html(d),a(c.contents())(b),e()})}]}]),websiteApp.directive("searchBar",function(){return{restrict:"E",templateUrl:"/assets/angular/views/search/partials/search_bar.html"}}),websiteApp.directive("checkScrollBottom",function(){return{restrict:"A",link:function(a,b,c){var d=b[0];b.bind("scroll",function(){var b=20;d.scrollTop+d.offsetHeight+b>d.scrollHeight&&a.$apply(c.checkScrollBottom)})}}}),websiteApp.directive("checkScrollUp",function(){return{restrict:"A",link:function(a,b,c){var d=b[0],e=d.scrollTop;b.bind("scroll",function(){d.scrollTop<=e&&a.$apply(c.checkScrollUp),e=d.scrollTop})}}}),websiteApp.directive("checkScrollDown",function(){return{restrict:"A",link:function(a,b,c){var d=b[0],e=d.scrollTop;b.bind("scroll",function(){d.scrollTop>e&&a.$apply(c.checkScrollDown),e=d.scrollTop})}}}),websiteApp.directive("focusOut",function(){return function(a,b,c){b.bind("blur",function(){a.$apply(c.focusOut)})}}),websiteApp.directive("calendar",["$rootScope",function(a){return{restrict:"E",scope:{saveDate:"&"},controller:["$scope",function(b){b.date_check=function(){var a=b.months.indexOf(b.selectedMonth)+1,c=new Date(b.selectedYear,a,0).getDate();b.days=new Array(c).join().split(",").map(function(a,b){return++b})},b.save_date=function(c,d,e){a.user.selectedDay=e,a.user.selectedMonth=d,a.user.selectedYear=c,b.saveDate()},(_init=function(){b.days=new Array(31).join().split(",").map(function(a,b){return++b}),b.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],b.years=[],b.selectedDay=a.user.selectedDay,b.selectedMonth=a.user.selectedMonth,b.selectedYear=a.user.selectedYear;for(var c=(new Date).getFullYear(),d=c;d>1904;d--)b.years.push(d)})()}],templateUrl:"/assets/angular/views/getting_started/shared/calendar.html"}}]),websiteApp.directive("feedbackPopup",["$document","websiteService","$rootScope","$timeout",function(a,b,c,d){return{restrict:"A",link:function(a,b){b=b.children()},controller:["$scope",function(a){a.get_feedback=!1,a.feedback_text="Feedback",c.user.feedback="",a.handle_feedback=function(){if(c.user.feedback.length>8){var e={feedback:c.user.feedback};a.feedback_text="Sent! :)",b.save_feedback(e),c.user.feedback="";var f=d(function(){g()},3e3);a.$on("destroy",function(){d.cancel(f)})}else a.feedback_text="Please elaborate a bit more..";var g=function(){a.feedback_text="Feedback"}}}],templateUrl:"/assets/angular/views/footer/feedback_popup.html"}}]),websiteApp.directive("feed",["$rootScope","$timeout","websiteService","widgetService","WebsiteUIConstants","StatusUIConstants",function(a,b,c,d,e,f){return{restrict:"E",controller:["$scope",function(g){g.update_hashtagged_comment=function(){},g.get_notifications=function(a,b){g.$emit("getNotifications",a,b)},_clear_focus=function(){var a=b(function(){g.start_searching=!1},200);g.$on("destroy",function(){b.cancel(a)})},g.handle_interact_book_selection=function(b){g.current_interact_book=0,g.selected_interact_book=b,a.user.interact_books=[],event.stopPropagation()},g.remove_selected_book=function(){a.user.interact_books=[],g.placeholder=e.ShareSomething,delete g.selected_interact_book},g.is_current_interact_book=function(a,b){return g.current_interact_book==a&&(g.current_interact_book_item=b),g.current_interact_book==a},g.set_current_interact_book=function(a){g.current_interact_book=a},g.search_interact_books=function(d){var f=d.keyCode==e.KeyUp,h=d.keyCode==e.KeyDown,i=d.keyCode==e.Enter,j=d.keyCode==e.Backspace,k=!(f||h||i);if(f?g.set_current_interact_book(0!=g.current_interact_book?g.current_interact_book-1:a.user.interact_books.length-1):h?g.set_current_interact_book(g.current_interact_book!=a.user.interact_books.length-1?g.current_interact_book+1:0):i&&(g.handle_interact_book_selection(g.current_interact_book_item),d.preventDefault()),k){var l=g.user.interact_book.length>3;if(l)var m=b(function(){g.loading=!0,c.search_books(g.user.interact_book).then(function(a){g.user.interact_books=[],a=a.results,0!=a.length?angular.forEach(a,function(a){var b=(null!=a[4],{isbn:a[0],id:a[1],title:a[2],author_name:a[3]});this.push(b)},g.user.interact_books):g.user.interact_books=[],g.loading=!1,b.cancel(m)})},500);else j&&(g.user.interact_books=[])}},g.select_level1=function(a,b){g.level1_option=a,delete g.level2_option,delete g.level3_option,g.level1_options=[],g.level2_options=a.value,g.show_search=angular.isDefined(a.value)&&angular.isDefined(a.value[0])&&a.value[0].SearchBook,g.start_searching=g.show_search,_clear_focus(),b.stopPropagation()},g.select_level2=function(a,b){g.level2_option=a,g.level3_option=a,g.level1_options=[],g.level2_options=[],g.show_search=angular.isDefined(a.value)&&angular.isDefined(a.value[0])&&a.value[0].SearchBook,g.start_searching=g.show_search,_clear_focus(),b.stopPropagation()},g.show_interaction_options=function(a,b){a==f.EmotionConstants.name?g.level1_options=f.EmotionConstants.value:a==f.OwnershipConstants.name?g.level1_options=f.OwnershipConstants.value:a==f.QuoteConstants.name&&(g.level1_options=f.QuoteConstants.value),g.level2_options=[],delete g.level1_option,delete g.level2_option,delete g.level3_option,b.stopPropagation()},g.stop_propagation=function(a){g.level1_options=[],g.level2_options=[],a.stopPropagation()},g.close_interaction_box=function(){angular.isDefined(g.hash_tags)&&g.hash_tags.length>0?g.hash_tags=[]:angular.isDefined(g.level1_options)&&g.level1_options.length>0?g.level1_options=[]:angular.isDefined(g.level2_options)&&g.level2_options.length>0?g.level2_options=[]:angular.isDefined(a.user.interact_books)&&a.user.interact_books.length>0?a.user.interact_books=[]:a.user.interact=!1},g.stop_horizontal_scroll=function(a){a.stopPropagation()},g.handle_selection=function(b){g.current=0;var c=a.user.current_comment.split(" "),d=a.user.hash_tagged_comment.split(" "),e=(String.fromCharCode(event.keyCode),c.length);if(1==e)var f=c.slice(0,e-1).join(" ").trim(),h=d.slice(0,e-1).join(" ").trim();else var f=c.slice(0,e-1).join(" ")+" ",h=d.slice(0,e-1).join(" ")+" ";c.pop(),d.pop(),g.hash_tagging;a.user.hash_tagged_comment=h+"<b>"+b+"</b>",a.user.current_comment=f+b,delete g.hash_tags,event.stopPropagation()},g.handle_backspace=function(b){var c=a.user.current_comment.split(" "),d=a.user.hash_tagged_comment.split(" "),f=(String.fromCharCode(b.keyCode),c.length);if(1==f)var h=c.slice(0,f-1).join(" "),i=d.slice(0,f-1).join(" ");else var h=c.slice(0,f-1).join(" ")+" ",i=d.slice(0,f-1).join(" ")+" ";var j=c.pop(),k=d.pop(),l=b.keyCode==e.Backspace,m=g.hash_tagging;if(l){if("#"==j)g.hash_tagging=!1,delete g.hash_tags,a.user.hash_tagged_comment=i;else{var n=i.split("<b>").length!=i.split("</b>").length,o=">"==k[k.length-1],p=k.indexOf("<br/>")>=0;if(p&&(d=i.split("<br/>"),f=d.length,i=d.slice(0,f-1).join("<br/>"),h=i.replace(/<br\/>/,"")),n&&(d=i.split("<b>"),f=d.length,i=d.slice(0,f-1).join("<b>"),h=i.replace(/<b>/,"").replace(/<\/b>/,"")),m||o)a.user.hash_tagged_comment=i,a.user.current_comment=h,g.is_new_word_initiation=!0,g.hash_tagging=!1,delete g.hash_tags,b.preventDefault();else{var q=a.user.hash_tagged_comment;a.user.hash_tagged_comment=q.substring(0,q.length-1)}}a.user.current_comment&&""!=a.user.current_comment||(a.user.hash_tagged_comment="")}b.stopPropagation()},g.handle_hash_tags=function(b){""==a.user.current_comment.trim()&&(g.is_new_word_initiation=!0);var d=a.user.current_comment.split(" "),f=String.fromCharCode(b.keyCode),h=d.length,i=(d.slice(0,h-1).join(" "),d.pop()),j=g.is_new_word_initiation,k=(g.hash_tagging,b.keyCode==e.Enter);if(k)g.hash_tags?(b.preventDefault(),g.handle_selection(g.currentItem)):(g.hash_tagging=!1,g.is_new_word_initiation=!0,a.user.hash_tagged_comment=a.user.hash_tagged_comment+"<br/>");else{if(j&&"#"==f){var l="<b>"+f+"</b>";g.hash_tagging=!0,a.user.hash_tagged_comment=a.user.hash_tagged_comment+l}else if(j&&"+"==f){var l="<b>"+f+"</b>";g.hash_tagging=!0,a.user.hash_tagged_comment=a.user.hash_tagged_comment+l,g.search_for="TAGS"}else if(j&&"@"==f){var l="<b>"+f+"</b>";g.hash_tagging=!0,a.user.hash_tagged_comment=a.user.hash_tagged_comment+l,g.search_for="[AUTHORS, READERS]"}else if(" "==f)g.hash_tagging=!1,a.user.hash_tagged_comment=a.user.hash_tagged_comment+f,delete g.search_for;else if(g.hash_tagging){var m=a.user.hash_tagged_comment.split("</b>"),n=m.length;if(n>2){var o=m[n-2]+f+"</b>"+m[n-1];a.user.hash_tagged_comment=m.slice(0,n-2).join("</b>")+"</b>"+o}else{var o=m[n-2]+f+"</b>"+m[n-1];a.user.hash_tagged_comment=o}}else a.user.hash_tagged_comment=a.user.hash_tagged_comment+f;g.search_for&&i.length>2&&(string_to_be_searched=i.slice(1,i.length)+""+f,c.search(string_to_be_searched.trim(),g.search_for,3).then(function(a){g.hash_tags=[];for(var b=a.results.data,c=0;c<b.length;c++){var d={name:b[c][0]};g.hash_tags.push(d)}})),g.is_new_word_initiation=" "==f?!0:!1}b.stopPropagation()},g.share_post=function(){var b=a.user.hash_tagged_comment.replace(/<b>/,"<a>").replace(/<\/b>/,"</a>"),c={message:b,user:{name:a.user.name,thumb:a.user.thumb}};c=_add_labels_to_tweet(c);var d=g.selected_interact_book;c=_add_comment(c,d),angular.isDefined(a.focused_book)&&(0==a.focused_book.tweets.length?a.focused_book.tweets=a.focused_book.tweets.concat([c]):a.focused_book.tweets.push(c))},_add_labels_to_tweet=function(a){if(angular.isDefined(g.level1_option)){var b={label1:{name:g.level1_option.name,icon:g.level1_option.icon,label:g.level1_option.label,icon2:g.level1_option.icon2}};a=angular.extend(a,b)}if(angular.isDefined(g.level2_option)){var b={label2:{name:g.level2_option.name,icon:g.level2_option.icon,label:g.level2_option.label,icon2:g.level2_option.icon2}};a=angular.extend(a,b)}return a},_reset_interact_box=function(){delete g.level1_option,delete g.level2_option,a.user.interact_book="",a.user.current_comment="",a.user.hash_tagged_comment="",g.status_message=e.StatusPosted;b(function(){g.status_message=""},5e3);g.$on("destroy",function(){b.cancel("share_timeout_event")})},_get_tag_for_tweet=function(a,b){if(angular.isDefined(a.label2)){if(angular.isDefined(a.label2.icon)&&null!=a.label2.icon)var c=a.label2.icon;else var c=a.label1.icon;var d="<span class='site_color'><span class='"+c+"'></span><span> "+a.label1.name+" "+a.label2.name+" "+b.title+"</span></span>"}else if(angular.isDefined(a.label1))var d="<span class='site_color'><span class='"+a.label1.icon+"'></span><span> "+a.label1.name+" "+b.title+"</span></span>";else if(angular.isDefined(b))var d="<span class='site_color'><span>"+b.title+"</span></span>";else var d=null;return d},_add_comment=function(b){if(angular.isDefined(g.selected_interact_book))var c=g.selected_interact_book;else if(angular.isDefined(a.focused_book))var c=a.focused_book;if(angular.isDefined(a.user.name))var e=a.user.name;else var e=a.user.email;var f="<span>"+b.message+"</span>",h=_get_tag_for_tweet(b,c);if(angular.isDefined(c))var i={id:c.id,message:b},j={thumb:a.user.thumb,message:f,timestamp:(new Date).getTime(),book:{id:c.id,title:c.title,author_name:c.author_name,isbn:c.isbn},user:{id:a.user.id,name:e}};else var i={message:b},j={thumb:a.user.thumb,message:f,timestamp:(new Date).getTime(),user:{id:a.user.id,name:e}};return angular.isDefined(h)&&(j=angular.extend(j,{tag:h})),d.comment(i),g.$emit("addToNotifications",j),_reset_interact_box(),b=angular.extend(b,{tag:h})},g.is_current=function(a,b){return g.current==a&&(g.currentItem=b),g.current==a},g.set_current=function(a){g.current=a},g.key_up=function(){var a=event.keyCode==e.KeyUp,b=event.keyCode==e.KeyDown;a?g.set_current(0!=g.current?g.current-1:g.hash_tags.length-1):b&&g.set_current(g.current!=g.hash_tags.length-1?g.current+1:0)},(_init=function(){g.is_new_word_initiation=!0,g.current=0,g.current_interact_book=0,angular.isDefined(a.focused_book)?(g.selected_interact_book=a.focused_book,g.placeholder="Comment on "+a.focused_book.title+" by "+a.focused_book.author_name+"..."):g.placeholder=e.ShareSomething,g.user.interact_book="",g.user.interact_books=[],a.user.hash_tagged_comment="",a.user.current_comment=""})()}],templateUrl:"/assets/angular/views/feed/show.html"}}]),websiteApp.directive("tooltip",function(){return{restrict:"E",scope:{text:"=",prependText:"@",appendText:"@",position:"@",pluralize:"@",scroll:"@",addRelative:"@"},link:function(a,b){angular.isDefined(a.addRelative)&&b.parent().css("position","relative"),b.parent().bind("mouseenter",function(){b.children().css("visibility","visible"),b.children().children().css("font-size","12px"),b.children().children().css("text-shadow","none"),b.children().children().css("font-weight","400"),b.children().children().css("letter-spacing","1px"),b.children().children().css("font-family","helvetica neue"),b.children().children().css("color","#333"),b.children().children().css("line-height","17px");var c=b.children()[0].clientWidth,d=b.children()[0].clientHeight;angular.isDefined(a.scroll)&&(d+=25,b.children().css("max-height","35vh"),b.children().css("overflow-y","scroll"));var e="left"==a.position,f="right"==a.position,g="top"==a.position,h="bottom"==a.position;e?(b.children().css("left","-"+c+"px"),b.children().children().css("border-left-color","#fff"),b.children().children(".tooltip_arrow").css("left",c+"px")):f?(b.children().css("right","-"+c+"px"),b.children().children().css("border-right-color","#fff"),b.children().children(".tooltip_arrow").css("right",c+"px")):h?(b.children().css("bottom","-"+d+"px"),b.children().children().css("border-bottom-color","#fff"),b.children().children(".tooltip_arrow").css("bottom",d+"px")):g&&(b.children().css("top","-"+d+"px"),b.children().children().css("border-top-color","#fff"),b.children().children(".tooltip_arrow").css("top",d+"px"))}),b.parent().bind("mouseleave",function(){b.children().css("visibility","hidden")})},controller:["$scope",function(a){a.stop_horizontal_scroll=function(a){a.stopPropagation()}}],templateUrl:"/assets/angular/views/shared/tooltip.html"}}),websiteApp.directive("profileLink",function(){return{restrict:"E",templateUrl:"/assets/angular/views/header/partials/profile_link.html"}});