var readersDoor = angular.module('readersDoor', ['ngRoute', 'recommendationApp']);
//This configures the routes and associates each route with a view and a controller
readersDoor.config(function ($routeProvider) {
})
.directive('rating', function () {
  return {
    restrict: 'E',
    scope: { 'rating': '=data' },
    templateUrl: "/assets/angular/widgets/base/rating.html"
  };
})
.directive('rate', function () {
  return {
    restrict: 'E',
    scope: { 'rate': '=data' },
    templateUrl: "/assets/angular/widgets/base/rate.html"
  };
})
.directive('comment', function () {
  return {
    restrict: 'E',
    scope: { 'comment': '=data' },
    templateUrl: "/assets/angular/widgets/base/comment.html"
  };
})
.directive('book', function () {
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    templateUrl: "/assets/angular/widgets/base/book_widget.html"
  };
})
.directive('bookthumb', function () {
  return {
    restrict: 'E',
    scope: { 'bookthumb': '=data' },
    templateUrl: "/assets/angular/widgets/base/book_thumb.html"
  };
})
.directive('newsWidget', function () {
  return {
    restrict: 'E',
    scope: { 'newsWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/news_widget.html"
  };
})
.directive('reviewWidget', function () {
  return {
    restrict: 'E',
    scope: { 'reviewWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/review_widget.html"
  };
})
.directive('tags', function () {
  return {
    restrict: 'E',
    scope: { 'tags': '=data' },
    templateUrl: "/assets/angular/widgets/base/tags.html"
  };
})
.directive('category', function () {
  return {
    restrict: 'E',
    scope: { 'category': '=data' },
    templateUrl: "/assets/angular/widgets/base/category.html"
  };
})
.directive('bookmark', function () {
  return {
    restrict: 'E',
    scope: { 'bookmark': '=data' },
    templateUrl: "/assets/angular/widgets/base/bookmark.html"
  };
})
.directive('interactWidget', function () {
  return {
    restrict: 'E',
    scope: { 'interactWidget': '=data' },
    templateUrl: "/assets/angular/widgets/base/interact_widget.html"
  };
})
.directive('shelf', function () {
  return {
    restrict: 'E',
    scope: { 'shelf': '=data' },
    templateUrl: "/assets/angular/widgets/base/shelf.html"
  };
})