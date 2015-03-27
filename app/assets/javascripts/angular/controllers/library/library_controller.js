homeApp.controller('libraryController', ["$scope", "$rootScope", "$timeout", 'WebsiteUIConstants', 'SearchUIConstants', 'bookService', '$routeParams', '$location', 'ColorConstants', '$mdToast', 'infinityService', function($scope, $rootScope, $timeout, WebsiteUIConstants, SearchUIConstants, bookService, $routeParams, $location, ColorConstants, $mdToast, infinityService){

    $scope.get_popular_books = function(){
        if(!$scope.info.loading && !$scope.constant.show_book && !
            $scope.info.author_filter && !$scope.info.sort_by_alphabet &&
            !$scope.info.reading_time_filter && !$scope.info.published_era_filter &&
            !$scope.info.custom_loading && !$scope.info.subject_filter){
            $scope.info.loading = true;
            $scope._get_popular_books();
        }
    }

    $scope.init_book = function(index){
        var book_id = $scope.info.books[index];
        bookService.get_basic_details(book_id).then(function(data){
            $scope.info.books[index] = angular.extend($scope.info.books[index], data);
        });
    }

    $scope.sort_by_author = function(){
        $scope.info.author_filter = true;
        $scope.info.sort_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;
        $scope.info.subject_filter = false;
    }

    $scope.sort_by_alphabet = function(){
        $scope.info.author_filter = false;
        $scope.info.sort_by_alphabet = true;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;   
        $scope.info.subject_filter = false;
    }

    $scope.sort_by_reading_time = function(){
        $scope.info.author_filter = false;
        $scope.info.sort_by_alphabet = false;
        $scope.info.reading_time_filter = true;
        $scope.info.published_era_filter = false;   
        $scope.info.subject_filter = false;
    }

    $scope.sort_by_published_era = function(){
        $scope.info.author_filter = false;
        $scope.info.sort_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = true;   
        $scope.info.subject_filter = false;   
    }

    $scope.sort_by_subject = function(){
        $scope.info.author_filter = false;
        $scope.info.sort_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;
        $scope.info.subject_filter = true;
    }

    $scope.select_read_time = function(event){
        delete $scope.info.books;
        $scope.info.custom_loading = true;   
    }

    $scope.select_genre = function(selected_genre, event){
        delete $scope.info.books;
        $scope.info.custom_loading = true;
        $scope.filters.other  = angular.extend($scope.filters.other, {"genre" : selected_genre.id});
        $scope._get_popular_books();
    }

    $scope.select_author = function(event){
        delete $scope.info.books;
        $scope.info.custom_loading = true;
    }

    $scope.select_time_group = function(event){
        delete $scope.info.books;
        $scope.info.custom_loading = true;
    }

    $scope._get_popular_books = function(){
        if(angular.isDefined($scope.info.books)){
            var skip_count = $scope.info.books.length;
        }
        else{
            $scope.info.books = [];
            var skip_count = 0;
        }
        var params = angular.extend($scope.filters, {"skip_count": skip_count});
        params = angular.toJson(params);

        var _is_absent = function(category){
            var is_present = false;
            angular.forEach($scope.info.categories, function(base_category){
                if(angular.equals(base_category, category)){
                    is_present = true;
                }
            });
            return !is_present;
        }

        bookService.get_popular_books(params).then(function(data){
            angular.forEach(data, function(book){
                angular.forEach(book.categories, function(category){
                    if($scope.info.categories.length == 0){
                        $scope.info.categories.push(category);
                    }
                    else{
                        angular.forEach($scope.info.categories, function(base_category){
                            if(!angular.equals(category, base_category) && _is_absent(category)){
                                this.push(category);
                            }
                        }, $scope.info.categories);
                    }
                });
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var status = book.status != null;
                if(book.page_count < 50){
                    var reading_time = "For a flight journey";
                }
                else if(book.page_count < 100){
                    var reading_time = "For a weekend getaway";
                }
                else if(book.page_count <= 250){
                    var reading_time = "For a week holiday";
                }
                else{
                    var reading_time = "For a month vacation";
                }

                if(book.published_year > 2000){
                    var published_era = "Contemporary";
                }
                else{
                    var published_era = "Remaining";
                }

                var json = {
                        "published_era": published_era,
                        "reading_time": reading_time,
                        "status": status,
                        "isBook": true,
                        "colspan": 1,
                        "color": ColorConstants.value[random_int],
                        "rowspan": 1,
                        "alphabet": book.title[0]};
                json = angular.extend(book, json)
                this.push(json);
            },  $scope.info.books);
            $scope.info.loading = false;
        });
    }

    $scope.show_grid = function(event){
        if($scope.constant.show_book){
            $scope.grid_style = {"height": "initial", "padding-bottom": "100px"};
            $scope.constant = {"show_book": false};
            $scope.info.books = $scope.tempBooks;
        }
    }

    $scope.show_book = function(event, index){
        $scope.grid_style = {"height": "35px", "overflow-y": "hidden", "padding-bottom": "0px"};
        var insertIndex = (Math.floor(index/5) + 1)*5

        $scope.tempBooks = $scope.info.books;
        $scope.info.books = $scope.info.books.slice(0, insertIndex);
        $scope.constant = {"show_book": true};
        $rootScope.active_book = $scope.info.books[index];
        event.stopPropagation();
    }

    $scope.toggle_infinity_content = function(){
        if(angular.isDefined($scope.active_tab.infinity) && $scope.active_tab.infinity){
            $scope._get_personalised_suggestions();
        }
        else{
            $scope._get_popular_books();
        }
    }

    $scope._get_personalised_suggestions = function(){
        infinityService.get_small_reads().then(function(data){
            $scope.small_reads = data;
        });

        infinityService.get_books_from_favourite_author().then(function(data){
            $scope.books_from_favourite_author = data;
        });

        infinityService.get_books_from_favourite_category().then(function(data){
            $scope.books_from_favourite_category = data;
        });

        infinityService.get_books_from_favourite_era().then(function(data){
            $scope.books_from_favourite_era = data;
        });

        infinityService.get_books_on_friends_shelves().then(function(data){
            $scope.books_on_friends_shelves = data;
        });

        infinityService.get_books_from_unexplored_subjects().then(function(data){
            $scope.books_from_unexplored_subjects = data;
        });
    }

    var _init = function(){
        // $scope.info.author_filter = true;
        $scope.$routeParams = $routeParams;
        $scope.filters = {"other": {}};
        // var genre = (/genre=(\d+)/.exec($location.absUrl())[1]);
        // var year = (/year=(\d+)/.exec($location.absUrl())[1]);
        // var author = (/author=(\d+)/.exec($location.absUrl())[1]);
        // var duration = (/duration=(\d+)/.exec($location.absUrl())[1]);
        $scope.active_endorse = false;
        $scope.active_bookmark = true;
        $scope.active_share = true;
        $scope._get_personalised_suggestions();

        $scope.constant = {"show_book": false};
        $scope.info.books = [];
        $scope.search_tag = {};
        $scope.active_tab = {};
        $scope.info.categories = [];
    }


    $scope.show_right_nav = function(event){
        $mdSidenav('alphabets_sidenav').toggle();
        event.stopPropagation();
    }    

    $scope.show_left_nav = function(event){
        $mdSidenav('sort_by_sidenav').toggle();
        event.stopPropagation();
    }    

    $scope.show_bottom_filters = function(event){
        $mdBottomSheet.show({
            templateUrl: '/assets/angular/html/library/bottom_sheet_filters.html',
            targetEvent: event
        })

    };


    _init();
}]);