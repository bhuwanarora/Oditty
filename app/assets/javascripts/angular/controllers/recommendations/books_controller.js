recommendationApp.controller('BooksController', function ($scope, recommendationService, $rootScope) {
    function _init() {
    	$scope.books = []
	    $rootScope.$on('loadBooks', function(){
	    	_get_books();
	    })
        _get_books();
        $scope.extra_elements = true;
    }

    function _get_books(){
        recommendationService.getBooks().then(function(data){
	    	$scope.books = $scope.books.concat(data["books"])
	    })
    }


    _init();

});