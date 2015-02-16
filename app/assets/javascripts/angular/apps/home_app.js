var homeApp = angular.module('homeApp', ['ngAnimate', 'ngMaterial', 'ngMessages', 'duScroll', 'ngRoute', 'monospaced.mousewheel', 'appConstants', 'timer']);

homeApp.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when('/discover', {
        templateUrl : 'assets/angular/views/landing_page/discover.html',
    })
    .otherwise({
         templateUrl : 'assets/angular/views/landing_page/main.html'
    });
}]);