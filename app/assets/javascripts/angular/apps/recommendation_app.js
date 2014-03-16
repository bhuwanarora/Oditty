var recommendationApp = angular.module('recommendationApp', ['ngRoute', 'bookWidgetApp']);
//This configures the routes and associates each route with a view and a controller
recommendationApp.config(function ($routeProvider) {
    $routeProvider
    .when('/',
        {
            templateUrl: 'assets/angular/widgets/partials/recommendations.html'
        })
})