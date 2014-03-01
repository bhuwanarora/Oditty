recommendationApp.controller('BooksController', function ($scope, $http, recommendationService) {

    init();

    function init() {
        recommendationService.getBooks().then(function(data){
	    	$scope.books = data["books"];
	    })
    }
});