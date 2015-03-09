homeApp.controller('libraryController', ["$scope", "$rootScope", "$timeout", 'WebsiteUIConstants', 'SearchUIConstants', 'bookService', '$routeParams', '$location', 'ColorConstants', '$mdToast', function($scope, $rootScope, $timeout, WebsiteUIConstants, SearchUIConstants, bookService, $routeParams, $location, ColorConstants, $mdToast){

    $scope.get_popular_books = function(){
        if(!$scope.info.loading && !$scope.constant.show_book && !
            $scope.info.author_filter && !$scope.info.sort_by_alphabet &&
            !$scope.info.reading_time_filter && !$scope.info.published_era_filter &&
            !$scope.info.custom_loading){
            $scope.info.loading = true;
            $scope._get_popular_books();
        }
    }

    $scope.init_book = function(index){
        var book_id = $scope.books[index];
        bookService.get_basic_details(book_id).then(function(data){
            $scope.books[index] = angular.extend($scope.books[index], data);
        });
    }

    $scope.sort_by_author = function(){
        $scope.info.author_filter = true;
        $scope.info.sort_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;
    }

    $scope.sort_by_alphabet = function(){
        $scope.info.author_filter = false;
        $scope.info.sort_by_alphabet = true;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = false;   
    }

    $scope.sort_by_reading_time = function(){
        $scope.info.author_filter = false;
        $scope.info.sort_by_alphabet = false;
        $scope.info.reading_time_filter = true;
        $scope.info.published_era_filter = false;   
    }

    $scope.sort_by_published_era = function(){
        $scope.info.author_filter = false;
        $scope.info.sort_by_alphabet = false;
        $scope.info.reading_time_filter = false;
        $scope.info.published_era_filter = true;      
    }

    $scope.select_read_time = function(event){
        delete $scope.books;
        $scope.info.custom_loading = true;   
    }

    $scope.select_genre = function(selected_genre, event){
        delete $scope.books;
        $scope.info.custom_loading = true;
        $scope.filters.other  = angular.extend($scope.filters.other, {"genre" : selected_genre.id});
        $scope._get_popular_books();
    }

    $scope.select_author = function(event){
        delete $scope.books;
        $scope.info.custom_loading = true;
    }

    $scope.select_time_group = function(event){
        delete $scope.books;
        $scope.info.custom_loading = true;
    }

    $scope._get_popular_books = function(){
        if(angular.isDefined($scope.books)){
            var skip_count = $scope.books.length;
        }
        else{
            $scope.books = [];
            var skip_count = 0;
        }
        var params = angular.extend($scope.filters, {"skip_count": skip_count});
        params = angular.toJson(params);

        bookService.get_popular_books(params).then(function(data){
            angular.forEach(data, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var status = value[4] != null;
                if(value[7] < 50){
                    var reading_time = "For a flight journey";
                }
                else if(value[7] < 100){
                    var reading_time = "For a weekend getaway";
                }
                else if(value[7] <= 250){
                    var reading_time = "For a week holiday";
                }
                else{
                    var reading_time = "For a month vacation";
                }

                if(value[6] > 2000){
                    var published_era = "Contemporary";
                }
                else{
                    var published_era = "Remaining";
                }

                var json = {"isbn": value[0], 
                        "id": value[1], 
                        "title": value[2], 
                        "author_name": value[3], 
                        "user_rating": value[5],
                        "published_era": published_era,
                        "reading_time": reading_time,
                        "status": status,
                        "isBook": true,
                        "colspan": 1,
                        "color": ColorConstants.value[random_int],
                        "rowspan": 1,
                        "alphabet": value[2][0]};
                this.push(json);
            },  $scope.books);
            $scope.info.loading = false;
        });
    }

    $scope.show_grid = function(event){
        if($scope.constant.show_book){
            $scope.grid_style = {"height": "initial", "padding-bottom": "100px"};
            $scope.constant = {"show_book": false};
            // $scope._init();
            $scope.books = $scope.tempBooks;
        }
    }

    $scope.show_book = function(event, index){
        // var offsetTop = event.currentTarget.parentElement.parentElement.parentElement.offsetTop;
        // var clientHeight = event.currentTarget.parentElement.parentElement.clientHeight;
        // var marginTop = offsetTop + 1*clientHeight/3;
        $scope.grid_style = {"height": "35px", "overflow-y": "hidden", "padding-bottom": "0px"};

        // var offset = 100;
        // var duration = 3000;
        // var bookBoundingRectangle = event.currentTarget.parentElement.parentElement.getBoundingClientRect();

        var insertIndex = (Math.floor(index/5) + 1)*5

        // var item = {
        //   color: "#fffff",
        //   colspan: 5,
        //   rowspan: 5,
        //   isBook: true
        // }
        
        $scope.tempBooks = $scope.books;
        $scope.books = $scope.books.slice(0, insertIndex);
        $scope.constant = {"show_book": true};
        $rootScope.active_book = $scope.books[index];
        event.stopPropagation();
    }

    $scope.toggle_endorse = function(){
        if($scope.active_endorse){
            $scope.active_endorse = false;
        }
        else{
            $scope.active_endorse = true;
        }
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/endorse_action.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
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

        $scope.constant = {"show_book": false};
        $scope.books = [];
        $scope.search_tag = {}
        $scope._get_popular_books();
    }


    _init();
}]);