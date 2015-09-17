homeApp.directive("testimonials",["websiteService","$timeout",function(a,b){return{restrict:"E",controller:"testimonialsController",templateUrl:"/assets/angular/html/shared/testimonials.html"}}]),homeApp.directive("browseRooms",["$rootScope","userService",function(a,b){return{restrict:"E",scope:{reduced:"="},controller:["$scope",function(a){var c=function(){var a=[{name:"Social Psychology",id:4998086,col:4,row:4},{name:"Comic Book Superhero",id:5017968,col:2,row:2},{name:"Political Philosophy",id:4972796,col:2,row:2},{name:"Sports",id:5024590,col:2,row:2},{name:"Brain",id:4988942,col:2,row:2},{name:"Religion",id:5023062,col:2,row:2},{name:"Technology",id:5021552,col:4,row:2},{name:"Health",id:5020478,col:2,row:2},{name:"Blanching(Cooking)",id:5107299,col:2,row:2},{name:"Kumaon Literary Festival",id:5408842,col:2,row:2},{name:"Medicine",id:5020467,col:2,row:2},{name:"Pornography Ring",id:5002021,col:2,row:2},{name:"Harry Potter Universe",id:5250069,col:2,row:2},{name:"Sports Cars",id:4978290,col:2,row:2},{name:"Ghost",id:5014454,col:2,row:2},{name:"Self Portrait",id:4996889,col:2,row:2},{name:"Travel",id:4980414,col:4,row:4},{name:"Walt Disney Co",id:5100214,col:2,row:2},{name:"Biology",id:5023104,col:2,row:2},{name:"Quantum Gravity",id:5013921,col:2,row:2},{name:"Time",id:4980633,col:2,row:2},{name:"Space",id:4975850,col:2,row:2},{name:"Terrorism",id:5035970,col:2,row:2}];return a};a.goto_room=function(a){window.location.href="/room?p="+a};var d=function(b){angular.forEach(b,function(a){1==a.score?(a.row=4,a.col=4):2==a.score?(a.row=2,a.col=4):(a.row=2,a.row=2),this.push(a)},a.rooms)};a.show_more_suggestions=function(){angular.isUndefined(a.rooms)&&(a.rooms=[]);var e=a.rooms.length;b.room_suggestions(e).then(function(b){0==b.length&&0==a.rooms.length?(a.rooms=c(),a.no_suggestions=!0):d(b)})};var e=function(){a.show_more_suggestions()};e()}],templateUrl:"/assets/angular/html/home/partials/browse_rooms.html"}}]),homeApp.directive("socialFeed",["$rootScope","userService","$timeout",function(a,b,c){return{restrict:"E",scope:{global:"=",info:"="},controller:["$scope",function(a){a.get_feed=function(){if(!a.info.feed_loading){if(a.info.feed_loading=!0,angular.isDefined(a.social_feed))var c=a.social_feed.length;else{var c=0;a.social_feed=[]}angular.isDefined(a.global)&&a.global?b.get_global_feed(c).then(function(b){a.info.feed_loading=!1,a.social_feed=a.social_feed.concat(b)}):b.get_social_feed(c).then(function(b){a.info.feed_loading=!1,a.social_feed=a.social_feed.concat(b)})}};var d=function(){var b=c(function(){a.get_feed()},100);a.$on("destroy",function(){c.cancel(b)})};d()}],templateUrl:"/assets/angular/html/home/partials/social_feed.html"}}]),homeApp.directive("emailInvite",["userService","$timeout",function(a,b){return{restrict:"E",scope:{},controller:["$scope",function(b){b.send_invitation_mail=function(){b.sending_mail=!0;var c=function(){var b=getCookie("todo");b&&(b=JSON.parse(b),b.home.invite||(deleteCookie("todo"),a.update_todo_key("home/invite")))};c(),a.invite(b.email).then(function(a){b.sending_mail=!1,b.email=""})}}],templateUrl:"/assets/angular/html/shared/partials/invite_email.html"}}]),homeApp.directive("suggestCommunities",["$rootScope","userService","$timeout",function(a,b,c){return{restrict:"E",controller:["$scope",function(a){var d=function(){a.info.loading=!0;var d=c(function(){b.suggest_communities().then(function(b){a.info.loading=!1,a.suggest_communities=[],a.show_suggestions=!0,angular.forEach(b,function(a,b){a.span={col:1,row:1},this.push(a)},a.suggest_communities)})},100);a.$on("destroy",function(){c.cancel(d)})};a.goto_room=function(a){window.location.href="/room?p="+a},a.toggle_suggestions=function(){a.show_suggestions=!a.show_suggestions},d()}],templateUrl:"/assets/angular/html/home/partials/community_suggestions.html"}}]),homeApp.directive("suggestFriends",["$rootScope","userService","$timeout",function(a,b,c){return{restrict:"E",controller:["$scope",function(a){var d=function(){var d=c(function(){b.suggest_friends().then(function(b){a.suggest_friends=b,a.show_suggestions=!0})},100);a.$on("destroy",function(){c.cancel(d)})};a.remove_suggestion=function(b){var c=a.suggest_friends.indexOf(b);a.suggest_friends.splice(c,1)},a.follow_user=function(c){b.follow(c,!0),angular.forEach(a.suggest_friends,function(b,d){b.id==c&&a.suggest_friends.splice(d,1)})},d()}],templateUrl:"/assets/angular/html/home/partials/friend_suggestions.html"}}]),homeApp.directive("trending",["$rootScope","userService","$timeout",function(a,b,c){return{restrict:"E",controller:["$scope",function(a){var d=function(){var d=c(function(){b.suggest_communities().then(function(b){a.suggest_communities=b})},100);a.$on("destroy",function(){c.cancel(d)})};d()}],templateUrl:"/assets/angular/html/shared/partials/trending.html"}}]),homeApp.directive("bookEmbed",["$rootScope","google_public_key",function(a,b){return{restrict:"A",scope:{book:"=",info:"="},link:function(b,c,d){b.alert_not_found=function(){b.info.loading=!1,b.info.book_not_found=!0};var e=function(){if(null==b.book.isbn)b.alert_not_found();else{var a=b.book.isbn.split(","),d="ISBN:";b.info.book_not_found=!1;var e=new google.books.DefaultViewer(c.find("div")[0]);e.load(d.concat(a[1]),b.alert_not_found),b.info.loading=!1}};(function(){b.info.loading=!0;a.active_book.id||a.active_book.book_id;angular.isUndefined(b.book)&&(b.book=a.active_book),b.book_loading=!0,google.load("books","0",{callback:e})})()}}}]),homeApp.directive("recommend",["$rootScope","userService","sharedService",function(a,b,c){return{restrict:"E",scope:{user:"=",book:"="},controller:["$scope",function(c){c.recommend_friend=function(){var d=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.book.recommend||(deleteCookie("todo"),b.update_todo_key("book/recommend")))};d();var e=c.user.id,f=c.book.id||a.active_book.id||a.active_book.book_id;c.recommending=!0,b.recommend(e,f).then(function(){c.recommending=!1,c.recommended=!0})};var d=function(){c.recommending=!1};d()}],templateUrl:"/assets/angular/html/shared/recommend.html"}}]),homeApp.directive("basicBook",["$rootScope","bookService",function(a,b){return{restrict:"E",scope:{book:"="},controller:["$scope",function(a){var c=function(){b.get_primary_info(a.book.id).then(function(b){a.book=angular.extend(a.book,b)})};c()}],templateUrl:"/assets/angular/html/shared/partials/basic_book.html"}}]),homeApp.directive("bookInfo",["$rootScope","bookService","sharedService",function(a,b,c){return{restrict:"E",scope:{book:"=",info:"="},controller:["$scope",function(d){d.show_book_dialog=function(b,e){c.show_book_dialog(a,d,b,e)};var e=function(){angular.isUndefined(d.book.description)&&(d.book_loading=!0,b.get_basic_book_details(d.book.id).then(function(a){d.book=angular.extend(d.book,a),d.book_loading=!1}))};e()}],templateUrl:"/assets/angular/html/shared/partials/book_info.html"}}]),homeApp.directive("bookmark",["$rootScope","feedService","$timeout","$mdSidenav",function(a,b,c,d){return{restrict:"E",scope:{bookmarkId:"=",bookmarkType:"=",shelves:"=",custom:"=",count:"=",info:"="},controller:["$scope",function(c){var e=function(){return""==getCookie("logged")||null==getCookie("logged")};c.show_shelves=function(f){e()?d("signup").toggle():(c.shelves_loading=!0,b.get_bookmarks(c.bookmarkId,c.bookmarkType).then(function(b){a.shelves=b,c.shelves_loading=!1,a.bookmark_object={id:c.bookmarkId,type:c.bookmarkType},d("right_bookmark").toggle()})),f.stopPropagation()}}],templateUrl:"/assets/angular/html/shared/bookmark.html"}}]),homeApp.directive("communityFeed",["$rootScope","websiteService","$timeout","$mdDialog","$sce","$location","$rootScope",function(a,b,c,d,e,f,a){return{restrict:"E",scope:{communityFeed:"="},controller:["$scope",function(c){c.toggle_expand=function(){c.communityFeed.expand=!c.communityFeed.expand},c.remove_news=function(){var a=c.communityFeed.news_id,d=/[?&]([^=#]+)=([^&#]*)/g,e=d.exec(f.absUrl());if(null!=e){var g=e[2];b.remove_news(a,g),window.location.reload()}},c.show_news=function(a){var e=c.communityFeed.news_url||c.communityFeed.url;e="https://api.embed.ly/1/extract?key=0038e86d5e754f8d9a0c3823e338563d&url="+e+"&format=json",c.cirular_loading=!0,angular.isUndefined(c.communityFeed.data)&&b.extract_embed(e).then(function(a){c.cirular_loading=!1,c.communityFeed.data=a}),d.show({templateUrl:"/assets/angular/html/news/iframe.html",scope:c,preserveScope:!0,clickOutsideToClose:!0,targetEvent:a}),a.stopPropagation()};var e=function(){angular.isDefined(a.user)&&(c.user=a.user),c.communityFeed.expand=!1};e()}],templateUrl:"/assets/angular/html/home/_community_feed.html"}}]),homeApp.directive("setFocus",["$timeout","$parse","$rootScope",function(a,b,c){return{link:function(d,e,f){var g=b(f.setFocus);d.$watch(g,function(b){1==b&&a(function(){c.keyCode&&(e[0].value=String.fromCharCode(c.keyCode)),e[0].focus()})})}}}]),homeApp.directive("rdSticky",["$timeout","$parse","$rootScope","$document",function(a,b,c,d){return{link:function(a,b,c){var e=b[0];e.scrollTop;d.bind("scroll",function(){})}}}]),homeApp.directive("compile",["$compile",function(a){return["scope","element","attrs",function(b,c,d){var e=b.$watch(function(a){return a.$eval(d.compile)},function(d){c.html(d),a(c.contents())(b),e()})}]}]),homeApp.directive("checkScrollBottom",function(){return{restrict:"A",link:function(a,b,c){var d=b[0];b.bind("scroll",function(){var b=1400;d.scrollTop+d.offsetHeight+b>d.scrollHeight&&a.$apply(c.checkScrollBottom)})}}}),homeApp.directive("checkScrollUp",function(){return{restrict:"A",link:function(a,b,c){var d=b[0],e=d.scrollTop;b.bind("scroll",function(){d.scrollTop<=e&&a.$apply(c.checkScrollUp),e=d.scrollTop})}}}),homeApp.directive("checkScrollDown",function(){return{restrict:"A",link:function(a,b,c){var d=b[0],e=d.scrollTop;b.bind("scroll",function(){d.scrollTop>e&&a.$apply(c.checkScrollDown),e=d.scrollTop})}}}),homeApp.directive("focusOut",function(){return function(a,b,c){b.bind("blur",function(){a.$apply(c.focusOut)})}}),homeApp.directive("calendar",["$rootScope",function(a){return{restrict:"E",scope:{saveDate:"&"},controller:["$scope",function(b){b.date_check=function(){var a=b.months.indexOf(b.selectedMonth)+1,c=new Date(b.selectedYear,a,0).getDate();b.days=new Array(c).join().split(",").map(function(a,b){return++b})},b.save_date=function(c,d,e){a.user.selectedDay=e,a.user.selectedMonth=d,a.user.selectedYear=c,b.saveDate()},_init=function(){b.days=new Array(31).join().split(",").map(function(a,b){return++b}),b.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],b.years=[],angular.isDefined(a.user)&&(b.selectedDay=a.user.selectedDay),angular.isDefined(a.user)&&(b.selectedMonth=a.user.selectedMonth),angular.isDefined(a.user)&&(b.selectedYear=a.user.selectedYear);for(var c=(new Date).getFullYear(),d=c;d>1904;d--)b.years.push(d)},_init()}],templateUrl:"/assets/angular/html/shared/calendar.html"}}]);