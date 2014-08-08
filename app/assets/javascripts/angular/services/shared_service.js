websiteApp.service('sharedService', ['$timeout', '$rootScope', 'widgetService', 'websiteService', 'stropheService', function ($timeout, $rootScope, widgetService, websiteService, stropheService) {
    this.is_logged_in = function($scope){
      websiteService.get_user().then(function(data){
        if(data["logged_in"]){
          $rootScope.user.logged = true;
          $rootScope.user.id = data["id"];
          // $scope.$emit('getNotifications');
          websiteService.get_user_details().then(function(data){
              angular.extend($rootScope.user, data);
            });
          stropheService.start_connection();
        }
      });
    }

    this.mark_as_read = function($scope, book, event){
        var book_title = book.title;
        var author_name = book.author_name;
        if(book.status){
          book.status = false;
          var index = $rootScope.user.books['read'].indexOf(book);
          $rootScope.user.books['read'].splice(index, 1);
          var message = "SUCCESS-Removed from <span class='icon-books'></span> Books Read. ";
          $rootScope.user.book_read_count = $rootScope.user.book_read_count - 1;
          var points = 5;
          var remove_rating = angular.isDefined(book.user_rating) && book.user_rating != null;
          var remove_read_time = angular.isDefined(book.time_index) && book.time_index != null;
          if(remove_rating){
            delete book.user_rating;
            points = points + 10;
          }
          if(remove_read_time){
            delete book.time_index ;
            points = points + 10;
          }
          $rootScope.$broadcast('gamifyCount', points, false);
        }
        else{
          if($rootScope.user.name){
            var name = $rootScope.user.name;
          }
          else{
            var name = $rootScope.user.email; 
          }
          var message = "<span><b>"+name+"</b> </span><br/><span> added </span><span class='site_color'>"+book_title+"</span>&nbsp;to&nbsp;<span class='icon-books'></span><span>&nbsp;books read.</span>";
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
              "name":name
            }
          }
          $rootScope.$broadcast('gamifyCount', 5, true);
          $rootScope.user.book_read_count = $rootScope.user.book_read_count + 1;
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