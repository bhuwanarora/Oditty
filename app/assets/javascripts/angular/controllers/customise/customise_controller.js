homeApp.controller('customiseController', ["$scope", "$rootScope", "$timeout", 'userService', function($scope, $rootScope, $timeout, userService){
    $scope.close_edit_profile = function(event){
        $rootScope.user.compressed_info = true;
        $scope.popular_books = [];
        event.stopPropagation();
    }

    $scope.stop_propagation = function(event){
        event.stopPropagation();
    }

    $scope.goto_info_card = function(page_number){
        if(angular.isDefined(page_number)){
            $rootScope.user.profile_status = page_number;
        }
        $rootScope.user.compressed_info = false;
        // scroller.scrollTo(0, 0, 2000);
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

    $scope.next = function(){
        var _check_select_limit_for = function(data){
            var count = 0;
            var genre_limit = 3;
            var valid_state = false;
            angular.forEach(data, function(value){
                if(value.status){
                    count = count + 1;
                }
            });
            if(count >= genre_limit){
                valid_state = true;
            }
            return valid_state;
        }
        
        var _check_selected_genres_count = function(){
            _check_select_limit_for($scope.info.genres);
        }

        var _check_selected_book_count = function(){
            _check_select_limit_for($scope.popular_books);
        }

        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.home.profile){
                    deleteCookie("todo");
                    userService.update_todo_key('home/profile');
                }
            }
        }

        if(angular.isDefined($scope.data.selectedIndex)){
            if($scope.data.selectedIndex == 2){
                _handle_todo_update();    
                window.location.href = "/profile";
            }
            else{
                if($scope.data.selectedIndex == 0){
                }
                else if($scope.data.selectedIndex == 1){
                    _check_selected_genres_count();
                }
                else if($scope.data.selectedIndex == 2){

                }
                $scope.data.selectedIndex = $scope.data.selectedIndex + 1;
            }
        }
        else{
            $scope.data.selectedIndex = 0;
        }
    }

    $scope.previous = function(){
        if(angular.isDefined($scope.data.selectedIndex)){
            if($scope.data.selectedIndex == 0){
                $scope.data.selectedIndex = 2;
            }
            else{
                $scope.data.selectedIndex = $scope.data.selectedIndex - 1;
            }
        }
        else{
            $scope.data.selectedIndex = 0;
        }
    }
    
    
    var _init = (function(){
        $scope.info.loading = false;
        
        userService.get_user_details().then(function(data){
            $rootScope.user = data;
        });
        $scope.info.my_profile = true;
    }());

}]);