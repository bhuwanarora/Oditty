var websiteApp = angular.module('websiteApp', ['ngRoute', 'ngAnimate', 'recommendationApp', 
                  'monospaced.mousewheel', 'angular-parallax']);
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

function notify($rootScope, message, $timeout){
  $rootScope.message = message
  $rootScope.notification_active = true
  $timeout(function(){
    $rootScope.notification_active = false
    $rootScope.message = ""
  }, 3000)
}