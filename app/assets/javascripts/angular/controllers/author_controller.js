homeApp.controller('authorController', ["$scope", "$location", 'authorService', function($scope, $location, authorService){

	$scope.show_book_buy_options = function(){
		
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