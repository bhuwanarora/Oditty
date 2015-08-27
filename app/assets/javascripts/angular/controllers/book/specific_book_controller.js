homeApp.controller('specificBookController', ["$scope", "$rootScope", "$timeout", "bookService", '$mdToast', '$location', '$mdSidenav', 'ColorConstants', '$mdBottomSheet', function($scope, $rootScope, $timeout, bookService, $mdToast, $location, $mdSidenav, ColorConstants, $mdBottomSheet){

    $scope.toggle_endorse = function(){
        if(_unauthenticated_user()){
            $mdSidenav('signup').toggle();
        }
        else{
            if($scope.book.endorse_status){
                $scope.book.endorse_status = false;
            }
            else{
                $scope.book.endorse_status = true;
            }
            bookService.endorse_book($rootScope.active_book.book_id, $scope.book.endorse_status);
            $mdToast.show({
                controller: 'toastController',
                templateUrl: 'assets/angular/html/shared/toast/endorse_action.html',
                hideDelay: 6000,
                position: $scope.getToastPosition()
            });
        }
    }

    $scope.hide_bottomsheet = function($event){
        $mdBottomSheet.hide();
    }

    $scope.show_todo_list = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/todo/book.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: event
        });
    }

    var _unauthenticated_user = function(){
        return ((getCookie("logged") == "") || (getCookie("logged") == null));
    }

    $scope.show_share_bottom_sheet = function(event){
        $mdSidenav('right_share').toggle();
    }; 


    $scope.getToastPosition = function() {
        return Object.keys($scope.toast_position)
                    .filter(function(pos) { return $scope.toast_position[pos]; })
                    .join(' ');
    };


    $scope.rate_book = function(book){
        if(_unauthenticated_user()){
            $mdSidenav('signup').toggle();
        }
        else{
            bookService.rate_book(book.book_id, book.user_rating);
        }
    }

    $scope.load_sample_read = function(){
        // google.load("books", "0");

        // function initialize() {
        //     var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
        //     viewer.load('ISBN:0738531367');
        // }

        // google.setOnLoadCallback(initialize);
    }

    $scope.get_active_class = function(path){
        var is_init = $location.path().substr(1, path.length+1) == "" && (path == "book/timeline");
        if(($location.path().substr(1, path.length+1) == path) || is_init){
            return "bold red_color";
        } else {
            return "grey_color";
        }
    }

    var _init = function(){
        // $scope.$location = $location;
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parsed = regex.exec($location.absUrl());
        
        if(url_parsed != null){
            var id = url_parsed[2];
        }
        if(angular.isDefined($rootScope.active_book)){
            if(angular.isDefined($rootScope.active_book.id)){
                var book_id = $rootScope.active_book.id;
            }
            else{
                var book_id = $rootScope.active_book.book_id;
            }
        }
        else{
            var book_id = id;
        }
        
        var filter = "id="+book_id;
        $scope.book_loading = true;
        var book_data_timeout = $timeout(function(){
            $scope.info.loading = true;
            bookService.get_book_details(filter).then(function(data){
                if(angular.isDefined(data) && data != null){
                    var endorse_status = data.endorse_status != null;
                    var status = data.status != null;
                    var json = {"endorse_status" : endorse_status, "status" : status};
                    if(angular.isDefined($rootScope.active_book)){
                        $scope.book = angular.extend($rootScope.active_book, data);
                    }
                    else{
                        $scope.book = data;
                    }
                    $scope.book = angular.extend($scope.book, json);
                    $rootScope.active_book = $scope.book;
                    $scope.info.book = $scope.book;
                }
                $scope.book_loading = false;
                $scope.info.loading = false;
            });
            bookService.update_visited(book_id);
        }, 100);
        
        $scope.$on('destroy', function(){
            $timeout.cancel(book_data_timeout);
        });

        $scope.toast_position = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.is_book = true;

        $scope.constant = {"show_book": true};
        
    }

    _init();
}]);