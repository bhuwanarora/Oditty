var websiteApp = angular.module('websiteApp', ['ngRoute', 'ngAnimate', 
                  'monospaced.mousewheel', 'facebook', 
                  'directive.g+signin', 'ngMap', 'cropme',
                  'duScroll', 'ngDropdowns', 'filtersApp', 'ngCookies', 'ngTouch', 
                  'appConstants']);

websiteApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/search', {
    templateUrl: '/assets/angular/widgets/partials/search.html'
  })
  .when('/user/:id', {
    templateUrl: '/assets/angular/widgets/partials/search.html'
  })
  .when('/user/:id/recommendations/:type', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/recommendations/:type/filter/:filter_id/name/:name', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/recommendations/:type/label/:label_id/name/:name', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/grid/:type/id/:grid_id/name/:name', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/trending/:type/id/:trend_id/name/:name', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/book/:title/author/:author', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/book/:title/all/:status', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/book/:book_id', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/book/:title/author/:author/id/:book_id', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  // .when('/user/:id/timeline', {
  //   templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  // })
  // .when('/user/:id/book/:book_id', {
  //   templateUrl: '/assets/angular/widgets/partials/book.html'
  // })
  // .when('/user/:id/book/:book_id/reviews', {
  //   templateUrl: '/assets/angular/widgets/partials/book.html'
  // })
  // .when('/user/:id/book/:book_id/discussions', {
  //   templateUrl: '/assets/angular/widgets/partials/book.html'
  // })
  // .when('/user/:id/book/:book_id/timeline', {
  //   templateUrl: '/assets/angular/widgets/partials/book.html'
  // })
  // .when('/book/:book_id', {
  //   templateUrl: '/assets/angular/widgets/partials/book.html'
  // })
  // .when('/book/:book_id/reviews', {
  //   templateUrl: '/assets/angular/widgets/partials/book.html'
  // })
  // .when('/book/:book_id/discussions', {
  //   templateUrl: '/assets/angular/widgets/partials/book.html'
  // })
  // .when('/book/:book_id/timeline', {
  //   templateUrl: '/assets/angular/widgets/partials/book/timeline.html'
  // })
  .when('/', {
    templateUrl: '/assets/angular/widgets/partials/search.html'
  })
  .otherwise({
    templateUrl: '/assets/angular/widgets/partials/search.html'
  });
  // $locationProvider.html5Mode(true);
}]);

websiteApp.constant('facebookAppId', "667868653261167");
// websiteApp.constant('facebookAppId', "742659549115410");

websiteApp.run(['$rootScope', '$location', '$cookieStore', '$cookies', '$http', function($rootScope, $location, $cookieStore, $cookies, $http){
  $rootScope.$on("$routeChangeStart", function(event, next, current){
    var unauthenticated_user = !$rootScope.user.logged && !$cookieStore.get('logged');

    // var csrf_token = $cookies['XSRF-TOKEN'];
    // console.debug("csrftoken ", csrf_token);
    // $http.defaults.headers.common['X-XSRF-TOKEN'] = csrf_token;
    // $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
    // $http.defaults.headers.post['X-CSRF-Token'] = csrf_token
    // $http.defaults.headers.put['X-CSRF-Token'] = csrf_token
    // $http.defaults.headers.patch['X-CSRF-Token'] = csrf_token
    // $http.defaults.headers.delete['X-CSRF-Token'] = csrf_token

    if(unauthenticated_user){
      // no logged user, we should be going to #login
      if(next.templateUrl == "/assets/angular/widgets/partials/search.html"){
        // already going to #login, no redirect needed
      }else{
        // not going to #login, we should redirect now
        $location.path( "/search");
      }
    }
  });
}]);

angular.element(document).ready(function() {
  console.time('bootstrap');
  angular.bootstrap(document, ['websiteApp']);
  console.timeEnd('bootstrap');
});

websiteApp.config(['FacebookProvider', 'facebookAppId',
  function(FacebookProvider, facebookAppId){
    var myAppId = facebookAppId;
    FacebookProvider.init(myAppId);
  }
]);

function notify($rootScope, message, $timeout){
  var message_split = message.split("-");
  var message_type = message_split[0];
  if(message_type == "SUCCESS"){
    $rootScope.message_type = 0;
    $rootScope.message_style = {"background-color": "#f9edbe"};
  }
  else if(message_type == "ALERT"){
    $rootScope.message_type = 1;
    $rootScope.message_style = {"background-color": "#d73d32"};
  }
  else{
    $rootScope.message_type = 2;
    $rootScope.message_style = {"background-color": "#427fed"};
  }
  $rootScope.message = message_split.slice(1, message_split.length).join("-");
  $rootScope.notification_active = true;
  var timeout_event = $timeout(function(){
    $rootScope.notification_active = false;
    $rootScope.message = "";
  }, 7000);
  return timeout_event;
}

function get_size() {
  if(typeof(window.innerWidth) == 'number'){
    //Non-IE
    window_width = window.innerWidth;
    window_height = window.innerHeight;
  }else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)){
    //IE 6+ in 'standards compliant mode'
    window_width = document.documentElement.clientWidth;
    window_height = document.documentElement.clientHeight;
  }else if(document.body && (document.body.clientWidth || document.body.clientHeight)){
    //IE 4 compatible
    window_width = document.body.clientWidth;
    window_height = document.body.clientHeight;
  }
}

var window_width = 0, window_height = 0;
get_size();