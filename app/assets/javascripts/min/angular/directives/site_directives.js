homeApp.directive("setFocus",["$timeout","$parse","$rootScope",function(a,b,c){return{link:function(d,e,f){var g=b(f.setFocus);d.$watch(g,function(b){1==b&&a(function(){c.keyCode&&(e[0].value=String.fromCharCode(c.keyCode)),e[0].focus()})})}}}]),homeApp.directive("rdSticky",["$timeout","$parse","$rootScope","$document",function(a,b,c,d){return{link:function(a,b){{var c=b[0];c.scrollTop}d.bind("scroll",function(){})}}}]),homeApp.directive("compile",["$compile",function(a){return["scope","element","attrs",function(b,c,d){var e=b.$watch(function(a){return a.$eval(d.compile)},function(d){c.html(d),a(c.contents())(b),e()})}]}]),homeApp.directive("checkScrollBottom",function(){return{restrict:"A",link:function(a,b,c){var d=b[0];b.bind("scroll",function(){var b=20;d.scrollTop+d.offsetHeight+b>d.scrollHeight&&a.$apply(c.checkScrollBottom)})}}}),homeApp.directive("checkScrollUp",function(){return{restrict:"A",link:function(a,b,c){var d=b[0],e=d.scrollTop;b.bind("scroll",function(){d.scrollTop<=e&&a.$apply(c.checkScrollUp),e=d.scrollTop})}}}),homeApp.directive("checkScrollDown",function(){return{restrict:"A",link:function(a,b,c){var d=b[0],e=d.scrollTop;b.bind("scroll",function(){d.scrollTop>e&&a.$apply(c.checkScrollDown),e=d.scrollTop})}}}),homeApp.directive("focusOut",function(){return function(a,b,c){b.bind("blur",function(){a.$apply(c.focusOut)})}}),homeApp.directive("calendar",["$rootScope",function(a){return{restrict:"E",scope:{saveDate:"&"},controller:["$scope",function(b){b.date_check=function(){var a=b.months.indexOf(b.selectedMonth)+1,c=new Date(b.selectedYear,a,0).getDate();b.days=new Array(c).join().split(",").map(function(a,b){return++b})},b.save_date=function(c,d,e){a.user.selectedDay=e,a.user.selectedMonth=d,a.user.selectedYear=c,b.saveDate()},_init=function(){b.days=new Array(31).join().split(",").map(function(a,b){return++b}),b.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],b.years=[],b.selectedDay=a.user.selectedDay,b.selectedMonth=a.user.selectedMonth,b.selectedYear=a.user.selectedYear;for(var c=(new Date).getFullYear(),d=c;d>1904;d--)b.years.push(d)},_init()}],templateUrl:"/assets/angular/views/getting_started/shared/calendar.html"}}]),homeApp.directive("rate",["$rootScope","$timeout",function(a,b){return{restrict:"E",scope:{rate_object:"=data"},controller:["$scope",function(c){c.show_if_rated=function(a){c.temp_rating=c.rate_object.user_rating,c.rate_object.user_rating=parseInt(a)+1,c.ready_to_rate=!0},c.reset_rating=function(){c.ready_to_rate=!1,c.rate_object.user_rating=c.temp_rating},_add_notification=function(){var b=a.user.email;angular.isDefined(a.user.name)&&(b=a.user.name);var d="<span>gave "+c.rate_object.user_rating+"/10 stars to&nbsp;</span><span class='site_color'>"+c.rate_object.title+"</span>",e={thumb:a.user.thumb,message:d,timestamp:(new Date).getTime(),book:{id:c.rate_object.id,title:c.rate_object.title,author_name:c.rate_object.author_name,isbn:c.rate_object.isbn},user:{id:a.user.id,name:b}};c.$emit("addToNotifications",e)},_gamify=function(){c.rate_object.rated||c.$emit("gamifyCount",10,!0)},c.mark_as_rated=function(d,e){_gamify(),c.rate_object.rated=!0,c.rate_object.user_rating=parseInt(d)+1,c.temp_rating=parseInt(d)+1;var f=notify(a,"SUCCESS-Thanks, This will help us to recommend you better books.",b);c.$on("destroy",function(){b.cancel(f)});var g={id:c.rate_object.id,data:c.rate_object.user_rating};(angular.isUndefined(c.rate_object.status)||!c.rate_object.status)&&sharedService.mark_as_read(c,c.rate_object,e),widgetService.rate_this_book(g),_add_notification(),e.stopPropagation()},c.is_active=function(a){var b=!1;if(c.rate_object){var d=parseInt(a)+1;d<=c.rate_object.user_rating&&(b=!0)}return b}}],templateUrl:"/assets/angular/views/shared/rate.html"}}]);