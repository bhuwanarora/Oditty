var homeApp = angular.module('homeApp', ['ngAnimate', 'ngMaterial', 'ngMessages', 'duScroll', 'ngRoute', 'monospaced.mousewheel', 'appConstants', 'timer', 'duScroll', 'filtersApp', 'angular.filter', 'angular-parallax', 'ngSanitize', 'ngCookies', 'facebook']);

homeApp.config(["$routeProvider", function($routeProvider){
    $routeProvider.when('/discover', {
        templateUrl : 'assets/angular/views/landing_page/discover.html',
    })
    .otherwise({
         templateUrl : 'assets/angular/views/landing_page/main.html'
    });
}]);

homeApp.config(["$mdThemingProvider", function($mdThemingProvider){
    $mdThemingProvider.definePalette('googleBlue', {
        '50': '4487FF',
        '100': '4485FA',
        '200': '4182F5',
        '300': '427fed',
        '400': '3D7BEA',
        '500': '3066C7',
        '600': '3066C7',
        '700': '3066C7',
        '800': '3066C7',
        '900': '3066C7',
        'A100': '3066C7',
        'A200': '3066C7',
        'A400': '3066C7',
        'A700': '3066C7',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('googleRed', {
        '50': 'F4473B',
        '100': 'EF4539',
        '200': 'ED4539',
        '300': 'E84236',
        '400': 'DF4034',
        '500': 'D03C31',
        '600': 'C73A30',
        '700': 'C73A30',
        '800': 'C73A30',
        '900': 'C73A30',
        'A100': 'C73A30',
        'A200': 'C73A30',
        'A400': 'C73A30',
        'A700': 'C73A30',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.definePalette('googleGreen', {
        '50': '03A35D',
        '100': '029655',
        '200': '039052',
        '300': '02884D',
        '400': '03844C',
        '500': '009C58',
        '600': '027C47',
        '700': '027C47',
        '800': '027C47',
        '900': '027C47',
        'A100': '027C47',
        'A200': '027C47',
        'A400': '027C47',
        'A700': '027C47',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
                      .primaryPalette('blue')
                      .accentPalette('googleGreen')
                      .warnPalette('googleRed')
}]);

homeApp.constant('facebookAppId', "667868653261167");

homeApp.config(["FacebookProvider", "facebookAppId", function(FacebookProvider, facebookAppId){
    var myAppId = facebookAppId;
    FacebookProvider.init(myAppId);
  }
]);

homeApp.run(["$rootScope", "$location", "$cookieStore", "$cookies", "$http", function($rootScope, $location, $cookieStore, $cookies, $http){
    var unauthenticated_user = getCookie("logged") == "";
    if(unauthenticated_user){
        var closed_urls = ($location.$$absUrl.indexOf("signup") < 0) && ($location.$$absUrl.indexOf("book") < 0) && ($location.$$absUrl.indexOf("author") < 0) && ($location.$$absUrl.indexOf("communities") < 0) && ($location.$$absUrl.indexOf("home") < 0) && ($location.$$absUrl.indexOf("room") < 0) && ($location.$$absUrl.indexOf("news") < 0) && ($location.$$absUrl.indexOf("news_group") < 0) && ($location.$$absUrl.indexOf("infinity") < 0) && ($location.$$absUrl.indexOf("publisher") < 0) && ($location.$$absUrl.indexOf("search") < 0);
        if(closed_urls){
            // $cookieStore.put('redirect_url', $location.$$absUrl);
            setCookie("redirect_url", $location.$$absUrl);
    		window.location.href = "/signup";
        }
	}
}]);

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function deleteCookie(name){
    setCookie(name, "", -1);
}

var _deferred_request = function(url, $q, $http, search_service_url){
    var deferred = $q.defer();
    var success_callback = function(result){
        return deferred.resolve(result.data); 
    }
    var error_callback = function(reason){
        if(reason.status == 500){
            alert("Something went wrong. Our developers are working on this error.");
        }
    }
    if(angular.isDefined(search_service_url)){
        // $http.defaults.headers.config.withCredentials = true;
        $http.get(search_service_url + url, {"withCredentials": true}).then(success_callback, error_callback);
    }
    else{
        $http.get(url).then(success_callback, error_callback);
    }
    return deferred.promise;   
}

var _deferred_post_request = function(url, params, $q, $http){
    var deferred = $q.defer();
    var success_callback = function(result){
        return deferred.resolve(result.data); 
    }
    var error_callback = function(reason){
        console.debug("error_callback service", reason);
        if(reason.status == 500){
            alert("Something went wrong. Our developers are working on this error.");
        }
        else if(reason.status == 403){
            // window.location.href = "/signup";
            console.debug("403 authenticate");
            return deferred.reject(reason);
        }
    }
    $http.post(url, params).then(success_callback, error_callback);
    return deferred.promise;
}