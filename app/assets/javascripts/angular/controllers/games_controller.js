homeApp.controller('gamesController', ["$scope", 'gamesService', '$rootScope', '$timeout', 'feedService', function($scope, gamesService, $rootScope, $timeout, feedService){

    $scope.get_books = function(){
        if(angular.isUndefined($scope.books)){
            $scope.books = [];
        }
        var skip = $scope.books.length;
        gamesService.get_books(skip).then(function(data){
            $scope.books = $scope.books.concat(data);
            $scope.set_book();
        });
    }

    $scope.set_book = function(){
        delete $scope.book;
        $scope.book = $scope.books[$scope.active_index];
        $scope.book.isbn = $scope.book.isbn.split(",")[0];
        $scope.game_background = {"background-image": "url('http://rd-images.readersdoor.netdna-cdn.com/"+$scope.book.isbn+"/L.jpg')"};
        delete $scope.shelves;
        feedService.get_bookmarks($scope.book.id, "Book").then(function(data){
            $scope.shelves = data;
        });
        $scope.book.user_rating = 0;
    }

    $scope.toggle_bookmark = function(shelf){
        shelf.status = !shelf.status;
        
    }

    $scope.get_users = function(){
        if(angular.isUndefined($scope.users)){
            $scope.users = [];
        }
        var skip = $scope.users.length;
        gamesService.get_users(skip).then(function(data){
            $scope.users = $scope.users.concat(data);
        });
    }

    $scope.start_playing = function(){
        $scope.score = 0;
        $scope.play = false;
        $scope.done = false;
        delete $scope.message;
        $scope.active_index = 0;
        $scope.get_books();
        $scope.get_users();
    }

    $scope.next_book = function(){
        if($scope.next){
            $scope.next = false;
            if($scope.active_index == 9){
                $scope.message = "<h1>Done!</h1>";
                $scope.done = true;
                $scope.play = true;
                $scope.score = parseInt($scope.score);
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
            var difference = Math.abs($scope.book.user_rating - $scope.book.rating);
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

    var _init = (function(){
        $scope.play = true;
        $scope.play_message = "GOT IT";
        $scope.message = "<div class='guide'><div><b>How to Play</b></div><br/><div>We'll serve up 10 book covers in a row. Just slide the circle and rate the book based off its cover. Then click JUDGE.</div><br/><div>Got it?</div></div>";
    }());
}]);