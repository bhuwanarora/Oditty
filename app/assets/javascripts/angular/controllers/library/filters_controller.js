homeApp.controller('filtersController', ["$scope", "$rootScope", "$timeout", 'genreService', 'authorService', 'WebsiteUIConstants', 'SearchUIConstants', 'timeGroupService', 'readingTimeService', 'infinityService', function($scope, $rootScope, $timeout, genreService, authorService, WebsiteUIConstants, SearchUIConstants, timeGroupService, readingTimeService, infinityService){

    $scope._get_genres = function(){
    	if(angular.isUndefined($scope.info.genres) || $scope.info.genres.length == 0){
			$scope.info.genres = [];
	    	genreService.get_genres().then(function(data){
	    		angular.forEach(data, function(value){
	    			var status = value[3] != null;
	    			var json = {"name": value[0], 
	    						"id": value[1], 
	    						"icon": value[2], 
	    						"status": status};
	    			this.push(json);
	    		}, $scope.info.genres);
	    	});
		}
    }

    $scope._get_authors = function(){
        $scope.info.authors = [];
        var skip_count = 0;
        authorService.get_popular_authors(skip_count).then(function(data){
            angular.forEach(data, function(value){
                var json = {"name": value[0]};
                this.push(json);
            },  $scope.info.authors);
        });
    }

    $scope.reset_filter = function(){
        delete $scope.selected_genre;
        delete $scope.selected_author;
        delete $scope.selected_year;
        delete $scope.selected_duration;
    }

    _set_books = function(){
        $scope.info.books = [];
        infinityService.get_books().then(function(data){
            angular.forEach(data.recommendations.books, function(value){
                var json = {
                    "isbn": value[0],
                    "id": value[1]
                }
                this.push(json);
            }, $scope.info.books);
        });
    }

    $scope.select_genre = function(genre){
        $rootScope.filters.other_filters[SearchUIConstants.Genre] = genre.id;
        _set_books();
    }

    $scope.select_author = function(author){
        $rootScope.filters.other_filters[SearchUIConstants.AuthorSearch] = author.id;
        _set_books();
    }

    $scope.select_reading_time = function(read_time){
        $rootScope.filters.other_filters[SearchUIConstants.Time] = read_time.id;
        _set_books();
    }

    $scope.select_publishing_year = function(time_group){
        $rootScope.filters.other_filters[SearchUIConstants.Year] = time_group.id;
        _set_books();
    }

    $scope.search_genres = function(input){
        var params = "q="+input+"&count="+10;
        $scope.info.loading = true;
        genreService.search_genres(params).then(function(data){
            $scope.info.loading = false;
            if(data.length > 0){
                $scope.info.genres = [];
                angular.forEach(data, function(value){
                    var json = {"type": SearchUIConstants.Genre, "custom_option": true, "icon2": "icon-tag"};
                    json = angular.extend(json, {"name": value[0], "id": value[1]});
                    this.push(json);
                }, $scope.info.genres);
            }
            else{
                // $scope.search_display = SearchUIConstants.NoResultsFound;
            }
        });
    }

    $scope.search_authors = function(input){
        var params = "q="+input+"&count="+10;
        $scope.info.loading = true;
        authorService.search_authors("q="+input).then(function(data){
            $scope.info.loading = false;
            if(data.length > 0){
                $scope.info.authors = [];
                angular.forEach(data, function(value){
                    var json = {"icon2": "icon-pen", "type": SearchUIConstants.AuthorSearch, "custom_option": true};
                    json = angular.extend(json, {"name": value[0], "id": value[1]});
                    this.push(json);
                }, $scope.info.authors);
            }
            else{
                // $scope.search_display = SearchUIConstants.NoResultsFound;
            }
        });
    }

    $scope._get_time_groups = function(){
        timeGroupService.get_time_groups().then(function(data){
            data = data["times"]
            $scope.info.time_groups = [];
            angular.forEach(data, function(value){
                var time_data = value[0]["data"];
                var name = time_data["name"];
                var json = {"icon2": "icon-calendar", "type": SearchUIConstants.Year, "custom_option": true};
                json = angular.extend(json, {"name": name, "label": time_data["range"]});
                this.push(json);
            }, $scope.info.time_groups);
        });
    }

    $scope._get_reading_times = function(){
        readingTimeService.get_read_times().then(function(data){
            $scope.info.read_times = [];

            angular.forEach(data["read_times"], function(value){
                var time_data = value[0]["data"];
                var name = time_data["name"];
                var tag = time_data["type"];
                var json = {"icon2": "icon-clock", "type": SearchUIConstants.Time, "custom_option": true};
                json = angular.extend(json, {"name": name, "tag": tag});
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

    _init = function(){
        $scope.search_tag = {};
        console.debug("initialised filters controller");
        $scope._get_genres();
        $scope._get_authors();
        $scope._get_time_groups();
        $scope._get_reading_times();
        if(angular.isUndefined($rootScope.filters)){
            $rootScope.filters = {"filter_type": SearchUIConstants.BookSearch};
        }
        $rootScope.filters.other_filters = {};
    }

    _init();
}]);