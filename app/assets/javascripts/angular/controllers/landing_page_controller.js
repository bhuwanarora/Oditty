app.controller('MainCtrl', ['$scope', 'scroller', '$document', '$timeout', 'WebsiteUIConstants', function($scope, scroller, $document, $timeout, WebsiteUIConstants){
	function _init(){
	    $scope.data = [
	    	"Intro",
	    	"ReadersDoor",
	      	"Discover",
	      	"Connect",
	      	"Explore",
	      	"Personalise",
			"Invite"
		];

		var video = document.getElementsByTagName('video')[0];

		$scope.current_page_id = 0;
		$scope.nested_page_id = 0;
		$timeout(function(){
			$scope.show_content = true;
		}, 3000);
	}

	$scope.scroll_page = function(page_id){
		$scope.nested_page_id = 0;
    	$scope.current_page_id = page_id;
		page_id = $scope.data[page_id];
		$scope._scroll_page_to(page_id);
    	if(page_id == 0){
    		$scope.down_button_style = {"bottom": "40px !important"};
    	}
    	else if(page_id == $scope.data.length-1){
    		$scope.down_button_style = {"display": "none !important"};
    	}
    	else{
    		$scope.down_button_style = {"bottom": "20px !important"};
    	}
	}

	$scope._scroll_page_to = function(page_id){
		var offset = 0;
		var duration = 2000;
		var someElement = angular.element(document.getElementById(page_id));
    	scroller.scrollToElement(someElement, offset, duration);
	}

	$scope.scroll_next_state = function(){
		var nested_page = $scope.current_page_id == 2;
		if(nested_page){
			$scope.nested_page_id = $scope.nested_page_id + 1;
			if($scope.nested_page_id == 1){
				$scope._scroll_page_to("Search");
				$scope.hide_text = true;
			}
			else if($scope.nested_page_id == 2){
				$scope._scroll_page_to();
			}
			else if($scope.nested_page_id == 3){
				$scope._scroll_page_to();
			}
			else if($scope.nested_page_id == 4){
				$scope._scroll_page_to();
			}
			else{
				var page_id = $scope.current_page_id + 1;
				$scope.scroll_page(page_id);	
			}
		}
		else{
			var page_id = $scope.current_page_id + 1;
			$scope.scroll_page(page_id);
		}
	}

	$scope.scroll_on_keypress = function(event){
		debugger
		if(event.keyCode == WebsiteUIConstants.keyUp){

		}
		else if(event.keyCode == WebsiteUIConstants.keyDown){
			$scope.scroll_next_state();
		}
		event.stopPropagation();
	}

	$scope.bind_mousewheel_scroll = function(event){
		event.preventDefault();
		var delta = event.wheelDelta;
		if(delta > 0){
			if($scope.current_page_id > 0){
				var page_id = $scope.current_page_id - 1;
				$scope.scroll_page(page_id);
			}
		}
		else{
			if($scope.current_page_id < $scope.data.length){
				$scope.scroll_next_state();
			}
		}
		event.stopPropagation();
	}


	_init();
    
}]);
