homeApp.controller('libraryController', ["$scope", "$rootScope", "$timeout", 'WebsiteUIConstants', 'SearchUIConstants', 'bookService', '$routeParams', '$location', 'ColorConstants', '$mdToast', 'infinityService', '$mdBottomSheet', '$mdSidenav', 'sharedService', '$cookieStore', '$mdDialog', function($scope, $rootScope, $timeout, WebsiteUIConstants, SearchUIConstants, bookService, $routeParams, $location, ColorConstants, $mdToast, infinityService, $mdBottomSheet, $mdSidenav, sharedService, $cookieStore, $mdDialog){

    $scope.get_popular_books = function(){
        var grouped = $scope.info.author_filter || $scope.info.group_by_alphabet || $scope.info.reading_time_filter || $scope.info.published_era_filter || $scope.info.subject_filter;
        if(!grouped){
            if(angular.isUndefined($scope.constant) || !$scope.constant.show_book){
                if(Object.keys($rootScope.filters).length > 0){
                    if(!$scope.info.fetching_books){
                        sharedService.filtered_books($scope);
                    }
                }
                else{
                    sharedService.get_popular_books($scope, $scope.info.books);
                }
            }
        }
    }

    $scope.remove_expanded_book = function(index){
        $scope.info.books.splice(index, 1);
        delete $scope.expanded_book;
        delete $scope.expanded_index;
    }

    $scope.expand_book = function(index){
        if(window.innerWidth > 1100){
            var row_count = 5;
        }
        else if(window.innerWidth > 900){
            var row_count = 4;
        }
        else{
            var row_count = 3;
        }
        var _scroll_and_expand = function(index){
            var book = {
                "title": $scope.info.books[index].title,
                "author_name": $scope.info.books[index].author_name,
                "page_count": $scope.info.books[index].page_count,
                "published_year": $scope.info.books[index].published_year,
                "description": $scope.info.books[index].description,
                "expanded": true,
                "id": ($scope.info.books[index].id || $scope.info.books[index].book_id),
                "isbn": $scope.info.books[index].isbn,
                "root_category": $scope.info.books[index].root_category,
                "bookmark_count": $scope.info.books[index].bookmark_count
            }
            $scope.expanded_index = index;
            index = row_count*(Math.floor(index / row_count)) + row_count;
            $scope.expanded_book = index;
            $scope.info.books.splice(index, 0, book);
        }
        if(angular.isDefined($scope.expanded_index)){
            if($scope.expanded_index == index){
                index = row_count*(Math.floor(index / row_count)) + row_count;
                $scope.remove_expanded_book(index);
            }
            else{
                $scope.info.books.splice($scope.expanded_book, 1);
                if(index > $scope.expanded_book){
                    index = index - 1;
                }
                _scroll_and_expand(index);
            }
        }
        else{
            _scroll_and_expand(index);
        }
    }

    $scope.init_book = function(index){
        var book_id = $scope.info.books[index];
        bookService.get_basic_details(book_id).then(function(data){
            $scope.info.books[index] = angular.extend($scope.info.books[index], data);
        });
    }

    $scope.ungroup = function(){
        $scope.info.author_filter = false;
        $scope.info.group_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;
        $scope.info.subject_filter = false;
    }

    $scope.group_by_author = function(){
        $scope.info.author_filter = true;
        $scope.info.group_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;
        $scope.info.subject_filter = false;
    }

    $scope.group_by_alphabet = function(){
        $scope.info.author_filter = false;
        $scope.info.group_by_alphabet = true;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;   
        $scope.info.subject_filter = false;
    }

    $scope.group_by_reading_time = function(){
        $scope.info.author_filter = false;
        $scope.info.group_by_alphabet = false;
        $scope.info.reading_time_filter = true;
        $scope.info.published_era_filter = false;   
        $scope.info.subject_filter = false;
    }

    $scope.group_by_published_era = function(){
        $scope.info.author_filter = false;
        $scope.info.group_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = true;   
        $scope.info.subject_filter = false;   
    }

    $scope.group_by_subject = function(){
        $scope.info.author_filter = false;
        $scope.info.group_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;
        $scope.info.subject_filter = true;
    }

    $scope._get_popular_books = function(){
        console.log("_get_popular_books");
        sharedService.load_popular_books($scope, $scope.info.books);
    }

    $scope.show_grid = function(event){
        if($scope.constant.show_book){
            $scope.grid_style = {"height": "initial", "padding-bottom": "100px"};
            $scope.constant = {"show_book": false};
        }
    }

    $scope.show_book = function(event, book){
        // $scope.grid_style = {"height": "35px", "overflow-y": "hidden", "padding-bottom": "0px"};
        // $scope.constant = {"show_book": true};
        // $rootScope.active_book = book;
        // sharedService.show_book_dialog($rootScope, $scope, book, event);
        var id = book.book_id || book.id;
        window.location.href = "/book?id="+id;
    }

    var _set_data = function(data, array){
        angular.forEach(data, function(value){
            var random_int = Math.floor(Math.random()*ColorConstants.value.length);
            var json = {"colspan": 1,
                        "color": ColorConstants.value[random_int],
                        "rowspan": 1};
            value = angular.extend(value, json);
            this.push(value);
        }, array);
        return array;
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
            targetEvent: event ,
            scope : $scope ,
            preserveScope: true,
            controller: "filtersController" 
        });
    };

    function get_query_params(name){
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec(window.location.href);
        var output = "";
        if(results != null){
            output = results[1];
        }
        if(output == ""){
            output = null;
        }
        return output;
    }

    var _init = (function(){
        // $scope.info.author_filter = true;
        $scope.$routeParams = $routeParams;
        $scope.filters = {"other": {}};
        $scope.grid = {};
        $scope.info.books = [];
        $scope.search_tag = {};
        $scope.active_tab = {};
        $scope.info.categories = [];
        $scope.friends = [];

        $scope.active_endorse = false;
        $scope.active_bookmark = true;
        $scope.active_share = true;
        var genre = get_query_params("g");
        var duration = get_query_params("d");
        if(genre == null && duration == null){
            var popular_books_timeout = $timeout(function(){
                console.log("libraryController");
                $scope._get_popular_books();
            }, 100);

            $scope.$on('destroy', function(){
                $timeout.cancel(popular_books_timeout);
            });
        }
        $scope.constant = {"show_book": false};
    }());

}]);