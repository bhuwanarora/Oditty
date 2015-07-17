var app = angular.module('myApp', ['ngAnimate', 'ngMaterial', 'duScroll', 'ngRoute', 'monospaced.mousewheel', 'appConstants', 'timer', 'facebook', 'ngCookies']);
function easeInQuad(t){ 
    return  t<.5 ? 2*t*t : -1+(4-2*t)*t;
};

app.value('duScrollEasing', easeInQuad);

app.config(
["$routeProvider", function($routeProvider) {
    $routeProvider.when('/discover', {
        templateUrl : 'assets/angular/html/landing_page/discover.html',
    })
    .when('/intro', {
        templateUrl : 'assets/angular/html/landing_page/intro.html',
    })
    .when('/connect', {
        templateUrl : 'assets/angular/html/landing_page/connect.html',
    })
    .when('/explore', {
        templateUrl : 'assets/angular/html/landing_page/explore.html',
    })
    .when('/personalise', {
        templateUrl : 'assets/angular/html/landing_page/personalise.html',
    })
    .when('/request', {
        templateUrl : 'assets/angular/html/landing_page/sign_in.html',
    })
    .when('/main', {
        templateUrl : 'assets/angular/html/landing_page/main.html',
    })
    .otherwise({
         templateUrl : 'assets/angular/html/landing_page/main.html'
    });
}]);

app.constant('facebookAppId', "667868653261167");

app.config(["FacebookProvider", "facebookAppId", function(FacebookProvider, facebookAppId){
    var myAppId = facebookAppId;
    FacebookProvider.init(myAppId);
  }
]);

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