angular.module('sticky', [])

.directive('sticky', ['$timeout', '$rootScope', function($timeout, $rootScope){
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
					stickyLine = 50;
					checkSticky();
				}

				// Check if the window has passed the sticky line
				//
				function checkSticky(){
					// scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
					scrollLeft = (window.pageXOffset || doc.scrollLeft)  - (doc.clientLeft || 0);
					console.log(window.pageXOffset, doc.scrollLeft, doc.clientLeft, scrollLeft, stickyLine, scrollLeft >= stickyLine);
					if (scrollLeft >= stickyLine){
						$elem.css('position', 'fixed');
						$elem.css('top', '95px');
						$elem.css('z-index', 5);
						if($rootScope.user.collapsed_column){
							$elem.css('left', '20px');
						}
						else{
							$elem.css('left', '260px');
						}
						var timeout_event = $timeout(function(){
							$rootScope.compressed_info = true;
							$elem.css('position', initialPositionStyle);
						}, 1000);
						$scope.$on('destroy', function(){
							$timeout.cancel(timeout_event);
						});
					}
					else{
						$rootScope.compressed_info = false;
						console.log("settig false", $rootScope.compressed_info);
						$timeout.cancel(timeout_event);
					 	$elem.css('position', initialPositionStyle);
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