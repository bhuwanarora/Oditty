recommendationApp.controller('ReadersController', function ($scope, recommendationService) {

    init();

    function init() {
        $scope.readers = recommendationService.getReaders()
    }
});