websiteApp.directive('category', function () {
  return {
    restrict: 'E',
    scope: {
      widget : '@'
    },
    controller: ['$scope', function($scope){
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
          // var description = obj.category.description;
          if(name){
            $scope.nameArray = name.split('');
          }
          $scope.rating = obj.rating;
          // $scope.descriptionArray = description.split('');
          // $scope.category_style = {"background-color": obj.category.background_color};
        }
      }
    }],
    templateUrl: "/assets/angular/widgets/base/widget/category.html"
  };
});

websiteApp.directive('messageApp', ['websiteService', function (websiteService) {
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.send_message = function(){

      }
    }],
    templateUrl: "/assets/angular/widgets/base/widget/message_app.html"
  }
}]);

websiteApp.directive('follow', ['$rootScope', '$timeout', 'widgetService', function ($rootScope, $timeout, widgetService) {
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.toggle_follow = function(){
        if($scope.reader){
          var reader_name = $scope.reader.name;
          if($scope.reader.follow){
            $scope.reader.follow = false;
            var index = $rootScope.user.readers['follow'].indexOf(data);
            $rootScope.user.readers['follow'].splice(index, 1);
            var message = "SUCCESS-Reader "+reader_name+" has been removed from your follow list.";
          }
          else{
            $scope.reader.follow = true;
            $rootScope.user.readers['follow'].push($scope.reader);
            var message = "SUCCESS-You are now following "+reader_name+".";
          }
          var timeout_event = notify($rootScope, message, $timeout);
          widgetService.follow($scope.reader.id, "READER", $scope.reader.follow);
        }
        else if($scope.author){
          var author = $scope.author.name;
          if($scope.author.follow){
            $scope.author.follow = false;
            var index = $rootScope.user.authors['follow'].indexOf(data);
            $rootScope.user.authors['follow'].splice(index, 1);
            widgetService.follow($scope.author.id, "AUTHOR", $scope.author.follow);
            var message = "SUCCESS-Author "+author+" has been removed from your follow list."; 
          }
          else{
            $scope.author.follow = true;
            $rootScope.user.authors['follow'].push($scope.author);
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
    }],
    templateUrl: "/assets/angular/widgets/base/widget/follow.html"
  }
}]);

websiteApp.directive('widgetThumb', ['$timeout', '$rootScope', '$filter', function ($timeout, $rootScope, $filter) {
  return {
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.show_images = function(){
        // var delay = 0;
        // if(global_display_timer == 2500){
        //   global_display_timer = delay;
        // }
        // else{
        //   global_display_timer = global_display_timer + delay;
        // }
        if(angular.isDefined($scope.book)){
          var obj = $scope.book;
          if(angular.isDefined(obj.isbn)){
            $scope.thumb_style = {'background': "url('"+_get_thumb(obj)+"')"};
          }
        }
        else if(angular.isDefined($scope.author)){
          var obj = $scope.author;
        }
        else if(angular.isDefined($scope.reader)){
          var obj = $scope.reader;
        }
        // var timeout_event = $timeout(function(){
        // }, global_display_timer);

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

      _get_thumb = function(obj){
        var external_thumb = angular.isDefined(obj.external_thumb) && obj.external_thumb != null;
        if(external_thumb){
          var thumb = obj.external_thumb;
        }
        else{
          var thumb = $filter('thumb')(obj.isbn);
        }
        return thumb;
      }

      _init = function(){
        var obj = _get_obj();
        if(obj && obj.isbn){
          $scope.thumb_style = {'background': "url('"+_get_thumb(obj)+"')"};
        }
        // $scope.$on('showImages', function(){
        //   $scope.show_images();
        // });
        $scope.show_images();
      }


      _init();
    }],
    templateUrl: "/assets/angular/widgets/base/widget/widget_thumb.html"
  };
}]);