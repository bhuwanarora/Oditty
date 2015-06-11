homeApp.controller('timelineController', ["$scope", "$rootScope", "bookService", '$location', 'userService', '$mdDialog', '$mdSidenav', '$timeout', function($scope, $rootScope, bookService, $location, userService, $mdDialog, $mdSidenav, $timeout){

    var _unauthenticated_user = function(){
        return ((getCookie("logged") == "") || (getCookie("logged") == null));
    }

    $scope.write_reading_journey_for = function(){
        if(_unauthenticated_user()){
            $mdSidenav('signup').toggle();
        }
        else{
            // $scope.info.book = $rootScope.active_book;
            $scope.info.show_share = true;
            // $scope.info.show_book_share = true;
            $mdDialog.hide();
        }
    }

    $scope.get_feed = function(){
        $scope.book_loading = true;
        $scope.info.loading = true;
        if(angular.isUndefined($scope.book_feed)){
            $scope.book_feed = [];
        }
        var skip_count = $scope.book_feed.length;

        var _get_message = function(value){
            var message = ""
            switch(value.label){
                case "BookmarkNode":
                    if(value.node.key){
                        message = "Added to "+value.node.key;
                    }
                    else{
                        message = "Added "+$rootScope.active_book.title+" to a Shelf."
                    }
                    break;
                case "Listopia":
                    break;
                case "CommunityNode":
                    break;
                case "BlogNode":
                    break;
                case "StatusNode":
                    message = value.node.wrapper_content;
                    break;
                case "EndorseNode":
                    message = "Endorsed this book.";
                    break;
                case "RatingNode":
                    message = "Gave "+value.node.content + " rating on 10.";
            }
            return message;
        }

        bookService.get_feed($scope.book_id, skip_count).then(function(data){
            $scope.book_feed = data;
            angular.forEach($scope.book_feed, function(value){
                var message = _get_message(value);
                value = angular.extend(value, {"message": message});
                if(angular.isDefined(value.user)){
                    userService.get_user_details(value.user.id).then(function(data){
                        value.user = angular.extend(value.user, data);
                    });
                }
                else{
                    var message = _get_message(value);
                    value = angular.extend(value, {"message": message});
                }
            });
            $scope.book_loading = false;
            $scope.info.loading = false;
        });
    }
    
    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parsed = regex.exec($location.absUrl());
        if(url_parsed != null){
            var id = url_parsed[2];
        }

        if(angular.isDefined($rootScope.active_book)){
            var book_id = $rootScope.active_book.book_id || $rootScope.active_book.id;
        }
        else{
            var book_id = id;
        }
        $scope.book_id = book_id;
        var feed_timeout = $timeout(function(){
            $scope.get_feed();
        }, 100);

        $scope.$on('destroy', function(){
            $timeout.cancel(feed_timeout);
        });
    }());
}]);