homeApp.controller('searchController', ["$scope", "searchService", "$location", function($scope, searchService, $location){

    $scope.query_search = function(search_text){
        if(search_text.length > 2){
            $scope.info.loading = true;
            params = {"q": search_text, "count": 4};
            searchService.raw(params).then(function(data){
                delete $scope.search_results;
                $scope.info.loading = false;
                $scope.did_you_mean = false;
                angular.forEach(data, function(value){
                    if(value.fuzzy){
                        $scope.did_you_mean = true;
                    }
                });
                
                $scope.search_results = data;
                if($scope.did_you_mean){
                    var json = {"name": "Did you mean", "labels": []};
                    $scope.search_results.splice(0, 0, json);
                }
                if(data.length > 0){
                    var json = {"name": "Show all results", "show_all": true, "labels": [], "search_text": search_text};
                    $scope.search_results.push(json);
                }
            });
        }
        else{
            $scope.search_results = [];
        }
    }

    $scope.on_select = function(item){
        delete $scope.search_results;
        if(angular.isDefined(item)){
            var book_label = item.labels.indexOf("Book") >= 0;
            var author_label = item.labels.indexOf("Author") >= 0;
            var output = ""
            if(book_label){
                output = "/book?q="+item.id;
            }
            else if(author_label){
                output = "/author?q="+item.id;
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
        $scope.info.mobile_search = true;
        $scope.search_results = [];
    }());
}]);