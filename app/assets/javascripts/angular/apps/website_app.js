var websiteApp = angular.module('websiteApp', ['ngRoute', 'loadingApp', 'ngAnimate', 'recommendationApp', 
                  'monospaced.mousewheel', 'bookApp', 'ngSlider', 'facebook', 
                  'directive.g+signin', 'nsPopover', 'ngMap', 'cropme',
                  'duScroll']);
//This configures the routes and associates each route with a view and a controller
websiteApp.config(function ($sceDelegateProvider, $routeProvider) {
  // $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://bhuwan.com:3000/**']);
  $routeProvider
  .when('/search',
    {
      templateUrl: 'assets/angular/widgets/partials/search.html'
    });
});


websiteApp.config(['FacebookProvider',
    function(FacebookProvider) {
     var myAppId = '667868653261167';
     
     FacebookProvider.setAppId('myAppId');
     FacebookProvider.init(myAppId);
    }
]);

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