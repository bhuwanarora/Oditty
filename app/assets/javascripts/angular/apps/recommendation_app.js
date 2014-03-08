var recommendationApp = angular.module('recommendationApp', ['ngRoute', 'bookWidgetApp']);
//This configures the routes and associates each route with a view and a controller
recommendationApp.config(function ($routeProvider) {
    $routeProvider
    .when('/',
        {
            controller: 'recommendationsController',
            templateUrl: 'assets/angular/widgets/partials/recommendations.html'
        })
    .when('/books',
        {
            controller: 'BooksController',
            templateUrl: 'assets/angular/widgets/recommended/books.html'
        })
    .when('/authors',
    	{
    		controller: 'AuthorsController',
            templateUrl: 'assets/angular/widgets/recommended/authors.html'
    	})
    .when('/readers',
    	{
    		controller: 'ReadersController',
            templateUrl: 'assets/angular/widgets/recommended/readers.html'
    	})
})