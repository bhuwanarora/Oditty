homeApp.controller('searchPageController', ["$scope", "searchService", "$location", "ColorConstants", function($scope, searchService, $location, ColorConstants){

    $scope.show_all_results = function(search_text, type){
        if(angular.isUndefined($scope.info.loading) || !$scope.info.loading){
            var search_text = search_text || $scope.active_q;
            var type = type || $scope.active_type;
            $scope.info.loading = true;
            if(angular.isUndefined($scope.all_results)){
                $scope.all_results = [];
            }
            var params = {"type": type,  "q": search_text, "skip": $scope.all_results.length, "count": 10};
            searchService.raw(params).then(function(data){
                angular.forEach(data, function(value){
                    if(value.labels.indexOf("Book") >= 0){
                        var random_int = Math.floor(Math.random() * ColorConstants.value.length);
                        value = angular.extend(value, {"color": ColorConstants.value[random_int], "title": value.name});
                    }
                    this.push(value);
                }, $scope.all_results)
                $scope.info.loading = false;
            });
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

        $scope.search_results = [];
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parser = regex.exec($location.absUrl());
        var is_search = $location.$$absUrl.indexOf("search") >= 0;
        if(angular.isDefined(url_parser) && (url_parser != null) && is_search){
            var q = _get_parameter_by_name("q");
            var type = _get_parameter_by_name("type");
            $scope.active_q = q;
            $scope.active_type = type;
            $scope.show_all_results();
            $scope.display_results_for = q;
        }
    }());
}]);