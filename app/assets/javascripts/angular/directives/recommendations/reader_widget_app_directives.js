websiteApp.directive('reader', function (widgetService) {
  return {
    restrict: 'E',
    scope: { 'reader': '=data' },
    controller: function($scope){
      $scope.hover = function() {
        $scope.hovered = true;
      };

      $scope.mouseout = function() {
      	$scope.hovered = false;
      };

      _init = function(){
        var reader_id = $scope.reader.id;
        widgetService.populate_tooltips(reader_id).then(function(data){
          $scope.reader.title = data.title;
          $scope.reader.author_name = data.author_name;
          $scope.reader.users = data.users;
          $scope.reader.summary = data.summary;
          $scope.reader.users_count = data.users_count;
        });
        var tilt_angle = (Math.floor(Math.random() * 10) + 1)/10+"deg";
        // $scope.reader_tilt = {"transform":"rotate("+tilt_angle+")",
        //                   "-ms-transform":"rotate("+tilt_angle+")",
        //                   "-webkit-transform":"rotate("+tilt_angle+")";
      }

      // _init();

    },
    templateUrl: "/assets/angular/widgets/base/reader/reader_widget.html"
  };
});

// websiteApp.directive('readerNavbar', function ($rootScope, $timeout) {
//   return {
//     restrict: 'E',
//     controller: function($scope){
//       $scope.show_reader = function(page){
//         zoomin_reader($scope, $timeout, $rootScope, page);
//       }
//     },
//     templateUrl: "/assets/angular/widgets/base/reader/reader_navbar.html"
//   };
// });

websiteApp.directive('readerInteract', function (websiteService) {
  return {
    restrict: 'E',
    controller: function($scope){
      _init = function(){
        $scope.setStatus();
        $('.comment_box').contentEditable='true'; 
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

      // _init();
    },
    templateUrl: "/assets/angular/widgets/base/reader/reader_interact.html"
  };
});

// websiteApp.directive('interactionBox', function($rootScope, $timeout, widgetService){
//   return{
//     restrict: 'E',
//     controller: function($scope){
//       $scope.close_interaction_box = function(){
//         $scope.interact = false;
//         $scope.hash_tags = [];
//       }

//       $scope.own_this_reader = function(){
//         if($scope.have_this_reader){
//           $scope.have_this_reader = false;
//         }
//         else{
//           $scope.have_this_reader = true;
//         }
//         var id = $scope.reader.id;
//         widgetService.own_this_reader(id, $scope.have_this_reader);
//       }
      
//       _init = function(){
//       }

//       $scope.toggle = function(index){
//         $scope.mark_as_rated();
//       }

//       $scope.mark_as_rated = function(){
//         $scope.reader.rating = parseInt(event.srcElement.innerText);
//         var timeout_event = notify($rootScope, "THANKS-This will help us to recommend you better readers.", $timeout);

//         $scope.$on('destroy', function(){
//           $timeout.cancel(timeout_event)
//         });

//         widgetService.rate_this_reader($scope.reader.id, $scope.reader.rating);
//       }

//       $scope.is_active = function(index){
//         var rating = parseInt(index) + 1;
//         var is_active = false;
//         if(rating <= $scope.reader.rating){
//           is_active = true;
//         }
//         return is_active;
//       }

//       $scope.record_read_time = function(read_timer){
//         $scope.reader.read_timer = read_timer;
//         widgetService.record_time($scope.reader.id, read_timer);
//       }

//       $scope.is_timer = function(read_timer){
//         var is_timer = false;
//         if($scope.reader.read_timer == read_timer){
//           is_timer = true;
//         }
//         return is_timer;
//       }

//       _init();
//     },
//     templateUrl: "assets/angular/widgets/base/reader/interaction_box.html"
//   }
// });

// websiteApp.directive('readerTags', function($rootScope, $timeout) {
//   return {
//     restrict: 'E',
//     controller: function($scope){
//       $scope.show_reader = function(page){
//         zoomin_reader($scope, $timeout, $rootScope, page);
//       }
//     },
//     templateUrl: "/assets/angular/widgets/base/reader/reader_tags.html"
//   };
// });

// websiteApp.directive('recommend', function($rootScope, $timeout, widgetService){
//   return{
//     restrict: 'E',
//     controller: function($scope){
//       $scope.recommend = function(){
//         var reader_title = $scope.reader.title;
//         var author_name = $scope.reader.author_name;
//         if($scope.recommended){
//           $scope.recommended = false;
//           var message = "SUCCESS-"+reader_title+" by "+author_name+" will not be recommended to your friends.";
//         }
//         else{
//           $scope.recommended = true;
//           var message = "SUCCESS-"+reader_title+" by "+author_name+" has been recommended to all your friends.";
//         }
//         var timeout_event = notify($rootScope, message, $timeout);
//         $scope.$on('destroy', function(){
//           $timeout.cancel(timeout_event);
//         });
//         widgetService.recommend("reader", $scope.reader.id, $scope.recommended);
//       }
//     },
//     templateUrl: "/assets/angular/widgets/base/reader/recommend.html"
//   }
// });

// websiteApp.directive('markAsRead', function($rootScope, $timeout, widgetService){
// 	return {
// 		restrict: 'E',
// 		controller: function($scope){
//       $scope.markAsRead = function(){
//         if($scope.read){
//           $scope.read = false;
//           $scope.reader.status = 0;
//           $scope.$emit('removereaderFromShelf', $scope.reader);
//         }
//         else{
//           $scope.read = true;
//           $scope.reader.status = 1;
//           $scope.$emit('addreaderToShelf', $scope.reader);
//           $rootScope.$broadcast('glowShelf');
//           var reader_title = $scope.reader.title;
//           var author_name = $scope.reader.author_name;
//           var message = "ADVISE-Also please rate "+reader_title+" by "+author_name+". This will help us to recommend better readers."
//           var timeout_event = notify($rootScope, message, $timeout);
//           $scope.interact = true;

//           $scope.$on('destroy', function(){
//             $timeout.cancel(timeout_event);
//             $timeout.cancel(glow_event);
//           });
//         }
//         widgetService.mark_as_read($scope.reader.id, $scope.read);
//       }
//     },
//     templateUrl: "/assets/angular/widgets/base/reader/mark_as_read.html"
//   }
// });

// function zoomin_reader($scope, $timeout, $rootScope, page){
//   $rootScope.initPage = page;
//   $scope.zoomin_reader = true;
//   var posX = event.currentTarget.offsetParent.offsetLeft + event.currentTarget.offsetWidth;
//   var screenX = event.screenX;
//   var scrollWidth = event.currentTarget.offsetParent.offsetParent.scrollWidth;
//   $scope.$emit('expandreader', $scope.reader.id, posX, screenX, scrollWidth);
//   var zoomout_event = $timeout(function(){
//     $scope.zoomin_reader = false;
//   }, 3000);

//   $scope.$on('destroy', function(){
//     $timeout.cancel(zoomout_event);
//   });
// }

// var global_display_timer = 0;