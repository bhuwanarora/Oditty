websiteApp.directive('author', ['$rootScope', 'widgetService', function ($rootScope, widgetService) {
  return {
    restrict: 'E',
    scope: { 'author': '=data' },
    controller: ['$scope', function($scope){
      $scope.hover = function() {
        $scope.hovered = true;
      };

      $scope.mouseout = function() {
      	$scope.hovered = false;
      };

      $scope.show_focused_tooltip = function(event){
        if($rootScope.focused_author != $scope.author){
          $rootScope.focused_author = $scope.author;
          var posX = event.currentTarget.offsetParent.offsetParent.offsetLeft - event.pageX + event.clientX;
          var display_right_width =  window_width - (posX + event.currentTarget.offsetParent.scrollWidth);
          var display_left_width = posX;

          if(display_right_width > display_left_width){
            if(display_right_width > 400){
              posX = posX + event.currentTarget.offsetParent.scrollWidth - event.currentTarget.offsetLeft;
              $rootScope.focused_author.reposition_tooltip = {"left": posX+"px", "top": "60px"};
            }
            else{
              $rootScope.focused_author.reposition_tooltip = {"right": "0px", "top": "60px"}; 
            }
          }
          else{
            if(display_left_width > 400){
              posX = window_width - posX;
              $rootScope.focused_author.reposition_tooltip = {"right": posX+"px", "top": "60px"}; 
            }
            else{
              $rootScope.focused_author.reposition_tooltip = {"left": "0px", "top": "60px"};  
            }
          }
          // event.currentTarget.offsetParent.offsetParent.scrollWidth;
          // var test = event.currentTarget.offsetParent.offsetParent.offsetLeft -event.currentTarget.offsetLeft;
          // var test2 = event.currentTarget.offsetParent.offsetParent.scrollWidth;
          // var left = event.currentTarget.offsetParent.offsetParent.scrollWidth + event.screenX;
        }
        else{
          delete $rootScope.focused_author;
        }
        event.stopPropagation();
        // body...
      }

      _init = function(){
        $scope.active_author_filter = true;
        // var author_id = $scope.author.id;
        // widgetService.populate_tooltips(author_id).then(function(data){
        //   $scope.author.title = data.title;
        //   $scope.author.author_name = data.author_name;
        //   $scope.author.users = data.users;
        //   $scope.author.summary = data.summary;
        //   $scope.author.users_count = data.users_count;
        // });
        // var tilt_angle = (Math.floor(Math.random() * 10) + 1)/10+"deg";
        // $scope.author_tilt = {"transform":"rotate("+tilt_angle+")",
        //                   "-ms-transform":"rotate("+tilt_angle+")",
        //                   "-webkit-transform":"rotate("+tilt_angle+")";
      }

      _init();

    }],
    templateUrl: "/assets/angular/widgets/base/author/author_widget.html"
  };
}]);

websiteApp.directive('focusedAuthor', ['$rootScope', '$timeout', 'widgetService', function($rootScope, $timeout, widgetService){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.close_focused_tooltip = function(){
        delete $rootScope.focused_author;
      }

      $scope.close_interaction_box = function(){
        $scope.focused_author.interact = false;
        $scope.hash_tags = [];
      }

      $scope.stop_horizontal_scroll = function(event){
        event.stopPropagation();
      }

    }],
    templateUrl: "/assets/angular/widgets/base/author/focused_author.html"
  }
}]);

websiteApp.directive('authorBookmark', ['$rootScope', '$timeout', 'widgetService', function ($rootScope, $timeout, widgetService) {
  return {
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.toggle_bookmarked = function(event){
        var bookmark_status = $scope.author.bookmark_status;
        var author_name = $scope.author.name;
        if(bookmark_status == 1){
          $scope.author.bookmark_status = 0;
          var message = "SUCCESS-Author "+author_name+" has been removed from your bookmark shelf.";
          // $scope.$emit('removeFromBookmarks', "AUTHOR", $scope.author);
        }
        else{
          $scope.author.bookmark_status = 1;
          var message = "SUCCESS-AUTHOR "+author_name+" has been added to your bookmark shelf.";
          // $scope.$emit('addToBookmarks', "AUTHOR", $scope.author);
          $rootScope.$broadcast('glowBookmark');
        }
        var timeout_event = notify($rootScope, message, $timeout);
        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });
        widgetService.bookmark("AUTHOR", $scope.author.id, $scope.author.bookmark_status);
        event.stopPropagation();
      }
    }],
    templateUrl: "/assets/angular/widgets/base/author/bookmark.html"
  };
}]);

websiteApp.directive('authorInteract', ['websiteService', 'WebsiteUIConstants', function (websiteService, WebsiteUIConstants) {
  return {
    restrict: 'E',
    controller: ['$scope', function($scope){
      _init = function(){
        $scope.setStatus();
      }

    	$scope.setStatus = function(status){
    		if(status == 1){
          $scope.read = true;
    		}
    		else{
    			$scope.read = false;
    		}
    		
    	}

      $scope.handle_selection = function(selected_item){
        
      }

      $scope.set_current = function(index){

      }

      $scope.handle_backspace = function(event){
        var string_array = $(event.currentTarget).val().split(" ");
        var html_array = $(event.currentTarget).siblings().html().split(" ");
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
        var is_backspace = event.keyCode == WebsiteUIConstants.Backspace;
        var hash_tagging = $scope.hash_tagging;
        if(is_backspace){
          if(current_element == "#"){
            $scope.hash_tagging = false;
            $scope.hash_tags = [];
            $(event.currentTarget).siblings().html(old_html);
          }
          else{
            if(hash_tagging){
              $(event.currentTarget).siblings().html(old_html);
              $(event.currentTarget).val(old_string);
              $scope.hash_tagging = false;
              $scope.hash_tags = [];
              event.preventDefault();
            }
            else{
              var inside_a_hashtag = current_html[current_html.length - 1] == ">";
              if(inside_a_hashtag){
                $(event.currentTarget).siblings().html(old_html);
                $(event.currentTarget).val(old_string);
                $scope.hash_tags = [];
                event.preventDefault();
              }
              else{
                var html = $(event.currentTarget).siblings().html();
                $(event.currentTarget).siblings().html(html.substring(0, html.length-1));
              }
            }
          }
          if(!$(event.currentTarget).val() || $(event.currentTarget).val() == ""){
            $(event.currentTarget).siblings().html("");
          }
        }
        event.stopPropagation();
      }

      $scope.handle_hash_tags = function(event){
        var string_array = $(event.currentTarget).val().split(" ");
        var chr = String.fromCharCode(event.keyCode);
        var len = string_array.length;
        var old_string = string_array.slice(0, len-1).join(" ");
        var current_element = string_array.pop();
        var is_new_word_initiation = current_element == "";
        var under_a_tag = $scope.hash_tagging;
        
        if(is_new_word_initiation && chr == "#"){
          var html = "<b>"+chr+"</b>";
          $scope.hash_tagging = true;
          $(event.currentTarget).siblings().append(html);
        }
        else if(is_new_word_initiation && chr == "+"){
          var html = "<b>"+chr+"</b>";
          $scope.hash_tagging = true;
          $(event.currentTarget).siblings().append(html);
          $scope.search_for = "TAGS";
        }
        else if(is_new_word_initiation && chr == "@"){
          var html = "<b>"+chr+"</b>";
          $scope.hash_tagging = true;
          $(event.currentTarget).siblings().append(html);
          $scope.search_for = "[AUTHORS, authorS]";
        }
        else{
          if(chr == " "){
            $scope.hash_tagging = false;
            $(event.currentTarget).siblings().append(chr);
            delete $scope.search_for;
          }
          else{
            if($scope.hash_tagging){
              $(event.currentTarget).siblings().find('b:last').append(chr);
            }
            else{
              $(event.currentTarget).siblings().append(chr);
            }
          }
        }
        if($scope.search_for){
          string_to_be_searched = current_element.slice(1, current_element.length)+""+chr;
          websiteService.search(string_to_be_searched.trim(), $scope.search_for, 3).then(function(result) {
            $scope.hash_tags = result.results;
          });
        }
        event.stopPropagation();
      }

      // _init();
    }],
    templateUrl: "/assets/angular/widgets/base/author/author_interact.html"
  };
}]);

// websiteApp.directive('interactionBox', function($rootScope, $timeout, widgetService){
//   return{
//     restrict: 'E',
//     controller: function($scope){
//       $scope.close_interaction_box = function(){
//         $scope.interact = false;
//         $scope.hash_tags = [];
//       }

//       $scope.own_this_author = function(){
//         if($scope.have_this_author){
//           $scope.have_this_author = false;
//         }
//         else{
//           $scope.have_this_author = true;
//         }
//         var id = $scope.author.id;
//         widgetService.own_this_author(id, $scope.have_this_author);
//       }
      
//       _init = function(){
//       }

//       $scope.toggle = function(index){
//         $scope.mark_as_rated();
//       }

//       $scope.mark_as_rated = function(){
//         $scope.author.rating = parseInt(event.srcElement.innerText);
//         var timeout_event = notify($rootScope, "THANKS-This will help us to recommend you better authors.", $timeout);

//         $scope.$on('destroy', function(){
//           $timeout.cancel(timeout_event)
//         });

//         widgetService.rate_this_author($scope.author.id, $scope.author.rating);
//       }

//       $scope.is_active = function(index){
//         var rating = parseInt(index) + 1;
//         var is_active = false;
//         if(rating <= $scope.author.rating){
//           is_active = true;
//         }
//         return is_active;
//       }

//       $scope.record_read_time = function(read_timer){
//         $scope.author.read_timer = read_timer;
//         widgetService.record_time($scope.author.id, read_timer);
//       }

//       $scope.is_timer = function(read_timer){
//         var is_timer = false;
//         if($scope.author.read_timer == read_timer){
//           is_timer = true;
//         }
//         return is_timer;
//       }

//       _init();
//     },
//     templateUrl: "assets/angular/widgets/base/author/interaction_box.html"
//   }
// });

// websiteApp.directive('authorTags', function($rootScope, $timeout) {
//   return {
//     restrict: 'E',
//     controller: function($scope){
//       $scope.show_author = function(page){
//         zoomin_author($scope, $timeout, $rootScope, page);
//       }
//     },
//     templateUrl: "/assets/angular/widgets/base/author/author_tags.html"
//   };
// });

// websiteApp.directive('recommend', function($rootScope, $timeout, widgetService){
//   return{
//     restrict: 'E',
//     controller: function($scope){
//       $scope.recommend = function(){
//         var author_title = $scope.author.title;
//         var author_name = $scope.author.author_name;
//         if($scope.recommended){
//           $scope.recommended = false;
//           var message = "SUCCESS-"+author_title+" by "+author_name+" will not be recommended to your friends.";
//         }
//         else{
//           $scope.recommended = true;
//           var message = "SUCCESS-"+author_title+" by "+author_name+" has been recommended to all your friends.";
//         }
//         var timeout_event = notify($rootScope, message, $timeout);
//         $scope.$on('destroy', function(){
//           $timeout.cancel(timeout_event);
//         });
//         widgetService.recommend("author", $scope.author.id, $scope.recommended);
//       }
//     },
//     templateUrl: "/assets/angular/widgets/base/author/recommend.html"
//   }
// });

// websiteApp.directive('markAsRead', function($rootScope, $timeout, widgetService){
// 	return {
// 		restrict: 'E',
// 		controller: function($scope){
//       $scope.markAsRead = function(){
//         if($scope.read){
//           $scope.read = false;
//           $scope.author.status = 0;
//           $scope.$emit('removeauthorFromShelf', $scope.author);
//         }
//         else{
//           $scope.read = true;
//           $scope.author.status = 1;
//           $scope.$emit('addauthorToShelf', $scope.author);
//           $rootScope.$broadcast('glowShelf');
//           var author_title = $scope.author.title;
//           var author_name = $scope.author.author_name;
//           var message = "ADVISE-Also please rate "+author_title+" by "+author_name+". This will help us to recommend better authors."
//           var timeout_event = notify($rootScope, message, $timeout);
//           $scope.interact = true;

//           $scope.$on('destroy', function(){
//             $timeout.cancel(timeout_event);
//             $timeout.cancel(glow_event);
//           });
//         }
//         widgetService.mark_as_read($scope.author.id, $scope.read);
//       }
//     },
//     templateUrl: "/assets/angular/widgets/base/author/mark_as_read.html"
//   }
// });

// function zoomin_author($scope, $timeout, $rootScope, page){
//   $rootScope.initPage = page;
//   $scope.zoomin_author = true;
//   var posX = event.currentTarget.offsetParent.offsetLeft + event.currentTarget.offsetWidth;
//   var screenX = event.screenX;
//   var scrollWidth = event.currentTarget.offsetParent.offsetParent.scrollWidth;
//   $scope.$emit('expandauthor', $scope.author.id, posX, screenX, scrollWidth);
//   var zoomout_event = $timeout(function(){
//     $scope.zoomin_author = false;
//   }, 3000);

//   $scope.$on('destroy', function(){
//     $timeout.cancel(zoomout_event);
//   });
// }

// var global_display_timer = 0;