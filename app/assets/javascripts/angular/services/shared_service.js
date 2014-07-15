websiteApp.service('sharedService', ['$timeout', '$rootScope', 'widgetService', function ($timeout, $rootScope, widgetService) {
    this.mark_as_read = function($scope, book, event){
        var book_title = book.title;
        var author_name = book.author_name;
        if(book.status){
          book.status = false;
          var index = $rootScope.user.books['read'].indexOf(data);
          $rootScope.user.books['read'].splice(index, 1);
          var message = "SUCCESS-Removed from <span class='icon-books'></span> Books Read. ";
        }
        else{
          book.status = true;
          $rootScope.user.books['read'].push(book);
          
          var message = "SUCCESS-Added to <span class='icon-books'></span> Books Read. ";

          $scope.$on('destroy', function(){
            $timeout.cancel(timeout_event);
            $timeout.cancel(glow_event);
          });

        }
        var timeout_event = notify($rootScope, message, $timeout);
        widgetService.mark_as_read(book.id, book.status);
        event.stopPropagation();
    };
}]);