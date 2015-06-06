function setCookie(a,b,c){var d=new Date;d.setTime(d.getTime()+24*c*60*60*1e3);var e="expires="+d.toUTCString();document.cookie=a+"="+b+"; "+e+"; path=/"}function getCookie(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){for(var e=c[d];" "==e.charAt(0);)e=e.substring(1);if(0==e.indexOf(b))return e.substring(b.length,e.length)}return""}function deleteCookie(a){setCookie(a,"",-1)}var homeApp=angular.module("homeApp",["ngAnimate","ngMaterial","ngMessages","duScroll","ngRoute","monospaced.mousewheel","appConstants","timer","duScroll","filtersApp","angular.filter","angular-parallax","ngSanitize","ngCookies","facebook"]);homeApp.config(["$routeProvider",function(a){a.when("/discover",{templateUrl:"assets/angular/views/landing_page/discover.html"}).otherwise({templateUrl:"assets/angular/views/landing_page/main.html"})}]),homeApp.config(["$mdThemingProvider",function(a){a.definePalette("googleBlue",{50:"4487FF",100:"4485FA",200:"4182F5",300:"427fed",400:"3D7BEA",500:"3066C7",600:"3066C7",700:"3066C7",800:"3066C7",900:"3066C7",A100:"3066C7",A200:"3066C7",A400:"3066C7",A700:"3066C7",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.definePalette("googleRed",{50:"F4473B",100:"EF4539",200:"ED4539",300:"E84236",400:"DF4034",500:"D03C31",600:"C73A30",700:"C73A30",800:"C73A30",900:"C73A30",A100:"C73A30",A200:"C73A30",A400:"C73A30",A700:"C73A30",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.definePalette("googleGreen",{50:"03A35D",100:"029655",200:"039052",300:"02884D",400:"03844C",500:"009C58",600:"027C47",700:"027C47",800:"027C47",900:"027C47",A100:"027C47",A200:"027C47",A400:"027C47",A700:"027C47",contrastDefaultColor:"light",contrastDarkColors:["50","100","200","300","400","A100"],contrastLightColors:void 0}),a.theme("default").primaryPalette("blue").accentPalette("googleGreen").warnPalette("googleRed")}]),homeApp.constant("facebookAppId","667868653261167"),homeApp.config(["FacebookProvider","facebookAppId",function(a,b){var c=b;a.init(c)}]),homeApp.run(["$rootScope","$location","$cookieStore","$cookies","$http",function(a,b,c,d,e){var f=""==getCookie("logged");if(f){var g=b.$$absUrl.indexOf("signup")<0&&b.$$absUrl.indexOf("book")<0&&b.$$absUrl.indexOf("author")<0&&b.$$absUrl.indexOf("community")<0&&b.$$absUrl.indexOf("home")<0;g&&(setCookie("redirect_url",b.$$absUrl),window.location.href="/signup")}}]);var _deferred_request=function(a,b,c,d){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert("Something went wrong. Our developers are working on this error.")};return angular.isDefined(d)?c.get(d+a,{headers:{withCredentials:!0}}).then(f,g):c.get(a).then(f,g),e.promise},_deferred_post_request=function(a,b,c,d){var e=c.defer(),f=function(a){return e.resolve(a.data)},g=function(a){if(500==a.status)alert("Something went wrong. Our developers are working on this error.");else if(403==a.status)return e.reject(a)};return d.post(a,b).then(f,g),e.promise};