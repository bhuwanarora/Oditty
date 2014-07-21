websiteApp.service('sharedService', ['$timeout', '$rootScope', 'widgetService', function ($timeout, $rootScope, widgetService) {
    this.mark_as_read = function($scope, book, event){
        var book_title = book.title;
        var author_name = book.author_name;
        if(book.status){
          book.status = false;
          var index = $rootScope.user.books['read'].indexOf(book);
          $rootScope.user.books['read'].splice(index, 1);
          var message = "SUCCESS-Removed from <span class='icon-books'></span> Books Read. ";
        }
        else{
          var message = "<span><b>"+name+"</b> </span> added <span class='site_color'>"+book_title+"</span>&nbsp;to&nbsp;<span class='icon-books'></span><span>&nbsp;books read.</span>";
          var name = $rootScope.user.email;
          var thumb = "assets/profile_pic.jpeg"
          var notification = {
            "thumb":thumb,
            "message":message,
            "timestamp":new Date().getTime(),
            "book":{
              "id":book.id,
              "title":book_title,
              "author_name":author_name,
              "isbn":book.isbn
            },
            "user":{
              "id":$rootScope.user.id,
              "name":$rootScope.user.email
            }
          }
          $scope.$emit('addToNotifications', notification);


          book.status = true;
          $rootScope.user.books['read'].push(book);
          message = "SUCCESS-Added to <span class='icon-books'></span> Books Read. ";
        }
        widgetService.mark_as_read(book.id, book.status);

        var timeout_event = notify($rootScope, message, $timeout);
        $scope.$on('destroy', function(){
          $timeout.cancel(timeout_event);
          $timeout.cancel(glow_event);
        });

        event.stopPropagation();
    };

}]);