var app = angular.module('myApp', ['ngAnimate', 'ngMaterial', 'duScroll', 'ngRoute', 'monospaced.mousewheel', 'appConstants', 'timer', 'facebook', 'ngCookies']);

function easeInQuad(t){ 
    return  t<.5 ? 2*t*t : -1+(4-2*t)*t;
};

app.value('duScrollEasing', easeInQuad);

app.config(
["$routeProvider", function($routeProvider) {
    $routeProvider.when('/discover', {
        templateUrl : 'assets/angular/views/landing_page/discover.html',
    })
    .when('/intro', {
        templateUrl : 'assets/angular/views/landing_page/intro.html',
    })
    .when('/connect', {
        templateUrl : 'assets/angular/views/landing_page/connect.html',
    })
    .when('/explore', {
        templateUrl : 'assets/angular/views/landing_page/explore.html',
    })
    .when('/personalise', {
        templateUrl : 'assets/angular/views/landing_page/personalise.html',
    })
    .when('/request', {
        templateUrl : 'assets/angular/views/landing_page/sign_in.html',
    })
    .when('/main', {
        templateUrl : 'assets/angular/views/landing_page/main.html',
    })
    .otherwise({
         templateUrl : 'assets/angular/views/landing_page/main.html'
    });
}]);

app.constant('facebookAppId', "382226461962350");

app.config(["FacebookProvider", "facebookAppId", function(FacebookProvider, facebookAppId){
    var myAppId = facebookAppId;
    FacebookProvider.init(myAppId);
  }
]);