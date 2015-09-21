homeApp.controller('searchController', ["$scope", "searchService", "$location", function($scope, searchService, $location){

    $scope.query_search = function(search_text){
        if(search_text.length > 2){
            $scope.info.loading = true;
            params = {"q": search_text, "count": 4};
            searchService.raw(params).then(function(data){
                delete $scope.info.search_results;
                $scope.info.loading = false;
                $scope.did_you_mean = false;
                angular.forEach(data, function(value){
                    if(value.fuzzy){
                        $scope.did_you_mean = true;
                    }
                    if(value.first_name){
                        value.name = value.first_name + " " + value.last_name;
                    }
                });
                
                $scope.info.search_results = data;
                if($scope.did_you_mean){
                    var json = {"name": "Did you mean", "labels": []};
                    $scope.info.search_results.splice(0, 0, json);
                }
                if(data.length > 0){
                    var json = {"name": "Show all results", "show_all": true, "labels": [], "search_text": search_text};
                    $scope.info.search_results.push(json);
                }
            });
        }
        else if(angular.isUndefined(search_text) || (search_text == "")){
            if(angular.isUndefined($scope.top_searches)){
                searchService.get_top_results().then(function(data){
                    $scope.info.search_results = data;
                    $scope.top_searches = data;
                });
            }
            else{
                $scope.info.search_results = $scope.top_searches;
            }
        }
        else{
            $scope.info.search_results = [];
        }
    }

    $scope.get_default_results = function(search_text, event){
        if(angular.isUndefined(search_text) || (search_text == "")){
            if(angular.isUndefined($scope.top_searches)){
                searchService.get_top_results().then(function(data){
                    $scope.info.search_results = data;
                    $scope.top_searches = data;
                });
            }
            else{
                $scope.info.search_results = $scope.top_searches;
            }
        }
        event.stopPropagation();
    }

    $scope.on_select = function(item){
        delete $scope.info.search_results;
        if(angular.isDefined(item)){
            var book_label = item.labels.indexOf("Book") >= 0;
            var author_label = item.labels.indexOf("Author") >= 0;
            var user_label = item.labels == "User";
            var blog_label = item.labels == "Blog";
            var news_label = item.labels == "News";
            var community_label = item.labels == "Community";
            var output = ""
            if(book_label){
                output = "/book?q="+item.id;
            }
            else if(author_label){
                output = "/author?q="+item.id;
            }
            else if(user_label){
                output = "/profile?q="+item.id;
            }
            else if(blog_label){
                output = item.blog_url;
            }
            else if(news_label){
                output = "/news?q="+item.id;
            }
            else if(community_label){
                output = "/room?q="+item.id;
            }
            else if(item.show_all){
              output = "/search?q="+item.search_text;
            }

            if(output != ""){
                window.location.href = output;
            }
        }
    }

    var _init = (function(){
        console.log("searchController");
        $scope.info.mobile_search = true;
        $scope.info.search_results = [];
        $scope.info.search_ready = true;
    }());
}]);