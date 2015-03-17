homeApp.controller('customiseController', ["$scope", "$rootScope", "$timeout", 'userService', function($scope, $rootScope, $timeout, userService){
    $scope.close_edit_profile = function(event){
        $rootScope.user.compressed_info = true;
        $scope.popular_books = [];
        event.stopPropagation();
    }

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    }

    _handle_info_card_bindings = function($scope){
        if($rootScope.user.profile_status == 1){
            $scope._get_genres();
        }
        else if($rootScope.user.profile_status == 2){
            $scope.get_popular_books();
        }
        // else if($rootScope.user.profile_status == 3){
        //  $scope.get_popular_authors();
        //  // $rootScope.$broadcast('showBookReadShelf');
        // }
        else if($rootScope.user.profile_status == 3){
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    $rootScope.user.latitude = latitude;
                    $rootScope.user.longitude = longitude;
                    $scope.set_location();
                });
            }
            else{
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }
        else if($rootScope.user.profile_status == 4){
            $scope.fb_books();
        }
    }

    $scope.goto_info_card = function(page_number){
        if(angular.isDefined(page_number)){
            $rootScope.user.profile_status = page_number;
        }
        $rootScope.user.compressed_info = false;
        // scroller.scrollTo(0, 0, 2000);
    }

    $scope.prev_profile_state = function(){
        if($rootScope.user.profile_status != 0){
            $rootScope.user.profile_status = $rootScope.user.profile_status - 1;
        }
        else{
            $rootScope.user.compressed_info = true;
        }
        _handle_info_card_bindings($scope);
    }

    $scope.next_profile_state = function(){
        if($rootScope.user.profile_status != 4){
            $rootScope.user.profile_status = $rootScope.user.profile_status + 1;
        }
        else{
            $rootScope.user.compressed_info = true;
        }
        _handle_info_card_bindings($scope);
    }

    $scope.stop_horizontal_scroll = function(event){
        event.stopPropagation();
    }

    $scope.user_profile_changed = function(selected){
        var params = {"profile": selected.name};
        userService.save_user_info(params);
    }

    $scope.add_book = function(){

    }

    $scope.add_author = function(){

    }

    $scope.set_location = function(){
        if($rootScope.user.latitude){
            var params = {"latitude": $rootScope.user.latitude, "longitude": $rootScope.user.longitude};
            userService.save_user_info(params);
        }
    }
    
    var search_input_timeout = "";
    
    
    _init = function(){
        
        $scope.info.loading = false;
        // $rootScope.user.profile_status = 0;
        // _get_info_data();
        // $scope.popular_books = [];
        // $scope.popular_authors = [];
        // $scope._loading = false;
        // $scope.info = {"search_book": "", "search_author": "", "genres": []};
        // $scope.profileOptions = [
        //     {"name": "Reader"},
        //     {"name": "Author"},
        //     {"name": "Publisher"},
        //     {"name": "Editor"}
        // ];
        // if(angular.isUndefined($rootScope.user.ask_info) || $rootScope.user.ask_info){
        //     $rootScope.user.compressed_info = false;
        //     $rootScope.user.ask_info = false;
        //     var params = {"ask_info": false};
        //     userService.save_user_info(params);
        // }
        // else{
        //     $rootScope.user.compressed_info = true;
        // }
        // $scope.profileSelected = {"name": "Reader"};
        // $scope.info_card_width = 350;
        // $scope.info_card_ratio = 1.34;
    }

    _init();
}]);