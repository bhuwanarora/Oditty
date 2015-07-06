homeApp.controller('newHomeController', ["$scope", "$rootScope", "$timeout", 'WebsiteUIConstants', 'SearchUIConstants', 'bookService', '$routeParams', '$location', 'ColorConstants', '$mdToast', 'infinityService', '$mdBottomSheet', '$mdSidenav', 'sharedService', '$cookieStore', '$mdDialog', 'readingTimeService', 'genreService', function($scope, $rootScope, $timeout, WebsiteUIConstants, SearchUIConstants, bookService, $routeParams, $location, ColorConstants, $mdToast, infinityService, $mdBottomSheet, $mdSidenav, sharedService, $cookieStore, $mdDialog, readingTimeService, genreService){

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
        $scope.info.read_times = [];
        $scope.info.genres = [];
        var fetch_data = $timeout(function(){
            $scope._get_reading_times();
            $scope._get_genres();
        }, 100);
        $scope.$on('destroy', function(){
            $timeout.cancel(fetch_data);
        });
        if(angular.isUndefined($rootScope.filters)){
            $rootScope.filters = {};
        }
        // $scope.info.author_filter = true;
        $scope.$routeParams = $routeParams;
        $scope.filters = {"other": {}};
        $scope.search_tag = {};
        $scope.active_tab = {};

    }());

}]);