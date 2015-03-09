homeApp.controller('booksController', ["$scope", "$rootScope", "$timeout", 'bookService', 'ColorConstants', '$mdToast', function($scope, $rootScope, $timeout, bookService, ColorConstants, $mdToast){

    $scope.get_popular_books = function(){
        $scope.info.loading = true;
        var skip_count = $scope.popular_books.length;
        var get_popular_books = !$scope._loading && (angular.isUndefined($scope.info.search_book) || $scope.info.search_book.length < 1);
        if(get_popular_books){
            $scope._loading = true;
            var params = {"skip_count": skip_count};
            params = angular.toJson(params);
            bookService.get_popular_books(params).then(function(data){
                angular.forEach(data, function(value){
                    var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                    var status = value[4] != null;
                    var json = {"isbn": value[0], 
                            "id": value[1], 
                            "title": value[2], 
                            "author_name": value[3], 
                            "user_rating": value[5],
                            "status": status,
                            "color": ColorConstants.value[random_int]
                        };
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

    $scope.show_shelf_bottom_sheet = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/shared/shelf_bottom_sheet.html',
            controller: 'listBottomSheetController',
            targetEvent: event
        });
        event.stopPropagation();
    };

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
            }
        });
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/select_book.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
        // $scope.info.genres[index].status = true;
    }

    $scope.toast_position = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };

    $scope.getToastPosition = function() {
        return Object.keys($scope.toast_position)
          .filter(function(pos) { return $scope.toast_position[pos]; })
          .join(' ');
    };

    $scope._fetch_book_results = function(reset_required){
        debugger
        var skip_count = $scope.popular_books.length;
        var _all_results_fetched = function(){
            $scope.all_results_found = true;
            $scope.popular_books.push({"title": "All results fetched. "+$scope.popular_books.length+" books found for <span class='site_color'>"+$scope.info.search_book+"</span>"});
        }

        bookService.search_books($scope.info.search_book, skip_count).then(function(data){
            if(angular.isDefined(reset_required)){
                $scope.popular_books = [];
            }

            data = data.results;
            if(data.length != 0){
                angular.forEach(data, function(value){
                    var status = value[4] != null;
                    var json = {"isbn": value[0], 
                            "id": value[1], 
                            "title": value[2], 
                            "author_name": value[3], 
                            "status": status,
                            "user_rating": value[5]};
                    this.push(json);
                },  $scope.popular_books);

                if(data.length != 10){
                    _all_results_fetched();
                }
            }
            else{
                var all_results_not_found = angular.isUndefined($scope.all_results_found) || !$scope.all_results_found;
                if($scope.popular_books.length == 0){
                    if(all_results_not_found){
                        $scope.all_results_found = true;
                        $scope.popular_books = [{"title": "No results found..."}];
                    }
                }
                else{
                    if(all_results_not_found){
                        _all_results_fetched();
                    }
                }
            }
            $scope._loading = false;
        });
    }

    $scope.handle_search_input = function(type){
        $scope._loading = true;
        if(type == "BOOK"){
            $scope.all_results_found = false;
            $scope.popular_books = [];
            $scope._fetch_book_results(true);
        }
        else{
            userService.search_authors("q="+$scope.info.search_author).then(function(data){
                $scope.popular_authors = [];
                if(data.length != 0){
                    angular.forEach(data, function(value){
                        var json = {"name": value[0]};
                        this.push(json);
                    },  $scope.popular_authors);
                }
                else{
                    $scope.popular_authors = [{"title": "No results found..."}];
                }
                $scope._loading = false;
            });
        }
    }

    $scope.search_info_card = function(event, type){
        var keyUp = event.keyCode == WebsiteUIConstants.KeyUp;
        var keyDown = event.keyCode == WebsiteUIConstants.KeyDown;
        var keyLeft = event.keyCode == WebsiteUIConstants.KeyLeft;
        var keyRight = event.keyCode == WebsiteUIConstants.KeyRight;
        var enter_pressed = event.keyCode == WebsiteUIConstants.Enter;
        var backspace = event.keyCode == WebsiteUIConstants.Backspace;
        var char_pressed = !(keyUp || keyDown || enter_pressed || keyLeft || keyRight);
        if(char_pressed){
            if(type == 'BOOK'){
                var has_minimum_length = $scope.info.search_book.length > 3;
            }
            else{
                var has_minimum_length = $scope.info.search_author.length > 3;  
            }
            if(has_minimum_length){
                $scope.popular_books = [{"title": "Searching..."}];
                $timeout.cancel(search_input_timeout);
                search_input_timeout = $timeout(function(){
                    $scope.handle_search_input(type);
                }, 300);
            }
            else {
                if(backspace){
                    if(type == "BOOK"){
                        $scope.popular_books = [];
                        $scope.get_popular_books();
                    }
                    else{
                        $scope.popular_authors = [];
                        $scope.get_popular_authors();
                    
                    }
                }
                else{
                    $scope.popular_books = [{"title": "Type more characters..."}];
                }
            }
        }
        event.stopPropagation();
    }

    $scope.edit_books_read = function(){
        $scope.goto_info_card();
        $rootScope.user.profile_status = 2;
        $scope.get_popular_books();
    }

    _init = function(){
        if(angular.isUndefined($scope.popular_books)){
            $scope.popular_books = [];
        }
        $scope.get_popular_books();
    }

    _init();
}]);