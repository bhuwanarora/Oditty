recommendationApp.controller('BooksController', function ($scope, recommendationService) {

    init();

    function init() {
        recommendationService.getBooks().then(function(data){
	    	$scope.books = data["books"];
	    })
        $scope.extra_elements = true;
    }

});