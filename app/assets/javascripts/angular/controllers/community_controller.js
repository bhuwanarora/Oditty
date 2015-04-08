homeApp.controller('communityController', ["$scope", "$mdSidenav", function($scope, $mdSidenav) {
    $scope.toggle_details = function(event){
        $mdSidenav('right').toggle();
        $scope.show_details = true;
    };

    $scope.refresh_data = function(){
        alert("refresh_data");
    }

    _init = function(){
        $scope.show_details = false;

        $scope.electionData = [
            {text: "MODI", count: "236"},
            {text: "KEJRIWAL", count: "382"},
            {text: "BEDI", count: "170"},
            {text: "CONGRESS", count: "123"},
            {text: "ELECTIONS", count: "12"},
            {text: "DELHI", count: "170"}
        ];
    }

    _init();
}]);
