homeApp.controller('authorController', ["$scope", "$location", 'authorService', '$mdDialog', 'scroller', function($scope, $location, authorService, $mdDialog, scroller){

	$scope.show_buy_dialog = function(event){
        $mdDialog.show({
            templateUrl: 'assets/angular/html/author/buy.html',
            targetEvent: event,
        });
        event.stopPropagation();
    }

    $scope.close_dialog = function(){
        $mdDialog.hide();
    }

    $scope.next_block = function(){

    }

    $scope.previous_block = function(){

    }

  	_init = function(){
  		var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var id = regex.exec($location.absUrl())[2];
        var filter = "id="+id;
        authorService.get_details(filter).then(function(data){
            $scope.author = data;
        });
  	}

  	_init();

}]);