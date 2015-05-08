var homeApp = angular.module('homeApp', ['ngAnimate', 'ngMaterial', 'ngMessages', 'duScroll', 'ngRoute', 'monospaced.mousewheel', 'appConstants', 'timer', 'duScroll', 'filtersApp', 'angular.filter', 'd3', 'angular-parallax', 'ngSanitize', 'ngCookies']);

homeApp.config(["$routeProvider", function($routeProvider){
    $routeProvider.when('/discover', {
        templateUrl : 'assets/angular/views/landing_page/discover.html',
    })
    .otherwise({
         templateUrl : 'assets/angular/views/landing_page/main.html'
    });
}]);


homeApp.run(["$rootScope", "$location", "$cookieStore", "$cookies", "$http", function($rootScope, $location, $cookieStore, $cookies, $http){
    var unauthenticated_user = getCookie("logged") == "";
    if(unauthenticated_user){
        if($location.$$absUrl.indexOf("signup") < 0){
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
    document.cookie = cname + "=" + cvalue + "; " + expires;
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