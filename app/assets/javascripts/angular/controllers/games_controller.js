homeApp.controller('gamesController', ["$scope", 'gamesService', '$rootScope', '$timeout', 'feedService', 'sharedService', '$mdSidenav', function($scope, gamesService, $rootScope, $timeout, feedService, sharedService, $mdSidenav){

    $scope.get_books = function(){
        gamesService.get_books().then(function(data){
            $scope.books = data;
            $scope.set_book();
        });
    }

    $scope.set_book = function(){
        delete $scope.book;
        var book = {
            "title": $scope.books[$scope.active_index].title,
            "author_name": $scope.books[$scope.active_index].author_name,
            "page_count": $scope.books[$scope.active_index].page_count,
            "published_year": $scope.books[$scope.active_index].published_year,
            "author_id": $scope.books[$scope.active_index].author_id,
            "book_id": ($scope.books[$scope.active_index].id || $scope.books[$scope.active_index].book_id),
            "isbn": $scope.books[$scope.active_index].isbn,
            "goodness_index": $scope.books[$scope.active_index].goodness_index,
            "book_reader_relationship_index": $scope.books[$scope.active_index].book_reader_relationship_index,
            "likability_index": $scope.books[$scope.active_index].likeability_index,
            "popularity_index": $scope.books[$scope.active_index].popularity_index
        }

        $scope.book = book;
        $scope.book.isbn = $scope.book.isbn.split(",")[0];
        $scope.game_background = {"background-image": "url('http://rd-images.readersdoor.netdna-cdn.com/"+$scope.book.isbn+"/L.jpg')"};
        delete $scope.shelves;
        feedService.get_bookmarks($scope.book.book_id, "Book").then(function(data){
            $scope.shelves = data;
        });
        $scope.book.user_rating = 0;
        $scope.disbale = true;
        $timeout(function(){
            $scope.disbale = false;
        }, 3000);
    }

    $scope.toggle_bookmark = function(shelf){
        var bookmark_object = {"type": "Book", "id": $scope.book.book_id};
        sharedService.toggle_bookmark(shelf, shelf.status, bookmark_object, $scope);
        shelf.status = !shelf.status;
    }

    $scope.get_users = function(){
        if(angular.isUndefined($scope.users)){
            $scope.users = [];
        }
        var skip = $scope.users.length;
        gamesService.get_users(skip).then(function(data){
            if(data && data.length < 10){
                $scope.hide_show_more = true;
            }
            $scope.users = $scope.users.concat(data);
        });
    }

    $scope.start_playing = function(){
        if(angular.isUndefined($rootScope.user.id)){
            $mdSidenav('signup').toggle();
        }
        else{
            $scope.score = 0;
            $scope.play = false;
            $scope.done = false;
            delete $scope.message;
            $scope.active_index = 0;
            $scope.get_books();
            $scope.get_users();
        }
    }

    $scope.next_book = function(){
        if($scope.next){
            $scope.next = false;
            if($scope.active_index == 6){
                $scope.message = "<h1>Done!</h1>";
                $scope.done = true;
                $scope.play = true;
                $scope.score = parseInt($scope.score);
                $scope.accuracy = parseInt(100*($scope.score/$scope.book_count));
                $scope.save_score();
                if(angular.isUndefined($scope.total_score)){
                    $scope.total_score = 0;
                }
                
                $scope.total_score = $scope.total_score + $scope.score;
                $scope.play_message = "PLAY AGAIN";
            }
            else{
                $scope.active_index = $scope.active_index + 1;
                $scope.set_book();
            }
        }
        else{
            $scope.next = true;
            if(angular.isUndefined($scope.book.user_rating)){
                $scope.book.user_rating = 0;
            }
            var difference = Math.abs($scope.book.user_rating - $scope.book.goodness_index);
            $scope.score = $scope.score + ((10-difference)/10);
            if(difference == 0){
                var message = "<h1>Perfect<h1>";
            }
            else if(difference < 1){
                var message = "<h1>Excellent<h1>";
            }
            else if(difference < 3){
                var message = "<h1>Good<h1>";
            }
            else if(difference < 4){
                var message = "<h1>Not Bad<h1>";
            }
            else if(difference < 7){
                var message = "<h1>Too Bad<h1>";
            }
            else{
                var message = "<h1>Don't judge a book by its cover<h1>";
            }
            $scope.message = message;
            $timeout(function(){
                delete $scope.message;
            }, 1000);
        }
    }

    $scope.save_score = function(){
        var score = {"score": $scope.score};
        gamesService.save_score(score);
    }

    $scope.get_user_score = function(){
        gamesService.get_user_score().then(function(data){
            if(angular.isDefined(data) && angular.isDefined(data.ranking)){
                $scope.ranking = data.ranking;
                $scope.score = data.score;
                $scope.games = data.games;
            }
        });
    }

    var _init = (function(){
        $scope.play = true;
        $scope.get_user_score();
        $scope.play_message = "GOT IT";
        $scope.book_count = 7;
        $scope.message = "<div class='guide'><div><b>How to Play</b></div><br/><div>We'll serve up "+$scope.book_count+" book covers in a row. Just slide the circle and rate the book based off its cover. Then click JUDGE.</div><br/><div>Got it?</div></div>";
    }());
}]);