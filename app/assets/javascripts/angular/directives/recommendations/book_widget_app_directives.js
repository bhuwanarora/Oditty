websiteApp.directive('book', ['widgetService', '$rootScope', function (widgetService, $rootScope){
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    controller: ['$scope', function($scope){
      $scope.hover = function(event){
        $scope.hovered = true;
      };

      $scope.mouseout = function() {
        $scope.hovered = false;
        // $rootScope.focused_book = null;
      };

      $scope.show_focused_tooltip = function(event){
        if($rootScope.focused_book != $scope.book){
          $rootScope.focused_book = $scope.book;
          var posX = event.currentTarget.offsetParent.offsetParent.offsetLeft - event.pageX + event.clientX;
          var display_right_width =  screen.width - (posX + event.currentTarget.offsetParent.scrollWidth);
          var display_left_width = posX;
          console.table([{
            "offsetLeft":event.currentTarget.offsetParent.offsetParent.offsetLeft,
            "pageX":event.pageX, 
            "clientX":event.clientX, 
            "posX": posX,
            "scrollWidth":event.currentTarget.offsetParent.scrollWidth,
            "display_left_width":display_left_width,
            "display_right_width":display_right_width}]);
          if(display_right_width > display_left_width){
            if(display_right_width > 400){
              posX = posX + event.currentTarget.offsetParent.scrollWidth - event.currentTarget.offsetLeft;
              $rootScope.focused_book.reposition_tooltip = {"left": posX+"px", "top": "60px"};
            }
            else{
              $rootScope.focused_book.reposition_tooltip = {"right": "0px", "top": "60px"}; 
            }
          }
          else{
            if(display_left_width > 400){
              posX = screen.width - posX;
              $rootScope.focused_book.reposition_tooltip = {"right": posX+"px", "top": "60px"}; 
            }
            else{
              $rootScope.focused_book.reposition_tooltip = {"left": "0px", "top": "60px"};  
            }
          }
          // event.currentTarget.offsetParent.offsetParent.scrollWidth;
          // var test = event.currentTarget.offsetParent.offsetParent.offsetLeft -event.currentTarget.offsetLeft;
          // var test2 = event.currentTarget.offsetParent.offsetParent.scrollWidth;
          // var left = event.currentTarget.offsetParent.offsetParent.scrollWidth + event.screenX;
        }
        else{
          $rootScope.focused_book = null;
        }
        event.stopPropagation();
        // body...
      }

      _init = function(){
        // $scope.active_book_filter = true;
        var book_id = $scope.book.id;
        widgetService.populate_tooltips(book_id).then(function(data){
          $scope.book.title = data.title;
          $scope.book.author_name = data.author_name;
          $scope.book.users = data.users;
          $scope.book.summary = data.summary;
          $scope.book.users_count = data.users_count;
        });
        var margin_right = (Math.floor(Math.random() * 20) + 1)+"px";
        var margin_top = (Math.floor(Math.random() * 50) + 1)+"px";
        var margin_right_neg = (Math.random() < 0.5);
        var margin_top_neg = (Math.random() < 0.5);
        if(margin_top_neg){
          margin_top = "-"+margin_top;
        }
        if(margin_right_neg){
          margin_right = "-"+margin_right;
        }
        // $scope.randomise_position = {"margin-left": margin_right, "margin-bottom":margin_top};
        // $scope.book_tilt = {"transform":"rotate("+tilt_angle+")",
        //                   "-ms-transform":"rotate("+tilt_angle+")",
        //                   "-webkit-transform":"rotate("+tilt_angle+")";
      }

      _init();

    }],
    templateUrl: "/assets/angular/widgets/base/book/book_widget.html"
  };
}]);

websiteApp.directive('bookNavbar', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
  return {
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.show_book = function(page){
        zoomin_book($scope, $timeout, $rootScope, page);
      }
    }],
    templateUrl: "/assets/angular/widgets/base/book/book_navbar.html"
  };
}]);

websiteApp.directive('listDropdown', function(){
  return{
    restrict: 'E',
    controller: function($scope){
      
    },
    templateUrl: "app/assets/javascripts/angular/widgets/base/book/list_dropdown.html"
  }
});

websiteApp.directive('bookBookmark', ['$rootScope', '$timeout', 'widgetService', function ($rootScope, $timeout, widgetService) {
  return {
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.toggle_bookmarked = function(event){
        var bookmark_status = $scope.book.bookmark_status;
        var book_title = $scope.book.title;
        var author_name = $scope.book.author_name;
        if(bookmark_status == 1){
          $scope.book.bookmark_status = 0;
          var message = "SUCCESS-"+book_title+" by "+author_name+" has been removed from your bookmark shelf.";
          $scope.$emit('removeFromBookmarks', "BOOK", $scope.book);
        }
        else{
          $scope.book.bookmark_status = 1;
          var message = "SUCCESS-"+book_title+" by "+author_name+" has been added to your bookmark shelf.";
          $scope.$emit('addToBookmarks', "BOOK", $scope.book);
          $rootScope.$broadcast('glowBookmark');
        }
        var timeout_event = notify($rootScope, message, $timeout);
        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });
        widgetService.bookmark("BOOK", $scope.book.id, $scope.book.bookmark_status);
        event.stopPropagation();
      }
    }],
    templateUrl: "/assets/angular/widgets/base/book/bookmark.html"
  };
}]);

websiteApp.directive('bookInteract', ['websiteService', function (websiteService) {
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
        var string_array = $('.comment_box').val().split(" ");
        var html_array = $('.comment_box').siblings().html().split(" ");
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
        $('.comment_box').siblings().html(old_html+" <b>"+selected_item+"</b>");
        $('.comment_box').val(old_string+" "+selected_item);
        $scope.hash_tags = null;
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
        var is_backspace = event.keyCode == 8;
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
          $scope.search_for = "[AUTHORS, READERS]";
        }
        else{
          if(chr == " "){
            $scope.hash_tagging = false;
            $(event.currentTarget).siblings().append(chr);
            $scope.search_for = null;
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

      _init();
    }],
    templateUrl: "/assets/angular/widgets/base/book/interact_widget.html"
  };
}]);

websiteApp.directive('rate', ['$rootScope', '$timeout', 'widgetService', function($rootScope, $timeout, widgetService){
  return{
    restrict: 'E',
    scope: {'rate_object': '=data'},
    controller: ['$scope', function($scope){
      $scope.show_if_rated = function(index){
        $scope.temp_rating = $scope.rate_object.user_rating;
        $scope.rate_object.user_rating = parseInt(index) + 1;
        $scope.ready_to_rate = true;
      }

      $scope.reset_rating = function(){
        $scope.ready_to_rate = false;
        $scope.rate_object.user_rating = $scope.temp_rating;
      }

      $scope.mark_as_rated = function(index, event){
        $scope.rate_object.rated = true;
        $scope.rate_object.user_rating = parseInt(index) + 1;
        $scope.temp_rating = parseInt(index) + 1;
        var timeout_event = notify($rootScope, "SUCCESS-Thanks, This will help us to recommend you better books.", $timeout);

        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });

        widgetService.rate_this_book($scope.rate_object.id, $scope.rate_object.user_rating);
        event.stopPropagation();
      }

      $scope.is_active = function(index){
        var is_active = false;
        if($scope.rate_object){
          var rating = parseInt(index) + 1;
          if(rating <= $scope.rate_object.user_rating){
            is_active = true;
          }
        }
        return is_active;
      }

    }],
    templateUrl: '/assets/angular/widgets/base/book/rate.html'
  }
}]);

websiteApp.directive('focusedBook', ['$rootScope', '$timeout', 'widgetService', function($rootScope, $timeout, widgetService){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      // $scope.show_book = function(page){
      //   zoomin_book($scope, $timeout, $rootScope, page);
      // }

      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.close_focused_tooltip = function(){
        $rootScope.focused_book = null;
      }

      $scope.own_this_book = function(){
        if($scope.have_this_book){
          $scope.have_this_book = false;
          var message = "SUCCESS-Are you sure, you don't have a copy of "+$scope.focused_book.title+"? <br/>Your friends might be looking for this book.";
        }
        else{
          $scope.have_this_book = true;
          var message = "SUCCESS-Thanks, Your friends will now know that you own a copy of "+$scope.focused_book.title;
        }
        var id = $scope.focused_book.id;
        var timeout_event = notify($rootScope, message, $timeout);
        widgetService.own_this_book(id, $scope.have_this_book);
        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });
      }

      $scope.record_read_time = function(read_timer){
        $scope.focused_book.read_timer = read_timer;
        var message = "SUCCESS-Thanks we have recorded your approximate time to read "+$scope.focused_book.title+". <br/> This will help us to recommend you books according to your reading skills."
        var timeout_event = notify($rootScope, message, $timeout);
        widgetService.record_time($scope.focused_book.id, read_timer);
        $scope.$on('destroy', function(){
          $timeout.cancel('timeout_event');
        });
      }

      $scope.is_timer = function(read_timer){
        var is_timer = false;
        if($scope.focused_book.read_timer == read_timer){
          is_timer = true;
        }
        return is_timer;
      }

      $scope.close_interaction_box = function(){
        $rootScope.focused_book.interact = false;
        $scope.hash_tags = [];
      }

      $scope.stop_horizontal_scroll = function(event){
        event.stopPropagation();
      }

    }],
    templateUrl: "/assets/angular/widgets/base/book/focused_book.html"
  }
}]);

websiteApp.directive('interactionBox', ['$rootScope', '$timeout', 'widgetService', function($rootScope, $timeout, widgetService){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }      

      _init();
    }],
    templateUrl: "assets/angular/widgets/base/book/interaction_box.html"
  }
}]);

websiteApp.directive('bookTags', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  return {
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.show_book = function(page){
        zoomin_book($scope, $timeout, $rootScope, page);
      }
    }],
    templateUrl: "/assets/angular/widgets/base/book/book_tags.html"
  };
}]);

websiteApp.directive('recommend', ['$rootScope', '$timeout', 'widgetService', function($rootScope, $timeout, widgetService){
  return{
    restrict: 'E',
    scope: {'recommend_object': '=data'},
    controller: ['$scope', function($scope){
      $scope.select_thumb = function(event){
        var selected = event.currentTarget.dataset.selected == "true";
        if(!selected){
          event.currentTarget.dataset.selected = true;
          event.currentTarget.style.border = "2px solid";
          // $(event.currentTarget).data("selected", true);
          // $(event.currentTarget).css('border', '2px solid');
        }
        else{
          event.currentTarget.dataset.selected = false;
          event.currentTarget.style.border = "2px solid transparent";
          // $(event.currentTarget).data("selected", false);
          // $(event.currentTarget).css('border', '2px solid none'); 
        }
      }

      $scope.recommend = function(){
        var book_title = $scope.recommend_object.title;
        var author_name = $scope.recommend_object.author_name;
        if($scope.recommend_object.recommended){
          $scope.recommend_object.recommended = false;
          var message = "SUCCESS-"+book_title+" by "+author_name+" has been recommended to selected friends.";
          var timeout_event = notify($rootScope, message, $timeout);
          $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
          });
          // $('body').css('cursor', 'default');
          widgetService.recommend("BOOK", $scope.recommend_object.id, $scope.recommend_object.recommended);
        }
        else{
          $scope.recommend_object.recommended = true;
          // $('body').css('cursor', 'copy');
        }
      }

      _init = function(){
        $scope.user = {};
        $scope.user.friends = $rootScope.user.friends;
      }

      _init();
    }],
    templateUrl: "/assets/angular/widgets/base/book/recommend.html"
  }
}]);


websiteApp.directive('markAsRead', ['$rootScope', '$timeout', 'widgetService', function($rootScope, $timeout, widgetService){
	return {
		restrict: 'E',
		controller: ['$scope', function($scope){
      $scope.markAsRead = function(event){
        var book_title = $scope.book.title;
        var author_name = $scope.book.author_name;
        if($scope.book.status){
          $scope.book.status = 0;
          $scope.$emit('removeFromShelf', "BOOK", $scope.book);
          var message = "ADVISE-Book "+book_title+" by "+author_name+" has been removed from your Read Shelf.<br/> You can mark as read again."
        }
        else{
          $scope.book.status = 1;
          $scope.$emit('addToShelf', "BOOK", $scope.book);
          $rootScope.$broadcast('glowShelf');
          var message = "ADVISE-Book "+book_title+" by "+author_name+" has been added to your Read Shelf.<br/> Also please rate this book."

          $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
            $timeout.cancel(glow_event);
          });
        }
        var timeout_event = notify($rootScope, message, $timeout);
        widgetService.mark_as_read($scope.book.id, $scope.read);
        event.stopPropagation();
      }

    }],
    templateUrl: "/assets/angular/widgets/base/book/mark_as_read.html"
  }
}]);

function zoomin_book($scope, $timeout, $rootScope, page){
  $rootScope.initPage = page;
  $scope.zoomin_book = true;
  var posX = event.currentTarget.offsetParent.offsetLeft + event.currentTarget.offsetWidth;
  var screenX = event.screenX;
  var scrollWidth = event.currentTarget.offsetParent.offsetParent.scrollWidth;
  $scope.$emit('expandBook', $scope.book.id, posX, screenX, scrollWidth);
  var zoomout_event = $timeout(function(){
    $scope.zoomin_book = false;
  }, 3000);

  $scope.$on('destroy', function(){
    $timeout.cancel(zoomout_event);
  });
}

var global_display_timer = 0;