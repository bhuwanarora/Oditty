homeApp.controller('specificBookController', ["$scope", "$rootScope", "$timeout", "bookService", '$mdToast', function($scope, $rootScope, $timeout, bookService, $mdToast){

    _init = function(){
        var book_id = $rootScope.active_book.id;
        if(angular.isDefined(book_id)){
            var filter = "id="+book_id;
            bookService.get_book_details(filter).then(function(data){
                // $scope.summary_style = {"background-color": data.dominant_color, "color": data.text};
                // $scope.spine_style = {"background-color": data.spine, "color": data.spine_text};
                $scope.book = angular.extend($rootScope.active_book, data);
                $rootScope.active_book = $scope.book;
            });
        }
        $scope.toast_position = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
    }

    $scope.toggle_endorse = function(){
        if($scope.active_endorse){
            $scope.active_endorse = false;
        }
        else{
            $scope.active_endorse = true;
        }
        bookService.endorse_book($rootScope.active_book.id, $scope.active_endorse);
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

    _init();
}]);