var websiteApp = angular.module('websiteApp', ['ngRoute', 'ngAnimate', 
                  'monospaced.mousewheel', 'facebook', 
                  'directive.g+signin', 'ngMap', 'cropme',
                  'duScroll', 'ngDropdowns', 'sticky']);
websiteApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/search', {
      templateUrl: 'assets/angular/widgets/partials/search.html'
  })
  .when('/user/:id', {
    templateUrl: 'assets/angular/widgets/partials/search.html'
  })
  .when('/user/:id/recommendations/:type', {
        templateUrl: 'assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/recommendations/:type/filter/:filter_id', {
        templateUrl: 'assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/timeline', {
        templateUrl: 'assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/book/:book_id', {
        templateUrl: 'assets/angular/widgets/partials/book.html'
  })
  .when('/user/:id/book/:book_id/reviews', {
        templateUrl: 'assets/angular/widgets/partials/book.html'
  })
  .when('/user/:id/book/:book_id/discussions', {
        templateUrl: 'assets/angular/widgets/partials/book.html'
  })
  .when('/user/:id/book/:book_id/timeline', {
        templateUrl: 'assets/angular/widgets/partials/book.html'
  })
  .when('/book/:book_id', {
        templateUrl: 'assets/angular/widgets/partials/book.html'
  })
  .when('/book/:book_id/reviews', {
        templateUrl: 'assets/angular/widgets/partials/book.html'
  })
  .when('/book/:book_id/discussions', {
        templateUrl: 'assets/angular/widgets/partials/book.html'
  })
  .when('/book/:book_id/timeline', {
        templateUrl: 'assets/angular/widgets/partials/book/timeline.html'
  })
  .when('/', {
        templateUrl: 'assets/angular/widgets/partials/search.html'
  })
  .otherwise({
    templateUrl: 'assets/angular/widgets/partials/search.html'
  });
  // $locationProvider.html5Mode(true);
}]);

websiteApp.run(['$rootScope', '$location', function($rootScope, $location){
  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    if(!$rootScope.user.logged){
      // no logged user, we should be going to #login
      if(next.templateUrl == "assets/angular/widgets/partials/search.html"){
        // already going to #login, no redirect needed
      }else{
        // not going to #login, we should redirect now
        // $location.path( "/search" );
      }
    }         
  });
}])

angular.element(document).ready(function() {
  console.time('bootstrap');
  angular.bootstrap(document, ['websiteApp']);
  console.timeEnd('bootstrap');
});

websiteApp.config(['FacebookProvider',
    function(FacebookProvider){
      // $motionProvider.setTreshold({
      //   'rgb': 150,
      //   'move': 1,
      //   'bright': 300
      // });
      var myAppId = '667868653261167';
     
     // FacebookProvider.setAppId('myAppId');
     FacebookProvider.init(myAppId);
    }
]);

function notify($rootScope, message, $timeout){
  // var message_split = message.split("-");
  // $rootScope.message_type = message_split[0];
  $rootScope.message = message;
  $rootScope.notification_active = true;
  var timeout_event = $timeout(function(){
    $rootScope.notification_active = false;
    $rootScope.message = "";
  }, 7000);
  return timeout_event;
}