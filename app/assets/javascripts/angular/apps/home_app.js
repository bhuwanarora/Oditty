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
        var closed_urls = ($location.$$absUrl.indexOf("signup") < 0) && ($location.$$absUrl.indexOf("book") < 0) && ($location.$$absUrl.indexOf("author") < 0) && ($location.$$absUrl.indexOf("community") < 0);
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

function deleteCookie(name){
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

var _deferred_request = function(url, $q, $http){
    var deferred = $q.defer();
    var success_callback = function(result){
        return deferred.resolve(result.data); 
    }
    var error_callback = function(reason){
        if(reason.status == 500){
            alert("Something went wrong. Our developers are working on this error.");
        }
    }
    $http.get(url).then(success_callback, error_callback);
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