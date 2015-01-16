var app = angular.module('myApp', ['ngAnimate', 'ngMaterial', 'ngRoute', 'duScroll']);

app.config(
function($routeProvider) {
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
        templateUrl : 'assets/angular/views/landing_page/request.html',
    })
    .when('/main', {
        templateUrl : 'assets/angular/views/landing_page/main.html',
    })
    .otherwise({
         templateUrl : 'assets/angular/views/landing_page/main.html'
    });
});


