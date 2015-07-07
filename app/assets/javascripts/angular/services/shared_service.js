homeApp.service('sharedService', ["$timeout", "$rootScope", "ColorConstants", "$location", "bookService", "shelfService", "$mdToast", "infinityService", "$mdDialog", function ($timeout, $rootScope, ColorConstants, $location, bookService, shelfService, $mdToast, infinityService, $mdDialog){

    this.get_popular_books = function($scope, books){
        console.log("get_popular_books");
        var ready_to_load = !$scope.info.loading && (angular.isUndefined($scope.constant) || !$scope.constant.show_book) && 
            (angular.isUndefined($scope.info.author_filter) || !$scope.info.author_filter) && (angular.isUndefined($scope.info.group_by_alphabet) || !$scope.info.group_by_alphabet) &&
            !$scope.info.reading_time_filter && !$scope.info.published_era_filter &&
            !$scope.info.custom_loading && !$scope.info.subject_filter && ($scope.info.infinity || angular.isUndefined($scope.info.infinity) || angular.isDefined(books));
        if(ready_to_load){
            this.load_popular_books($scope, books);
        }
    }

    var _get_reading_time = function(book){
        if(book.page_count == null){
            var reading_time = "Dont Know";
        }
        else{
            book.page_count = parseInt(book.page_count);
            if(book.page_count < 50){
                var reading_time = "For a flight journey";
            }
            else if(book.page_count < 100){
                var reading_time = "For a weekend getaway";
            }
            else if(book.page_count <= 250){
                var reading_time = "For a week holiday";
            }
            else if(book.page_count > 250){
                var reading_time = "For a month vacation";
            }
            else{
                var reading_time = "Dont Know";
            }
        }
        return reading_time;
    }

    var _get_published_era = function(book){
        if(book.published_year > 2000){
            var published_era = "Contemporary";
        }
        else if(book.published_year >= 1939 && book.published_year < 2000){
            var published_era = "Post Modern Literature";
        }
        else if(book.published_year >= 1900 && book.published_year < 1939){
            var published_era = "Modernism";
        }
        else if(book.published_year >= 1837 && book.published_year < 1901){
            var published_era = "Victorian Literature";
        }
        else if(book.published_year >= 1900 && book.published_year < 1939){
            var published_era = "Romanticism";
        }
        else if(book.published_year >= 1798 && book.published_year < 1837){
            var published_era = "Neo Classical Period";
        }
        else if(book.published_year >= 1900 && book.published_year < 1939){
            var published_era = "English Renaissance";
        }
        else if(book.published_year >= 1660 && book.published_year < 1798){
            var published_era = "Middle English Literature";
        }
        else if(book.published_year >= 1900 && book.published_year < 1939){
            var published_era = "Old English Literature";
        }
        else{
            var published_era = "Don't Know";
        }
        return published_era;
    }

    this.show_book_dialog = function($rootScope, $scope, book, event){
        var id = book.book_id || book.id;
        window.location.href = "/book?id="+id;
        // $rootScope.active_book = book;
        // $rootScope.active_book.show_info_only = true;
        // $mdDialog.show({
        //     templateUrl: '/assets/angular/html/news/book.html',
        //     scope: $scope,
        //     preserveScope: true,
        //     clickOutsideToClose: true,
        //     targetEvent: event
        // });
        // event.stopPropagation();
    }

    this.filtered_books = function($scope){
        $scope.info.loading = true;
        $scope.info.fetching_books = true;
        var skip_count = $scope.info.books.length;
        infinityService.get_books(skip_count).then(function(data){
            if(data != null){
                angular.forEach(data.books, function(book){
                    var status = book.status != null;
                    var reading_time = _get_reading_time(book);
                    var published_era = _get_published_era(book);

                    var json = {
                            "published_era": published_era,
                            "reading_time": reading_time,
                            "status": status,
                            "isBook": true,
                            "colspan": 1,
                            "rowspan": 1,
                            "alphabet": book.title[0]};
                    json = angular.extend(book, json)
                    this.push(json);
                }, $scope.info.books);
                delete data.books;
                $scope.info.other_info = data;
            }
            $scope.info.fetching_books = false;
            $scope.info.loading = false;
        });
    }

    this.toggle_bookmark = function(label, data, bookmark_object){
        var toast_position = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        var _getToastPosition = function(){
            return Object.keys(toast_position)
                          .filter(function(pos) { return toast_position[pos]; })
                          .join(' ');
        }

        if(angular.isUndefined(data) || !data){
            var status = true;
        }
        else{
            var status = false;
        }


        var id = bookmark_object.id;
        var type = bookmark_object.type;
        var shelf = (label.label_key || label.key);
        var params = {"id": id, "type": type, "shelf": shelf, "status": status};
        
        shelfService.bookmark(params);
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/bookmark_action.html',
            hideDelay: 6000,
            position: _getToastPosition()
        });
    }

    this.load_popular_books = function($scope, books){
        $scope.info.loading = true;
        if(angular.isUndefined(books)){
            if(angular.isUndefined($scope.info.books)){
                $scope.info.books = [];
            }
            books = $scope.info.books;
        }
        var skip_count = books.length;

        if(angular.isUndefined($scope.filters)){
            $scope.filters = {};
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
                if(angular.isDefined($scope.info.categories)){
                    angular.forEach(book.root_category, function(category){
                        if($scope.info.categories.length == 0){
                            if((category.name != null)){
                                $scope.info.categories.push(category);
                            }
                        }
                        else{
                            angular.forEach($scope.info.categories, function(base_category){
                                if(!angular.equals(category, base_category) && _is_absent(category) && (category.name != null)){
                                    this.push(category);
                                }
                            }, $scope.info.categories);
                        }
                    });
                }
                var status = book.status != null;
                var reading_time = _get_reading_time(book);
                var published_era = _get_published_era(book);
                var json = {
                        "published_era": published_era,
                        "reading_time": reading_time,
                        "status": status,
                        "isBook": true,
                        "colspan": 1,
                        "rowspan": 1,
                        "alphabet": book.title[0]};
                json = angular.extend(book, json)
                this.push(json);
            },  books);
            console.log("load_popular_books", books.length, $scope.info.books.length);
            // $scope.info.books = books;
            $scope.info.loading = false;
        });
    }

}]);