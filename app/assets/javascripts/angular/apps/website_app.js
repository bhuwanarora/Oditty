var websiteApp = angular.module('websiteApp', ['ngRoute', 'ngAnimate', 'recommendationApp', 
                  'monospaced.mousewheel']);
//This configures the routes and associates each route with a view and a controller
websiteApp.config(function ($sceDelegateProvider, $routeProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://bhuwan.com:3000/**']);
    $routeProvider
    .when('/search',
        {
            controller: 'websiteAppController',
            templateUrl: 'assets/angular/widgets/partials/search.html'
        })
});

function notify($rootScope, message, $timeout){
  var message_split = message.split("-");
  $rootScope.message_type = message_split[0];
  $rootScope.message = message_split[1];
  $rootScope.notification_active = true;
  var timeout_event = $timeout(function(){
    $rootScope.notification_active = false
    $rootScope.message = ""
  }, 3000);
  return timeout_event;
}