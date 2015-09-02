homeApp.controller('adsController', ["$scope", 'websiteService', '$rootScope', '$timeout', function($scope, websiteService, $rootScope, $timeout){

    $scope.reset = function(){
        $scope.ad = {"tags": []};
    }

    $scope.save = function(){
        websiteService.save_ad($scope.ad);
        $scope.reset();
        $scope.status = "Ad Submitted for Approval";
    }

    var _init = (function(){
        $scope.reset();
        $scope.ad = {"tags": [], 
                    "website_url": "http://www.myspinny.com/", 
                    "image_url": "http://www.myspinny.com/stc/images/logo.png", 
                    "text": "Buying and Selling Cars just became Easier", 
                    "headline": "MySpinny",
                    "description": "Buying and Selling Cars just became Easier"};

    }());

}]);