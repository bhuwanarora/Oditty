function setCookie(a,b,c){var d=new Date;d.setTime(d.getTime()+24*c*60*60*1e3);var e="expires="+d.toUTCString();document.cookie=a+"="+b+"; "+e+"; path=/"}function getCookie(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1);if(0==e.indexOf(b))return e.substring(b.length,e.length)}return""}function deleteCookie(a){setCookie(a,"",-1)}var homeApp=angular.module("homeApp",["ngAnimate","ngMaterial","ngMessages","duScroll","ngRoute","monospaced.mousewheel","appConstants","timer","duScroll","filtersApp","angular.filter","d3","angular-parallax","ngSanitize","ngCookies"]);homeApp.config(["$routeProvider",function(a){a.when("/discover",{templateUrl:"assets/angular/views/landing_page/discover.html"}).otherwise({templateUrl:"assets/angular/views/landing_page/main.html"})}]),homeApp.run(["$rootScope","$location","$cookieStore","$cookies","$http",function(a,b,c,d,e){var f=""==getCookie("logged");if(f){var g=b.$$absUrl.indexOf("signup")<0&&b.$$absUrl.indexOf("book")<0&&b.$$absUrl.indexOf("author")<0&&b.$$absUrl.indexOf("community")<0;g&&(setCookie("redirect_url",b.$$absUrl),window.location.href="/signup")}}]);var _deferred_request=function(a,b,c){var d=b.defer(),e=function(a){return d.resolve(a.data)},f=function(a){500==a.status&&alert("Something went wrong. Our developers are working on this error.")};return c.get(a).then(e,f),d.promise},_deferred_post_request=function(a,b,c,d){var e=c.defer(),f=function(a){return e.resolve(a.data)},g=function(a){if(500==a.status)alert("Something went wrong. Our developers are working on this error.");else if(403==a.status)return e.reject(a)};return d.post(a,b).then(f,g),e.promise};