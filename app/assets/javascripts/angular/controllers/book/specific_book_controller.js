homeApp.controller('specificBookController', ["$scope", "$rootScope", "$timeout", "bookService", '$mdToast', '$location', function($scope, $rootScope, $timeout, bookService, $mdToast, $location){

    $scope.toggle_endorse = function(){
        if($scope.book.endorse_status){
            $scope.book.endorse_status = false;
        }
        else{
            $scope.book.endorse_status = true;
        }
        bookService.endorse_book($rootScope.active_book.id, $scope.book.endorse_status);
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/endorse_action.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
    }


    $scope.getToastPosition = function() {
        return Object.keys($scope.toast_position)
                    .filter(function(pos) { return $scope.toast_position[pos]; })
                    .join(' ');
    };

    var _init = function(){
        // $scope.$location = $location;
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        if(regex.exec($location.absUrl()) != null){
            var id = regex.exec($location.absUrl())[2];
        }
        if(angular.isDefined(id)){
            var book_id = id;   
        }
        else{
            var book_id = $rootScope.active_book.book_id;
        }
        var filter = "id="+book_id;
        bookService.get_book_details(filter).then(function(data){
            var endorse_status = data.endorse_status != null;
            var status = data.status != null;
            var json = {"endorse_status" : endorse_status, "status" : status};
            if(angular.isDefined($rootScope.active_book)){
                $scope.book = angular.extend($rootScope.active_book, data);
            }
            else{
                $scope.book = data;    
            }
            $scope.book = angular.extend($scope.book, json);
            $rootScope.active_book = $scope.book;
        });
        $scope.toast_position = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

    }

    _init();
}]);