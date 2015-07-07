homeApp.controller('newHomeController', ["$scope", "$timeout", 'SearchUIConstants', 'ReadTimes', 'genreService', 'PopularGenres', function($scope, $timeout, SearchUIConstants, ReadTimes, genreService, PopularGenres){

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

    var _init = (function(){
        $scope.info.read_times = [];
        $scope.info.genres = [];
        $scope.info.read_times = ReadTimes;
        $scope.info.genres = PopularGenres;
        
        $scope.filters = {"other": {}};
        $scope.search_tag = {};

    }());

}]);