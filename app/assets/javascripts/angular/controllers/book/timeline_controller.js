homeApp.controller('timelineController', ["$scope", "$rootScope", "bookService", '$location', 'userService', function($scope, $rootScope, bookService, $location, userService){

    $scope.get_feed = function(){
        if(angular.isUndefined($scope.book_feed)){
            $scope.book_feed = [];
        }
        var skip_count = $scope.book_feed.length;

        var _get_message = function(value){
            var message = ""
            switch(value.label){
                case "BookmarkNode":
                    message = "Added to "+value.node.key;
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

        var _group_feed = function(){
            var grouped_feed = [];
            var _user_exists = function(grouped_feed, user_id){
                var book_exists = false;
                var feed_index = 0;
                if(grouped_feed.length > 0){
                    angular.forEach(grouped_feed, function(value, index){
                        if(angular.isDefined(value.user)){
                            if(value.user.id == user_id){
                                book_exists = true;
                                feed_index = index
                            }
                        }
                    });
                }
                return {"status": book_exists, "index": feed_index};
            }

            angular.forEach($scope.book_feed, function(value){
                if(angular.isDefined(value.user)){
                    var user = _user_exists(grouped_feed, value.user.id);
                    if(user.status){
                        delete value.user;
                        grouped_feed[user.index].data.push(value)
                    }
                    else{
                        if(angular.isDefined(value.user)){
                            user = {"user": value.user};
                            delete value.user;
                            value = angular.extend(user, {"data": [value]});
                        }
                        this.push(value);
                    }
                }
                else{
                    this.push(value);
                }
            }, grouped_feed);
            $scope.book_feed = grouped_feed;
        }

        bookService.get_feed($scope.book_id, skip_count).then(function(data){
            $scope.book_feed = data;
            _group_feed();
            angular.forEach($scope.book_feed, function(value){
                if(angular.isDefined(value.user)){
                    userService.get_user_details(value.user.id).then(function(data){
                        value.user = angular.extend(value.user, data);
                        angular.forEach(value.data, function(feed_data){
                            var message = _get_message(feed_data);
                            feed_data = angular.extend(feed_data, {"message": message});
                        })
                    });
                }
                else{
                    var message = _get_message(value);
                    var feed_data = angular.extend(value, {"message": message});
                    value.data = [feed_data];
                }
            });
            // $scope.book_feed = data;
        });
    }
    
    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parsed = regex.exec($location.absUrl());
        if(url_parsed != null){
            var id = url_parsed[2];
        }
        if(angular.isDefined(id)){
            var book_id = id;   
        }
        else{
            var book_id = $rootScope.active_book.book_id;
        }
        $scope.book_id = book_id;
        $scope.get_feed();
    }());
}]);