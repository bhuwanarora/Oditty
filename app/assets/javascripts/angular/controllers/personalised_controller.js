homeApp.controller('personalisedController', ["$scope", "$timeout", '$rootScope', "websiteService", 'ColorConstants', '$location', 'bookService', 'newsService', '$mdDialog', 'infinityService', 'sharedService', 'Facebook', function($scope, $timeout, $rootScope, websiteService, ColorConstants, $location, bookService, newsService, $mdDialog, infinityService, sharedService, Facebook){
	
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

    $scope.show_unexplored_subject_books = function(){
        if(angular.isUndefined($scope.books_from_unexplored_subjects)){
            $scope.info.loading = true;
            infinityService.get_books_from_unexplored_subjects().then(function(data){
                $scope.books_from_unexplored_subjects = data.books;
                $scope.unexplored_subject = data.info;
                $scope.info.loading = false;
            });
        }
    }

    $scope.goto_user_profile = function(){
        window.location.href = "/profile?id=" + $scope.info.active_tag.id;
    }

    $scope.goto_author_profile = function(){
        window.location.href = "/author?id=" + $scope.info.active_tag.id;   
    }

    $scope.show_books_on_friend_shelves = function(){
        if(angular.isUndefined($scope.friends) || $scope.friends.length == 0){
            $scope.info.loading = true;
            delete $scope.info.active_tag;
            infinityService.get_books_on_friends_shelves().then(function(data){
                angular.forEach(data, function(value){
                    if((value.info[0].image_url == null) || (value.info[0].image_url == "")){
                        var image_url = "http://www.sessionlogs.com/media/icons/defaultIcon.png";
                    }
                    else{
                        var image_url = value.info[0].image_url;
                    }
                    var json = {"image_url": image_url, "view_count": 100, "name": value.info[0].first_name, "id": value.info[0].id};
                    value = angular.extend(value, json);
                    value.books = _set_data(value.books, []);
                    if(value.name != null){
                        this.push(value);
                    }
                }, $scope.friends);
                $scope.info.active_tag = $scope.friends[0];
                $scope.info.loading = false;
            });
        }
        else{
            var temp = $scope.friends;
            $scope.friends = [];
            $scope.info.loading = true;
            var timeout_event = $timeout(function(){
                $scope.info.loading = false;
                $scope.friends = temp;
                $scope.info.active_tag = $scope.friends[0];
            }, 1000);
            $scope.$on('destroy', function(){
                $timeout.cancel(timeout_event);
            });
        }
    }

     $scope.show_book_dialog = function(book, event){
    //     $rootScope.active_book = book;
    //     $rootScope.active_book.show_info_only = true;
    //     $mdDialog.show({
    //         templateUrl: '/assets/angular/html/news/book.html',
    //         scope: $scope,
    //         preserveScope: true,
    //         clickOutsideToClose: true,
    //         targetEvent: event
    //     });
    //     event.stopPropagation();
        sharedService.show_book_dialog($rootScope, $scope, book, event);
    }

    $scope.show_books_for_era = function(){
        if(angular.isUndefined($scope.books_from_favourite_era)){
            $scope.info.loading = true;
            delete $scope.info.active_tag;
            infinityService.get_books_from_favourite_era().then(function(data){
                data = data[0];
                $scope.books_from_favourite_era = [];
                _set_data(data.books, $scope.books_from_favourite_era);
                $scope.likeable_era = data.info;
                $scope.info.loading = false;
            });
        }
    }

    $scope.show_books_for_category = function(){
        if(angular.isUndefined($scope.books_from_favourite_category)){
            $scope.info.loading = true;
            delete $scope.info.active_tag;
            infinityService.get_books_from_favourite_category().then(function(data){
                $scope.books_from_favourite_category = [];
                _set_data(data.books, $scope.books_from_favourite_category);
                $scope.likeable_category = data.info;
                $scope.info.loading = false;
            });
        }
    }

    $scope.show_books_for_author = function(){
        $scope.info.selectedIndex = 0;
        if(angular.isUndefined($scope.books_from_favourite_author)){
            $scope.books_from_favourite_author = [];
            $scope.info.loading = true;
            delete $scope.info.active_tag;
            infinityService.get_books_from_favourite_author().then(function(data){
                angular.forEach(data, function(value){
                    var json = {"image_url": "http://rd-authors.readersdoor.netdna-cdn.com/"+value.id+"/M.png", 
                                "view_count": 100};
                    value = angular.extend(value, json);
                    value.books = _set_data(value.books, []);
                    this.push(value);
                }, $scope.books_from_favourite_author);
                $scope.info.active_tag = $scope.books_from_favourite_author[0];
                $scope.info.loading = false;
            });
        }
        else{
            $scope.info.active_tag = $scope.books_from_favourite_author[0];
        }
    }

    $scope.refresh_data = function(active_item){
        $scope.info.active_tag = active_item;
    }

    $scope.show_small_reads = function(){
        if(angular.isUndefined($scope.small_reads)){
            $scope.info.loading = true;
            delete $scope.info.active_tag;
            infinityService.get_small_reads().then(function(data){
                $scope.small_reads = [];
                _set_data(data, $scope.small_reads);
                $scope.info.loading = false;
            });
        }
    }

	var _init = (function(){
        $scope.info.books = [];
        $scope.friends = [];
        var authors_timeout = $timeout(function(){
    	   $scope.show_books_for_author();
        }, 100);

        $scope.$on('destroy', function(){
            $timeout.cancel(authors_timeout);
        });

        bookService.get_social_books().then(function(data){
            $scope.social_books = data;
        });

        // Facebook.api('108160689204689', function(response){
        //     websiteService.handle_facebook_books(response);
        // });
        // Facebook.api('me/og.likes', function(response){
        //     websiteService.handle_facebook_books(response);
        // });
    }());

}]);