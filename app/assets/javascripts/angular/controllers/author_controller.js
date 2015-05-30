homeApp.controller('authorController', ["$scope", "$location", "$mdSidenav", 'authorService', '$mdDialog', 'scroller', 'ColorConstants', '$filter', '$sce', '$rootScope', "scroller", "WebsiteUIConstants", function($scope, $location, $mdSidenav, authorService, $mdDialog, scroller, ColorConstants, $filter, $sce, $rootScope, scroller, WebsiteUIConstants){

    $scope.toggle_follow = function(){
        $scope.author.status = !$scope.author.status;
        authorService.follow($scope.author.id, $scope.author.status);
    }

    $scope.keypress_scroll = function(event){
        if(event.keyCode == WebsiteUIConstants.KeyDown){
            $scope.active_index = $scope.next_block($scope.active_index);
        }
        else if(event.keyCode == WebsiteUIConstants.KeyUp){
            $scope.active_index = $scope.previous_block($scope.active_index);
        }
    }

    $scope.next_block = function(index){
        var length = $scope.author.books.length;
        if(index == (length-1)){
            index = -1;
        }
        index = index + 1;
        $scope.scroll_to_element(index);
        return index;
    }

    $scope.scroll_to_element = function(index){
        var offset = 0;
        var duration = 2000;
        var id = $scope.author.books[index].id;
        var someElement = angular.element(document.getElementById(id));
        var easeInQuad = function(t){ 
            return t*t;
        };
        scroller.scrollToElement(someElement, offset, duration);
    }

    $scope.previous_block = function(index){
        var length = $scope.author.books.length;
        if(index == 0){
            index = length;
        }
        index = index - 1;
        $scope.scroll_to_element(index);
        return index;
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

    $scope.get_books = function(id){
        if(angular.isUndefined($scope.info.loading) || !$scope.info.loading){
            var _get_wiki_without_google_redirect = function(wiki_url){
                $scope.author.wiki_url = wiki_url.substring(wiki_url.lastIndexOf("?q=")+3, wiki_url.lastIndexOf("&sa"));
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
                    var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                    var color = ColorConstants.value[random_int];
                    $scope.custom_style = {'background-color': color};
                    $scope.custom_color = color;
                }
                else{
                    angular.forEach($scope.author.books, function(value, index){
                        var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                        var url = $filter('large_thumb')(value);
                        var color = ColorConstants.value[random_int];
                        if(url != ""){
                            var json =  {"color": color, "custom_style": {"background-image": "url('"+url+"')"}};
                        }
                        else{
                            var json =  {"color": color, "custom_style": {"background-color": color}};
                        }
                        $scope.author.books[index] = angular.extend($scope.author.books[index], json);
                    });
                }
                $scope.info.loading = false;
            });
        }
    }

    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var id = regex.exec($location.absUrl())[2];
        if(angular.isUndefined($scope.info)){
            $scope.info = {};
        }

        $scope.active_index = 0;
        $scope.get_books(id);
    }());

}]);