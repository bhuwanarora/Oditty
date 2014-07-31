websiteApp.directive("siteLogo",[function(){return{restrict:"E",templateUrl:"/assets/angular/widgets/partials/site_logo.html"}}]),websiteApp.directive("userThumb",[function(){return{restrict:"E",templateUrl:"/assets/angular/widgets/partials/user_thumb.html"}}]),websiteApp.directive("toggle",function(){return{restrict:"E",scope:{obj:"=data"},controller:["$scope",function(a){a.toggle=function(){a.active=a.active?!1:!0}}],templateUrl:"/assets/angular/widgets/partials/toggle.html"}}),websiteApp.directive("track",["$rootScope",function(a){return{restrict:"A",link:["scope","element","attrs",function(b,c){c.bind("mouseleave",function(a){_record_details(a)}),c.bind("mouseenter",function(a){_record_details(a)}),c.bind("click",function(a){_record_details(a)}),_record_details=function(b){node_name=b.currentTarget.nodeName,time_stamp=b.timeStamp,thousand_milliseconds=1e5,time_stamp=thousand_milliseconds*(time_stamp%thousand_milliseconds/thousand_milliseconds),action_type=b.type,"A"==node_name&&(node_name=b.currentTarget.href),id=b.currentTarget.id,uid=node_name+":"+id,array=id.split("-"),containsCategory=array.length>1,containsCategory?(category=array[0],book_id=array[1]):(category="",book_id=""),data_json=[{time_stamp:time_stamp,action_type:action_type,node_name:node_name,uid:uid,category:category,book_id:book_id}],a.data=a.data.concat(data_json)}}]}}]),websiteApp.directive("horizontalScroller",function(){return{restrict:"E",templateUrl:"/assets/angular/widgets/base/horizontal_scroller.html"}}),websiteApp.directive("setFocus",["$timeout","$parse","$rootScope",function(a,b,c){return{link:function(d,e,f){var g=b(f.setFocus);d.$watch(g,function(b){1==b&&a(function(){c.keyCode&&(e[0].value=String.fromCharCode(c.keyCode)),e[0].focus()})})}}}]),websiteApp.directive("typeAhead",["$timeout","$sce","$document",function(a){return{restrict:"E",scope:{items:"=",prompt:"@",title:"@",id:"@",custom:"@",iconClass:"@",customOptions:"@",focusWhen:"=",subtitle:"@",model:"=",itemId:"=",onSelect:"&",autoPopulate:"&",onClear:"&"},link:function(){},controller:["$scope","$sce","recommendationService",function(b,c){b.is_current=function(a,c){return b.current==a&&(b.currentItem=c.name,b.currentItemId=c.id),b.current==a},b.set_current=function(a){b.current=a},b.navigate_options=function(){var a=13==event.keyCode;a&&b.handle_selection(b.currentItem,b.currentItemId)},b.key_up=function(){var a=38==event.keyCode,c=40==event.keyCode,d=8==event.keyCode;a?b.set_current(0!=b.current?b.current-1:b.filtered.length-1):c?b.set_current(b.current!=b.filtered.length-1?b.current+1:0):d&&(angular.isUndefined(b.model)||""==b.model)&&(b.filtered=[],b.onClear())},_init=function(){b.current=0,b.selected=!0,b.name=""},b.focus_on_input=function(){},b.auto_populate=function(){b.autoPopulate()},b.highlight=function(a,b){return angular.isDefined(b)&&angular.isDefined(a)?c.trustAsHtml(b.replace(new RegExp(a,"gi"),'<span style="font-weight:bold;">$&</span>')):void 0},b.remove_filter=function(){b.model="",b.onClear()},b.handle_selection=function(c,d){angular.isDefined(d)?(b.itemId=d,b.model=c.toUpperCase()):(b.itemId=c.id,b.model=c.name.toUpperCase()),b.current=0,b.selected=!0,a(function(){b.onSelect()},200)},_init()}],templateUrl:"/assets/angular/widgets/partials/type_ahead.html"}}]),websiteApp.directive("message",function(){return{restrict:"E",controller:["$scope",function(a){a.close_message=function(){"Allow your webcam. Swipe Left|Right to look for more books."==a.message?a.message='Just "START TYPING" anytime to search.':a.message_closed=!0},_init_motion_adaption=function(){},(_init=function(){a.message_closed=!0})()}],templateUrl:"/assets/angular/widgets/partials/message.html"}}),websiteApp.directive("notification",["$rootScope","$timeout",function(a,b){return{restrict:"E",scope:{notification:"=data"},controller:["$scope",function(c){c.toggle_ticker_popup=function(d){var e=null==a.ticker_popup;if(e)a.ticker_popup=c.notification.book,a.focused_book=null;else if(a.ticker_popup==c.notification.book)a.ticker_popup=null;else{var f=b(function(){a.ticker_popup=c.notification.book});c.$on("destroy",function(){b.cancel(f)})}d.stopPropagation()},_get_arrow_position=function(a){var b=90,c=17;return a.y>b&&a.y<b+54||(a.y>b+54&&a.y<b+108?c+=54:a.y>b+108&&a.y<b+162?c+=108:a.y>b+162&&a.y<b+216?c+=162:a.y>b+216&&a.y<b+270&&(c+=216)),c},c.show_ticker_popup=function(){a.ticker_popup=c.notification.book}}],templateUrl:"/assets/angular/widgets/partials/notification.html"}}]),websiteApp.directive("compile",["$compile",function(a){return["scope","element","attrs",function(b,c,d){var e=b.$watch(function(a){return a.$eval(d.compile)},function(d){c.html(d),a(c.contents())(b),e()})}]}]),websiteApp.directive("searchBar",function(){return{restrict:"E",templateUrl:"/assets/angular/widgets/partials/search_bar.html"}}),websiteApp.directive("checkScrollBottom",function(){return{restrict:"A",link:function(a,b,c){var d=b[0];b.bind("scroll",function(){d.scrollTop+d.offsetHeight>d.scrollHeight&&a.$apply(c.checkScrollBottom)})}}}),websiteApp.directive("checkScrollUp",function(){return{restrict:"A",link:function(a,b,c){var d=b[0],e=d.scrollTop;b.bind("scroll",function(){d.scrollTop<=e&&a.$apply(c.checkScrollUp),e=d.scrollTop})}}}),websiteApp.directive("checkScrollDown",function(){return{restrict:"A",link:function(a,b,c){var d=b[0],e=d.scrollTop;b.bind("scroll",function(){d.scrollTop>e&&a.$apply(c.checkScrollDown),e=d.scrollTop})}}}),websiteApp.directive("focusOut",function(){return function(a,b,c){b.bind("blur",function(){a.$apply(c.focusOut)})}}),websiteApp.directive("calendar",["$rootScope",function(a){return{restrict:"E",scope:{saveDate:"&"},controller:["$scope",function(b){b.date_check=function(){var a=b.months.indexOf(b.selectedMonth)+1,c=new Date(b.selectedYear,a,0).getDate();b.days=new Array(c).join().split(",").map(function(a,b){return++b})},b.save_date=function(c,d,e){a.user.selectedDay=e,a.user.selectedMonth=d,a.user.selectedYear=c,b.saveDate()},(_init=function(){b.days=new Array(31).join().split(",").map(function(a,b){return++b}),b.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],b.years=[],b.selectedDay=a.user.selectedDay,b.selectedMonth=a.user.selectedMonth,b.selectedYear=a.user.selectedYear;for(var c=(new Date).getFullYear(),d=c;d>1904;d--)b.years.push(d)})()}],templateUrl:"/assets/angular/widgets/partials/calendar.html"}}]),websiteApp.directive("feedbackPopup",["$document","websiteService","$rootScope",function(a,b,c){return{restrict:"A",link:function(b,c){function d(a){i=a.screenY-g,h=a.screenX-f,0>i?i=0:i>screen.height&&(i=screen.height),0>h?h=0:h>screen.width&&(h=screen.width),c.css({top:i+"px",left:h+"px"})}function e(){a.off("mousemove",d),a.off("mouseup",e)}c=c.children();var f=0,g=0,h=300,i=50;c.on("mousedown",function(b){f=b.screenX-h,g=b.screenY-i,a.on("mousemove",d),a.on("mouseup",e)})},controller:["$scope",function(a){a.get_feedback=!1,a.feedback_text="Feedback",a.handle_feedback=function(){if(c.user.feedback.length>8){var d={feedback:c.user.feedback};a.get_feedback=!1,a.feedback_text="Thanks! :)",b.save_feedback(d)}else a.feedback_text="Please elaborate a bit more.."}}],templateUrl:"/assets/angular/widgets/partials/feedback_popup.html"}}]);