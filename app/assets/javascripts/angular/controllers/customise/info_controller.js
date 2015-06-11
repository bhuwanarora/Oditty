homeApp.controller('infoController', ["$scope", "$rootScope", "$timeout", 'userService', function($scope, $rootScope, $timeout, userService){
    
    $scope.set_first_name = function(){
        if(angular.isDefined($rootScope.user.first_name) &&  $rootScope.user.first_name != null && $rootScope.user.first_name.length > 0){
            var params = {"first_name": $rootScope.user.first_name};
            userService.save_user_info(params);
        }
    }

    $scope.set_last_name = function(){
        if(angular.isDefined($rootScope.user.last_name) && $rootScope.user.last_name != null && $rootScope.user.last_name.length > 0){
            var params = {"last_name": $rootScope.user.last_name};
            userService.save_user_info(params);
        }
    }

    $scope.set_date_of_birth = function(){
        var params = {"selectedYear": $rootScope.user.selectedYear, 
                      "selectedMonth": $rootScope.user.selectedMonth,
                      "selectedDay": $rootScope.user.selectedDay};
        userService.save_user_info(params);
    }

    $scope.set_email = function(){
        if(angular.isDefined($rootScope.user.email) && $rootScope.user.email.length > 0){
            var params = {"email": $rootScope.user.email};
            userService.save_user_info(params);
        }   
    } 
          
    $scope.set_gender = function(){
           
            
            if($rootScope.user.gender){
               
            
            var params = {"gender": $rootScope.user.gender};
            userService.save_user_info(params);
        }
    }
    
    $scope.set_init_book_read_count = function(){
        if($rootScope.user.init_book_read_count){
            var params = {"init_book_read_count": $rootScope.user.init_book_read_count};
            userService.save_user_info(params);  
        }
    }

    $scope.set_init_book_written_count = function(){
        if($rootScope.user.init_book_written_count){
            var params = {"init_book_written_count": $rootScope.user.init_book_written_count};
            userService.save_user_info(params);  
        }
    }

    $scope.set_about = function(){
        if($rootScope.user.about){
            var params = {"about": $rootScope.user.about};
            userService.save_user_info(params);     
        }
    }
    
    _get_info_data = function(){
        userService.get_info_data().then(function(data){
            $scope.book_counts = data.reading_count_list;
            $scope.user_book_count = $scope.book_counts[0];
        });
    }
    
    _init = function(){
        _get_info_data();
    }

    _init();
}]);