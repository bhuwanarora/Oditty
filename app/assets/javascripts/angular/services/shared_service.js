websiteApp.service('sharedService', ['$timeout', '$rootScope', 'widgetService', 'websiteService', 'stropheService', '$location', 'RecommendationUIConstants', function ($timeout, $rootScope, widgetService, websiteService, stropheService, $location, RecommendationUIConstants) {
    this.is_logged_in = function($scope){
        websiteService.get_user().then(function(data){
            if(data["logged_in"]){
                $rootScope.user.logged = true;
                $rootScope.user.id = data["id"];
                websiteService.get_user_details().then(function(data){
                    angular.extend($rootScope.user, data);
                });
            // stropheService.start_connection();
            }
        });
    }

    this.get_user = function(reader_id){
        websiteService.get_user_details(reader_id).then(function(data){
            $rootScope.reader = angular.extend($rootScope.reader, data);
            if(angular.isDefined($rootScope.reader.gender)){
                if($rootScope.reader.gender == "Male"){
                    $rootScope.reader.gender_prefix = "His";
                    $rootScope.reader.gender_suffix = "him";
                }
                else{
                    $rootScope.reader.gender_prefix = "Her";
                    $rootScope.reader.gender_suffix = "her";
                }
            }
        });
    }

    this.logout = function(){
        websiteService.logout().then(function(){
            $rootScope.user = {'books': {'bookmarked':[], 'read': []},
                'authors': {'bookmarked': [], 'follow': []},
                'readers': {'follow': []},
                'logged': false};
            $location.path("/search");
        });
    }

    this.bookmark_book = function($scope, index, event, label_name){
        var atleast_one_label_checked = false;
        var _basic_bookmark = function(){
            var labels = $scope.book.labels;
            $scope.book.labels[index]["checked"] = !$scope.book.labels[index]["checked"];
            if($scope.book.labels[index]["checked"]){
                //add to notifications
                var name = $rootScope.user.email;
                if(angular.isDefined($rootScope.user.name)){
                    name = $rootScope.user.name;
                }
                var message = "<span>saved&nbsp;</span><span class='site_color'>"+$scope.book.title+"</span><span> to '"+$scope.book.labels[index]["name"]+"'</span>";
            
                var notification = {
                    "thumb":$rootScope.user.thumb,
                    "message":message,
                    "timestamp":new Date().getTime(),
                    "book":{
                        "id":$scope.book.id,
                        "title":$scope.book.title,
                        "author_name":$scope.book.author_name,
                        "isbn":$scope.book.isbn
                    },
                    "user":{
                        "id":$rootScope.user.id,
                        "name":name
                    }
                }
                $rootScope.user.bookmark_count = $rootScope.user.bookmark_count + 1;
                $scope.$emit('gamifyCount', 10, true);
                $scope.$emit('addToNotifications', notification);

                var message = "SUCCESS-Added to "+$scope.book.labels[index]["name"]+" <span class='icon-tags'></span>.";
            }
            else{
                $rootScope.user.bookmark_count = $rootScope.user.bookmark_count - 1;
                $scope.$emit('gamifyCount', 10, false);
                var message = "SUCCESS-Removed from "+$scope.book.labels[index]["name"]+" <span class='icon-tags'></span>.";
            }

            if($scope.book.labels[index]["name"] == RecommendationUIConstants.MarkAsRead){
                this.mark_as_read($scope, $scope.book, event);
            }

            var timeout_event = notify($rootScope, message, $timeout);
            var params = {"id": $scope.book.id, 
                            "type": "BOOK",
                            "name": $scope.book.labels[index]["name"],
                            "data": $scope.book.labels[index]["checked"]};
            for(var i=0; i<labels.length; i++){
                if(labels[i]["checked"]){
                    atleast_one_label_checked = true;
                    break;
                }
            }
            if(atleast_one_label_checked){
                $scope.book.bookmark_status = 1;
            }
            else{
                $scope.book.bookmark_status = 0; 
            }
            return params;
        }

        _influential_book_bookmarked = function(){
            var book = index;
            if(!book.status){
                //add to notifications
                var name = $rootScope.user.email;
                if(angular.isDefined($rootScope.user.name)){
                    name = $rootScope.user.name;
                }
                var message = "<span>saved&nbsp;</span><span class='site_color'>"+book.title+"</span><span> to '"+label_name+"'</span>";
            
                var notification = {
                    "thumb":$rootScope.user.thumb,
                    "message":message,
                    "timestamp":new Date().getTime(),
                    "book":{
                        "id":book.id,
                        "title":book.title,
                        "author_name":book.author_name,
                        "isbn":book.isbn
                    },
                    "user":{
                        "id":$rootScope.user.id,
                        "name":name
                    }
                }
                $rootScope.user.bookmark_count = $rootScope.user.bookmark_count + 1;
                $scope.$emit('gamifyCount', 10, true);
                $scope.$emit('addToNotifications', notification);

                var message = "SUCCESS-Added to "+label_name+" <span class='icon-tags'></span>.";
            }
            else{
                $rootScope.user.bookmark_count = $rootScope.user.bookmark_count - 1;
                $scope.$emit('gamifyCount', 10, false);
                var message = "SUCCESS-Removed from "+label_name+" <span class='icon-tags'></span>.";
            }
            var timeout_event = notify($rootScope, message, $timeout);
            var params = {"id": book.id, 
                            "type": "BOOK",
                            "name": label_name,
                            "data": !book.status};
            return params;
        }
      
        if(angular.isUndefined(label_name)){
            var params = _basic_bookmark();
        }
        else{
            var params = _influential_book_bookmarked();
        }

        widgetService.bookmark(params);
        $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
        });
        
    }

    this.mark_as_read = function($scope, book, event){
        var book_title = book.title;
        var author_name = book.author_name;

        var _mark_as_read = function(){
            if($rootScope.user.name){
                var name = $rootScope.user.name;
            }
            else{
                var name = $rootScope.user.email; 
            }
            var message = "<span> added </span><span class='site_color'>"+book_title+"</span>&nbsp;to&nbsp;<span class='icon-books'></span><span>&nbsp;books read.</span>";
            var notification = {
                "thumb":$rootScope.user.thumb,
                "message":message,
                "timestamp":new Date().getTime(),
                "book":{
                    "id":book.id,
                    "title":book_title,
                    "author_name":author_name,
                    "isbn":book.isbn
                },
                "user":{
                    "id":$rootScope.user.id,
                    "name":name
                }
            }
            $rootScope.$broadcast('gamifyCount', 5, true);
            $rootScope.user.book_read_count = $rootScope.user.book_read_count + 1;
            $scope.$emit('addToNotifications', notification);

            book.status = true;
            $rootScope.user.books['read'].push(book);
            message = "SUCCESS-Added to <span class='icon-books'></span> Books Read. ";
            return message;
        }

        var _mark_as_unread = function(){
            book.status = false;
            var index = $rootScope.user.books['read'].indexOf(book);
            $rootScope.user.books['read'].splice(index, 1);
            var message = "SUCCESS-Removed from <span class='icon-books'></span> Books Read. ";
            $rootScope.user.book_read_count = $rootScope.user.book_read_count - 1;
            var points = 5;
            var remove_rating = angular.isDefined(book.user_rating) && book.user_rating != null;
            var remove_read_time = angular.isDefined(book.time_index) && book.time_index != null;
            if(remove_rating){
                delete book.user_rating;
                points = points + 10;
            }
            if(remove_read_time){
                delete book.time_index;
                points = points + 10;
            }
            $rootScope.$broadcast('gamifyCount', points, false);
            return message;
        }

        if(book.status){
            var message = _mark_as_unread();
        }
        else{
            var message = _mark_as_read();
        }
        widgetService.mark_as_read(book.id, book.status);

        var timeout_event = notify($rootScope, message, $timeout);
        $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
        });

        event.stopPropagation();
    };

}]);