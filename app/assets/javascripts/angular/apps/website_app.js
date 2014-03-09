var websiteApp = angular.module('websiteApp', ['ngRoute', 'ngAnimate', 'recommendationApp', 'monospaced.mousewheel', 
												'bookWidgetApp', 'angular-parallax']);
//This configures the routes and associates each route with a view and a controller
websiteApp.config(function ($sceDelegateProvider, $routeProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://bhuwan.com:3000/**']);
    $routeProvider
    .when('/search',
        {
            controller: 'websiteAppController',
            templateUrl: 'assets/angular/widgets/partials/search.html'
        })
})
