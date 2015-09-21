function setCookie(a,b,c){var d=new Date;d.setTime(d.getTime()+24*c*60*60*1e3);var e="expires="+d.toUTCString();document.cookie=a+"="+b+"; "+e+"; path=/"}function getCookie(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1);if(0==e.indexOf(b))return e.substring(b.length,e.length)}return""}function deleteCookie(a){setCookie(a,"",-1)}function detect_browser(){var a="Currently this browser is not supported. Please use Chrome for a better experience.";-1!=navigator.userAgent.indexOf("Chrome")||(-1!=navigator.userAgent.indexOf("Opera")?alert(a):-1!=navigator.userAgent.indexOf("Firefox")||(-1!=navigator.userAgent.indexOf("MSIE")||1==!!document.documentMode?alert(a):alert(a)))}var homeApp=angular.module("homeApp",["ngAnimate","ngMaterial","ngMessages","duScroll","ngRoute","monospaced.mousewheel","appConstants","timer","duScroll","filtersApp","angular.filter","angular-parallax","ngSanitize","ngCookies","facebook","ngMockE2E"]);homeApp.config(["$routeProvider",function(a){a.when("/discover",{templateUrl:"assets/angular/views/landing_page/discover.html"}).when("/wiki",{templateUrl:"assets/angular/html/author/wiki.html"}).when("/feed",{templateUrl:"assets/angular/html/author/feed.html"}).when("/books",{templateUrl:"assets/angular/html/author/books.html"}).when("/followers",{templateUrl:"assets/angular/html/author/followers.html"}).when("/interview",{templateUrl:"assets/angular/html/author/interview.html"}).when("/book/timeline",{templateUrl:"assets/angular/html/book/_timeline.html"}).when("/book/buyandreview",{templateUrl:"assets/angular/html/book/_buy.html"}).when("/book/realvirtuality",{templateUrl:"assets/angular/html/book/_news.html"}).when("/book/preview",{templateUrl:"assets/angular/html/book/_overview.html"}).when("/room/books",{templateUrl:"assets/angular/html/community/books.html"}).when("/room/home",{templateUrl:"assets/angular/html/community/feed.html"}).when("/room/videos",{templateUrl:"assets/angular/html/community/videos.html"}).when("/room/wiki",{templateUrl:"assets/angular/html/community/wiki.html"}).when("/profile/feed",{templateUrl:"assets/angular/html/profile/feed.html"}).when("/profile/followers",{templateUrl:"assets/angular/html/profile/followers.html"}).when("/profile/followings",{templateUrl:"assets/angular/html/profile/followings.html"}).when("/profile/books",{templateUrl:"assets/angular/html/profile/books.html"}).when("/profile/rooms",{templateUrl:"assets/angular/html/profile/rooms.html"}).when("/profile/news",{templateUrl:"assets/angular/html/profile/news.html"}).when("/profile/history",{templateUrl:"assets/angular/html/profile/history.html"}).otherwise({templateUrl:"assets/angular/html/shared/default.html"})}]),homeApp.config(["$mdThemingProvider",function(a){a.definePalette("googleBlue",{50:"4487FF",100:"4485FA",200:"4182F5",300:"427fed",400:"3D7BEA",500:"3066C7",600:"3066C7",700:"3066C7",800:"3066C7",900:"3066C7",A100:"3066C7",A200:"3066C7",A400:"3066C7",A700:"3066C7",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.definePalette("googleRed",{50:"F4473B",100:"EF4539",200:"ED4539",300:"E84236",400:"DF4034",500:"D03C31",600:"C73A30",700:"C73A30",800:"C73A30",900:"C73A30",A100:"C73A30",A200:"C73A30",A400:"C73A30",A700:"C73A30",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.definePalette("googleGreen",{50:"03A35D",100:"029655",200:"039052",300:"02884D",400:"03844C",500:"009C58",600:"027C47",700:"027C47",800:"027C47",900:"027C47",A100:"027C47",A200:"027C47",A400:"027C47",A700:"027C47",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.theme("default").primaryPalette("blue").accentPalette("googleGreen").warnPalette("googleRed")}]),homeApp.config(["FacebookProvider","facebookAppId",function(a,b){var c=b;a.init(c)}]),homeApp.run(["$rootScope","$location","$cookieStore","$cookies","$http",function(a,b,c,d,e){var f=""==getCookie("logged");if(f){var g=b.$$absUrl.indexOf("signup")<0&&b.$$absUrl.indexOf("book")<0&&b.$$absUrl.indexOf("author")<0&&b.$$absUrl.indexOf("communities")<0&&b.$$absUrl.indexOf("home")<0&&b.$$absUrl.indexOf("room")<0&&b.$$absUrl.indexOf("news")<0&&b.$$absUrl.indexOf("news_group")<0&&b.$$absUrl.indexOf("filters")<0&&b.$$absUrl.indexOf("games")<0&&b.$$absUrl.indexOf("publisher")<0&&b.$$absUrl.indexOf("search")<0&&b.$$absUrl.indexOf("profile")<0&&b.$$absUrl.indexOf("quiz")<0&&b.$$absUrl.indexOf("spaces")<0&&b.$$absUrl.indexOf("journey")<0&&""!=b.$$absUrl.split("/")[3],h="profile"==b.$$absUrl.split("/")[3];(g||h)&&(setCookie("redirect_url",b.$$absUrl),window.location.href="/signup")}if("/room"==window.location.pathname){var i=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.rooms.visit||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_room"))};i()}else if("/book"==window.location.pathname){var i=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.filters.book||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_book"))};i()}else if("/browse"==window.location.pathname){var i=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),$scope.todo.home.rooms||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_rooms"))};i()}else if("/books"==window.location.pathname){var i=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.home.filters||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_filters"))};i()}else if("/author"==window.location.pathname){var i=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.book.author||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_author"))};i()}}]);var _deferred_request=function(a,b,c,d){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert("Something went wrong. If you're already Logged in. Try Logging out and Log in again.")};return angular.isDefined(d)?c.get(d+a,{withCredentials:!0}).then(f,g):c.get(a).then(f,g),e.promise},_deferred_post_request=function(a,b,c,d,e){var f=c.defer(),g=function(a){return f.resolve(a.data)},h=function(a){if(500==a.status)alert("Something went wrong. Our developers are working on this error.");else if(403==a.status)return f.reject(a)};return angular.isDefined(e)?d.post(e+a,b).then(g,h):d.post(a,b).then(g,h),f.promise};detect_browser(),JSON.flatten=function(a){function b(a,d){if(Object(a)!==a)c[d]=a;else if(Array.isArray(a)){for(var e=0,f=a.length;f>e;e++)b(a[e],d+"["+e+"]");0==f&&(c[d]=[])}else{var g=!0;for(var h in a)g=!1,b(a[h],d?d+"."+h:h);g&&d&&(c[d]={})}}var c={};return b(a,""),c};