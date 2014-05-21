websiteApp.directive('infoCard', function($rootScope, $timeout){
	return{
		restrict: 'E',
		templateUrl: "/assets/angular/widgets/base/widget/info_card.html"
	}
});

websiteApp.directive('track', function($rootScope){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			element.bind('mouseleave', function(event){
				_record_details(event)
			})

			element.bind('mouseenter', function(event){
				_record_details(event)
			})

			element.bind('click', function(event){
				_record_details(event)
			})

			_record_details = function(event){
				node_name = event.currentTarget.nodeName
				time_stamp = event.timeStamp
				thousand_milliseconds = 100000
				time_stamp = thousand_milliseconds * ((time_stamp % thousand_milliseconds)/thousand_milliseconds)
				action_type = event.type

				if(node_name == "A"){
					node_name = event.currentTarget.href
				}
				id = event.currentTarget.id
				uid = node_name+":"+id
				array = id.split("-")
				containsCategory = array.length > 1
				if(containsCategory){
					category = array[0]
					book_id = array[1]
				}
				else{
					category = ""
					book_id = ""
				}
				data_json = [{"time_stamp": time_stamp, 
							"action_type": action_type, 
							"node_name": node_name, 
							"uid": uid,
							"category": category,
							"book_id": book_id}]
				$rootScope.data = $rootScope.data.concat(data_json)
			}
		}
	}
})

websiteApp.directive('horizontalScroller', function(){
	return{
		restrict: 'E',
		templateUrl: "/assets/angular/widgets/base/horizontal_scroller.html"
	}
})

websiteApp.directive('setFocus', function($timeout, $parse, $rootScope) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.setFocus);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].value = String.fromCharCode($rootScope.keyCode);
            element[0].focus(); 
            // $speechSynthetis.speak("You are at Reader's Door. How can I help you?", 'en-UK');
          });
        }
      });
    }
  };
});

websiteApp.directive('typeAhead', function($timeout, $sce){
	return{
		restrict: 'E',
		scope: {
			items: '=',
	      	prompt: '@',
	      	title: '@',
	      	id: '@',
	      	custom: '@',
	      	customOptions: '@',
	      	subtitle: '@',
	      	model: '=',
	      	onSelect: '&'
		},
		link: function(scope, elem, attrs){
			scope.handle_selection = function(selectedItem) {
				scope.model = selectedItem.toUpperCase();
			    scope.current = 0;
			    scope.selected = true;
			    scope.onSelect();
			    // $timeout(function() {
			    // }, 200);
			};

			scope.is_current = function(index, selectedItem) {
				if(scope.current == index){
					scope.currentItem = selectedItem;
				}
			    return scope.current == index;
			};

			scope.set_current = function(index) {
			    scope.current = index;
			};

			scope.navigate_options = function(){
				var keyEnter = event.keyCode == 13;
				if(keyEnter){
					scope.handle_selection(scope.currentItem);
				}
			}

			scope.key_up = function(){
				var keyUp = event.keyCode == 38;
				var keyDown = event.keyCode == 40;
				if(keyUp){
					if(scope.current != 0){
						scope.set_current(scope.current-1);
					}
				}

				if(keyDown){
					if(scope.current != scope.filtered.length -1){
						scope.set_current(scope.current+1);
					}
				}
			}

			scope.highlight = function(searchItem, textToSearchThrough){
    			return $sce.trustAsHtml(textToSearchThrough.replace(new RegExp(searchItem, 'gi'), '<span style="font-weight:bold;">$&</span>'));
			}

			_init = function(){
				scope.current = 0;
				scope.selected = true; // hides the list initially
			}

		  	scope.focus_on_input = function(){
		  		elem.find('input').focus();
		  	}

			_init();
		},
		controller: function($scope, recommendationService){
		  	_init = function(){
		  		$scope.name = ''; // This will hold the selected item
		  	}


		  	_init();
		},
		templateUrl: 'assets/angular/widgets/partials/type_ahead.html'
	}
});

websiteApp.directive('message', function($motion){
	return{
		restrict: 'E',
		controller: function($scope){
			$scope.close_message = function(){
				if($scope.message == 'Allow your webcam. Swipe Left|Right to look for more books.'){
					$scope.message = 'Just "START TYPING" anytime to search.'
				}
				else{
					$scope.message_closed = true;
				}
			}

			_init_motion_adaption = function(){
				$motion.start();
				
				$motion.onSwipeLeft(function(){
					console.log("%c SWIPE LEFT", "color: blue;");
					$scope.scroll_one_page_right();
				});
				$motion.onSwipeRight(function(){
					console.log("%c SWIPE RIGHT", "color: blue;");
					$scope.scroll_one_page_left();
				});
			}

			_init = function(){
				$scope.message_closed = true;
				_init_motion_adaption();
				$scope.message = 'Allow your webcam. Swipe Left|Right to look for more books.'
			}

			_init();
		},
		templateUrl: 'assets/angular/widgets/partials/message.html'
	}
});

websiteApp.directive('notification', function(){
	return{
		restrict: 'E',
		scope: {"notification": "=data"},
		templateUrl: 'assets/angular/widgets/partials/notification.html'
	}
});


websiteApp.directive('compile', function($compile){
	return function(scope, element, attrs){
				var ensureCompileRunsOnce = scope.$watch(function(scope){
	            	// watch the 'compile' expression for changes
	            	return scope.$eval(attrs.compile);
	            },
	            function(value){
	              	// when the 'compile' expression changes
	              	// assign it into the current DOM
	              	element.html(value);

	              	// compile the new DOM and link it to the current
	              	// scope.
	              	// NOTE: we only compile .childNodes so that
	              	// we don't get into infinite loop compiling ourselves
	              	$compile(element.contents())(scope);
	                
	              	// Use Angular's un-watch feature to ensure compilation only happens once.
	              	ensureCompileRunsOnce();
	            });
			}
});

websiteApp.directive('searchBar', function(){
	return{
		restrict: 'E',
		templateUrl: 'assets/angular/widgets/partials/search_bar.html'
	}
});