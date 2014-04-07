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

websiteApp.directive('setFocus', function($timeout, $parse, $rootScope, $speechRecognition, $speechSynthetis) {
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

websiteApp.directive('pushNotification', function($rootScope, $parse, $timeout){
	return{
		link: function(scope, element, attrs){
			var model = $parse(attrs.pushNotification);
			scope.$watch(model, function(value){
				if(value == true){
					element[0].firstChild.nextSibling.innerHTML = $rootScope.message_type //header
					element[0].firstChild.nextSibling.nextSibling.nextSibling.innerHTML = $rootScope.message //message
					$timeout(function(){
						$rootScope.notification_active = false
						$rootScope.message = ""
					}, 10000)
				}
			})
		}
	}
});

websiteApp.directive('typeAhead', function($timeout){
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

			scope.is_current = function(index) {
			    return scope.current == index;
			};

			scope.set_current = function(index) {
			    scope.current = index;
			};

			scope.navigate_options = function(){
				var keyEnter = event.keyCode == 13;
				if(keyEnter){
					scope.handle_selection("NOT WORKING"+scope.current);
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
					scope.set_current(scope.current+1);
				}
			}

			_init = function(){
				scope.current = 0;
				scope.selected = true; // hides the list initially
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


websiteApp.directive('angularte', function() {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function (scope, element, attrs, ngModel) {
            $(function () {
                element.jqte({
                    // On focus show the toolbar
                    focus: function () {
                        scope.$apply(function () {
                            element.parents(".jqte").find(".jqte_toolbar").show();
                            element.parents(".jqte").click(function () { element.parents(".jqte").find(".jqte_toolbar").show(); });
                        });
                    },
                    // On blur hide the toolar
                    blur: function () {
                        scope.$apply(function () {
                            element.parents(".jqte").find(".jqte_toolbar").hide();
                        });
                    },
                    // On change refresh the model with the textarea value
                    change: function () {
                        scope.$apply(function () {
                            ngModel.$setViewValue(element.parents(".jqte").find(".jqte_editor")[0].innerHTML);
                        });
                }
                });
                element.parents(".jqte").find(".jqte_toolbar").hide();
            });

            // On render refresh the textarea with the model value 
            ngModel.$render = function () {
                element.parents(".jqte").find(".jqte_editor")[0].innerHTML = ngModel.$viewValue || '';
            };
        }
    }
});