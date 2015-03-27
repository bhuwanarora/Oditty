homeApp.controller('shelfController', ['$scope', '$mdBottomSheet', '$mdToast', function($scope, $mdBottomSheet, $mdToast){
    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };

    $scope.getToastPosition = function() {
        return Object.keys($scope.toast_position)
          .filter(function(pos) { return $scope.toast_position[pos]; })
          .join(' ');
          
    };

    $scope.show_custom_toast = function() {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/bookmark_action.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
    };

    $scope.add_new_label = function(){
        // if $rootScope.labels include $scope.new_label then push a toast that a label already exists.
        // else call the below service to add the new label.
        shelfService.add_new_label($scope.new_label);
    }

    var _init = function(){
        $scope.toast_position = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
    }

    _init();
}]);