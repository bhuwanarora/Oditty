var websiteApp = angular.module('websiteApp', ['ngRoute', 'ngAnimate', 
                  'monospaced.mousewheel', 'ngSlider', 'facebook', 
                  'directive.g+signin', 'ngMap', 'cropme',
                  'duScroll', 'adaptive.motion', 'ngDropdowns']);
websiteApp.config(function ($sceDelegateProvider, $routeProvider) {
  $routeProvider
  .when('/search',
    {
      templateUrl: 'assets/angular/widgets/partials/search.html'
    })
  .when('/',
    {
        templateUrl: 'assets/angular/widgets/partials/recommendations.html'
    });
});

angular.element(document).ready(function() {
  console.time('bootstrap');
  angular.bootstrap(document, ['websiteApp']);
  console.timeEnd('bootstrap');
});

websiteApp.config(['FacebookProvider', '$motionProvider',
    function(FacebookProvider, $motionProvider) {
      $motionProvider.setTreshold({
        'rgb': 150,
        'move': 1,
        'bright': 300
      });
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
    $rootScope.notification_active = false;
    $rootScope.message = "";
  }, 5000);
  return timeout_event;
}