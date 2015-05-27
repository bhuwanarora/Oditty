homeApp.controller('newsController', ["$scope", "$mdSidenav", 'newsService', '$location', '$rootScope', '$mdDialog', 'ColorConstants', '$timeout', function($scope, $mdSidenav, newsService, $location, $rootScope, $mdDialog, ColorConstants, $timeout){
    $scope.toggle_details = function(){
        $mdSidenav('right').toggle();
        // $scope.get_detailed_community_info();
    };

    $scope.get_detailed_community_info = function(){
        newsService.get_detailed_community_info($scope.active_tag.id).then(function(data){
            $scope.active_tag = angular.extend($scope.active_tag, data);
            var follow_node = $scope.active_tag.follow_node;
            if(angular.isDefined(follow_node) && (follow_node != null)){
                $scope.active_tag.status = true;
            }
            $scope._check_users();
        });
    }


    $scope.toggle_follow = function(){
        $scope.active_tag.status = !$scope.active_tag.status;
        newsService.follow($scope.active_tag.id, $scope.active_tag.status);
    }

    $scope.show_book_dialog = function(book, event){
        $rootScope.active_book = book;
        $rootScope.active_book.show_info_only = true;
        $mdDialog.show({
            templateUrl: '/assets/angular/html/news/book.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: event,
            clickOutsideToClose: true
        });
        event.stopPropagation();
    }

    $scope.refresh_data = function(active_item){
        $scope.active_tag = active_item;
        $scope.info.loading = true;
        newsService.get_community_details($scope.active_tag.id).then(function(data){
            $scope.active_tag = data[0].most_important_tag[0];
            angular.forEach($scope.active_tag.books, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var color = ColorConstants.value[random_int];
                value.color = color;
            });
            $scope.info.loading = false;
        });

        if($scope.info.circles){
        }
        $scope.get_detailed_community_info();
    }

    $scope._check_users = function(){
        if($scope.active_tag.users.length == 1){
            var first_name = $scope.active_tag.users[0].first_name;
            if(angular.isUndefined(first_name) || first_name == null){
                $scope.active_tag.users = [];
            }
        }
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

        $scope.info.active_news_id = news_id;

        $scope.newsTags = [];
        $scope.info.active_tag = $scope.active_tag;
        $scope.info.loading = true;
        var active_community = getCookie("active_community");
        newsService.get_news_info(news_id, active_community).then(function(data){
            $scope.info.loading = false;
            data = data[0];
            $scope.active_tag = data.most_important_tag[0];
            var most_important_tag = {"name": $scope.active_tag.name, 
                                "view_count": $scope.active_tag.view_count, 
                                "id": $scope.active_tag.id, 
                                "image_url": $scope.active_tag.image_url};
            $scope.newsTags.push(most_important_tag);
            data.other_tags.shift();
            $scope.newsTags = $scope.newsTags.concat(data.other_tags);
            angular.forEach($scope.newsTags, function(value){
                if($scope.active_tag.id == value.id){
                    value.view_count = Math.floor((Math.random() * 1000) + 500);
                }
                else{
                    value.view_count = Math.floor((Math.random() * 100) + 50);
                }
                deleteCookie("active_community");
            });
            angular.forEach($scope.active_tag.books, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var color = ColorConstants.value[random_int];
                value.color = color;
            });

            $scope._check_users();

            $timeout(function(){
                $scope.get_detailed_community_info();
            }, 100);
        });


    }());

}]);