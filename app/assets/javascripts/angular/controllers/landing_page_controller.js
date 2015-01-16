app.controller('MainCtrl', ['$scope', 'scroller', '$document', function($scope, scroller, $document){
	function _init(){
	    $scope.data = {
	    	selectedIndex : 0,
	    	tabLabel0 : "ReadersDoor",
	      	tabLabel1 : "Discover",
	      	tabLabel2 : "Connect",
	      	tabLabel3 : "Explore",
	      	tabLabel4 : "Personalise",
			tabLabel5 : "Request invite"
		};
	}

	$scope.scroll_page = function(page_id){
		var offset = 100;
		var duration = 2000;
		var someElement = angular.element(document.getElementById(page_id));
    	scroller.scrollToElement(someElement, offset, duration);
    	if(page_id == "tab0"){
    		$scope.down_button_style = {"bottom": "40px !important"};
    	}
    	else{
    		$scope.down_button_style = {"bottom": "20px !important"};
    	}
	}

	_init();
    
}]);
