websiteApp.directive('reader', ['$rootScope', 'widgetService', function ($rootScope, widgetService) {
  return {
    restrict: 'E',
    scope: { 'reader': '=data' },
    controller: ['$scope', function($scope){
      $scope.hover = function() {
        $scope.hovered = true;
      }

      $scope.mouseout = function() {
      	$scope.hovered = false;
      }

      $scope.show_focused_tooltip = function(event){
        if($rootScope.focused_reader != $scope.reader){
          $rootScope.focused_reader = $scope.reader;
          var posX = event.currentTarget.offsetParent.offsetParent.offsetLeft - event.pageX + event.clientX;
          var display_right_width =  window_width - (posX + event.currentTarget.offsetParent.scrollWidth);
          var display_left_width = posX;

          if(display_right_width > display_left_width){
            if(display_right_width > 400){
              posX = posX + event.currentTarget.offsetParent.scrollWidth - event.currentTarget.offsetLeft;
              $rootScope.focused_reader.reposition_tooltip = {"left": posX+"px", "top": "60px"};
            }
            else{
              $rootScope.focused_reader.reposition_tooltip = {"right": "0px", "top": "60px"}; 
            }
          }
          else{
            if(display_left_width > 400){
              posX = window_width - posX;
              $rootScope.focused_reader.reposition_tooltip = {"right": posX+"px", "top": "60px"}; 
            }
            else{
              $rootScope.focused_reader.reposition_tooltip = {"left": "0px", "top": "60px"};  
            }
          }
        }
        else{
          $rootScope.focused_reader = null;
        }
        event.stopPropagation();
      }

      _init = function(){
        $scope.active_reader_filter = true;
      }

      _init();

    }],
    templateUrl: "/assets/angular/views/unused/reader/reader_widget.html"
  };
}]);

websiteApp.directive('focusedReader', ['$rootScope', '$timeout', 'widgetService', function($rootScope, $timeout, widgetService){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.stop_propagation = function(event){
        event.stopPropagation();
      }

      $scope.close_focused_tooltip = function(){
        $rootScope.focused_reader = null;
      }

      $scope.close_interaction_box = function(){
        $scope.focused_reader.interact = false;
        $scope.hash_tags = [];
      }

      $scope.stop_horizontal_scroll = function(event){
        event.stopPropagation();
      }

    }],
    templateUrl: "/assets/angular/views/unused/reader/focused_reader.html"
  }
}]);

websiteApp.directive('messageBox', function(){
  return{
    restrict: 'E',
    controller: ['$scope', function($scope){
      $scope.close_message_box = function(){
        $scope.reader.show_message_box = false;
      }
    }],
    templateUrl: "/assets/angular/views/unused/reader/message_box.html"
  }
});

websiteApp.directive('readerInteract', ['websiteService', function (websiteService) {
  return {
    restrict: 'E',
    controller: ['$scope', function($scope){

      $scope.toggle_message_box = function(){
        if($scope.reader.show_message_box){
          $scope.reader.show_message_box = false;
        }
        else{
          $scope.reader.show_message_box = true;
        }
      }
    }],
    templateUrl: "/assets/angular/views/unused/reader/reader_interact.html"
  };
}]);