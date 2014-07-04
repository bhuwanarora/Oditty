var websiteApp = angular.module('websiteApp', ['ngRoute', 'ngAnimate', 
                  'monospaced.mousewheel', 'facebook', 
                  'directive.g+signin', 'ngMap', 'cropme',
                  'duScroll', 'ngDropdowns', 'sticky', 'filtersApp']);

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
  .when('/user/:id/recommendations/:type/filter/:filter_id', {
    templateUrl: '/assets/angular/widgets/partials/recommendations.html'
  })
  .when('/user/:id/book/:title/author/:author', {
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

websiteApp.run(['$rootScope', '$location', function($rootScope, $location){
  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    if(!$rootScope.user.logged){
      // no logged user, we should be going to #login
      if(next.templateUrl == "/assets/angular/widgets/partials/search.html"){
        // already going to #login, no redirect needed
      }else{
        // not going to #login, we should redirect now
        $location.path( "/search" );
      }
    }         
  });
}]);

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

var connection = new Strophe.Connection("http://localhost:5280/http-bind");
var on_status = function(status){
  console.log(status, Strophe.Status);
  if(status == Strophe.Status.CONNECTED){
    //query for the roster
    var stanza = new Strophe.Builder("message", {"to": "bhuwan@localhost", "type": "chat"})
                .c("body")
                .t("Hello World");
    console.debug("send initial presence...", stanza.tree());
    // debugger
    // var xmp = "";
    connection.addHandler(on_message, null, "message", "chat");
    connection.send(stanza);
  }
}
var on_message = function(message){
  //extract message body
  // display text
  // debugger
  alert("message");
  return true;
}

// connection.addTimeHandler(100, send_flood);
// connection.addHandler(on_version, null, "iq", null, "disco-1");
// connection.addHandler(on_iq_version, "jabber:iq:version", "iq", "get");
connection.connect("bhuwan@localhost", "bhuwan", on_status);
