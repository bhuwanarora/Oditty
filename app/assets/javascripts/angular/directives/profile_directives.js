homeApp.directive('friendInfo', ["$rootScope", "userService", function($rootScope, userService){
    return {
        restrict: 'E',
        scope : {friend: '=', info: '='},
        controller: ["$scope", function($scope){
           
            var _init = function(){
                if(angular.isDefined($scope.friend)){
                    userService.get_user_details($scope.friend.id).then(function(data){
                        $scope.friend = angular.extend($scope.friend, data);
                    });
                }
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/friend_info.html'
    };
}]);

homeApp.directive('authorInfo', ["$rootScope", "authorService", 'ColorConstants', '$mdDialog', function($rootScope, authorService, ColorConstants, $mdDialog){
    return {
        restrict: 'E',
        scope : {author: '=', info: '='},
        controller: ["$scope", function($scope){
           
            var _init = function(){
                if(angular.isDefined($scope.author)){
                    authorService.get_basic_info($scope.author.id).then(function(data){
                        $scope.author = angular.extend($scope.author, data);
                    });
                }
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/author_info.html'
    };
}]);

homeApp.directive('communityInfo', ["$rootScope", "newsService", 'ColorConstants', '$mdDialog', 'sharedService', function($rootScope, newsService, ColorConstants, $mdDialog, sharedService){
    return {
        restrict: 'E',
        scope : {community: '=', info: '='},
        controller: ["$scope", function($scope){
            $scope.show_book_dialog = function(book, event){
                sharedService.show_book_dialog($rootScope, $scope, book, event);
            }

            var _init = function(){
                if(angular.isDefined($scope.community)){
                    newsService.get_feed_info($scope.community.id).then(function(data){
                        $scope.community = angular.extend($scope.community, data);
                    });
                }
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/community_info.html'
    };
}]);


homeApp.directive('userCommunities', ["$rootScope", "userService", function($rootScope, userService){
    return {
        restrict: 'E',
        scope : {userId: '='},
        controller: ["$scope", function($scope){
            var _init = function(){
                $scope.rooms = [];
                // $scope.info.loading = true;
                userService.get_communities($scope.userId).then(function(data){
                    angular.forEach(data, function(room){
                        var json = angular.extend(room, {"status": 1});
                        this.push(json);
                    }, $scope.rooms);
                    // $scope.info.loading = false;
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/rooms/show.html'
    };
}]);

homeApp.directive('bookShelf', ["$rootScope", "roomService", "ColorConstants", '$mdDialog', 'sharedService', function($rootScope, roomService, ColorConstants, $mdDialog, sharedService){
    return {
        restrict: 'E',
        scope: {shelf: '=', info: '='},
        controller: ["$scope", function($scope){

            $scope.toggle = function(){
                $scope.show_shelf = !$scope.show_shelf;
            }

            $scope.show_book_dialog = function(book, event){
                // $rootScope.active_book = book;
                // $rootScope.active_book.show_info_only = true;
                // $mdDialog.show({
                //     templateUrl: '/assets/angular/html/news/book.html',
                //     scope: $scope,
                //     preserveScope: true,
                //     clickOutsideToClose: true
                // });
                sharedService.show_book_dialog($rootScope, $scope, book, event);
            }

            $scope.add_books_to_shelf = function(shelf, event){
                $rootScope.active_shelf = shelf;
                $scope.info.show_book_share = true;
            }
            
            var _init = function(){
               if($scope.shelf.books.length == 1 && ($scope.shelf.books[0].title == null)){
                    $scope.show_shelf = false;
                }
                else if($scope.shelf.books.length > 0){ 
                    $scope.show_shelf = true;
                }
                else{
                    $scope.show_shelf = false;
                }
            }

            _init();

        }],
        templateUrl: '/assets/angular/html/room/partials/book_shelf.html'
    };
}]);

homeApp.directive('articleShelf', ["$rootScope", "roomService", "ColorConstants", function($rootScope, roomService, ColorConstants){
    return {
        restrict: 'E',
        scope: {shelf: '='},
        controller: ["$scope", function($scope){

            $scope.toggle = function(){
                $scope.show_shelf = !$scope.show_shelf;
            }

            var _init = function(){
                if($scope.shelf.articles.length == 1 && ($scope.shelf.articles[0].title == null)){
                    $scope.show_shelf = false;
                }
                else if($scope.shelf.articles.length > 0){ 
                    $scope.show_shelf = true;
                }
                else{
                    $scope.show_shelf = false;
                }
            }

            _init();

        }],
        templateUrl: '/assets/angular/html/room/partials/article_shelf.html'
    };
}]);

homeApp.directive('articles', ["$rootScope", "roomService", "ColorConstants", function($rootScope, roomService, ColorConstants){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){

            var _get_visited_articles = function(){
                roomService.get_visited_articles().then(function(data){
                    if(angular.isUndefined($scope.visited_articles)){
                        $scope.visited_articles = [];
                    }
                    _set_data(data, $scope.visited_articles);
                    $scope.shelf_loading = false;
                });
            }

            var _set_data = function(data, array){
                angular.forEach(data, function(value){
                    var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                    var width = _get_random_init(70, 100);
                    var height = _get_random_init(40, 60);
                    var margin_left = _get_random_init(1, 10);
                    var random_style = {"width": width+"%", "height": height+"px", "background-color": ColorConstants.value[random_int], "margin-left": margin_left+"px"};
                    var json = angular.extend(value, {"random_style": random_style, "color": ColorConstants.value[random_int]});
                    this.push(json);
                }, array);
                return array;
            }

            var _get_random_init = function(min, max){
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            var _init = function(){
                $scope.shelf_loading = true;
                _get_visited_articles();
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/room/show.html'
    };
}]);

homeApp.directive('articleShelves', ["$rootScope", "roomService", "ColorConstants", function($rootScope, roomService, ColorConstants){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){

            var _get_articles_grouped_by_shelves = function(){
                roomService.get_articles_grouped_by_shelves().then(function(data){
                    $scope.articles_grouped_by_shelves = data;
                    $scope.shelf_loading = false;
                });
            }

            var _init = function(){
                $scope.shelf_loading = true;
                _get_articles_grouped_by_shelves();
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/room/_right_panel.html'
    };
}]);

homeApp.directive('bookShelves', ["$rootScope", "roomService", "ColorConstants", function($rootScope, roomService, ColorConstants){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){

            var _get_books_grouped_by_shelves = function(){
                roomService.get_books_grouped_by_shelves().then(function(data){
                    if(angular.isUndefined($scope.book_shelves)){
                        $scope.book_shelves = [];
                    }
                    $scope.book_shelves = [];
                    angular.forEach(data, function(book_shelf){
                        var books = [];
                        book_shelf.books = _set_data(book_shelf.books, books);
                        this.push(book_shelf);
                    }, $scope.book_shelves);
                    _group_books_by_shelf();
                    $scope.shelf_loading = false;
                });
            }

            var _get_random_init = function(min, max){
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            var _set_data = function(data, array){
                angular.forEach(data, function(value){
                    var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                    var width = _get_random_init(70, 100);
                    var height = _get_random_init(40, 60);
                    var margin_left = _get_random_init(1, 10);
                    var random_style = {"width": width+"%", "height": height+"px", "background-color": ColorConstants.value[random_int], "margin-left": margin_left+"px"};
                    var json = angular.extend(value, {"random_style": random_style, "color": ColorConstants.value[random_int]});
                    this.push(json);
                }, array);
                return array;
            }

            var _group_books_by_shelf = function(){
                var _shelf_exists = function(shelf, groups){
                    var shelf_exists = false;
                    var shelf_index = 0;
                    angular.forEach(groups, function(book_shelf, index){
                        if(shelf == book_shelf.shelf){
                            shelf_exists = true;
                            shelf_index = index;
                        }
                    });
                    return {"status": shelf_exists, "index": shelf_index};
                }

                var groups = [];
                angular.forEach($scope.book_shelves, function(value){
                    var shelf_exists = _shelf_exists(value.shelf, groups);
                    if(shelf_exists.status){
                        groups[shelf_exists.index].books.push(value.books[0]);
                    }
                    else{
                        groups.push(value);
                    }
                });
                $scope.book_shelves = groups;
            }

            var _init = function(){
                $scope.shelf_loading = true;
                _get_books_grouped_by_shelves();
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/room/_left_panel.html'
    };
}]);