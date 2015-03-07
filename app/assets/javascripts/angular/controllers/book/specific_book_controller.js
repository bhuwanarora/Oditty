homeApp.controller('specificBookController', ["$scope", "$rootScope", "$timeout", "bookService", function($scope, $rootScope, $timeout, bookService){

    _init = function(){
        var book_id = $rootScope.active_book.id;
        if(angular.isDefined(book_id)){
            var filter = "id="+book_id;
            bookService.get_book_details(filter).then(function(data){
                // $scope.summary_style = {"background-color": data.dominant_color, "color": data.text};
                // $scope.spine_style = {"background-color": data.spine, "color": data.spine_text};
                $scope.book = angular.extend($rootScope.active_book, data);
                $rootScope.active_book = $scope.book;
            });
        }
    }

    _init();
}]);