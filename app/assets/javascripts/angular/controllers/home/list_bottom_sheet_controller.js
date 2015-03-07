homeApp.controller('listBottomSheetController', ['$scope', '$mdBottomSheet', '$mdToast', function($scope, $mdBottomSheet, $mdToast){
    $scope.items = [
        { name: 'Plan to Read', icon: 'share' },
        { name: 'Plan to Buy', icon: 'upload' },
        { name: 'Plan to re-read', icon: 'copy' }
    ];

    $scope.personal_shelves = [
        { name: 'Travellers Suggestions', icon: 'print'}
    ];

    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };

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

    $scope.show_custom_toast = function() {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/bookmark_action.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
    };

    $scope.add_new_shelf = function(){
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/new_shelf.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });    
    }
}]);