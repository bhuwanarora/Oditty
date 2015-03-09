homeApp.controller('genresController', ["$scope", "$rootScope", "$timeout", 'userService', 'genreService', 'WebsiteUIConstants', '$mdToast', function($scope, $rootScope, $timeout, userService, genreService, WebsiteUIConstants, $mdToast){

    $scope.save_genre = function(genre){
        var params = {"genre": genre.id, "status": true};
        userService.save_user_info(params);
    }

    $scope.remove_genre = function(genre){
        var params = {"genre": genre.id, "status": false};
        userService.save_user_info(params);
    }

    $scope.edit_genres_like = function(){
        $scope.goto_info_card();
        $rootScope.user.profile_status = 1;
        $scope._get_genres();
    }

    $scope._get_genres = function(){
        $scope.info.loading = true;
        if(angular.isUndefined($scope.info.genres) || $scope.info.genres.length == 0){
            $scope.info.genres = [];
            genreService.get_genres().then(function(data){
                angular.forEach(data, function(value){
                    var status = value[3] != null;
                    var json = {"name": value[0], 
                                "id": value[1], 
                                "url": WebsiteUIConstants.GenreAWS+value[4],
                                "icon": value[2], 
                                "status": status};
                    this.push(json);
                }, $scope.info.genres);
                $scope.info.loading = false;
            });
        }
    }

    $scope.select_genre = function(genre){
        if(genre.status){
            genre.status = false;
            var params = {"genre": genre.id, "status": false};
        }
        else{
            genre.status = true;
            var params = {"genre": genre.id, "status": true};
        }
        // angular.forEach($scope.info.genres, function(value){
        //     if(angular.equals(value, genre)){
        //         if(angular.equals(genre.status, false)){
        //             genre.status = true;
        //         }
        //         else{
        //             genre.status = false;
        //             var params = {"genre": genre.id, "status": false};
        //         }
        //     }
        // });
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/select_genre.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
        userService.save_user_info(params);
    }

    $scope.toast_position = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };

    $scope.getToastPosition = function() {
        return Object.keys($scope.toast_position)
          .filter(function(pos) { return $scope.toast_position[pos]; })
          .join(' ');
    };

    _init = function(){
        $scope._get_genres();
    }

    _init();
}]);