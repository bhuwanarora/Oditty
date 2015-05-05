homeApp.controller('authorController', ["$scope", "$location", "$mdSidenav", 'authorService', '$mdDialog', 'scroller', 'ColorConstants', '$filter', '$sce', '$rootScope', "scroller", function($scope, $location, $mdSidenav, authorService, $mdDialog, scroller, ColorConstants, $filter, $sce, $rootScope, scroller){

    $scope.show_buy_dialog = function(event, book){
        $rootScope.active_book = book;
        $mdDialog.show({
            templateUrl: 'assets/angular/html/author/buy.html',
            targetEvent: event
        });
        event.stopPropagation();
    }

    $scope.next_block = function(index){
        var length = $scope.author.books.length;
        if(index == (length-1)){
            index = -1;
        }
        index = index + 1;
        $scope.scroll_to_element(index);
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

    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var id = regex.exec($location.absUrl())[2];
        var _get_wiki_without_google_redirect = function(wiki_url){
            $scope.author.wiki_url = wiki_url.substring(wiki_url.lastIndexOf("?q=")+3, wiki_url.lastIndexOf("&sa"));
        }

        $scope.active_index = 0;
        $scope.info.loading = true;
        authorService.get_details(id).then(function(data){
            $scope.author = data;
            if(data.wiki_url != null){
                _get_wiki_without_google_redirect(data.wiki_url);
                $scope.author.wiki_url = $sce.trustAsResourceUrl($scope.author.wiki_url+"?action=render");
            }
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
            $scope.custom_color = {'background-color': $scope.author.books[0].color};
            $scope.info.loading = false;
        });
    }());

}]);