app.controller('MainCtrl', ["$scope", "scroller", "$document", "$timeout", "WebsiteUIConstants", '$interval', '$mdDialog', '$mdSidenav', function($scope, scroller, $document, $timeout, WebsiteUIConstants, $interval, $mdDialog, $mdSidenav){
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

		$scope.down_button_style = {"bottom": "110px"};
		$scope.scroll_active = true;
		$scope.text_index = 1;
		$scope.current_text = "";
	}

	$scope.scroll_page = function(page_id){
		$scope.nested_page_id = 0;
		$scope.hide_text = false;
		if(page_id <=  $scope.data.length-1){
	    	$scope.current_page_id = page_id;
			$scope._scroll_page_to(page_id);
		}
	}

	$scope._scroll_page_to = function(page_id){
    	$scope._handle_down_button(page_id);
		page_id = $scope.data[page_id];
		$scope._scroll_page_to_id(page_id);
	}

	$scope._scroll_page_to_id = function(id){
		var offset = 0;
		var duration = 2000;
		var someElement = angular.element(document.getElementById(id));
		var easeInQuad = function(t){ 
			return t*t; 
		};
    	scroller.scrollToElement(someElement, offset, duration);
	}

	$scope._handle_down_button = function(page_id){
    	if(page_id == 0){
    		$scope.down_button_style = {"bottom": "110px"};
    	}
    	else if(page_id == $scope.data.length-1){
    		$scope.down_button_style = {"display": "none"};
    	}
    	else{
    		$scope.down_button_style = {"bottom": "20px"};
    	}
	}

	$scope.search_animate = function(){
		debugger
		var text = ["H", "i", "t", "c", "h", "h", "i", "k", "e"];
		if($scope.text_index < text.length){
			$scope.current_text = $scope.current_text + text[$scope.text_index];
			$scope.text_index = $scope.text_index + 1;
		}
		else{
			$scope.typing_active = false;
		}
		
	}

	$scope.$on('timer-tick', function(){
		$scope.search_animate();
	});

	$scope.scroll_next_state = function(){
		var discover = $scope.current_page_id == 2;
		var connect = $scope.current_page_id == 3;
		var explore = $scope.current_page_id == 4;
		var personalise = $scope.current_page_id == 5;

		var _next_page = function(){
			$scope.hide_text = false;
			var page_id = $scope.current_page_id + 1;
			$scope.scroll_page(page_id);
		}

		var _next_nested_page = function(){
			$scope.hide_text = true;
			$scope.nested_page_id = 1;
		}

		if(discover){
			$scope.nested_page_id = $scope.nested_page_id + 1;
			if($scope.nested_page_id == 1){
				$scope.nested_page_id = 2;
				$scope._scroll_page_to_id("Search");
				$scope.hide_text = true;
				// $scope.typing_active = true;
				$scope.$broadcast('timer-start');
				$scope.search_animated = "<span>"+$scope.current_text+"</span>";
			}
			else if($scope.nested_page_id == 2){
			}
			else if($scope.nested_page_id == 3){
			}
			else{
				_next_page();
			}
		}
		else if(connect){
			$scope.nested_page_id = $scope.nested_page_id + 1;
			if($scope.nested_page_id == 1){
				$scope._scroll_page_to_id("ConnectInner");
				$scope.hide_text = true;
			}
			else if($scope.nested_page_id == 2){
			}
			else if($scope.nested_page_id == 3){
			}
			else{
				_next_page();
			}
		}
		else if(explore){
			if($scope.nested_page_id == 0){
				$scope._scroll_page_to_id("ExploreInner");
				_next_nested_page();
			}
			else{
				$scope.nested_page_id = 0;
				_next_page();
			}
		}
		else if(personalise){
			if($scope.nested_page_id == 0){
				$scope._scroll_page_to_id("PersonaliseInner");
				_next_nested_page();
			}
			else{
				$scope.nested_page_id = 0;
				_next_page();
			}
		}
		else{
			_next_page();
		}
	}

	$scope.scroll_previous_state = function(){
		$scope.hide_text = false;
		var page_id = $scope.current_page_id - 1;
		$scope.scroll_page(page_id);
	}

	$scope.scroll_on_keypress = function(event){
		if(event.keyCode == WebsiteUIConstants.KeyUp){
			$scope.scroll_previous_state();
		}
		else if(event.keyCode == WebsiteUIConstants.KeyDown){
			$scope.scroll_next_state();
		}
		event.stopPropagation();
	}

	$scope.bind_mousewheel_scroll = function(event){
		event.preventDefault();
		var delta = event.wheelDelta;
		var handle_scroll = function(){
			if(delta > 0){
				if($scope.current_page_id > 0){
					$scope.scroll_previous_state();
				}
			}
			else{
				if($scope.current_page_id < $scope.data.length){
					$scope.scroll_next_state();
				}
			}
		}


		if($scope.scroll_active){
			$scope.scroll_active = false;
			handle_scroll();
			var timeout_event = $timeout(function(){
				$scope.scroll_active = true;
			}, 500);
			$scope.$on('destroy', function(){
				$timeout.cancel(timeout_event);
			});
		}

		event.stopPropagation();
	}

	$scope.show_signin_options = function(event){
		$mdSidenav('right').toggle();
		event.stopPropagation();
	}

	$scope.left_tab_list = function(event) {
    	$mdSidenav('left').toggle();
		event.stopPropagation();
  	}

	_init();
    
}]);