homeApp.controller('filtersController', ["$scope", "$rootScope", "$timeout", 'genreService', 'authorService', 'WebsiteUIConstants', 'SearchUIConstants', '$location', 'sharedService', '$mdBottomSheet', 'PopularAuthors', 'Times', 'PopularGenres', 'ReadTimes', function($scope, $rootScope, $timeout, genreService, authorService, WebsiteUIConstants, SearchUIConstants, $location, sharedService, $mdBottomSheet, PopularAuthors, Times, PopularGenres, ReadTimes){

    $scope.close_filters = function(){
        $mdBottomSheet.hide();
    }

    $scope.reset_filter = function(){
        delete $scope.info.selected_genre;
        delete $scope.info.selected_author;
        delete $scope.info.selected_year;
        delete $scope.info.selected_duration;
        delete $scope.search_tag.genre;
        delete $scope.search_tag.time_group;
        delete $scope.search_tag.author;
        delete $scope.search_tag.read_time;
        $rootScope.filters = {};
        _set_books();
    }

    var _set_books = function(){
        // $scope.info.books = [];
        $scope.info.infinity = true;
        $scope.info.books = [];
        if(null_filters()){
            sharedService.get_popular_books($scope);
        }
        else{
            sharedService.filtered_books($scope);
        }
    }

    var null_filters = function(){
        var keys = Object.keys($rootScope.filters);
        var has_other = keys.indexOf("other") >= 0;
        var has_skip_count = keys.indexOf("skip_count") >= 0;
        var status_on_length_one = (keys.length == 1) && (has_other || has_skip_count);
        var status_on_length_two = (keys.length == 2) && (has_other && has_skip_count);
        var has_null_filters = (keys.length == 0) || status_on_length_two || status_on_length_one;
        return has_null_filters;
    }

    var _handle_filter_removal = function(){
        var skip_count = $rootScope.filters.skip_count;
        delete $rootScope.filters.skip_count;
        delete $scope.info.other_info;
        $scope.info.books = [];
        if(null_filters()){
            sharedService.get_popular_books($scope);
        }
        else{
            _set_books();
        }
    }

    $scope.select_genre = function(genre){
        if(angular.isUndefined(genre) || (genre == null)){
            delete $rootScope.filters.genre_id;
            _handle_filter_removal();
        }
        else{
            $rootScope.filters["genre_id"] = genre.id;
           _set_books();
        }
    }

    $scope.select_author = function(author){
        if(angular.isUndefined(author) || (author == null)){
            delete $rootScope.filters.author_id;
            _handle_filter_removal();
        }
        else{
            $rootScope.filters["author_id"] = author.id;
            _set_books();
        }
    }

    $scope.select_reading_time = function(read_time){
        if(angular.isUndefined(read_time) || (read_time == null)){
            delete $rootScope.filters.reading_time_id;
            _handle_filter_removal();
        }
        else{
            $rootScope.filters["reading_time_id"] = read_time.id;
            _set_books();
        }
    }

    $scope.select_publishing_year = function(time_group){
        if(angular.isUndefined(time_group) || (time_group == null)){
            delete $rootScope.filters.era_id;
            _handle_filter_removal();
        }
        else{
            $rootScope.filters["era_id"] = time_group.id;
            _set_books();
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

    $scope.search_publishing_year = function(){

    }

    $scope.search_authors = function(input){
        // var params = "q="+input+"&count="+10;

        if(!$scope.info.loading && angular.isDefined(input) && input.length > 2){
            $scope.info.loading = true;
            authorService.search_authors(input).then(function(data){
                $scope.info.loading = false;
                if(data.length > 0){
                    $scope.info.authors = [];
                    angular.forEach(data, function(value){
                        var json = {"icon2": "icon-pen", "type": SearchUIConstants.AuthorSearch, "custom_option": true};
                        json = angular.extend(json, value);
                        this.push(json);
                    }, $scope.info.authors);
                }
                else{
                    // $scope.search_display = SearchUIConstants.NoResultsFound;
                }
            });
        }
        else if(!$scope.info.loading && angular.isDefined(input) && input.length < 3){
            if($scope.top_authors){
                $scope.info.authors = $scope.top_authors;
            }
            else{
                $scope._get_authors();
            }
        }
    }

    $scope._detect_key = function(event){
        var backspace_or_delete = (event.keyCode == WebsiteUIConstants.Backspace) || (event.keyCode == WebsiteUIConstants.Delete);
        var keyUp = event.keyCode == WebsiteUIConstants.KeyUp;
        var keyDown = event.keyCode == WebsiteUIConstants.KeyDown;
        var keyLeft = event.keyCode == WebsiteUIConstants.KeyLeft;
        var keyRight = event.keyCode == WebsiteUIConstants.KeyRight;
        var enter = event.keyCode == WebsiteUIConstants.Enter;
        return {"backspace_or_delete": backspace_or_delete, "keyUp": keyUp, "keyDown": keyDown, "keyLeft": keyLeft, "keyRight": keyRight, "keyEnter": enter};
    }

    function get_query_params(name){
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec(window.location.href);
        var output = "";
        if(results != null){
            output = results[1];
        }
        return output;
    }

    var _init = (function(){
        console.log("filtersController");
        $scope.search_tag = {};
        $scope.info.time_groups = Times;
        $scope.info.read_times = ReadTimes;
        $scope.info.genres = PopularGenres;
        $scope.info.authors = PopularAuthors;
        
        if(angular.isUndefined($rootScope.filters)){
            $rootScope.filters = {};
        }

        var genre = get_query_params("g");
        var duration = get_query_params("d");
        if(genre != null){
            $scope.selected_genre = genre;
        }
        if(duration != null){
            $scope.selected_duration = duration;
        }
    }());
    
}]);