websiteApp.directive('book', ['websiteService', '$rootScope', 'widgetService', function (websiteService, $rootScope, widgetService){
  return {
    restrict: 'E',
    scope: { 'book': '=data' },
    controller: ['$scope', function($scope){
      $scope.show_interaction_box = function(event){
        $rootScope.user.interact = true;
      }

      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.show_focused_tooltip = function(event){
        if($rootScope.focused_book != $scope.book){
          var _set_dark_wrapper = function(){
            $rootScope.popups.left_panel_width = {"background-color": "#333"};
            $rootScope.style = {};
            $rootScope.style.main_header = {"background-color": "#333", "color": "white"};
            $rootScope.style.header_icon = {"color": "white"};
            $rootScope.style.site_logo = {"color": "white", "text-shadow": "none"};
            $rootScope.style.dark_wrapper = {"background-color": "#333"};
          }

          var _hide_other_popups = function(){
            delete $rootScope.ticker_popup;
            $rootScope.popups = {};
            $rootScope.user.collapsed_friends = true; 
            $rootScope.user.collapsed_left_column = true;
            $rootScope.user.collapsed_column = true; 
            $rootScope.user.collapsed_lists = true;
            $rootScope.user.collapsed_filters = true;
            $rootScope.user.collapsed_trends = true;
          }

          _hide_other_popups();
          $rootScope.focused_book = $scope.book;
          var posX = event.currentTarget.offsetParent.offsetParent.offsetLeft - event.pageX + event.clientX;
          var display_right_width =  window_width - (posX + event.currentTarget.offsetParent.scrollWidth);
          var display_left_width = posX;
          var card_width = window_height*0.8;
          console.table([{
            "offsetLeft":event.currentTarget.offsetParent.offsetParent.offsetLeft,
            "pageX":event.pageX, 
            "clientX":event.clientX, 
            "posX": posX,
            "card_width": card_width,
            "scrollWidth":event.currentTarget.offsetParent.scrollWidth,
            "display_left_width":display_left_width,
            "display_right_width":display_right_width}]);
          if(display_right_width > display_left_width){
            if(display_right_width > card_width){
              posX = posX + event.currentTarget.offsetParent.scrollWidth - event.currentTarget.offsetLeft;
              $rootScope.focused_book.reposition_tooltip = {"left": posX+"px"};
            }
            else{
              $rootScope.focused_book.reposition_tooltip = {"right": "0px"};
            }
            $rootScope.on_left = true;
          }
          else{
            if(display_left_width > card_width){
              posX = window_width - posX;
              $rootScope.focused_book.reposition_tooltip = {"right": posX+"px"}; 
            }
            else{
              $rootScope.focused_book.reposition_tooltip = {"left": "0px"};  
            }
            $rootScope.on_left = false;
          }
          // _set_dark_wrapper();
        }
        else{
          delete $rootScope.focused_book;
        }
        event.stopPropagation();
      }

      _init = function(){
        var book_id = $scope.book.id;
        console.debug("%c _init book"+book_id, "color: purple");
        $scope.book.show_labels = false;
        
        if(angular.isUndefined($scope.book.title)){
          websiteService.get_book_details("id="+book_id).then(function(data){
            angular.extend($scope.book, data);
            angular.forEach($scope.book.labels, function(value){
              if(value.checked){
                $scope.book.bookmark_status = 1;
              }
            });
            $scope.book.data_fetched = true;
          });
        }
      }

      _init();

    }],
    templateUrl: "/assets/angular/views/book_widget/show.html"
  };
}]);

websiteApp.directive('labelPopup', ['$rootScope', '$timeout', 'widgetService', 'RecommendationUIConstants', 'sharedService', function($rootScope, $timeout, widgetService, RecommendationUIConstants, sharedService){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.select_label = function(index){
        sharedService.bookmark_book($scope, index, event);
      }

      $scope.stop_horizontal_scroll = function(event){
        event.stopPropagation();
      }
    }],
    templateUrl: '/assets/angular/views/book_widget/partials/label_popup.html'    
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
    templateUrl: "/assets/angular/views/unused/book_navbar.html"
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
    templateUrl: "/assets/angular/views/book_widget/partials/bookmark.html"
  };
}]);

websiteApp.directive('bookInteract', ['$rootScope', '$timeout', 'widgetService', 'WebsiteUIConstants',
  function ($rootScope, $timeout, widgetService, WebsiteUIConstants){
  return {
    restrict: 'E',
    scope: {"book": "=data"},
    controller: ['$scope', function($scope){
      _init = function(){
        $scope.setStatus();
        $scope.label_placeholder = "Add to my library";
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
          $scope.label_placeholder = "Add a new shelf...";
        }

        event.stopPropagation();
      }

      $scope.handle_enter = function(event){
        var is_enter = event.keyCode == WebsiteUIConstants.Enter;
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

      $scope.stop_propagation = function(event){
        event.stopPropagation()
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
    templateUrl: "/assets/angular/views/book_widget/footer.html"
  };
}]);

websiteApp.directive('bookInfo', ['$rootScope', '$timeout', 'widgetService', 'sharedService', 'WebsiteUIConstants', '$cookieStore', function($rootScope, $timeout, widgetService, sharedService, WebsiteUIConstants, $cookieStore){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      // $scope.show_book = function(page){
      //   zoomin_book($scope, $timeout, $rootScope, page);
      // }
      $scope.stop_keyboard_navigation = function(event){
        var keyLeft = event.keyCode == WebsiteUIConstants.KeyLeft;
        var keyUp = event.keyCode == WebsiteUIConstants.KeyUp;
        var keyRight = event.keyCode == WebsiteUIConstants.KeyRight;
        var keyDown = event.keyCode == WebsiteUIConstants.KeyDown;
        if(keyLeft || keyRight || keyUp || keyDown){
          event.stopPropagation();
        }
      }

      $scope.handle_enter = function(event, new_thumb){
        var enter_key = event.keyCode == WebsiteUIConstants.Enter;
        if(enter_key){
          $rootScope.focused_book.add_thumb = false;
          var id = $rootScope.focused_book.id;
          var params = {"thumb_url": new_thumb, 
                        "book_id": id}
          widgetService.add_thumbnail(params);
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

      $scope.get_author_details = function(){
        $scope.show_author = true;
        $scope.show_buy = false;
        $rootScope.focused_book.collapse_blocks = true;
        $cookieStore.put('show_author', true);
        $cookieStore.put('show_buy', false);
        if(angular.isUndefined($rootScope.focused_book.author_details)){
          widgetService.get_author_details($rootScope.focused_book.id).then(function(data){
            if(angular.isDefined($rootScope.focused_book)){
              $rootScope.focused_book.author_details = {"about": data[0], "image_url": data[1], "signature_pic": data[2], "id": data[3], "book_ids": data[4], "book_isbns": data[5]};
            }
          });
        }
      }

      $scope.get_book_from_author = function(){
        var json = {"name": $rootScope.focused_book.author_name, "id": $rootScope.focused_book.author_details.id};
        $rootScope.$broadcast('updateFilters', "AUTHOR", json);
      }

      $scope.get_buy_links = function(){
        $rootScope.focused_book.collapse_blocks = true;
        $scope.show_author = false;
        $scope.show_buy = true;
        $cookieStore.put('show_author', false);
        $cookieStore.put('show_buy', true);
        if(angular.isUndefined($rootScope.focused_book.bnn_links)){
          widgetService.get_affiliate_links($rootScope.focused_book.id).then(function(results){
            $rootScope.focused_book.bnn_links = results.bnn.links;
          });
        }
      }

      $scope.get_book_overview = function(){
        $rootScope.focused_book.collapse_blocks = true;
        $scope.show_buy = false; 
        $scope.show_author = false;
        $cookieStore.put('show_author', false);
        $cookieStore.put('show_buy', false);
      }

      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.close_focused_tooltip = function(){
        delete $rootScope.focused_book;
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
        var recording_time_first_time = angular.isUndefined($rootScope.focused_book.time_index) || $rootScope.focused_book.time_index == null;
        if(recording_time_first_time){
          $scope.$emit('gamifyCount', 10, true);
        }

        $rootScope.focused_book.time_index = read_timer;
        var message = "SUCCESS-Recorded approximate time to read <br/>."
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
        if(angular.isDefined($rootScope.user.name)){
          name = $rootScope.user.name;
        }
        var message = "<span>described reading length of <span class='site_color'>"+$rootScope.focused_book.title+"</span><span>&nbsp; as a&nbsp;'"+reading_length+"'</span>";
        
        var notification = {
          "thumb":$rootScope.user.thumb,
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
            "name":name
          }
        };
        
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

      _display_tweet = function(){
        $rootScope.focused_book.display_profile = $rootScope.user.thumb; 
        $rootScope.focused_book.display_tweet = "Comment on this book...";
      }

      _open_tab = function(){
        if(angular.isDefined($cookieStore.get('show_author'))){
          $scope.show_author = $cookieStore.get('show_author');
        }
        else{
          $scope.show_author = false;
        }
        if(angular.isDefined($cookieStore.get('show_buy'))){
          $scope.show_buy = $cookieStore.get('show_buy');
        }
        else{
          $scope.show_buy = false;
        }
      }

      $scope._get_book_feed = function(){
        if(angular.isUndefined($rootScope.focused_book.tweets)){
          $rootScope.focused_book.tweets = [];
          widgetService.get_book_feed($rootScope.focused_book.id).then(function(data){
            if($rootScope.focused_book != null){
              $rootScope.focused_book.tweets = data;
              _display_tweet();
            }
          });
        }
      }

      _init = function(){
        _open_tab();

        if(angular.isDefined($rootScope.focused_book)){
          $scope._get_book_feed();
          if($scope.show_author){
            $scope.get_author_details();
          }
          else if($scope.show_buy){
            $scope.get_buy_links();
          }
          else{
            $scope.get_book_overview();
          }
        }
      }

      _init();

    }],
    templateUrl: "/assets/angular/views/home/shared/book_info.html"
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
    templateUrl: "/assets/angular/views/unused/book_tags.html"
  };
}]);

websiteApp.directive('recommend', ['$rootScope', '$timeout', 'widgetService', 'websiteService', function($rootScope, $timeout, widgetService, websiteService){
  return{
    restrict: 'E',
    scope: {'recommend_object': '=data'},
    controller: ['$scope', function($scope){
      $scope.select_thumb = function(event, friend_id){
        var selected = event.currentTarget.dataset.selected == "true";
        if(!selected){
          $scope.user.selected_followers.push(friend_id);
          event.currentTarget.dataset.selected = true;
          event.currentTarget.style.border = "5px solid #FEBF00";
        }
        else{
          $scope.user.selected_followers.splice($scope.user.selected_followers.indexOf(friend_id), 1);
          event.currentTarget.dataset.selected = false;
          event.currentTarget.style.border = "5px solid transparent";
        }
      }

      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.close_friends_list = function(){
        $scope.recommend_object.recommended = false; 
        $rootScope.focused_book.collapse_blocks = false;
      }

      $scope.recommend = function(){
        $rootScope.focused_book.collapse_blocks = true;
        var book_title = $scope.recommend_object.title;
        var author_name = $scope.recommend_object.author_name;
        if($scope.recommend_object.recommended){
          $scope.recommend_object.recommended = false;
          var message = "SUCCESS-Recommended to selected friends.";
          var timeout_event = notify($rootScope, message, $timeout);
          $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
          });
          // $('body').css('cursor', 'default');
          var params = {"friend_ids": $scope.user.selected_followers, "book_id": $scope.recommend_object.id};
          widgetService.recommend(params);
          $scope.$emit('gamifyCount', 10, true);
        }
        else{
          $scope.recommend_object.recommended = true;
          // $('body').css('cursor', 'copy');
        }
      }

      $scope._init = function(){
        if(angular.isUndefined($rootScope.user.followers)){
          $rootScope.user.selected_followers = [];
          websiteService.get_followed_by().then(function(data){
            $rootScope.user.followers = [];
            angular.forEach(data, function(value){
              var json = {"name": value[1], "id": value[0], "thumb": value[2]};
              this.push(json);
            }, $rootScope.user.followers);
            $scope.user = {};
            $scope.user.followers = $rootScope.user.followers;
            $scope.user.selected_followers = $rootScope.user.selected_followers;
          });
        }
        else{
          $scope.user = {};
          $scope.user.followers = $rootScope.user.followers;
          $scope.user.selected_followers = $rootScope.user.selected_followers;
        }
      }

      $scope._init();
    }],
    templateUrl: "/assets/angular/views/home/shared/recommend.html"
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
    templateUrl: "/assets/angular/views/unused/mark_as_read.html"
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
        var message = "ALERT- Tag with the name '"+custom_bookmark+"' is already added in the list";
        break;
      }
    }

    if(!already_exists){
      $scope.book.bookmark_status = 1;
      $rootScope.labels = $rootScope.labels.concat([{"name": custom_bookmark}]);
      $scope.book.labels = $scope.book.labels.concat([{"name": custom_bookmark, "checked": true}]);
      $rootScope.user.bookmark_count = $rootScope.user.bookmark_count + 1;
      $scope.$emit('gamifyCount', 10, true);
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