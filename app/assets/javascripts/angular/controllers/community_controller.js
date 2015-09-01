homeApp.controller('communityController', ["$scope", 'newsService', '$rootScope', 'ColorConstants', '$timeout', '$location', '$mdDialog', 'userService', '$mdSidenav', 'sharedService', '$sce', 'bookService', '$mdBottomSheet', function($scope, newsService, $rootScope, ColorConstants, $timeout, $location, $mdDialog, userService, $mdSidenav, sharedService, $sce, bookService, $mdBottomSheet){
    
    $scope.get_detailed_community_info = function(){
        if(angular.isDefined($scope.active_tag)){
            newsService.get_detailed_community_info($scope.active_tag.id).then(function(data){
                $scope.active_tag = angular.extend($scope.active_tag, data);
                var follow_node = $scope.active_tag.follows_node;
                if($scope.active_tag.wiki_url && $scope.active_tag.wiki_url != null){
                    $scope.active_tag.wiki_url = $sce.trustAsResourceUrl($scope.active_tag.wiki_url+"?action=render");
                }
                if(angular.isDefined(follow_node) && (follow_node != null)){
                    $scope.active_tag.status = true;
                }
            });
        }
    }

    $scope.hide_bottomsheet = function($event){
        $mdBottomSheet.hide();
    }

    $scope.show_todo_list = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/todo/room.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: event
        });
    }

    $scope.show_more_books = function(){
        var books_remaining = $scope.active_tag.books.length - $scope.limit_count;
        if(books_remaining > 8){
            $scope.limit_count = $scope.limit_count + 8;
        }
        else{
            $scope.hide_show_more = true;
            $scope.limit_count = $scope.limit_count + books_remaining;
        }
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
            }, $scope.popular_books);
        });
    }

    $scope.add_book = function(book){
        var book_id = book.id || book.book_id;
        userService.add_book($scope.active_tag.id, book_id);
        window.location.reload();
    }

    $scope.update_room_news_visit= function(){
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.room.news){
                    deleteCookie("todo");
                    userService.update_todo_key('room/news');
                }
            }
        }
        _handle_todo_update();
    }

    $scope.goto_news_page = function(id, community_id){
        userService.news_visited(id);
        deleteCookie("active_community");
        if(angular.isDefined(community_id)){
            setCookie("active_community", community_id, 1)
        }
        window.location.href = "/news?q="+id;
    }

    $scope.get_active_class = function(path){
        var is_init = $location.path().substr(1, path.length+1) == "" && (path == "room/books");
        if(($location.path().substr(1, path.length+1) == path) || is_init){
            return "bold red_color";
        } else {
            return "grey_color";
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

    $scope.toggle_follow = function(){
        var unauthenticated_user = (getCookie("logged") == "") || (getCookie("logged") == null);
        if(unauthenticated_user){
            $mdSidenav('signup').toggle();
        }
        else{
            $scope.active_tag.status = !$scope.active_tag.status;
            newsService.follow($scope.active_tag.id, $scope.active_tag.status);
        }
    }

    $scope.refresh_data = function(){
        newsService.get_community_details($scope.active_tag.id).then(function(data){
            if(angular.isDefined(data[0])){
                $scope.active_tag = angular.extend($scope.active_tag, data[0].most_important_tag[0]);
                $scope.info.loading = false;
            }
            else{
                $scope.info.loading = false;
            }
        });
    }

    $scope.get_community_news = function(){
        var is_news_tab = $location.path() == "/room/news";
        if(angular.isDefined($scope.active_tag) && is_news_tab){
            var id = $scope.active_tag.id;
            var skip_count = $scope.active_tag.news.length;
            if(!$scope.info.loading){
                $scope.info.loading = true;
                newsService.get_community_news(id, skip_count).then(function(data){
                    if(data != null && data.length > 0){
                        data = data[0];
                        $scope.active_tag.news = $scope.active_tag.news.concat(data.news);
                    }
                    $scope.info.loading = false;
                });
            }
        }
    }

    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parsed = regex.exec($location.absUrl());
        if(url_parsed != null){
            $scope.info.loading = true;
            var id = url_parsed[2];
            $scope.active_tag = {"id": id};
            $scope.get_detailed_community_info();
            $timeout(function(){
                $scope.refresh_data();
            }, 2000);
        }
        else{
            alert("Bad url");
        }
        if(angular.isUndefined($scope.popular_books)){
            $scope.popular_books = [];
        }
        $scope.is_room = true;

        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.rooms.visit){
                    deleteCookie("todo");
                    userService.update_todo_key('rooms/visit');
                }
            }
        }

        _handle_todo_update();

        $scope.limit_count = 6;
    }());

}]);