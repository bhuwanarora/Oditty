websiteApp.directive('siteLogo', [function(){
	return{
		restrict: 'E',
		templateUrl: "/assets/angular/widgets/partials/site_logo.html"
	}
}]);

websiteApp.directive('userThumb', [function(){
	return{
		restrict: 'E',
		templateUrl: '/assets/angular/widgets/partials/user_thumb.html'
	}
}]);

websiteApp.directive('infoCard', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'E',
		controller: ['$scope', 'websiteService', function($scope, websiteService){
			_get_genres = function(){
		    	websiteService.get_genres().then(function(data){
		    		$scope.genres = data.genres;
		    	});
		    }

		    _profile_status_colors = function(){
				var profile_status = $rootScope.user.profile_status;
				if(profile_status == 0){
					$rootScope.user.profile_status_color = "#4374e0";
				}
				else if(profile_status == 1){
					$rootScope.user.profile_status_color = "#65b045";
				}
				else if(profile_status == 2){
					$rootScope.user.profile_status_color = "#d73d32";
				}
				else if(profile_status == 3){
					$rootScope.user.profile_status_color = "#11a9cc";
				}
				else if(profile_status == 4){
					$rootScope.user.profile_status_color = "#981b48";
				}
				else if(profile_status == 5){
					$rootScope.user.profile_status_color = "#7e3794";
				}
				else if(profile_status == 6){
					$rootScope.user.profile_status_color = "#4374e0";
				}
				else if(profile_status == 7){
					$rootScope.user.profile_status_color = "#981b48";	
				}
				else if(profile_status == 8){
					$rootScope.user.profile_status_color = "#981b48";
				}
			}

			_handle_info_card_bindings = function($scope){
				if($rootScope.user.profile_status == 6){
					if(navigator.geolocation){
						navigator.geolocation.getCurrentPosition(function(position){
							var latitude = position.coords.latitude;
							var longitude = position.coords.longitude;
							$rootScope.user.latitude = latitude;
							$rootScope.user.longitude = longitude;
						});
					}
					else{
						x.innerHTML="Geolocation is not supported by this browser.";
					}
				}
				else if($rootScope.user.profile_status == 4){
					// $rootScope.$broadcast('showBookReadShelf');
				}
				else if($rootScope.user.profile_status == 2){
					_get_genres();
				}
			}

			_get_info_data = function(){
				websiteService.get_info_data().then(function(data){
					$scope.book_counts = data.reading_count_list;
					$scope.user_book_count = $scope.book_counts[0];
				});

			}
			
			_init = function(){
				$rootScope.user.profile_status = 0;
	    		_profile_status_colors();
	    		_get_info_data();

				$scope.profileOptions = [
					{"name": "Reader"},
					{"name": "Author"},
					{"name": "Publisher"},
					{"name": "Editor"}
				]
				$scope.gender = "Male";
				$scope.profileSelected = {"name": "Reader"};
				$scope.info_card_width = 350; //in px
				$scope.info_card_ratio = 1.34;
			}


			$scope.prev_profile_state = function(){
				if($rootScope.user.profile_status != 0){
					$rootScope.user.profile_status = $rootScope.user.profile_status - 1;
				}
				else{
					$rootScope.user.profile_status = 8;
				}
				_handle_info_card_bindings($scope);
				_profile_status_colors();
			}

			$scope.next_profile_state = function(){
				if($rootScope.user.profile_status != 8){
					$rootScope.user.profile_status = $rootScope.user.profile_status + 1;
				}
				else{
					$rootScope.user.profile_status = 0;
				}
				_handle_info_card_bindings($scope);
				_profile_status_colors();
			}

			$scope.stop_horizontal_scroll = function(event){
				event.stopPropagation();
			}

			$scope.update_profile = function(){
				var enter_pressed = event.keyCode == 13;
				if(enter_pressed){
					var profile_status = $rootScope.user.profile_status;
					if(profile_status == 0){
						websiteService.update_profile($rootScope.user);
						$rootScope.user.profile_status = $rootScope.user.profile_status + 1;
						_profile_status_colors();
					}
				}
			}
			$scope.user_profile_changed = function(selected){
				if(selected.name == "Reader" || selected.name == "Author"){
					$scope.show_loading_bar = true;
					var timeout_event = $timeout(function(){
						$scope.show_loading_bar = false;
						$scope.ask_book_count = true;
					}, 1000);
				}
			}

			$scope.add_book = function(){

			}

			$scope.add_author = function(){

			}

			$scope.get_search_results = function(event, type, searchResults){
				if(searchResults){
					searchResults = searchResults + String.fromCharCode(event.keyCode);
				}
				else{
					searchResults = String.fromCharCode(event.keyCode);	
				}
				websiteService.search(searchResults, type, 3)
		        .then(function(result) {
		            $scope.search_results = $scope.search_results.concat(result.results);
		        });
			}

			_init();

		}],
		templateUrl: "/assets/angular/widgets/base/widget/info_card.html"
	}
}]);

websiteApp.directive('toggle', function(){
	return{
		restrict: 'E',
		scope: {"obj": "=data"},
		controller: ['$scope', function($scope){
			$scope.toggle = function(){
				if($scope.active){
					$scope.active = false;
				}
				else{
					$scope.active = true;
				}
			}
		}],
		templateUrl: "/assets/angular/widgets/partials/toggle.html"
	}
});

websiteApp.directive('track', ['$rootScope', function($rootScope){
	return{
		restrict: 'A',
		link: ['scope', 'element', 'attrs', function(scope, element, attrs){
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
		}]
	}
}]);

websiteApp.directive('horizontalScroller', function(){
	return{
		restrict: 'E',
		templateUrl: "/assets/angular/widgets/base/horizontal_scroller.html"
	}
});

websiteApp.directive('setFocus', ['$timeout', '$parse' , '$rootScope', function($timeout, $parse, $rootScope) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.setFocus);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
          	if($rootScope.keyCode){
            	element[0].value = String.fromCharCode($rootScope.keyCode);
          	}
            element[0].focus(); 
            // $speechSynthetis.speak("You are at Reader's Door. How can I help you?", 'en-UK');
          });
        }
      });
    }
  };
}]);

websiteApp.directive('typeAhead', ['$timeout', '$sce', function($timeout, $sce){
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
	      	onSelect: '&',
	      	autoPopulate: '&',
	      	onClear: '&'
		},
		link: ['scope', 'elem', 'attrs', function(scope, elem, attrs){


		}],
		controller: ['$scope', '$sce', 'recommendationService', function($scope, $sce, recommendationService){
			$scope.is_current = function(index, selectedItem) {
				if($scope.current == index){
					$scope.currentItem = selectedItem;
				}
			    return $scope.current == index;
			};

			$scope.set_current = function(index) {
			    $scope.current = index;
			};

			$scope.navigate_options = function(){
				var keyEnter = event.keyCode == 13;
				if(keyEnter){
					$scope.handle_selection($scope.currentItem);
				}
			}

			$scope.key_up = function(){
				var keyUp = event.keyCode == 38;
				var keyDown = event.keyCode == 40;
				var backSpace = event.keyCode == 8;
				if(keyUp){
					if($scope.current != 0){
						$scope.set_current($scope.current-1);
					}
					else{
						$scope.set_current($scope.filtered.length-1);
					}
				}
				else if(keyDown){
					if($scope.current != $scope.filtered.length -1){
						$scope.set_current($scope.current+1);
					}
					else{
						$scope.set_current(0);
					}
				}
				else if(backSpace){
					if($scope.model == undefined || $scope.model == ""){
						$scope.onClear();
					}
				}
			}

			_init = function(){
				$scope.current = 0;
				$scope.selected = true; // hides the list initially
		  		$scope.name = ''; // This will hold the selected item
			}

		  	$scope.focus_on_input = function(){
		  		// elem.find('input')[0].focus();
		  	}

		  	$scope.auto_populate = function(){
		  		$scope.autoPopulate();
		  	}

			$scope.highlight = function(searchItem, textToSearchThrough){
    			return $sce.trustAsHtml(textToSearchThrough
    					.replace(new RegExp(searchItem, 'gi'), 
    					'<span style="font-weight:bold;">$&</span>'));
			}

			$scope.remove_filter = function(){
				$scope.model = "";
				$scope.onClear();
			}

		  	$scope.handle_selection = function(selectedItem) {
				$scope.model = selectedItem.toUpperCase();
			    $scope.current = 0;
			    $scope.selected = true;
			    $timeout(function() {
			    	$scope.onSelect();
			    }, 200);
			};

		  	_init();
		}],
		templateUrl: '/assets/angular/widgets/partials/type_ahead.html'
	}
}]);

websiteApp.directive('message', function(){
	return{
		restrict: 'E',
		controller: ['$scope', function($scope){
			$scope.close_message = function(){
				if($scope.message == 'Allow your webcam. Swipe Left|Right to look for more books.'){
					$scope.message = 'Just "START TYPING" anytime to search.'
				}
				else{
					$scope.message_closed = true;
				}
			}

			_init_motion_adaption = function(){
				// $motion.start();
				
				// $motion.onSwipeLeft(function(){
				// 	console.log("%c SWIPE LEFT", "color: blue;");
				// 	$scope.scroll_one_page_right();
				// });
				// $motion.onSwipeRight(function(){
				// 	console.log("%c SWIPE RIGHT", "color: blue;");
				// 	$scope.scroll_one_page_left();
				// });
			}

			_init = function(){
				$scope.message_closed = true;
				// _init_motion_adaption();
				// $scope.message = 'Allow your webcam. Swipe Left|Right to look for more books.'
			}

			_init();
		}],
		templateUrl: '/assets/angular/widgets/partials/message.html'
	}
});

websiteApp.directive('notification', ['$rootScope', function($rootScope){
	return{
		restrict: 'E',
		scope: {"notification": "=data"},
		controller: ['$scope', function($scope){
			$scope.toggle_ticker_popup = function(event){
				var ticker_popup_absent = $rootScope.ticker_popup == null;
				if(ticker_popup_absent){
					$rootScope.ticker_popup = true;
					var top = _get_arrow_position(event);
					$rootScope.ticker_position = {"top": top+"px"};
				}
				else{
					$rootScope.ticker_popup = null;
				}
				event.stopPropagation();
			}

			_get_arrow_position = function(event){
				console.log(event.currentTarget);
				console.log(event.currentTarget.clientHeight);
				console.log(event.currentTarget.offsetHeight);
				console.log(event.currentTarget.pageY);
				console.log(event.currentTarget.y);
				console.log(event.currentTarget.style);
				console.log(event.currentTarget.css);
				var base = 90;
				var top = 17;
				if(event.y > base && event.y < base + 54){

				}
				else if(event.y > base + 54 && event.y < base + 54*2){
					top = top + 54;
				}
				else if(event.y > base + 54*2 && event.y < base + 54*3){
					top = top + 54*2;
				}
				else if(event.y > base + 54*3 && event.y < base + 54*4){
					top = top + 54*3;
				}
				else if(event.y > base + 54*4 && event.y < base + 54*5){
					top = top + 54*4;
				}
				return top;
			}

			$scope.show_ticker_popup = function(){
				var top = _get_arrow_position(event);
				$rootScope.ticker_popup = true;	
				$rootScope.ticker_position = {"top": top+"px"};
			}
		}],
		templateUrl: '/assets/angular/widgets/partials/notification.html'
	}
}]);


websiteApp.directive('compile', ['$compile', function($compile){
	return ['scope', 'element', 'attrs', function(scope, element, attrs){
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
			}]
}]);

websiteApp.directive('searchBar', function(){
	return{
		restrict: 'E',
		templateUrl: '/assets/angular/widgets/partials/search_bar.html'
	}
});