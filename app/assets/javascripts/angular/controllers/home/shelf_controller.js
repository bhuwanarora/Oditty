homeApp.controller('shelfController', ['$scope', '$mdBottomSheet', '$mdToast', 'shelfService', '$rootScope', function($scope, $mdBottomSheet, $mdToast, shelfService, $rootScope){
    
    $scope.listItemClick = function($index) {
        var clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
    };

    $scope.getToastPosition = function() {
        return Object.keys($scope.toast_position)
          .filter(function(pos) { return $scope.toast_position[pos]; })
          .join(' ');    
    };

    $scope.toggle_bookmark = function(label, data){
        if(angular.isUndefined(data) || !data){
            var status = true;
        }
        else{
            var status = false;
        }
        var id = $rootScope.bookmark_object.id;
        var type = $rootScope.bookmark_object.type;
        var shelf = label.label_key;
        var params = {"id": id, "type": type, "shelf": shelf, "status": status};
        
        shelfService.bookmark(params);
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'assets/angular/html/shared/toast/bookmark_action.html',
            hideDelay: 6000,
            position: $scope.getToastPosition()
        });
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