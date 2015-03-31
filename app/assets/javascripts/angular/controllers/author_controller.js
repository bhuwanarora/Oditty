homeApp.controller('authorController', ["$scope", "$location", 'authorService', '$mdDialog', 'scroller', 'ColorConstants', function($scope, $location, authorService, $mdDialog, scroller, ColorConstants){

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
        authorService.get_details(id).then(function(data){
            $scope.author = data;
            angular.forEach($scope.author.books, function(value, index){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var json =  {"color": ColorConstants.value[random_int]};
                $scope.author.books[index] = angular.extend($scope.author.books[index], json);
            });
            $scope.custom_color = {'background-color': $scope.author.books[0].color};
        });
  	}

  	_init();

}]);