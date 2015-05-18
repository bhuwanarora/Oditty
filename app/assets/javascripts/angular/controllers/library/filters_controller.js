homeApp.controller('filtersController', ["$scope", "$rootScope", "$timeout", 'genreService', 'authorService', 'WebsiteUIConstants', 'SearchUIConstants', 'timeGroupService', 'readingTimeService', 'infinityService', 'ColorConstants', 'sharedService', '$mdBottomSheet', function($scope, $rootScope, $timeout, genreService, authorService, WebsiteUIConstants, SearchUIConstants, timeGroupService, readingTimeService, infinityService, ColorConstants, sharedService, $mdBottomSheet){

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
        if(Object.keys($rootScope.filters).length == 0){
            $scope.info.books = [];
            sharedService.get_popular_books($scope);
        }
        else{
            $scope.info.books = [];
            sharedService.filtered_books($scope);
        }
    }

    var _handle_filter_removal = function(){
        var skip_count = $rootScope.filters.skip_count;
        delete $rootScope.filters.skip_count;
        delete $scope.info.other_info;
        $scope.info.books = [];
        if(Object.keys($rootScope.filters).length > 0){
            _set_books();
        }
        else{
            sharedService.get_popular_books($scope);
        }
    }

    $scope.select_genre = function(genre){
        if(angular.isUndefined(genre)){
            delete $rootScope.filters.category_id;
            _handle_filter_removal();
        }
        else{
            $rootScope.filters["category_id"] = genre.id;
           _set_books();
        }
    }

    $scope.select_author = function(author){
        if(author){
            if(angular.isUndefined(author)){
                delete $rootScope.filters.author_id;
                _handle_filter_removal();
            }
            else{
                $rootScope.filters["author_id"] = author.id;
                _set_books();
            }
        }
        else{
        }
    }

    $scope.select_reading_time = function(read_time){
        if(angular.isUndefined(read_time)){
            delete $rootScope.filters.reading_time_id;
            _handle_filter_removal();
        }
        else{
            $rootScope.filters["reading_time_id"] = read_time.id;
            _set_books();
        }
    }

    $scope.select_publishing_year = function(time_group){
        if(angular.isUndefined(time_group)){
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
        if(input){
            if(!$scope.info.loading){
                $scope.info.loading = true;
                genreService.search_genres(input).then(function(data){
                    $scope.info.loading = false;
                    if(data.length > 0){
                        $scope.info.genres = [];
                        angular.forEach(data, function(value){
                            var json = {"type": SearchUIConstants.Genre, "custom_option": true, "icon2": "icon-tag", 
                                        "name": value.category_name, "id": value.category_id};
                            this.push(json);
                        }, $scope.info.genres);
                    }
                    else{
                        // $scope.search_display = SearchUIConstants.NoResultsFound;
                    }
                });
            }
        }
        else{
            $scope.info.loading = true;
            if(angular.isUndefined($scope.info.genres) || ($scope.info.genres.length == 0)){
                genreService.get_genres().then(function(data){
                    $scope.info.genres = [];
                    angular.forEach(data, function(value){
                        var json = {"name": value.root_category_name, "id": value.root_category_id};
                        this.push(json);
                    }, $scope.info.genres);
                    $scope.info.loading = false;
                });
            }
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
        if(!$scope.info.loading){
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
        $scope.search_tag = {};
        $scope.info.genres = [];
        $scope.info.authors = [];
        $scope.info.time_groups = [];
        $scope.info.read_times = [];
        console.debug("initialised filters controller");
        $scope._get_time_groups();
        $scope._get_reading_times();
        if(angular.isUndefined($rootScope.filters)){
            $rootScope.filters = {};
        }
    }());
    
}]);