homeApp.controller('newHomeController', ["$scope", "$timeout", 'SearchUIConstants', 'readingTimeService', 'genreService', function($scope, $timeout, SearchUIConstants, readingTimeService, genreService){

    $scope._get_genres = function(){
        if(angular.isUndefined($scope.info.genres) || $scope.info.genres.length == 0){
            $scope.info.genres = [];
            genreService.get_genres().then(function(data){
                angular.forEach(data, function(value){
                    var status = value.status != null;
                    var json = angular.extend(value, {"status": status});
                    this.push(json);
                }, $scope.info.genres);
            });
        }
        else{
            $scope.info.loading = false;
        }
    }

    $scope.show_filter_results = function(){
        var filters = "";
        if(angular.isDefined($scope.info.selected_duration) && $scope.info.selected_duration != null){
            var duration_filter = "d="+$scope.info.selected_duration.id;
            filters = duration_filter;
        }
        if(angular.isDefined($scope.info.selected_genre) && $scope.info.selected_genre != null){
            var genre_filter = "g="+$scope.info.selected_genre.id;
            if(filters != ""){
                filters = filters + "&" + genre_filter;
            }
            else{
                filters = genre_filter;
            }
        }

        if(filters != ""){
            window.location.href = "/filters?"+filters;
        }
        else{
            window.location.href = "/filters";
        }
    }

    $scope.search_genres = function(input){
        // var params = "q="+input+"&count="+10;
        if(angular.isDefined(input) && (input.length > 2)){
            if(!$scope.info.loading){
                $scope.info.loading = true;
                genreService.search_star_genres(input).then(function(data){
                    $scope.info.loading = false;
                    $scope.info.genres = data;
                });
            }
            else{
                $scope.info.genres = [];
            }
        }
        else{
            $scope.info.loading = true;
            $scope._get_genres();
        }
    }

    $scope.search_reading_time = function(){
        $scope.info.loading = true;
        $scope.search_tag.read_time = "";
    }

    $scope._get_reading_times = function(){
        readingTimeService.get_read_times().then(function(data){
            $scope.info.read_times = [];

            angular.forEach(data, function(value){
                var json = {"icon2": "icon-clock", "type": SearchUIConstants.Time, "custom_option": true};
                json = angular.extend(json, value);
                this.push(json);
            }, $scope.info.read_times);
        });
    }

    var _init = (function(){
        $scope.info.read_times = [];
        $scope.info.genres = [];
        var fetch_data = $timeout(function(){
            $scope._get_reading_times();
            $scope._get_genres();
        }, 100);
        $scope.$on('destroy', function(){
            $timeout.cancel(fetch_data);
        });
        $scope.filters = {"other": {}};
        $scope.search_tag = {};

    }());

}]);