homeApp.controller('communityController', ["$scope", "$mdSidenav", 'communityService', '$location', '$rootScope', '$mdDialog', 'ColorConstants', function($scope, $mdSidenav, communityService, $location, $rootScope, $mdDialog, ColorConstants){
    $scope.toggle_details = function(){
        $mdSidenav('right').toggle();
        $scope.show_details = true;
        communityService.get_detailed_community_info($scope.active_tag.id).then(function(data){
            $scope.active_tag = angular.extend($scope.active_tag, data);
            angular.forEach(data.news, function(value){
                communityService.get_metadata(value.news_url).then(function(news_data){
                    value = angular.extend(value, news_data);
                });
            });
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
            $scope.active_tag = data[0].most_important_tag[0];
            angular.forEach($scope.active_tag.books, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var color = ColorConstants.value[random_int];
                value.color = color;
            });
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
            data = data[0];
            $scope.active_tag = data.most_important_tag[0];
            var most_important_tag = {"name": $scope.active_tag.name, 
                                "view_count": $scope.active_tag.view_count, 
                                "id": $scope.active_tag.id, 
                                "image_url": $scope.active_tag.image_url};
            $scope.newsTags.push(most_important_tag);
            $scope.newsTags = $scope.newsTags.concat(data.other_tags);
            angular.forEach($scope.newsTags, function(value){
                value.view_count = 100;
            });
            angular.forEach($scope.active_tag.books, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var color = ColorConstants.value[random_int];
                value.color = color;
            });
        });

        communityService.get_chronological_news(news_id).then(function(data){
            $scope.news = data;
        });
    }());

}]);