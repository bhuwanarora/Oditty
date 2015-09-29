function setCookie(a,b,c){var d=new Date;d.setTime(d.getTime()+24*c*60*60*1e3);var e="expires="+d.toUTCString();document.cookie=a+"="+b+"; "+e+"; path=/;"}function getCookie(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1);if(0==e.indexOf(b))return e.substring(b.length,e.length)}return""}function deleteCookie(a){setCookie(a,"",-1)}function detect_browser(){var a="Currently this browser is not supported. Please use Chrome for a better experience.";-1!=navigator.userAgent.indexOf("Chrome")||(-1!=navigator.userAgent.indexOf("Opera")?alert(a):-1!=navigator.userAgent.indexOf("Firefox")||(-1!=navigator.userAgent.indexOf("MSIE")||1==!!document.documentMode?alert(a):alert(a)))}var homeApp=angular.module("homeApp",["ngAnimate","ngMaterial","ngMessages","duScroll","ngRoute","monospaced.mousewheel","appConstants","timer","duScroll","filtersApp","angular.filter","angular-parallax","ui.router","ngCookies","ngSanitize","facebook","ngMockE2E"]);homeApp.config(["FacebookProvider","facebookAppId",function(a,b){var c=b;a.init(c)}]),homeApp.run(["$rootScope","$location","$cookieStore","$cookies","$http","$state",function(a,b,c,d,e,f){var g=""==getCookie("logged");if(g){var h=b.$$absUrl.indexOf("signup")<0&&b.$$absUrl.indexOf("book")<0&&b.$$absUrl.indexOf("author")<0&&b.$$absUrl.indexOf("communities")<0&&b.$$absUrl.indexOf("home")<0&&b.$$absUrl.indexOf("room")<0&&b.$$absUrl.indexOf("news")<0&&b.$$absUrl.indexOf("news_group")<0&&b.$$absUrl.indexOf("filters")<0&&b.$$absUrl.indexOf("games")<0&&b.$$absUrl.indexOf("publisher")<0&&b.$$absUrl.indexOf("search")<0&&b.$$absUrl.indexOf("profile")<0&&b.$$absUrl.indexOf("quiz")<0&&b.$$absUrl.indexOf("spaces")<0&&b.$$absUrl.indexOf("journey")<0&&""!=b.$$absUrl.split("/")[3],i="profile"==b.$$absUrl.split("/")[3];(h||i)&&(setCookie("redirect_url",b.$$absUrl),window.location.href="/signup")}if("/room"==window.location.pathname){var j=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.rooms.visit||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_room"))};j()}else if("/book"==window.location.pathname){var j=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.filters.book||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_book"))};j()}else if("/browse"==window.location.pathname){var j=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),$scope.todo.home.rooms||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_rooms"))};j()}else if("/books"==window.location.pathname){var j=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.home.filters||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_filters"))};j()}else if("/author"==window.location.pathname){var j=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.book.author||(deleteCookie("continue_to"),setCookie("continue_to",b.absUrl()),window.location.href="/odit_author"))};j()}}]);var _deferred_request=function(a,b,c,d){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert("Something went wrong. If you're already Logged in. Try Logging out and Log in again.")};return angular.isDefined(d)?c.get(d+a,{withCredentials:!0}).then(f,g):c.get(a).then(f,g),e.promise},_deferred_post_request=function(a,b,c,d,e){var f=c.defer(),g=function(a){return f.resolve(a.data)},h=function(a){if(500==a.status)alert("Something went wrong. Our developers are working on this error.");else if(403==a.status)return f.reject(a)};return angular.isDefined(e)?d.post(e+a,b).then(g,h):d.post(a,b).then(g,h),f.promise};detect_browser(),JSON.flatten=function(a){function b(a,d){if(Object(a)!==a)c[d]=a;else if(Array.isArray(a)){for(var e=0,f=a.length;f>e;e++)b(a[e],d+"["+e+"]");0==f&&(c[d]=[])}else{var g=!0;for(var h in a)g=!1,b(a[h],d?d+"."+h:h);g&&d&&(c[d]={})}}var c={};return b(a,""),c};