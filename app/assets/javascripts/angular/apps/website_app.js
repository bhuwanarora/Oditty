var websiteApp = angular.module('websiteApp', ['ngRoute', 'ngAnimate', 'recommendationApp', 'monospaced.mousewheel', 'bookWidgetApp']);
//This configures the routes and associates each route with a view and a controller
websiteApp.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://bhuwan.com:3000/**']);
})