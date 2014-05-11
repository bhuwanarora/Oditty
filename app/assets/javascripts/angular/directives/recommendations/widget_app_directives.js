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
        if(obj.category){
          var name = obj.category.name;
          var description = obj.category.description;
          $scope.nameArray = name.split('');
          $scope.descriptionArray = description.split('');
          $scope.category_style = {"background-color": obj.category.background_color};
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
        if($scope.follow){
          $scope.follow = false;
          if($scope.reader){
            $scope.$emit('removeFromShelf', "READER", $scope.reader);
            widgetService.follow($scope.reader.id, "READER", $scope.follow);
          }
          else if($scope.author){
            $scope.$emit('removeFromShelf', "AUTHOR", $scope.author);
            widgetService.follow($scope.author.id, "AUTHOR", $scope.follow);
          }
        }
        else{
          $scope.follow = true;
          if($scope.reader){
            $scope.$emit('addToShelf', "READER", $scope.reader);
            var reader = $scope.reader.name;
            var message = "SUCCESS-You are now following "+reader;
            widgetService.follow($scope.reader.id, "READER", $scope.follow);
          }
          else if($scope.author){
            $scope.$emit('addToShelf', "AUTHOR", $scope.author);
            var author = $scope.author.name;
            var message = "SUCCESS-You are now following Author "+author; 
            widgetService.follow($scope.author.id, "AUTHOR", $scope.follow);
          }

          var timeout_event = notify($rootScope, message, $timeout);
          $rootScope.$broadcast('glowShelf');
          $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
            $timeout.cancel(glow_event);
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
      $scope.show_book = function(page){
        zoomin_book($scope, $timeout, $rootScope, page);
      }

      $scope.show_share_options = function(){
        $scope.show_share_menu = true;
      }

      $scope.hide_share_options = function(){
        $scope.show_share_menu = false;
      }

      _init = function(){
        $scope.zoomin_book = false;
        $scope.show_share_menu = false;
      }

      $scope.show_images = function(){
        if(global_display_timer == 5000){
          global_display_timer = 1000;
        }
        else{
          global_display_timer = global_display_timer + 1000;
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
          $scope.thumb_style = {'background': "url('"+obj.thumb.url+"')"};
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
        $scope.thumb_style = {'background-color': obj.thumb.background_color};
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