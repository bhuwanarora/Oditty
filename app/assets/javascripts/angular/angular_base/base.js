var readersDoor = angular.module('readersDoor', ['ngRoute', 'recommendationApp', 'monospaced.mousewheel']);
//This configures the routes and associates each route with a view and a controller
readersDoor.config(function ($routeProvider) {
  
})

readersDoor.controller('readersDoorController', function($scope){
	$scope.bindHorizontalScroll = function(event, delta, deltaX, deltaY){
		event.preventDefault();
		if(delta > 0){
	        event.view.window.scrollBy(-80,0);
		}
		else{
			event.view.window.scrollBy(80,0);
		}
	}
})