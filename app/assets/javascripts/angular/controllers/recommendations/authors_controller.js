recommendationApp.controller('AuthorsController', function ($scope, recommendationService) {

    init();

    function init() {
        $scope.authors = recommendationService.getAuthors()
    }
});