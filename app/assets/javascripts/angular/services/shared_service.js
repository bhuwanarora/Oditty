homeApp.service('sharedService', ["$timeout", "$rootScope", "ColorConstants", "$location", "bookService", "shelfService", "$mdToast", "infinityService", "userService", "$location", "newsService", "Years", "Months", "websiteService", "$document", function ($timeout, $rootScope, ColorConstants, $location, bookService, shelfService, $mdToast, infinityService, userService, $location, newsService, Years, Months, websiteService, $document){

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
        // userService.show({
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
                    if(book.title != null){
                        var alphabet = book.title[0];
                        var json = {
                                "published_era": published_era,
                                "reading_time": reading_time,
                                "status": status,
                                "isBook": true,
                                "colspan": 1,
                                "rowspan": 1,
                                "alphabet": alphabet};
                        json = angular.extend(book, json)
                        this.push(json);
                    }
                }, $scope.info.books);
                delete data.books;
                $scope.info.other_info = data;
            }
            $scope.info.fetching_books = false;
            $scope.info.loading = false;
        });
    }

    this.render_page = function(event){
        if(angular.isDefined($rootScope.containers)){
            var element = event.target;
            var content = String(element.textContent).replace(/^\s+|\s+$/g, '');
            if(content == "Go to Book"){
                var element = element.parentElement;
            }
            var url = element.getAttribute('data-url');
            var id = element.getAttribute('data-id');
            var header = element.getAttribute('data-header');
            if(!header || header == null || angular.isUndefined(header)){
                header = url.toCamel();
            }
            if(angular.isUndefined(id) || (id == null) || (id == 'null')){
                var container = {"id": id, "url": url, "full_url": url, "header": header};
            }
            else{
                var container = {"id": id, "url": url, "full_url": url+"?id="+id, "header": header};
            }

            // debugger
            if(container.url == "book"){
                var first_container = {"id": id, "url": "book_interaction", "full_url": url+"?id="+id, "header": header};
                $rootScope.containers.push(first_container);
                $rootScope.containers.push(container);
                var last_container = {"id": id, "url": "book_rating", "full_url": url+"?id="+id, "header": header};
                $rootScope.containers.push(last_container);
            }
            else{
                $rootScope.containers.push(container);
            }
            var container = angular.element(document.getElementById('browseScreen'));
            var length = $rootScope.containers.length;
            container.scrollLeft(length*600, 1000);
            $location.path(null);
            return false;
        }
    }

    this.toggle_bookmark = function(label, data, bookmark_object, scope){
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.filters.shelf){
                    deleteCookie("todo");
                    userService.update_todo_key('filters/shelf');
                }
            }
        }
        _handle_todo_update();
        
        if(angular.isUndefined(scope.info)){
            scope.info = {"loading": false};
        }
        if(!scope.info.loading){
            scope.info.loading = true;
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
            
            shelfService.bookmark(params).then(function(){
                scope.info.loading = false;    
                $mdToast.show({
                    controller: 'toastController',
                    templateUrl: 'assets/angular/html/shared/toast/bookmark_action.html',
                    hideDelay: 3000,
                    position: _getToastPosition()
                });
            });
        }
    }

    this.get_community_news = function($scope){
        var is_news_tab = $location.path() != "/room/books" && $location.path() != "/room/videos" && $location.path() != "/room/wiki";
        // if(angular.isUndefined($scope.active_tag)){
        //     $scope.active_tag.news = {};
        // }
        var id = $scope.active_tag.id;
        if(angular.isUndefined($scope.active_tag.news)){
            $scope.active_tag.news = [];
        }
        if(is_news_tab){
            var skip_count = $scope.active_tag.news.length;
            var month_index = Months.indexOf($scope.info.active_month);
            if(!$scope.info.loading){
                $scope.info.loading = true;
                var time = $scope.info.active_year;
                if(time == "recent" || angular.isUndefined(time)){
                    time = 2015;
                }
                if(angular.isUndefined($scope.info.active_month)){
                    var time = time + "/12";
                }
                else{
                    var time = time + "/"+ (12 - month_index);
                }
                // alert(time);
                newsService.get_community_news(id, skip_count, time).then(function(data){
                    if(data != null && data.length > 0){
                        data = data[0];
                        $scope.active_tag.news = $scope.active_tag.news.concat(data.news);
                    }
                    else{
                        if(month_index == 11){
                            if(time != "1998"){
                                var year_index = Years.indexOf(time);
                                time = Years[year_index + 1];
                                $scope.info.active_month = Months[0];
                            }
                        }
                        else{
                            $scope.info.active_month = Months[month_index + 1];   
                        }
                    }
                    $scope.info.loading = false;
                });
            }
        }
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
                        "alphabet": book.title[0],
                        "root_category": book.root_category};
                json = angular.extend(book, json)
                this.push(json);
            },  books);
            console.log("load_popular_books", books.length, $scope.info.books.length, books);
            // $scope.info.books = books;
            $scope.info.loading = false;
        });
    }

}]);