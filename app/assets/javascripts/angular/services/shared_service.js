websiteApp.service('sharedService', ['$timeout', '$rootScope', 'widgetService', 'websiteService', 'stropheService', '$location', 'RecommendationUIConstants', '$cookieStore', 'recommendationService', function ($timeout, $rootScope, widgetService, websiteService, stropheService, $location, RecommendationUIConstants, $cookieStore, recommendationService){
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

    this.set_friends = function(){
        var length = angular.isDefined($rootScope.user.friends) ? $rootScope.user.friends.length : 0;
        var count = 12;
        if(angular.isUndefined($rootScope.user.friends) || !$rootScope.user.all_friends_shown){
            var _set_friends_for = function(user_array, data){
                angular.forEach(data, function(value){
                    if(value[2] == null){
                        thumb = "/assets/profile_pic.jpeg"
                    }
                    else{
                        thumb = value[2];
                    }
                    
                    var json = {"id": value[0], 
                                "name": value[1], 
                                "thumb": thumb, 
                                "init_book_read_count": value[3],
                                "total_count": value[4],
                                "book_read_count": value[5],
                                "bookmark_count": value[6],
                                "fav_categories": value[7].join(", ")};
                    this.push(json);
                }, user_array);
            }
            widgetService.get_friends($rootScope.user.id, count, length).then(function(data){
                if(count > data.length){
                    $rootScope.user.all_friends_shown = true;
                }
                if(angular.isUndefined($rootScope.user.friends)){
                    $rootScope.user.friends = [];
                }
                _set_friends_for($rootScope.user.friends, data);
            });
        }
    }

    this.set_labels = function(user_id){
        if(angular.isUndefined(user_id) || user_id == null){
            user_id = $rootScope.user.id;
        }
        recommendationService.get_labels(user_id).then(function(data){
            $rootScope.labels = [];
            if(angular.isArray(data) && data.length > 0){
                angular.forEach(data, function(value){
                    if(value[0]!=null){
                        this.push({"name": value[0].replace("\"", ""), "id": value[1]});
                    }
                }, $rootScope.labels);
            }
        });
    }

    this.get_trends = function(){
        if(angular.isUndefined($rootScope.trending_feed)){
            $rootScope.trending_feed = [];
            var skip_count = 0;
        }
        else{
            var skip_count = $rootScope.trending_feed.length;
        }
        websiteService.get_trending_topics(skip_count).then(function(data){
            angular.forEach(data, function(value){
                var json = {"name": value[0], "id": value[1], "message": value[2], "url": value[3], "title":value[4], "thumb": value[7], "large_image": value[5], "keywords": value[8], "timestamp": value[9]};
                this.splice(0, 0, json);
            }, $rootScope.trending_feed);
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
            $cookieStore.remove('logged');
            $location.path("/search");
        });
    }

    this.bookmark_book = function($scope, index, event, label_name){
        if(angular.isUndefined($scope.book)){
            var book = $scope.selected_book;
        }
        else{
            var book = $scope.book;
        }
        var atleast_one_label_checked = false;
        var _basic_bookmark = function(){
            var labels = book.labels;
            book.labels[index]["checked"] = !book.labels[index]["checked"];
            if(book.labels[index]["checked"]){
                //add to notifications
                var name = $rootScope.user.email;
                if(angular.isDefined($rootScope.user.name)){
                    name = $rootScope.user.name;
                }
                var message = "<span>saved&nbsp;</span><span class='site_color'>"+book.title+"</span><span> to '"+book.labels[index]["name"]+"'</span>";
            
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

                var message = "SUCCESS-Added to "+book.labels[index]["name"]+" <span class='icon-tags'></span>.";
            }
            else{
                $rootScope.user.bookmark_count = $rootScope.user.bookmark_count - 1;
                $scope.$emit('gamifyCount', 10, false);
                var message = "SUCCESS-Removed from "+book.labels[index]["name"]+" <span class='icon-tags'></span>.";
            }

            if(book.labels[index]["name"] == RecommendationUIConstants.MarkAsRead){
                this.mark_as_read($scope, book, event);
            }

            var timeout_event = notify($rootScope, message, $timeout);
            var params = {"id": book.id, 
                            "type": "BOOK",
                            "name": book.labels[index]["name"],
                            "data": book.labels[index]["checked"]};
            for(var i=0; i<labels.length; i++){
                if(labels[i]["checked"]){
                    atleast_one_label_checked = true;
                    break;
                }
            }
            if(atleast_one_label_checked){
                book.bookmark_status = 1;
            }
            else{
                book.bookmark_status = 0; 
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