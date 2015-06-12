homeApp.controller('booksController', ["$scope", "$rootScope", "$timeout", 'bookService', 'ColorConstants', '$mdToast', function($scope, $rootScope, $timeout, bookService, ColorConstants, $mdToast){

    $scope.books_on_signup = function(){
        var search_active = angular.isDefined($scope.search_tag) && angular.isDefined($scope.search_tag.book) && ($scope.search_tag.book != "");
        if(!search_active){
            $scope.info.loading = true;
            var skip_count = $scope.popular_books.length;
            var get_popular_books = !$scope._loading && (angular.isUndefined($scope.info.search_book) || $scope.info.search_book.length < 1);
            if(get_popular_books){
                $scope._loading = true;
                var params = {"skip_count": skip_count};
                params = angular.toJson(params);
                bookService.books_on_signup(params).then(function(data){
                    angular.forEach(data, function(value){
                        var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                        var status = value.shelf == "HaveLeftAMarkOnMe";
                        var json = angular.extend(value, {"status": status, "color": ColorConstants.value[random_int]});
                        this.push(json);
                    },  $scope.popular_books);
                    $scope._loading = false;
                    $scope.info.loading = false;
                });
            }
            else{
                if(angular.isUndefined($scope.all_results_found) || !$scope.all_results_found){
                    // $scope._fetch_book_results();
                }
                $scope.info.loading = false;
            }
        }
    }

    $scope.rate_book = function(book){
        bookService.rate_book(book.book_id, book.user_rating);
    }

    $scope.mark_as_read = function(book, event){
        if(angular.isDefined(book.id)){
            sharedService.bookmark_book($scope, book, event, RecommendationUIConstants.InfluentialBooks);
            sharedService.mark_as_read($scope, book, event);
        }
    }

    $scope.select_book = function(book){
        angular.forEach($scope.popular_books, function(value){
            if(angular.equals(value, book)){
                if(angular.equals(book.status, false)){
                    book.status = true;
                }
                else{
                    book.status = false;
                }
                bookService.handle_influential_books(book.book_id, book.status);
            }
        });
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/select_book.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
    }

   
    $scope.getToastPosition = function() {
        return Object.keys($scope.toast_position)
          .filter(function(pos) { return $scope.toast_position[pos]; })
          .join(' ');
    };

    $scope.reset_books = function(){
        debugger
    }

    $scope.search_books = function(q){
        $scope.info.loading = true;
        $scope.popular_books = [];
        bookService.search_books(q, 10).then(function(data){
            $scope.info.loading = false;
            $scope.did_you_mean = true;
            angular.forEach(data, function(value){
                if(angular.isUndefined(value.fuzzy)){
                    this.push(value);
                }
            }, $scope.popular_books)
        });
    }

    $scope.edit_books_read = function(){
        $scope.goto_info_card();
        $rootScope.user.profile_status = 2;
        $scope.books_on_signup();
    }

    var _init = (function(){
        if(angular.isUndefined($scope.popular_books)){
            $scope.popular_books = [];
        }

        $scope.toast_position = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        var books_timeout = $timeout(function(){
            $scope.books_on_signup();
        }, 100);

        $scope.$on('destroy', function(){
            $timeout.cancel(books_timeout);
        });
    }());

}]);