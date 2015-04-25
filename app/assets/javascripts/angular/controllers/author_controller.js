homeApp.controller('authorController', ["$scope", "$location", "$mdSidenav", 'authorService', '$mdDialog', 'scroller', 'ColorConstants', '$filter', '$sce', function($scope, $location, $mdSidenav, authorService, $mdDialog, scroller, ColorConstants, $filter, $sce){

    $scope.show_buy_dialog = function(event){
        $mdDialog.show({
            templateUrl: 'assets/angular/html/author/buy.html',
            targetEvent: event,
        });
        event.stopPropagation();
    }

    $scope.close_dialog = function(){
        $mdDialog.hide();
    }

    $scope.next_block = function(){

    }

    $scope.previous_block = function(){

    }

    $scope.scroll_wiki = function(){

    }

    $scope.show_authors_nav = function(event){
        $mdSidenav('authors_detail_sidenav').toggle();
        event.stopPropagation();
    }

    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var id = regex.exec($location.absUrl())[2];

        authorService.get_details(id).then(function(data){
            $scope.author = data;
            if(data.wiki_url != null){
                $scope.author.wiki_url = data.wiki_url.substring(data.wiki_url.lastIndexOf("?q=")+3,data.wiki_url.lastIndexOf("&sa"));
                $scope.wiki_url = $sce.trustAsResourceUrl($scope.author.wiki_url)+"?action=render";
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
        });
    }());

}]);