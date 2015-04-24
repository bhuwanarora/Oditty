homeApp.controller('shelfController', ['$scope', '$mdBottomSheet', '$mdToast', 'shelfService', '$rootScope', 'sharedService', function($scope, $mdBottomSheet, $mdToast, shelfService, $rootScope, sharedService){
    
    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };

    $scope.toggle_bookmark = function(label, data){
        sharedService.toggle_bookmark(label, data);
    };

    $scope.add_new_label = function(){
        var label_exists = false;
        if(angular.isUndefined($scope.new_label) || ($scope.new_label == "")){
            alert("Enter a valid shelf.");
        }
        else{
            angular.forEach($rootScope.labels, function(value){
                if(value.label_name.toLowerCase() == $scope.new_label.toLowerCase()){
                    label_exists = true;
                }
            });

            if(!label_exists){
                shelfService.add_new_label($scope.new_label);
            }
            else{
                alert("Shelf already exists.");
                $scope.new_label = "";
            }
        }
    }

    var _init = (function(){
        $scope.toast_position = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
    }());

}]);