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
    templateUrl: "/assets/angular/widgets/views/unused/category.html"
  };
});

websiteApp.directive('messageApp', ['websiteService', function (websiteService) {
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.send_message = function(){

      }
    }],
    templateUrl: "/assets/angular/views/unused/message_app.html"
  }
}]);

websiteApp.directive('widgetThumb', ['$timeout', '$rootScope', '$filter', 'ColorConstants', function ($timeout, $rootScope, $filter, ColorConstants) {
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
            var thumb = _get_thumb(obj);
            if(angular.isDefined(thumb)){
              $scope.thumb_style = {'background': "url('"+thumb+"')"};
            }
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
          var thumb = _get_thumb(obj);
          if(angular.isDefined(thumb)){
            $scope.thumb_style = {'background': "url('"+thumb+"')"};
          }
        }
        var random_color = ColorConstants.value[Math.floor(Math.random() * ColorConstants.value.length)];
        $scope.random_background = {"background-color": random_color};
        // $scope.$on('showImages', function(){
        //   $scope.show_images();
        // });
        $scope.show_images();
      }


      _init();
    }],
    templateUrl: "/assets/angular/views/book_widget/thumb.html"
  };
}]);