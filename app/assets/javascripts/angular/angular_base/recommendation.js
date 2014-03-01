var recommendationApp = angular.module('recommendationApp', ['ngRoute']);
//This configures the routes and associates each route with a view and a controller
recommendationApp.config(function ($routeProvider) {
  $routeProvider
    .when('/books',
        {
            controller: 'BooksController',
            templateUrl: 'assets/angular/partials/recommended/books.html'
        })
    .when('/authors',
    	{
    		controller: 'AuthorsController',
            templateUrl: 'assets/angular/partials/recommended/authors.html'
    	})
    .when('/readers',
    	{
    		controller: 'ReadersController',
            templateUrl: 'assets/angular/partials/recommended/readers.html'
    	})
})
.directive('book', function () {
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    templateUrl: "/assets/angular/partials/recommended/book.html"
  };
})
.directive('reader', function () {
  return {
    restrict: 'E',
    scope: { 'reader': '=data' },
    templateUrl: "/assets/angular/partials/recommended/reader.html"
  };
})
.directive('author', function () {
  return {
    restrict: 'E',
    scope: { 'author': '=data' },
    templateUrl: "/assets/angular/partials/recommended/author.html"
  };
})

function explored($this){
  debugger
}