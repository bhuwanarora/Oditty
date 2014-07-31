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

websiteApp.directive('toggle', function(){
	return{
		restrict: 'E',
		scope: {"obj": "=data", 
				"onSelect": "&",
				"onDeselect": "&"},
		controller: ['$scope', function($scope){
			$scope.toggle = function(){
				if($scope.obj.status){
					$scope.obj.status = false;
					$scope.onDeselect();
				}
				else{
					$scope.obj.status = true;
					$scope.onSelect();
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
        if(value == true) { 
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

websiteApp.directive('typeAhead', ['$timeout', '$sce', '$document', function($timeout, $sce, $document){
	return{
		restrict: 'E',
		scope: {
			items: '=',
	      	prompt: '@',
	      	title: '@',
	      	id: '@',
	      	custom: '@',
	      	iconClass: '@',
	      	customOptions: '@',
	      	focusWhen: '=',
	      	subtitle: '@',
	      	model: '=',
	      	itemId: '=',
	      	onSelect: '&',
	      	autoPopulate: '&',
	      	onClear: '&'
		},
		link: function(scope, elem, attrs){
			// $document.bind('click', function(event){
		 //        var isClickedElementChildOfPopup = elem
		 //          .find(event.target)
		 //          .length > 0;
		 //          console.log();
		 //        if (!isClickedElementChildOfPopup){
			//         scope.selected = true;
			//         scope.$apply();
		 //        }
		          	
	  //     });

		},

		controller: ['$scope', '$sce', 'recommendationService', function($scope, $sce, recommendationService){
			$scope.is_current = function(index, selectedItem) {
				if($scope.current == index){
					$scope.currentItem = selectedItem.name;
					$scope.currentItemId = selectedItem.id;
				}
			    return $scope.current == index;
			};

			$scope.set_current = function(index) {
			    $scope.current = index;
			};

			$scope.navigate_options = function(){
				var keyEnter = event.keyCode == 13;
				if(keyEnter){
					$scope.handle_selection($scope.currentItem, $scope.currentItemId);
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
					if(angular.isUndefined($scope.model) || $scope.model == ""){
						$scope.filtered = [];
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
				if(angular.isDefined(textToSearchThrough) && angular.isDefined(searchItem)){
	    			return $sce.trustAsHtml(textToSearchThrough
	    					.replace(new RegExp(searchItem, 'gi'), 
	    					'<span style="font-weight:bold;">$&</span>'));
				}
			}

			$scope.remove_filter = function(){
				$scope.model = "";
				$scope.onClear();
			}

		  	$scope.handle_selection = function(selectedItem, selectedItemId) {
		  		if(angular.isDefined(selectedItemId)){
		  			$scope.itemId = selectedItemId;
					$scope.model = selectedItem.toUpperCase();
		  		}
		  		else{
		  			$scope.itemId = selectedItem.id;
					$scope.model = selectedItem.name.toUpperCase();	
		  		}
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

websiteApp.directive('notification', ['$rootScope', '$timeout', function($rootScope, $timeout){
	return{
		restrict: 'E',
		scope: {"notification": "=data"},
		controller: ['$scope', function($scope){
			$scope.toggle_ticker_popup = function(event, notification){
				var ticker_popup_absent = $rootScope.ticker_popup == null;
				if(ticker_popup_absent){
					$rootScope.ticker_popup = $scope.notification.book;
					$rootScope.focused_book = null;
					// var top = _get_arrow_position(event);
					// $rootScope.ticker_position = {"top": top+"px"};
				}
				else{
					if($rootScope.ticker_popup == $scope.notification.book){
						$rootScope.ticker_popup = null;
					}
					else{
						var timeout_event = $timeout(function(){
							$rootScope.ticker_popup = $scope.notification.book;
						});

						$scope.$on('destroy', function(){
							$timeout.cancel(timeout_event);
						});
					}
				}
				event.stopPropagation();
			}

			_get_arrow_position = function(event){
				// console.log(event.currentTarget);
				// console.log(event.currentTarget.clientHeight);
				// console.log(event.currentTarget.offsetHeight);
				// console.log(event.currentTarget.pageY);
				// console.log(event.currentTarget.y);
				// console.log(event.currentTarget.style);
				// console.log(event.currentTarget.css);
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
				// var top = _get_arrow_position(event);
				$rootScope.ticker_popup = $scope.notification.book;	
				// $rootScope.ticker_position = {"top": top+"px"};
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

websiteApp.directive('checkScrollBottom', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var elem = element[0];
            element.bind('scroll', function () {
                if (elem.scrollTop + elem.offsetHeight > elem.scrollHeight) {
                    scope.$apply(attrs.checkScrollBottom);
                }
            });
        }
    };
});

websiteApp.directive('checkScrollUp', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var elem = element[0];
            var position = elem.scrollTop;
            element.bind('scroll', function(){
                if(elem.scrollTop <= position){
                	scope.$apply(attrs.checkScrollUp);
                }
                position = elem.scrollTop;
            });
        }
    };
});

websiteApp.directive('checkScrollDown', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var elem = element[0];
            var position = elem.scrollTop;
            element.bind('scroll', function(){
                if(elem.scrollTop > position){
                	scope.$apply(attrs.checkScrollDown);
                }
                position = elem.scrollTop;
            });
        }
    };
});

websiteApp.directive('focusOut',function(){
	return function postLink(scope, element, attrs) {
        element.bind('blur', function () {
            scope.$apply(attrs.focusOut);
        });
	};
});

websiteApp.directive('calendar', ['$rootScope', function($rootScope){
	return{
		restrict: 'E',
		scope : {saveDate: '&'},
		controller: ['$scope', function($scope){
			$scope.date_check = function(){
				var month = $scope.months.indexOf($scope.selectedMonth) + 1;
				var no_days = new Date($scope.selectedYear, month, 0).getDate();
				$scope.days = new Array(no_days)
							.join()
							.split(',')
							.map(function(item, index){return ++index;});
			}

			$scope.save_date = function(selectedYear, selectedMonth, selectedDay){
				$rootScope.user.selectedDay = selectedDay;
				$rootScope.user.selectedMonth = selectedMonth;
				$rootScope.user.selectedYear = selectedYear;
				$scope.saveDate();
			}

			_init =function(){
				$scope.days = new Array(31)
							.join()
							.split(',')
							.map(function(item, index){return ++index;});
				$scope.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				$scope.years = [];
				
				$scope.selectedDay = $rootScope.user.selectedDay;
				$scope.selectedMonth = $rootScope.user.selectedMonth;
				$scope.selectedYear = $rootScope.user.selectedYear;

				var currentYear = new Date().getFullYear();
				for(var i=currentYear; i>1904; i--){
					$scope.years.push(i);
				}
			}

			_init();
		}],
		templateUrl: '/assets/angular/widgets/partials/calendar.html'
	}
}]);

websiteApp.directive('feedbackPopup', ['$document', 'websiteService', '$rootScope', function($document, websiteService, $rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // var options = scope.$eval(attrs.feedbackPopup);
      
      element = element.children();
      var startX = 0, startY = 0, x = 300, y = 50;
      
      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        // event.preventDefault();
        startX = event.screenX - x;
        startY = event.screenY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.screenY - startY;
        x = event.screenX - startX;
        if(y < 0){
        	y = 0
        }
        else if(y > screen.height){
        	y = screen.height;
        }
        if(x < 0){
        	x = 0
        }
        else if(x > screen.width){
        	x = screen.width;
        }
        element.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    },
    controller: ['$scope', function($scope){
    	$scope.get_feedback = false;
    	$scope.feedback_text = "Feedback";
    	$scope.handle_feedback = function(event){
    		if($rootScope.user.feedback.length > 8){
				var params = {"feedback": $rootScope.user.feedback};
				$scope.get_feedback = false;
				$scope.feedback_text = "Thanks! :)";
				websiteService.save_feedback(params);
    		}
    		else{
    			$scope.feedback_text = "Please elaborate a bit more..";
    		}
    	}
    }],
    templateUrl: '/assets/angular/widgets/partials/feedback_popup.html'
  };
}]);

websiteApp.directive('interactionBox', ['$rootScope', '$timeout', 'websiteService', 'widgetService', function($rootScope, $timeout, websiteService, widgetService){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.update_hashtagged_comment = function(){

      }

      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.close_interaction_box = function(){
        $rootScope.focused_book.interact = false;
        $scope.hash_tags = [];
      }

      $scope.stop_horizontal_scroll = function(event){
        event.stopPropagation();
      }

      $scope.handle_selection = function(selected_item){
        $scope.current = 0;
        var string_array = $rootScope.focused_book.current_comment.split(" ");
        var html_array = $rootScope.focused_book.hash_tagged_comment.split(" ");
        var chr = String.fromCharCode(event.keyCode);
        var len = string_array.length;
        if(len == 1){
          var old_string = string_array.slice(0, len-1).join(" ").trim();
          var old_html = html_array.slice(0, len-1).join(" ").trim();
        }
        else{
          var old_string = string_array.slice(0, len-1).join(" ")+" ";
          var old_html = html_array.slice(0, len-1).join(" ")+" ";
        }
        var current_element = string_array.pop();
        var current_html = html_array.pop();
        var is_backspace = event.keyCode == 8;
        var hash_tagging = $scope.hash_tagging;
        $rootScope.focused_book.hash_tagged_comment = old_html+"<b>"+selected_item+"</b>";
        $rootScope.focused_book.current_comment = old_string+selected_item;
        $scope.hash_tags = null;
        event.stopPropagation();
        //TODO: SET FOCUS ON CLICK
      }

      $scope.handle_backspace = function(event){
        var string_array = $rootScope.focused_book.current_comment.split(" ");
        var html_array = $rootScope.focused_book.hash_tagged_comment.split(" ");
        var chr = String.fromCharCode(event.keyCode);
        var len = string_array.length;
        if(len == 1){
          var old_string = string_array.slice(0, len-1).join(" ");
          var old_html = html_array.slice(0, len-1).join(" ");  
        }
        else{
          var old_string = string_array.slice(0, len-1).join(" ")+" ";
          var old_html = html_array.slice(0, len-1).join(" ")+" ";
        }
        var current_element = string_array.pop();
        var current_html = html_array.pop();
        var is_backspace = event.keyCode == 8;
        var hash_tagging = $scope.hash_tagging;
        if(is_backspace){
          if(current_element == "#"){
            $scope.hash_tagging = false;
            $scope.hash_tags = [];
            $rootScope.focused_book.hash_tagged_comment = old_html;
          }
          else{
            var hash_tagging_breaking_in_betwen = old_html.split("<b>").length != old_html.split("</b>").length
            var inside_a_hashtag = current_html[current_html.length - 1] == ">";
            if(hash_tagging_breaking_in_betwen){
              html_array = old_html.split("<b>");
              len = html_array.length;
              old_html = html_array.slice(0, len-1).join("<b>");
              old_string = old_html.replace(/<b>/, "").replace(/<\/b>/, "");
            }
            if(hash_tagging || inside_a_hashtag){
              $rootScope.focused_book.hash_tagged_comment = old_html;
              $rootScope.focused_book.current_comment = old_string;
              $scope.is_new_word_initiation = true;
              $scope.hash_tagging = false;
              $scope.hash_tags = [];
              event.preventDefault();
            }
            else{
              var html = $rootScope.focused_book.hash_tagged_comment;
              $rootScope.focused_book.hash_tagged_comment = html.substring(0, html.length-1);
            }
          }
          if(!$rootScope.focused_book.current_comment || $rootScope.focused_book.current_comment == ""){
            $rootScope.focused_book.hash_tagged_comment = "";
          }
        }
        event.stopPropagation();
      }

      $scope.handle_hash_tags = function(event){
        if($rootScope.focused_book.current_comment.trim() == ""){
          $scope.is_new_word_initiation = true;
        }
        var string_array = $rootScope.focused_book.current_comment.split(" ");
        var chr = String.fromCharCode(event.keyCode);
        var len = string_array.length;
        var old_string = string_array.slice(0, len-1).join(" ");
        var current_element = string_array.pop();
        var is_new_word_initiation = $scope.is_new_word_initiation;
        var under_a_tag = $scope.hash_tagging;
        var keyEnter = event.keyCode == 13;
        console.table([{"is_new_word_initiation":  is_new_word_initiation,
                        "chr": chr,
                        "len": len,
                        "old_string": old_string,
                        "current_element": current_element,
                        "current_comment": $rootScope.focused_book.current_comment,
                        "under_a_tag": under_a_tag}]);
        if((keyEnter) && ($scope.hash_tags)){
          event.preventDefault();
          $scope.handle_selection($scope.currentItem);
        }
        else if((keyEnter) && (!$scope.hash_tags)){
          var tweet_text = $rootScope.focused_book.hash_tagged_comment
                                .replace(/<b>/, "<a>")
                                .replace(/<\/b>/, "<\/a>");
          if($rootScope.user.thumb){
            var thumb = $rootScope.user.thumb;
            var tweet = {"message": tweet_text, "thumb": thumb};
          }
          else{
            var tweet = {"message": tweet_text}; 
          }
          $rootScope.focused_book.current_comment = "";
          $rootScope.focused_book.hash_tagged_comment = "";
          $rootScope.focused_book.tweets.push(tweet);
          _add_comment(tweet);
          event.preventDefault();
        }
        else{
          if(is_new_word_initiation && chr == "#"){
            var html = "<b>"+chr+"</b>";
            $scope.hash_tagging = true;
            $rootScope.focused_book.hash_tagged_comment = $rootScope.focused_book.hash_tagged_comment+html;
          }
          else if(is_new_word_initiation && chr == "+"){
            var html = "<b>"+chr+"</b>";
            $scope.hash_tagging = true;
            $rootScope.focused_book.hash_tagged_comment = $rootScope.focused_book.hash_tagged_comment+html;
            $scope.search_for = "TAGS";
          }
          else if(is_new_word_initiation && chr == "@"){
            var html = "<b>"+chr+"</b>";
            $scope.hash_tagging = true;
            $rootScope.focused_book.hash_tagged_comment = $rootScope.focused_book.hash_tagged_comment+html;
            $scope.search_for = "[AUTHORS, READERS]";
          }
          else{
            if(chr == " "){
              $scope.hash_tagging = false;
              $rootScope.focused_book.hash_tagged_comment = $rootScope.focused_book.hash_tagged_comment+chr;
              $scope.search_for = null;
            }
            else{
              if($scope.hash_tagging){
                var hash_tagged = $rootScope.focused_book.hash_tagged_comment.split("</b>");
                var length = hash_tagged.length;
                if(length > 2){
                  var last = hash_tagged[length - 2]+chr+"</b>"+hash_tagged[length - 1];
                  $rootScope.focused_book.hash_tagged_comment = hash_tagged.slice(0, length - 2).join("</b>")+"</b>"+last;
                }
                else{
                  var last = hash_tagged[length - 2]+chr+"</b>"+hash_tagged[length - 1];
                  $rootScope.focused_book.hash_tagged_comment = last;
                }
              }
              else{
                $rootScope.focused_book.hash_tagged_comment = $rootScope.focused_book.hash_tagged_comment+chr;
              }
            }
          }
          if($scope.search_for){
            if(current_element.length > 2){
              string_to_be_searched = current_element.slice(1, current_element.length)+""+chr;
              websiteService.search(string_to_be_searched.trim(), $scope.search_for, 3).then(function(result) {
                  $scope.hash_tags = [];
                  var data = result.results.data;
                  for(var i=0; i < data.length; i++){
                    var json = {"name": data[i][0]};
                    $scope.hash_tags.push(json);
                  }
              });
            }
          }

          if(chr == " "){
            $scope.is_new_word_initiation = true;
          }
          else{
            $scope.is_new_word_initiation = false; 
          }
        }

        event.stopPropagation();
      }

      _add_comment = function(tweet){
        var params = {
          "id": $rootScope.focused_book.id,
          "message": tweet
        }
        widgetService.comment(params);
        var name = $rootScope.user.email;
        var message = "<span><b>"+name+"</b> </span><span class='site_color'>"+tweet["message"]+"</span>";
        var thumb = "assets/profile_pic.jpeg"
        var notification = {
          "thumb":thumb,
          "message":message,
          "timestamp":new Date().getTime(),
          "book":{
            "id":$rootScope.focused_book.id,
            "title":$rootScope.focused_book.title,
            "author_name":$rootScope.focused_book.author_name,
            "isbn":$rootScope.focused_book.isbn
          },
          "user":{
            "id":$rootScope.user.id,
            "name":$rootScope.user.email
          }
        }
        $scope.$emit('addToNotifications', notification);
      }

      $scope.is_current = function(index, selectedItem) {
        if($scope.current == index){
          $scope.currentItem = selectedItem;
        }
          return $scope.current == index;
      };

      $scope.set_current = function(index) {
          $scope.current = index;
      };

      $scope.key_up = function(){
        var keyUp = event.keyCode == 38;
        var keyDown = event.keyCode == 40;
        if(keyUp){
          if($scope.current != 0){
            $scope.set_current($scope.current-1);
          }
          else{
            $scope.set_current($scope.hash_tags.length-1);
          }
        }
        else if(keyDown){
          if($scope.current != $scope.hash_tags.length -1){
            $scope.set_current($scope.current+1);
          }
          else{
            $scope.set_current(0);
          }
        }
      }

      _init = function(){
        $scope.is_new_word_initiation = true;
        $rootScope.focused_book.current_comment = "";
        $rootScope.focused_book.hash_tagged_comment = "";
        $scope.current = 0;
      }

      _init();

    }],
    templateUrl: "/assets/angular/widgets/base/book/interaction_box.html"
  }
}]);