homeApp.controller('authorController', ["$scope", "$location", "$mdSidenav", 'authorService', '$mdDialog', 'userService', '$filter', '$sce', '$rootScope', "WebsiteUIConstants", '$timeout', 'sharedService', '$mdBottomSheet', function($scope, $location, $mdSidenav, authorService, $mdDialog, userService, $filter, $sce, $rootScope, WebsiteUIConstants, $timeout, sharedService, $mdBottomSheet){

    $scope.toggle_follow = function(){
        if(angular.isDefined($scope.author.status)){
            var _handle_todo_update = function(){
                var todo = getCookie("todo");
                if(todo){
                    todo = JSON.parse(todo);
                    if(!todo.author.follow){
                        deleteCookie("todo");
                        userService.update_todo_key('author/follow');
                    }
                }
            }

            _handle_todo_update();
            $scope.author.status = !$scope.author.status;
            authorService.follow($scope.author.id, $scope.author.status);
        }
        else{
            $mdSidenav('signup').toggle();
        }
    }

    $scope.render_page = function(event){
        sharedService.render_page(event);
    }

    $scope.show_todo_list = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/todo/author.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: event
        });
    }


    $scope.show_more_books = function(){
        var books_remaining = $scope.author.books.length - $scope.limit_count;
        if(books_remaining > 8){
            $scope.limit_count = $scope.limit_count + 8;
        }
        else{
            $scope.hide_show_more = true;
            $scope.limit_count = $scope.limit_count + books_remaining;
        }
    }

    $scope.keypress_scroll = function(event){
        if(event.keyCode == WebsiteUIConstants.KeyDown){
            $scope.active_index = $scope.next_block($scope.active_index);
        }
        else if(event.keyCode == WebsiteUIConstants.KeyUp){
            $scope.active_index = $scope.previous_block($scope.active_index);
        }
    }

    $scope.show_book_dialog = function(book, event){
        sharedService.show_book_dialog($rootScope, $scope, book, event);
    }

    $scope.scroll_wiki = function(){

    }

    $scope.toggle_wiki = function(){
        $scope.show_author_wiki = !$scope.show_author_wiki;
    }

    $scope.show_authors_nav = function(event){
        $mdSidenav('authors_detail_sidenav').toggle();
        event.stopPropagation();
    }

    $scope.load_books = function(){
        if($scope.data.selectedIndex == 0){
            $scope.get_books();
        }
    }

    $scope.get_books = function(id){
        if(angular.isUndefined($scope.info.loading) || !$scope.info.loading){
            var _get_wiki_without_google_redirect = function(wiki_url){
                if(wiki_url.indexOf("google") < 0){
                    $scope.author.wiki_url = wiki_url;
                }
                else{
                    $scope.author.wiki_url = wiki_url.substring(wiki_url.lastIndexOf("?q=")+3, wiki_url.lastIndexOf("&sa"));
                }
            }

            if(angular.isUndefined(id)){
                id = $scope.author.id;
            }

            $scope.info.loading = true;
            if(angular.isDefined($scope.author) && angular.isDefined($scope.author.books)){
                var skip = $scope.author.books.length;
            }
            else{
                var skip = 0;
            }

            authorService.get_details(id, skip).then(function(data){
                if(skip == 0){
                    $scope.author = data;
                }
                else{
                    if(data.books.length == 1 && (data.books[0].title == null)){
                        data.books = [];
                    }
                    $scope.author.books = $scope.author.books.concat(data.books);
                }

                if(data.wiki_url != null && data.wiki_url != ""){
                    _get_wiki_without_google_redirect(data.wiki_url);
                    $scope.author.wiki_url = $sce.trustAsResourceUrl($scope.author.wiki_url+"?action=render");
                }
                if(($scope.author.books.length == 1) && ($scope.author.books[0].title == null)){
                    $scope.author.books = [];
                    // var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                    // var color = ColorConstants.value[random_int];
                    // $scope.custom_style = {'background-color': color};
                    // $scope.custom_color = color;
                }
                else{
                    angular.forEach($scope.author.books, function(value, index){
                        var url = $filter('large_thumb')(value);
                        if(url != ""){
                            var json =  {"custom_style": {"background-image": "url('"+url+"')"}};
                        }
                        else{
                            var json =  {"custom_style": {}};
                        }
                        $scope.author.books[index] = angular.extend($scope.author.books[index], json);
                    });
                }
                $scope.info.loading = false;
            });
        }
    }

    $scope.get_active_class = function(path){
        var is_init = $location.path().substr(1, path.length+1) == "" && (path == "books");
        if(($location.path().substr(1, path.length+1) == path) || is_init){
            return "bold red_color";
        } else {
            return "grey_color";
        }
    }

    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parsed = regex.exec($location.absUrl());
        if(url_parsed != null){
            var id = url_parsed[2];
        }
        else{
            var id = getCookie("id");
        }
        if(angular.isUndefined($scope.info)){
            $scope.info = {};
        }

        $scope.active_index = 0;
        var books_timeout = $timeout(function(){
            $scope.get_books(id);
        }, 100);
        $scope.$on('destroy', function(){
            $timeout.cancel(books_timeout);
        });

        $scope.limit_count = 8;

    }());

}]);