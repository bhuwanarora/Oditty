homeApp.controller('communityController', ["$scope", "$mdSidenav", 'communityService', '$location', '$rootScope', '$mdDialog', function($scope, $mdSidenav, communityService, $location, $rootScope, $mdDialog){
    $scope.toggle_details = function(){
        $mdSidenav('right').toggle();
        $scope.show_details = true;
        var url = "http://blog.readersdoor.com/2015/03/08/the-art-of-storytelling/";
        communityService.get_metadata(url).then(function(data){
            $scope.news_info = data;
        });
    };

    $scope.show_book_dialog = function(book, event){
        $rootScope.active_book = book;
        $rootScope.active_book.show_info_only = true;
        $mdDialog.show({
            templateUrl: '/assets/angular/html/community/book.html',
            targetEvent: event,
        });
        event.stopPropagation();
    }

    $scope.refresh_data = function(active_item){
        $scope.active_tag = active_item;
        communityService.get_community_details($scope.active_tag.id).then(function(data){
            $scope.active_tag = angular.extend($scope.active_tag, data);
        });
    }

    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parsed = regex.exec($location.absUrl());
        if(url_parsed != null){
            var id = url_parsed[2];
        }

        if(angular.isDefined(id)){
            var news_id = id;
        }
        else{
            var news_id = $rootScope.active_community.news_id;
        }

        $scope.show_details = false;

        $scope.newsTags = [];
        $scope.info.active_tag = $scope.active_tag;

        communityService.get_news_info(news_id).then(function(data){
            // $scope.newsTags = [
            //     {name: "MODI", view_count: "236"},
            //     {name: "KEJRIWAL", view_count: "382"},
            //     {name: "BEDI", view_count: "170"},
            //     {name: "CONGRESS", view_count: "123"},
            //     {name: "ELECTIONS", view_count: "12"},
            //     {name: "DELHI", view_count: "170"}
            // ]
            data = data[0]
            $scope.active_tag = data.most_important_tag[0];
            var most_important_tag = {"name": $scope.active_tag.name, "view_count": $scope.active_tag.view_count, "id": $scope.active_tag.id};
            $scope.newsTags.push(most_important_tag);
            $scope.newsTags = $scope.newsTags.concat(data.other_tags);
            angular.forEach($scope.newsTags, function(value){
                value.view_count = 100;
            });
        });

        communityService.get_chronological_news(news_id).then(function(data){
            $scope.news = data;
        });
    }());

}]);