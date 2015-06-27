homeApp.controller('communityController', ["$scope", 'newsService', '$rootScope', 'ColorConstants', '$timeout', '$location', '$mdDialog', 'userService', '$mdSidenav', 'sharedService', function($scope, newsService, $rootScope, ColorConstants, $timeout, $location, $mdDialog, userService, $mdSidenav, sharedService){
    $scope.get_detailed_community_info = function(){
        newsService.get_detailed_community_info($scope.active_tag.id).then(function(data){
            $scope.active_tag = angular.extend($scope.active_tag, data);
            var follow_node = $scope.active_tag.follow_node;
            if(angular.isDefined(follow_node) && (follow_node != null)){
                $scope.active_tag.status = true;
            }
        });
    }

    $scope.goto_news_page = function(id, community_id){
        userService.news_visited(id);
        deleteCookie("active_community");
        if(angular.isDefined(community_id)){
            setCookie("active_community", community_id, 1)
        }
        window.location.href = "/news?q="+id;
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
                angular.forEach($scope.active_tag.books, function(value){
                    var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                    var color = ColorConstants.value[random_int];
                    value.color = color;
                    $scope.info.loading = false;
                });
            }
            else{
                $scope.info.loading = false;
            }
        });
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

    }());

}]);