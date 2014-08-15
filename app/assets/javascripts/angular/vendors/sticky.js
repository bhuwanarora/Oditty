angular.module('sticky', [])

.directive('sticky', ['$timeout', function($timeout){
	return {
		restrict: 'A',
		link: function($scope, $elem, $attrs){
			$timeout(function(){
				var offsetLeft = $scope.offset || 0,
					$window = angular.element(window),
					doc = document.documentElement,
					initialPositionStyle = $elem.css('position'),
					stickyLine,
					scrollLeft;


				// Set the top offset
				//
				$elem.css('top', offsetLeft+'px');


				// Get the sticky line
				//
				function setInitial(){
					stickyLine = 200;
					checkSticky();
				}

				// Check if the window has passed the sticky line
				//
				function checkSticky(){
					// scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
					scrollLeft = (window.pageXOffset || doc.scrollLeft)  - (doc.clientLeft || 0);
					if (scrollLeft >= stickyLine ){
						$scope.compressed_info = true;
						// $elem.css('position', 'fixed');
					} else {
						$scope.compressed_info = false;
						// $elem.css('position', initialPositionStyle);
					}
				}


				// Handle the resize event
				//
				function resize(){
					$elem.css('position', initialPositionStyle);
					$timeout(setInitial);
				}


				// Attach our listeners
				//
				$window.on('scroll', checkSticky);
				$window.on('resize', resize);
				
				setInitial();
			});
		},
	};
}]);