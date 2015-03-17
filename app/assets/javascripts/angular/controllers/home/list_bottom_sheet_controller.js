homeApp.controller('listBottomSheetController', ['$scope', '$mdBottomSheet', function($scope, $mdBottomSheet) {
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

  $scope.social_share = [
    { name: 'Facebook', icon: 'share' },
    { name: 'Twitter', icon: 'upload' },
    { name: 'Google+', icon: 'copy' },
    { name: 'Linkedin', icon: 'copy' }
  ];
}]);