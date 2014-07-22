websiteApp.directive('book', ['websiteService', '$rootScope', 'widgetService', function (websiteService, $rootScope, widgetService){
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
        var book_id = $scope.book.id;
        console.debug("%c _init book"+book_id, "color: purple");
        $scope.book.tweets = [];
        $scope.book.show_labels = false;
        // if(!angular.isArray($scope.book.labels)){
        //   $scope.book.labels = [];
        //   angular.forEach($rootScope.labels, function(value){
        //     this.push({"name": value.name});
        //   }, $scope.book.labels);
        // }
        websiteService.get_book_details("id="+book_id).then(function(data){
          angular.extend($scope.book, data);
        });
        // var margin_right = (Math.floor(Math.random() * 20) + 1)+"px";
        // var margin_top = (Math.floor(Math.random() * 50) + 1)+"px";
        // var margin_right_neg = (Math.random() < 0.5);
        // var margin_top_neg = (Math.random() < 0.5);
        // if(margin_top_neg){
        //   margin_top = "-"+margin_top;
        // }
        // if(margin_right_neg){
        //   margin_right = "-"+margin_right;
        // }
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

websiteApp.directive('labelDropdown', ['$rootScope', '$timeout', 'widgetService', function($rootScope, $timeout, widgetService){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.select_label = function(index){
        var atleast_one_label_checked = false;
        var labels = $scope.book.labels;
        
        $scope.book.labels[index]["checked"] = !$scope.book.labels[index]["checked"];
        if($scope.book.labels[index]["checked"]){
          //add to notifications
          var name = $rootScope.user.email;
          var message = "<span><b>"+name+"</b> </span><span>bookmarked&nbsp;</span><span class='site_color'>"+$scope.book.title+"</span><span> to '"+$scope.book.labels[index]["name"]+"'</span>";
          var thumb = "assets/profile_pic.jpeg"
          var notification = {
            "thumb":thumb,
            "message":message,
            "timestamp":new Date().getTime(),
            "book":{
              "id":$scope.book.id,
              "title":$scope.book.title,
              "author_name":$scope.book.author_name,
              "isbn":$scope.book.isbn
            },
            "user":{
              "id":$rootScope.user.id,
              "name":$rootScope.user.email
            }
          }
          $scope.$emit('addToNotifications', notification);

          var message = "SUCCESS-Added to "+$scope.book.labels[index]["name"]+" <span class='icon-bookmarks'></span>.";
        }
        else{
          var message = "SUCCESS-Removed from "+$scope.book.labels[index]["name"]+" <span class='icon-bookmarks'></span>.";
        }
        var timeout_event = notify($rootScope, message, $timeout);
        var params = {"id": $scope.book.id, 
                    "type": "BOOK",
                    "name": $scope.book.labels[index]["name"],
                    "data": $scope.book.labels[index]["checked"]};



        widgetService.bookmark(params);
        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });

        for(var i=0; i<labels.length; i++){
          if(labels[i]["checked"]){
            atleast_one_label_checked = true;
            break;
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
        var book_scope_length = $scope.book.labels.length;
        var rootScope_length = $rootScope.labels.length;
        for(var i=book_scope_length; i<rootScope_length; i++){
          $scope.book.labels.push({name: $rootScope.labels[i].name});
        }
        if($scope.book.show_labels){
          var bookmark_status = $scope.book.bookmark_status;
          var book_title = $scope.book.title;
          var author_name = $scope.book.author_name;
          if($scope.book.custom_bookmark){
            var already_exists = add_custom_bookmark($scope, $rootScope, $timeout);
            if(!already_exists){
              var params = {"id": $scope.book.id, 
                    "type": "BOOK",
                    "name": $scope.book.custom_bookmark,
                    "data": true};
              widgetService.bookmark(params);
            }
          }
          else{
            $scope.book.show_labels = false;
            // alert("custom_bookmark not present");
          }
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

websiteApp.directive('bookInteract', ['$rootScope', '$timeout', 'widgetService',
  function ($rootScope, $timeout, widgetService){
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
          var book_scope_length = $scope.book.labels.length;
          var rootScope_length = $rootScope.labels.length;
          for(var i=book_scope_length; i<rootScope_length; i++){
            $scope.book.labels.push({name: $rootScope.labels[i].name});
          }
          $scope.book.blur_input = false;
          $scope.book.show_labels = true;
        }
        event.stopPropagation();
      }

      $scope.handle_enter = function(event){
        var is_enter = event.keyCode == 13;
        if(is_enter){
          var already_exists = add_custom_bookmark($scope, $rootScope, $timeout);
          if(!already_exists){
            var params = {"id": $scope.book.id, 
                  "type": "BOOK",
                  "name": $scope.book.custom_bookmark,
                  "data": true};
            widgetService.bookmark(params);
            $scope.book.custom_bookmark = "";
          }
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

websiteApp.directive('rate', ['$rootScope', '$timeout', 'widgetService', 'sharedService', function($rootScope, $timeout, widgetService, sharedService){
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

      _add_notification = function(){
        var name = $rootScope.user.email;
        var message = "<span><b>"+name+"</b> </span><span>gave "+$scope.rate_object.user_rating+"/10 stars to&nbsp;</span><span class='site_color'>"+$scope.rate_object.title+"</span>";
        var thumb = "assets/profile_pic.jpeg"
        var notification = {
          "thumb":thumb,
          "message":message,
          "timestamp":new Date().getTime(),
          "book":{
            "id":$scope.rate_object.id,
            "title":$scope.rate_object.title,
            "author_name":$scope.rate_object.author_name,
            "isbn":$scope.rate_object.isbn
          },
          "user":{
            "id":$rootScope.user.id,
            "name":$rootScope.user.email
          }
        }
        $scope.$emit('addToNotifications', notification);
      }

      $scope.mark_as_rated = function(index, event){
        $scope.rate_object.rated = true;
        $scope.rate_object.user_rating = parseInt(index) + 1;
        $scope.temp_rating = parseInt(index) + 1;
        var timeout_event = notify($rootScope, "SUCCESS-Thanks, This will help us to recommend you better books.", $timeout);

        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });
        var params = {"id":$scope.rate_object.id, "data":$scope.rate_object.user_rating};

        //ONLY FOR BOOKS
        if(angular.isUndefined($scope.rate_object.status) || !$scope.rate_object.status){
          sharedService.mark_as_read($scope, $scope.rate_object, event);
        }
        widgetService.rate_this_book(params);
        _add_notification();
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

websiteApp.directive('focusedBook', ['$rootScope', '$timeout', 'widgetService', 'sharedService', function($rootScope, $timeout, widgetService, sharedService){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      // $scope.show_book = function(page){
      //   zoomin_book($scope, $timeout, $rootScope, page);
      // }
      $scope.handle_enter = function(event, new_thumb){
        var enter_key = event.keyCode == 13;
        if(enter_key){
          $scope.add_thumb = false;
          var title = $rootScope.focused_book.title;
          var author_name = $rootScope.focused_book.author_name;
          var book_url = "/#/user/1/book/"+title+"/author/"+author_name;
          var params = {"thumb_url": new_thumb, 
                        "title": title,
                        "book_url": book_url,
                        "username": $rootScope.user.name,
                        "user_thumb": $rootScope.user.thumb,
                        "user_link": ""}
          widgetService.add_thumbnail(params).then(function(data){
            
          });
        }
      }

      $scope.show_feedback_popup = function(){
        if($rootScope.focused_book.show_feedback_popup){
          $rootScope.focused_book.show_feedback_popup = false;
        }
        else{
          $rootScope.focused_book.show_feedback_popup = true; 
        }
      }

      $scope.get_buy_links = function(){
        $scope.show_info = false; 
        $scope.show_buy = true;
        widgetService.get_affiliate_links($rootScope.focused_book.id).then(function(results){
          $scope.bnn_links = results.bnn.links;
        });
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

      $scope.record_read_time = function(read_timer, event){
        $rootScope.focused_book.time_index = read_timer;
        var message = "SUCCESS-Thanks we have recorded your approximate time to read "+$rootScope.focused_book.title+". <br/> This will help us to recommend you books according to your reading skills."
        var timeout_event = notify($rootScope, message, $timeout);
        if(!$rootScope.focused_book.status){
          sharedService.mark_as_read($rootScope, $rootScope.focused_book, event);
        }

        switch($rootScope.focused_book.time_index){
            case 0:
                var reading_length = "Tiny Read";
                break;
            case 1:
                var reading_length = "Small Read";
                break;
            case 2:
                var reading_length = "Normal Read";
                break;
            case 3:
                var reading_length = "Long Read";
                break;
        }
        var name = $rootScope.user.email;
        var message = "<span><b>"+name+"</b> </span><span>described reading length of <span class='site_color'>"+$rootScope.focused_book.title+"</span><span>&nbsp; as a&nbsp;'"+reading_length+"'</span>";
        var thumb = "assets/profile_pic.jpeg";
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


        widgetService.record_time($rootScope.focused_book.id, read_timer);
        $scope.$on('destroy', function(){
          $timeout.cancel('timeout_event');
        });
      }

      $scope.is_timer = function(read_timer){
        var is_timer = false;
        if($rootScope.focused_book.time_index == read_timer){
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
        if(angular.isDefined($rootScope.focused_book.tweets) && $rootScope.focused_book.tweets.length > 0){
          var tweets = $rootScope.focused_book.tweets;
          var timeout_event = $timeout(function(){
            if(index < tweets.length){
              $rootScope.focused_book.display_tweet = $rootScope.focused_book.tweets[index]["message"];
              if($rootScope.focused_book.tweets[index]["message"]){
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
        // var book_name = $rootScope.focused_book.title;
        // var author_name = $rootScope.focused_book.author_name;
        var book_id = $rootScope.focused_book.id;
        if(angular.isUndefined($rootScope.focused_book.tweets) || $rootScope.focused_book.tweets.length == 0){
          widgetService.get_book_feed(book_id).then(function(data){
            $rootScope.focused_book.tweets = data;
          });
        }
        _display_tweet(0);
        _open_tab();
        $scope.add_thumb = false;
      }

      _init();

    }],
    templateUrl: "/assets/angular/widgets/base/book/focused_book.html"
  }
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


websiteApp.directive('markAsRead', ['$rootScope', '$timeout', 'widgetService', 'sharedService', 'stropheService', function($rootScope, $timeout, widgetService, sharedService, stropheService){
	return {
		restrict: 'E',
		controller: ['$scope', function($scope){
      $scope.mark_as_read = function(event){
        var username = $rootScope.user.name;
        var message = username + "added " + $scope.book.title + " to Books Read."
        sharedService.mark_as_read($scope, $scope.book, event);
        stropheService.send_notification(message);
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
    custom_bookmark = custom_bookmark.trim().toUpperCase();
    var labels = $scope.book.labels;
    var already_exists = false;
    for(var i = 0; i < labels.length; i++){
      var label = labels[i];
      if(label["name"] == custom_bookmark){
        already_exists = true;
        var message = "ALERT- Bookmark with the name '"+custom_bookmark+"' is already added in the list";
        break;
      }
    }

    if(!already_exists){
      $scope.book.bookmark_status = 1;
      $rootScope.labels = $rootScope.labels.concat([{"name": custom_bookmark}]);
      $scope.book.labels = $scope.book.labels.concat([{"name": custom_bookmark, "checked": true}]);
      var message = "SUCCESS-Custom Bookmark "+custom_bookmark+" added to book "+$scope.book.title;
    }

    var timeout_event = notify($rootScope, message, $timeout);
    $scope.$on('destroy', function(){
      $timeout.cancel(timeout_event);
    });
    return already_exists;
  }
}

var global_display_timer = 0;