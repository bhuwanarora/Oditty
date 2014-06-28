websiteApp.directive('book', ['widgetService', '$rootScope', function (widgetService, $rootScope){
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    controller: ['$scope', function($scope){
      // $scope.hover = function(event){
      //   $scope.hovered = true;
      // };

      // $scope.mouseout = function() {
      //   $scope.hovered = false;
      //   // $rootScope.focused_book = null;
      // };

      $scope.show_focused_tooltip = function(event){
        if($rootScope.focused_book != $scope.book){
          // $rootScope.show_more_filters = false;
          $rootScope.ticker_popup = null;
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
              $rootScope.focused_book.reposition_tooltip = {"left": posX+"px"};
            }
            else{
              $rootScope.focused_book.reposition_tooltip = {"right": "0px"}; 
            }
            $rootScope.on_left = true;
          }
          else{
            if(display_left_width > 400){
              posX = screen.width - posX;
              $rootScope.focused_book.reposition_tooltip = {"right": posX+"px"}; 
            }
            else{
              $rootScope.focused_book.reposition_tooltip = {"left": "0px"};  
            }
            $rootScope.on_left = false;
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
        // var book_id = $scope.book.id;
        console.debug("%c _init book", "color: purple");
        $scope.book.tweets = [];
        $scope.book.labels = $rootScope.labels;
        $scope.book.show_labels = false;
        // widgetService.populate_tooltips(book_id).then(function(data){
          // $scope.book.title = data.title;
          // $scope.book.author_name = data.author_name;
          // $scope.book.users = data.users;
          // $scope.book.summary = data.summary;
          // $scope.book.users_count = data.users_count;
        // });
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

websiteApp.directive('labelDropdown', function(){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.select_label = function(name){
        var atleast_one_label_checked = false;
        var labels = $scope.book.labels;
        // labels["name"]
        for(var i=0; i<labels.length; i++){
          if(labels[i]["checked"]){
            atleast_one_label_checked = true;
            break
          }
        }
        if(atleast_one_label_checked){
          $scope.book.bookmark_status = 1;
        }
        else{
          $scope.book.bookmark_status = 0; 
        }
      }

      $scope.stop_horizontal_scroll = function(event){
        event.stopPropagation();
      }
    }],
    templateUrl: '/assets/angular/widgets/base/book/label_dropdown.html'    
  }
});

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
        if($scope.book.show_labels){
          var bookmark_status = $scope.book.bookmark_status;
          var book_title = $scope.book.title;
          var author_name = $scope.book.author_name;
          if($scope.book.custom_bookmark){
            add_custom_bookmark($scope, $rootScope, $timeout);
          }
          else{
            $scope.book.show_labels = false;
            // alert("custom_bookmark not present");
          }
          // if(bookmark_status == 1){
          //   $scope.book.bookmark_status = 0;
          //   var message = "SUCCESS-"+book_title+" by "+author_name+" has been removed from your bookmark shelf.";
          //   $scope.$emit('removeFromBookmarks', "BOOK", $scope.book);
          // }
          // else{
          //   $scope.book.bookmark_status = 1;
          //   var message = "SUCCESS-"+book_title+" by "+author_name+" has been added to your bookmark shelf.";
          //   $scope.$emit('addToBookmarks', "BOOK", $scope.book);
          //   $rootScope.$broadcast('glowBookmark');
          // }
          // var timeout_event = notify($rootScope, message, $timeout);
          // $scope.$on('destroy', function(){
          //   $timeout.cancel(timeout_event);
          // });
          // widgetService.bookmark("BOOK", $scope.book.id, $scope.book.bookmark_status);
        }
        else{
          $scope.book.show_labels = true;
        }
        event.stopPropagation();
      }
    }],
    templateUrl: "/assets/angular/widgets/base/book/bookmark.html"
  };
}]);

websiteApp.directive('bookInteract', ['$rootScope', '$timeout', 
  function ($rootScope, $timeout) {
  return {
    restrict: 'E',
    controller: ['$scope', function($scope){
      _init = function(){
        $scope.setStatus();
      }

      $scope.show_bookmark_options = function(event){
        if($scope.book.show_labels){
          $scope.book.blur_input = true;
          $scope.book.show_labels = false;
        }
        else{
          $scope.book.blur_input = false;
          $scope.book.show_labels = true;
        }
        event.stopPropagation();
      }

      $scope.handle_enter = function(event){
        var is_enter = event.keyCode == 13;
        if(is_enter){
          add_custom_bookmark($scope, $rootScope, $timeout);
        }
      }


      $scope.setStatus = function(status){
        if(status == 1){
          $scope.read = true;
        }
        else{
          $scope.read = false;
        }
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

      $scope.show_feedback_popup = function(){
        if($rootScope.focused_book.show_feedback_popup){
          $rootScope.focused_book.show_feedback_popup = false;
        }
        else{
          $rootScope.focused_book.show_feedback_popup = true; 
        }
      }

      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.close_focused_tooltip = function(){
        $rootScope.focused_book = null;
      }

      $scope.own_this_book = function(){
        if($scope.have_this_book){
          $scope.have_this_book = false;
          var message = "SUCCESS-Are you sure, you don't have a copy of "+$rootScope.focused_book.title+"? <br/>Your friends might be looking for this book.";
        }
        else{
          $scope.have_this_book = true;
          var message = "SUCCESS-Thanks, Your friends will now know that you own a copy of "+$rootScope.focused_book.title;
        }
        var id = $rootScope.focused_book.id;
        var timeout_event = notify($rootScope, message, $timeout);
        widgetService.own_this_book(id, $scope.have_this_book);
        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });
      }

      $scope.record_read_time = function(read_timer){
        $rootScope.focused_book.read_timer = read_timer;
        var message = "SUCCESS-Thanks we have recorded your approximate time to read "+$rootScope.focused_book.title+". <br/> This will help us to recommend you books according to your reading skills."
        var timeout_event = notify($rootScope, message, $timeout);
        widgetService.record_time($rootScope.focused_book.id, read_timer);
        $scope.$on('destroy', function(){
          $timeout.cancel('timeout_event');
        });
      }

      $scope.is_timer = function(read_timer){
        var is_timer = false;
        if($rootScope.focused_book.read_timer == read_timer){
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

      _display_tweet = function(index){
        // console.log("%c display_tweet", "color: red;");
        if($rootScope.focused_book.tweets.length != 0){
          var tweets = $rootScope.focused_book.tweets;
          var timeout_event = $timeout(function(){
            if(index < tweets.length){
              $rootScope.focused_book.display_tweet = $rootScope.focused_book.tweets[index]["tweet"];
              if($rootScope.focused_book.tweets[index]["tweet"]){
                $rootScope.focused_book.display_profile = $rootScope.focused_book.tweets[index]["thumb"];
              }
              else{
                $rootScope.focused_book.display_profile = "/assets/profile_pic.jpeg"; 
              }
              index++;
              _display_tweet(index);
            }
            else{
              _display_tweet(0);
            }
          }, 2000);
          $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
          });
        }
        else{
          $rootScope.focused_book.display_profile = null;
          $rootScope.focused_book.display_tweet = "What do you feel about this book?";
        }
      }

      _open_tab = function(){
        $scope.show_info = true;
      }

      _init = function(){
        var book_name = $rootScope.focused_book.title;
        var author_name = $rootScope.focused_book.author_name;
        widgetService.get_affiliate_links(book_name, author_name).then(function(results){
          $scope.bnn_links = results.bnn.links;
        });
        _display_tweet(0);
        _open_tab();
      }

      _init();

    }],
    templateUrl: "/assets/angular/widgets/base/book/focused_book.html"
  }
}]);

websiteApp.directive('interactionBox', ['$rootScope', '$timeout', 'websiteService', function($rootScope, $timeout, websiteService){
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

      $scope.set_current = function(index){

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
        console.table([{"is_new_word_initiation":  is_new_word_initiation,
                        "chr": chr,
                        "len": len,
                        "old_string": old_string,
                        "current_element": current_element,
                        "current_comment": $rootScope.focused_book.current_comment,
                        "under_a_tag": under_a_tag}]);
        if(event.keyCode == 13){
          var tweet_text = $rootScope.focused_book.hash_tagged_comment
                                .replace(/<b>/, "<a>")
                                .replace(/<\/b>/, "<\/a>");
          if($rootScope.user.thumb){
            var thumb = $rootScope.user.thumb;
            var tweet = {"tweet": tweet_text, "thumb": thumb};
          }
          else{
            var tweet = {"tweet": tweet_text}; 
          }
          $rootScope.focused_book.current_comment = "";
          $rootScope.focused_book.hash_tagged_comment = "";
          $rootScope.focused_book.tweets.push(tweet);
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

      _init = function(){
        $scope.is_new_word_initiation = true;
        $rootScope.focused_book.current_comment = "";
        $rootScope.focused_book.hash_tagged_comment = "";
      }

      _init();

    }],
    templateUrl: "/assets/angular/widgets/base/book/interaction_box.html"
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
        }
        else{
          event.currentTarget.dataset.selected = false;
          event.currentTarget.style.border = "2px solid transparent";
        }
      }

      $scope.stop_horizontal_scroll = function(event){
        event.stopPropagation();
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
          var message = "SUCCESS-Removed from <span class='icon-books'></span> Books Read. ";
        }
        else{
          $scope.book.status = 1;
          $scope.$emit('addToShelf', "BOOK", $scope.book);
          $rootScope.$broadcast('glowShelf');
          var message = "SUCCESS-Added to <span class='icon-books'></span> Books Read. ";

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

function add_custom_bookmark($scope, $rootScope, $timeout){
  var custom_bookmark = $scope.book.custom_bookmark;
  if(custom_bookmark){
    var labels = $scope.book.labels;
    var already_exists = false;
    for(var i = 0; i < labels.length; i++){
      var label = labels[i];
      if(label["name"] == custom_bookmark){
        already_exists = true;
        var message = "ALERT- Bookmark with the name "+custom_bookmark+" is already added in the list";
        break;
      }
    }

    if(!already_exists){
      $scope.book.bookmark_status = 1;
      $scope.book.labels = $scope.book.labels.concat([{"name": custom_bookmark, "checked": true}]);
      $scope.book.custom_bookmark = "";
      var message = "SUCCESS-Custom Bookmark "+custom_bookmark+" added to book "+$scope.book.title;
    }

    var timeout_event = notify($rootScope, message, $timeout);
    $scope.on('destroy', function(){
      $timeout.cancel(timeout_event);
    });
  }
}

var global_display_timer = 0;