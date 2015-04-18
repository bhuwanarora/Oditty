homeApp.controller('homeController', ["$scope", "$rootScope", "$timeout", "$mdSidenav", "$log", '$q', '$mdBottomSheet', '$mdDialog', 'scroller', '$document', 'feedService', '$mdToast', 'userService', function($scope, $rootScope, $timeout, $mdSidenav, $log, $q, $mdBottomSheet, $mdDialog, scroller, $document, feedService, $mdToast, userService){

    var _init = (function(){
        userService.get_feed().then(function(data){
            $scope.feed = data.posts;
            angular.forEach($scope.feed, function(value){
                value.image_url = value.attachments[parseInt(Object.keys(value.attachments)[0])].URL;
            });
        });
    }());

}]);