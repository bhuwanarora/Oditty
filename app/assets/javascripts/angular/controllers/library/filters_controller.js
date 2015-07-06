homeApp.controller('filtersController', ["$scope", "$rootScope", "$timeout", 'genreService', 'authorService', 'WebsiteUIConstants', 'SearchUIConstants', 'timeGroupService', 'readingTimeService', 'infinityService', '$location', 'sharedService', '$mdBottomSheet', function($scope, $rootScope, $timeout, genreService, authorService, WebsiteUIConstants, SearchUIConstants, timeGroupService, readingTimeService, infinityService, $location, sharedService, $mdBottomSheet){

    $scope._get_genres = function(){
    	if(angular.isUndefined($scope.info.genres) || $scope.info.genres.length == 0){
			$scope.info.genres = [];
	    	genreService.get_genres().then(function(data){
	    		angular.forEach(data, function(value){
	    			var status = value.status != null;
	    			var json = angular.extend(value, {"status": status});
                    if(angular.isDefined($scope.selected_genre)){
                        if(value.id == $scope.selected_genre){
                            $scope.info.selected_genre = value;
                        }
                    }
	    			this.push(json);
	    		}, $scope.info.genres);
	    	});
		}
        else{
            $scope.info.loading = false;
        }
    }

    $scope.close_filters = function(){
        $mdBottomSheet.hide();
    }

    $scope._get_authors = function(){
        $scope.info.authors = [];
        var skip_count = 0;
        authorService.get_popular_authors(skip_count).then(function(data){
            angular.forEach(data, function(value){
                this.push(value);
            },  $scope.info.authors);
            $scope.top_authors = $scope.info.authors;
        });
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

    $scope._get_time_groups = function(){
        timeGroupService.get_time_groups().then(function(data){
            $scope.info.time_groups = [];
            angular.forEach(data, function(value){
                var json = {"icon2": "icon-calendar", "type": SearchUIConstants.Year, "custom_option": true};
                json = angular.extend(json, value);
                this.push(json);
            }, $scope.info.time_groups);
        });
    }

    $scope._get_reading_times = function(){
        readingTimeService.get_read_times().then(function(data){
            $scope.info.read_times = [];

            angular.forEach(data, function(value){
                var json = {"icon2": "icon-clock", "type": SearchUIConstants.Time, "custom_option": true};
                json = angular.extend(json, value);
                if(angular.isDefined($scope.selected_duration)){
                    if(value.id == $scope.selected_duration){
                        $scope.info.selected_duration = value;
                    }
                }
                this.push(json);
            }, $scope.info.read_times);
        });
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

    var _init = (function(){
        console.log("filtersController");
        $scope.search_tag = {};
        $scope.info.genres = [];
        $scope.info.authors = [];
        $scope.info.time_groups = [];
        $scope.info.read_times = [];
        var fetch_data = $timeout(function(){
            $scope._get_time_groups();
            $scope._get_reading_times();
            $scope._get_genres();
            $scope._get_authors();
        }, 100);
        $scope.$on('destroy', function(){
            $timeout.cancel(fetch_data);
        });
        if(angular.isUndefined($rootScope.filters)){
            $rootScope.filters = {};
        }

        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parser = regex.exec($location.absUrl());
        if(angular.isDefined(url_parser) && url_parser != null){
            if(url_parser[1] == "g"){
                $scope.selected_genre = url_parser[2];
            }
            else if(url_parser[1] == "d"){
                $scope.selected_duration = url_parser[2];
            }

            if(url_parser[3] == "g"){
                $scope.selected_genre = url_parser[4];
            }
            else if(url_parser[3] == "d"){
                $scope.selected_duration = url_parser[4];
            }
        }
    }());
    
}]);