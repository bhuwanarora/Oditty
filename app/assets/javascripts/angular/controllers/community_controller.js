homeApp.controller('communityController', ["$scope", "$mdSidenav", function($scope, $mdSidenav) {
    $scope.toggle_details = function(event){
        $mdSidenav('right').toggle();
        $scope.show_details = true;
    };

    _init = function(){
        $scope.d3Data = [
            {name: "Greg", score: 98},
            {name: "Ari", score: 96},
            {name: 'Q', score: 75},
            {name: "Loser", score: 48}
        ];

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
