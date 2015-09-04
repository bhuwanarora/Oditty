homeApp.controller('gamesController', ["$scope", 'gamesService', '$rootScope', '$timeout', function($scope, gamesService, $rootScope, $timeout){

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
        $scope.book.user_rating = 0;
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
        delete $scope.message;
        $scope.active_index = 0;
        $scope.get_books();
        $scope.get_users();
    }

    $scope.next_book = function(){
        if($scope.next){
            $scope.next = false;
            if($scope.active_index == 9){
                $scope.message = "Done!";
                $scope.done = true;
                $scope.play = true;
                $scope.score = parseInt($scope.score);
                $scope.play_message = "Play Again";
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
                var message = "Perfect";
            }
            else if(difference < 1){
                var message = "Excellent";
            }
            else if(difference < 3){
                var message = "Good";
            }
            else if(difference < 4){
                var message = "Not Bad";
            }
            else if(difference < 7){
                var message = "Too Bad";
            }
            else{
                var message = "Don't judge a book by its cover";
            }
            $scope.message = message;
            $timeout(function(){
                delete $scope.message;
            }, 1000);
        }
    }

    var _init = (function(){
        $scope.play = true;
        $scope.play_message = "Play";
        $scope.message = "Judge a book by its Cover";
    }());
}]);