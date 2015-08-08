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
                userService.get_communities($scope.userId).then(function(data){
                    $scope.rooms = data;
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/rooms/show.html'
    };
}]);