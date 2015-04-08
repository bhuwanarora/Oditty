homeApp.controller('shareController', ["$scope", "$rootScope", "$timeout", 'ShareOptions', '$routeParams', '$mdBottomSheet', 'statusService', function($scope, $rootScope, $timeout, ShareOptions, $routeParams, $mdBottomSheet, statusService){

    $scope.show_share_options = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/share/_share_options.html',
            controller: 'optionsController',
            targetEvent: event
        });
    };

    $scope.back = function($event){
        $scope.info.show_share = false;
        event.stopPropagation();
    }

    var _init = function(){
        $scope.info.show_share = true;
        var params = {
            "book_id"                  : 2,
            "reading_status_value"     : 2,
            "mentioned_users_ids"      : [1, 2, 3],
            "mentioned_authors_ids"    : [2, 3, 4],
            "hash_tags"                : ["testUser", "lifeUser"],
            "content"                  : "This is test content.",
            "feelings"                 : ["Happy", "Sad"],
            "book_exchange_status"     : 1
        }
        statusService.post_status(params);
    }

    _init();
}]);