homeApp.controller('libraryController', ["$scope", "$rootScope", "$timeout", 'WebsiteUIConstants', 'SearchUIConstants', 'bookService', '$routeParams', '$location', function($scope, $rootScope, $timeout, WebsiteUIConstants, SearchUIConstants, bookService, $routeParams, $location){

    $scope.get_popular_books = function(){
        if(!$scope.info.loading && !$scope.constant.show_book){
            $scope.info.loading = true;
            $scope._get_popular_books();
        }
    }

    $scope._get_popular_books = function(){
        var skip_count = $scope.books.length;
        bookService.get_popular_books(skip_count).then(function(data){
            angular.forEach(data, function(value){
                var status = value[4] != null;
                var json = {"isbn": value[0], 
                        "id": value[1], 
                        "title": value[2], 
                        "author_name": value[3], 
                        "user_rating": value[5],
                        "status": status,
                        "isBook": true,
                        "colspan": 1,
                        "rowspan": 1};
                this.push(json);
            },  $scope.books);
            $scope.info.loading = false;
        });
    }

    $scope.show_grid = function(event){
        if($scope.constant.show_book){
            $scope.grid_style = {"max-height": "initial", "overflow-y": "scroll"};
            $scope.constant = {"show_book": false};
            // $scope._init();
            $scope.books = $scope.tempBooks;
        }
    }

    $scope.show_book = function(event, index){
        var offsetTop = event.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        var clientHeight = event.currentTarget.parentElement.parentElement.clientHeight;
        var marginTop = offsetTop + 1*clientHeight/3;
        $scope.grid_style = {"max-height": "10vh", "overflow-y": "hidden"};

        var offset = 100;
        var duration = 3000;
        var bookBoundingRectangle = event.currentTarget.parentElement.parentElement.getBoundingClientRect();

        var insertIndex = (Math.floor(index/5) + 1)*5

        var item = {
          color: "#fffff",
          colspan: 5,
          rowspan: 5,
          isBook: true
        }
        
        $scope.tempBooks = $scope.books;
        $scope.books = $scope.books.slice(0, insertIndex);
        $scope.constant = {"show_book": true};
        event.stopPropagation();
    }

    $scope.toggle_endorse = function(){
        if($scope.active_endorse){
            $scope.active_endorse = false;
        }
        else{
            $scope.active_endorse = true;
        }
    }

    var _init = function(){
        $scope.$routeParams = $routeParams;
        // var genre = (/genre=(\d+)/.exec($location.absUrl())[1]);
        // var year = (/year=(\d+)/.exec($location.absUrl())[1]);
        // var author = (/author=(\d+)/.exec($location.absUrl())[1]);
        // var duration = (/duration=(\d+)/.exec($location.absUrl())[1]);
        $scope.active_endorse = false;
        $scope.active_bookmark = true;
        $scope.active_share = true;

        $scope.constant = {"show_book": false};
        $scope.books = [];
        $scope._get_popular_books();
    }


    _init();
}]);