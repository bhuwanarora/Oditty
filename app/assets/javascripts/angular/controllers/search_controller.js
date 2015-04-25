homeApp.controller('searchController', ["$scope", "searchService", "$location", function($scope, searchService, $location){

    $scope.query_search = function(search_text){
        searchService.raw(search_text).then(function(data){
            $scope.search_results = data;
            $scope.did_you_mean = false;
            angular.forEach(data, function(value){
                if(value.fuzzy){
                    $scope.did_you_mean = true;
                }
                console.debug(value);
            });
            if($scope.did_you_mean){
                var json = {"name": "Did you mean", "labels": []};
                $scope.search_results.splice(0, 0, json);
            }
            var json = {"name": "Show all results", "show_all": true, "labels": [], "search_text": search_text};
            $scope.search_results.push(json);
        });
    }

    $scope.show_all_results = function(search_text, type){
        searchService.raw(search_text, type).then(function(data){
            $scope.all_results = data;
        });
    }

    $scope.on_select = function(item){
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

    $scope.reload_results = function(type){
        switch(type){
            case 'Book':
                break;
            case 'Author':
                break;
            case 'Community':
                break;
            case 'Blog':
                break;
            case 'Person':
                break;
            case 'News':
                break;
        }
    }

    var _init = (function(){
        var _get_parameter_by_name = function(name){
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        $scope.info.mobile_search = true;

        $scope.search_results = [];
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parser = regex.exec($location.absUrl());
        var is_search = $location.$$absUrl.indexOf("search") >= 0;
        if(angular.isDefined(url_parser) && (url_parser != null) && is_search){
            var q = _get_parameter_by_name("q");
            var type = _get_parameter_by_name("type")
            $scope.show_all_results(q, type);
            $scope.display_results_for = q;
        }
    }());
}]);