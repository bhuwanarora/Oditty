websiteApp.directive('category', function () {
  return {
    restrict: 'E',
    scope: {
      widget : '@'
    },
    controller: function($scope){
      $scope.initVerticalText = function(){
        var isBook = $scope.widget == "book";
        var isReader = $scope.widget == "reader";
        var isAuthor = $scope.widget == "author";
        if(isBook){
          var obj = $scope.$parent.book;
        }
        else if(isReader){
          var obj = $scope.$parent.reader;
        }
        else if(isAuthor){
          var obj = $scope.$parent.author;
        }
        if(obj){
          var name = obj.category.name;
          var description = obj.category.description;
          $scope.nameArray = name.split('');
          $scope.descriptionArray = description.split('');
          // $scope.category_style = {"background-color": obj.category.background_color};
        }
      }
    },
    templateUrl: "/assets/angular/widgets/base/widget/category.html"
  };
});

websiteApp.directive('messageApp', function (websiteService) {
  return{
    restrict: 'E',
    controller: function($scope){
      $scope.send_message = function(){

      }
    },
    templateUrl: "/assets/angular/widgets/base/widget/message_app.html"
  }
});

websiteApp.directive('follow', function ($rootScope, $timeout, widgetService) {
  return{
    restrict: 'E',
    controller: function($scope){
      $scope.toggle_follow = function(){
        if($scope.reader){
          var reader_name = $scope.reader.name;
          if($scope.reader.follow){
            $scope.reader.follow = false;
            $scope.$emit('removeFromShelf', "READER", $scope.reader);
            var message = "SUCCESS-Reader "+reader_name+" has been removed from your follow list.";
          }
          else{
            $scope.reader.follow = true;
            $scope.$emit('addToShelf', "READER", $scope.reader);
            var message = "SUCCESS-You are now following "+reader_name+".";
          }
          var timeout_event = notify($rootScope, message, $timeout);
          widgetService.follow($scope.reader.id, "READER", $scope.reader.follow);
        }
        else if($scope.author){
          var author = $scope.author.name;
          if($scope.author.follow){
            $scope.author.follow = false;
            $scope.$emit('removeFromShelf', "AUTHOR", $scope.author);
            widgetService.follow($scope.author.id, "AUTHOR", $scope.author.follow);
            var message = "SUCCESS-Author "+author+" has been removed from your follow list."; 
          }
          else{
            $scope.author.follow = true;
            $scope.$emit('addToShelf', "AUTHOR", $scope.author);
            var message = "SUCCESS-You are now following Author "+author+"."; 
          }
          var timeout_event = notify($rootScope, message, $timeout);
          widgetService.follow($scope.author.id, "AUTHOR", $scope.author.follow);
        }
        if(timeout_event){
          $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
          });
        }
      }
    },
    templateUrl: "/assets/angular/widgets/base/widget/follow.html"
  }
});

websiteApp.directive('widgetThumb', function ($timeout, $rootScope) {
  return {
    restrict: 'E',
    controller: function($scope){
      $scope.show_images = function(){
        var delay = 500;
        if(global_display_timer == 2500){
          global_display_timer = delay;
        }
        else{
          global_display_timer = global_display_timer + delay;
        }
        var timeout_event = $timeout(function(){
          if($scope.book){
            var obj = $scope.book;
          }
          else if($scope.author){
            var obj = $scope.author;
          }
          else if($scope.reader){
            var obj = $scope.reader;
          }
          if(obj){
            $scope.thumb_style = {'background': "url('"+obj.thumb.url+"')"};
          }
        }, global_display_timer);

        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
        });
      }

      _get_obj = function(){
        if($scope.book){
          var obj = $scope.book;
        }
        else if($scope.author){
          var obj = $scope.author;
        }
        else if($scope.reader){
          var obj = $scope.reader;
        }
        return obj;
      }

      _init = function(){
        var obj = _get_obj();
        if(obj){
          $scope.thumb_style = {'background-color': obj.thumb.background_color};
        }
        // $scope.$on('showImages', function(){
        //   $scope.show_images();
        // });
        $scope.show_images();
      }


      _init();
    },
    templateUrl: "/assets/angular/widgets/base/widget/widget_thumb.html"
  };
});