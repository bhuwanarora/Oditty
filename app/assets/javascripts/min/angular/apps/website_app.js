function notify(a,b,c){var d=b.split("-"),e=d[0];"SUCCESS"==e?(a.message_type=0,a.message_style={"background-color":"#f9edbe"}):"ALERT"==e?(a.message_type=1,a.message_style={"background-color":"#d73d32"}):(a.message_type=2,a.message_style={"background-color":"#427fed"}),a.message=d.slice(1,d.length).join("-"),a.notification_active=!0;var f=c(function(){a.notification_active=!1,a.message=""},7e3);return f}var websiteApp=angular.module("websiteApp",["ngRoute","ngAnimate","monospaced.mousewheel","facebook","directive.g+signin","ngMap","cropme","duScroll","ngDropdowns","sticky","filtersApp","ngCookies","appConstants"]);websiteApp.config(["$routeProvider","$locationProvider",function(a){a.when("/search",{templateUrl:"/assets/angular/widgets/partials/search.html"}).when("/user/:id",{templateUrl:"/assets/angular/widgets/partials/search.html"}).when("/user/:id/recommendations/:type",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/recommendations/:type/filter/:filter_id",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/recommendations/:type/filter/:filter_id/name/:name",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/trending/:type/id/:trend_id/name/:name",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/book/:title/author/:author",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/book/:title/all/:status",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/user/:id/book/:title/author/:author/id/:book_id",{templateUrl:"/assets/angular/widgets/partials/recommendations.html"}).when("/",{templateUrl:"/assets/angular/widgets/partials/search.html"}).otherwise({templateUrl:"/assets/angular/widgets/partials/search.html"})}]),websiteApp.constant("facebookAppId",609609685818282),websiteApp.run(["$rootScope","$location","$cookieStore",function(a,b,c){a.$on("$routeChangeStart",function(d,e){var f=!a.user.logged&&!c.get("logged");f&&("/assets/angular/widgets/partials/search.html"==e.templateUrl||b.path("/search"))})}]),angular.element(document).ready(function(){angular.bootstrap(document,["websiteApp"])}),websiteApp.config(["FacebookProvider","facebookAppId",function(a,b){var c=b;a.init(c)}]);