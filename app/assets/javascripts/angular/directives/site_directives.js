homeApp.directive('userCommunities', ["$rootScope", "userService", "sharedService", function($rootScope, userService, sharedService){
    return {
        restrict: 'E',
        scope : {userId: '=', reduced: '=', wrapped: '='},
        controller: ["$scope", function($scope){

            $scope.render_page = function(event){
                sharedService.render_page(event);
            }

            var _init = function(){
                $scope.rooms = [];
                if(angular.isUndefined($scope.userId) || ($scope.userId == null)){
                    if(angular.isDefined($rootScope.user) && angular.isDefined($rootScope.user.id)){
                        $scope.userId = $rootScope.user.id;
                    }
                }
                userService.get_communities($scope.userId).then(function(data){
                    angular.forEach(data, function(room){
                        var json = angular.extend(room, {"status": 1});
                        this.push(json);
                    }, $scope.rooms);
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/rooms/show.html'
    };
}]);

homeApp.directive('rdContent', ["websiteService", "$timeout", function(websiteService, $timeout){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
            }

            $scope.get_url = function(){
                return '/assets/angular/html/pages/products.html.erb';
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/rd_content.html'
    };
}]);

homeApp.directive('rdMainContent', ["websiteService", "$rootScope", "$sce", function(websiteService, $rootScope, $sce){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){

            var _init = function(){
                console.log("rdMainContent");
                var container = $rootScope.containers[$scope.$index];
                var url = container.url;
                var id = container.id;
                if(angular.isDefined(id)){
                    deleteCookie("id");
                    setCookie("id", id);
                }

                $scope.show_md_content = true;
                if(url == "room"){
                    $scope.show_md_content = false;
                    $scope.content_url = '/assets/angular/html/pages/room.html.erb';
                }
                else if(url == "rooms"){
                    $scope.content_url = '/assets/angular/html/pages/rooms.html.erb';
                }
                else if(url == "products"){
                    $scope.content_url = '/assets/angular/html/pages/products.html.erb';                
                    $scope.custom_style = {"width": '500px'};
                }
                else if(url == "spaces"){
                    $scope.show_md_content = false;
                    $scope.content_url = '/assets/angular/html/pages/spaces.html.erb';
                    $scope.custom_style = {"width": '500px'};
                }
                else if(url == "books"){
                    $scope.show_md_content = false;
                    $scope.content_url = '/assets/angular/html/pages/books.html.erb';
                }
                else if(url == "news_group"){
                    $scope.show_md_content = false;
                    $scope.content_url = '/assets/angular/html/pages/news.html.erb';
                    $scope.custom_style = {"width": '500px'};
                }
                else if(url == "book"){
                    $scope.custom_style = {"width": '1100px', "max-width": "1100px", "min-width": "1100px"};
                    $scope.content_url = '/assets/angular/html/pages/book.html.erb';
                }
                else if(url == "book_interaction"){
                    $scope.custom_style = {"width": '400px', 'min-width': '400px'};
                    $scope.content_url = '/assets/angular/html/pages/book_interaction.html.erb';   
                }
                else if(url == "book_rating"){
                    $scope.custom_style = {"width": '400px', 'min-width': '400px'};
                    $scope.content_url = '/assets/angular/html/pages/book_rating.html.erb';   
                }
                else if(url == "profile"){
                    $scope.content_url = '/assets/angular/html/pages/profile.html.erb';
                }
                else if(url == "browse"){
                    $scope.show_md_content = false;
                    $scope.content_url = '/assets/angular/html/pages/browse.html.erb';
                }
                else if(url.contains("author")){
                    if(url == "author"){

                    }
                    else if(url == "author#books"){

                    }
                    else if(url == "author#interview"){

                    }
                    else if(url == "author#wiki"){

                    }
                    $scope.content_url = '/assets/angular/html/pages/author.html.erb';
                }
                else if(url == "read_news"){
                    $scope.content_url = '/assets/angular/html/pages/read_news.html.erb';
                    $scope.custom_style = {"width": '500px'};   
                }
                else if(url == "watch_video"){
                    container.id = $sce.trustAsResourceUrl(container.id+"&autoplay=1");
                    $scope.content_url = '/assets/angular/html/pages/watch_video.html.erb';
                    $scope.custom_style = {"width": '500px'};

                    //  var tag = document.createElement('script');

                    // tag.src = "http://www.youtube.com/iframe_api";
                    // var firstScriptTag = document.getElementsByTagName('script')[0];
                    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                    // var player;
                    // var _onYouTubeIframeAPIReady = function(){
                    //     player = new YT.Player('ytplayer', {
                    //         events: {
                    //             'onReady': _onPlayerReady
                    //         }
                    //     });
                    // }

                    // var _onPlayerReady = function(event){
                    //     player.mute();
                    //     player.playVideo();
                    // }

                    // _onYouTubeIframeAPIReady();
                }
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/rd_main_content.html'
    };
}]);

homeApp.directive('testimonials', ["websiteService", "$timeout", function(websiteService, $timeout){
    return {
        restrict: 'E',
        controller: 'testimonialsController',
        templateUrl: '/assets/angular/html/shared/testimonials.html'
    };
}]);

homeApp.directive('browseRooms', ["$rootScope", "userService", "sharedService", function($rootScope, userService, sharedService){
    return {
        restrict: 'E',
        scope: {'reduced': '='},
        controller: ["$scope", function($scope){
            var _rooms = function(){
                var rooms = [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086,
                        "col": 4,
                        "row": 4
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Political Philosophy",
                        "id": 4972796,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Sports",
                        "id": 5024590,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Brain",
                        "id": 4988942,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Religion",
                        "id": 5023062,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Technology",
                        "id": 5021552,
                        "col": 4,
                        "row": 2
                    },
                    {
                        "name" : "Health",
                        "id": 5020478,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Blanching(Cooking)",
                        "id": 5107299,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Kumaon Literary Festival",
                        "id": 5408842,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Medicine",
                        "id": 5020467,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Pornography Ring",
                        "id": 5002021,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Harry Potter Universe",
                        "id": 5250069,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Sports Cars",
                        "id": 4978290,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Ghost",
                        "id": 5014454,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Self Portrait",
                        "id": 4996889,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Travel",
                        "id": 4980414,
                        "col": 4,
                        "row": 4
                    },
                    {
                        "name" : "Walt Disney Co",
                        "id": 5100214,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Biology",
                        "id": 5023104,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Quantum Gravity",
                        "id": 5013921,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Time",
                        "id": 4980633,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Space",
                        "id": 4975850,
                        "col": 2,
                        "row": 2
                    },
                    {
                        "name" : "Terrorism",
                        "id": 5035970,
                        "col": 2,
                        "row": 2
                    }

                ];
                return rooms;
            }

            $scope.render_page = function(event){
                sharedService.render_page(event);
            }

            $scope.goto_room = function(id){
                window.location.href = "/room?p="+id;
            }

            var _add_rooms = function(data){
                angular.forEach(data, function(value){
                    if(value.score == 1){
                        value.row = 6;
                        value.col = 6;
                    }
                    else if(value.score == 2){
                        value.row = 3;
                        value.col = 6;
                    }
                    else{
                        value.row = 3;
                        value.row = 3;
                    }
                    this.push(value);
                }, $scope.rooms);
            }

            $scope.show_more_suggestions = function(){
                if(!$scope.rooms_loading){
                    $scope.rooms_loading = true;
                    if(angular.isUndefined($scope.rooms)){
                        $scope.rooms = [];
                    }
                    var skip = $scope.rooms.length;
                    userService.room_suggestions(skip).then(function(data){
                        $scope.rooms_loading = false;
                        if(angular.isDefined(data.message)){
                            $scope.rooms = _rooms();
                            $scope.no_suggestions = true;
                        }
                        else{
                            if(data.length == 0){
                                if($scope.rooms.length == 0){
                                    $scope.rooms = _rooms();
                                    $scope.no_suggestions = true;
                                }
                                else{
                                    _add_rooms(data);
                                }
                            }
                            else{
                                _add_rooms(data);
                            }
                        }
                    });
                }
            }

            var _init = function(){
                $scope.show_more_suggestions();
                // if(angular.isDefined($rootScope.user)){
                // }
                // else{
                //     $scope.rooms = _rooms();
                //     $scope.no_suggestions = true;
                // }
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/browse_rooms.html'
    };
}]);

homeApp.directive('emailInvite', ["userService", "$timeout", function(userService, $timeout){
    return {
        restrict: 'E',
        scope: {},
        controller: ["$scope", function($scope){
            $scope.send_invitation_mail = function(){
                $scope.sending_mail = true;
                var _handle_todo_update = function(){
                    var todo = getCookie("todo");
                    if(todo){
                        todo = JSON.parse(todo);
                        if(!todo.home.invite){
                            deleteCookie("todo");
                            userService.update_todo_key('home/invite');
                        }
                    }
                }

                _handle_todo_update();

                userService.invite($scope.email).then(function(data){
                    $scope.sending_mail = false;
                    $scope.email = "";
                    // $scope.invitation_sent = true;
                });
            }
        }],
        templateUrl: '/assets/angular/html/shared/partials/invite_email.html'
    };
}]);

homeApp.directive('suggestCommunities', ["$rootScope", "userService", "$timeout", function($rootScope, userService, $timeout){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                $scope.info.loading = true;
                var room_timeout = $timeout(function(){
                    userService.suggest_communities().then(function(data){
                        $scope.info.loading = false;
                        $scope.suggest_communities = [];
                        $scope.show_suggestions = true;
                        angular.forEach(data, function(value, index){
                            value.span = {"col": 1, "row": 1};
                            this.push(value);
                        }, $scope.suggest_communities);
                    });
                }, 100);
                $scope.$on('destroy', function(){
                    $timeout.cancel(room_timeout);
                });
            }

            $scope.goto_room = function(id){
                window.location.href = "/room?p="+id;
            }

            $scope.toggle_suggestions = function(){
                $scope.show_suggestions = !$scope.show_suggestions;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/community_suggestions.html'
    };
}]);


homeApp.directive('suggestFriends', ["$rootScope", "userService", "$timeout", "sharedService", function($rootScope, userService, $timeout, sharedService){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                var friend_timeout = $timeout(function(){
                    userService.suggest_friends().then(function(data){
                        $scope.suggest_friends = data;
                        $scope.show_suggestions = true;
                    });
                }, 100);

                $scope.$on('destroy', function(){
                    $timeout.cancel(friend_timeout);
                });
            }

            $scope.remove_suggestion = function(friend){
                var index = $scope.suggest_friends.indexOf(friend);
                $scope.suggest_friends.splice(index, 1);
            }

            $scope.render_page = function($event){
                sharedService.render_page(event);
            }

            $scope.follow_user = function(id){
                userService.follow(id, true);
                angular.forEach($scope.suggest_friends, function(value, index){
                    if(value.id == id){
                        $scope.suggest_friends.splice(index, 1);
                    }
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/partials/friend_suggestions.html'
    };
}]);


homeApp.directive('trending', ["$rootScope", "userService", "$timeout", function($rootScope, userService, $timeout){
    return {
        restrict: 'E',
        controller: ["$scope", function($scope){
            var _init = function(){
                var room_timeout = $timeout(function(){
                    userService.suggest_communities().then(function(data){
                        $scope.suggest_communities = data;
                    });
                }, 100);

                $scope.$on('destroy', function(){
                    $timeout.cancel(room_timeout);
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/trending.html'
    };
}]);

homeApp.directive('bookEmbed', ["$rootScope", "google_public_key", function($rootScope, google_public_key){
    return{
        restrict: 'A',
        scope: {book: '=', info: '='},
        link: function($scope, $element, google_public_key){

            $scope.alert_not_found = function(){
                $scope.info.loading = false;
                $scope.info.book_not_found = true;
            }

            var load_book = function(){
                if($scope.book.isbn == null){
                    $scope.alert_not_found();
                }
                else{
                    var isbn = $scope.book.isbn.split(',');
                    var isbn_string = "ISBN:"
                    $scope.info.book_not_found = false;
                    var viewer = new google.books.DefaultViewer($element.find('div')[0]);
                    viewer.load(isbn_string.concat(isbn[1]), $scope.alert_not_found);
                    $scope.info.loading = false;
                }
            }


            var _init = (function () {
                $scope.info.loading = true;
                var id = ($rootScope.active_book.id) || ($rootScope.active_book.book_id);

                if(angular.isUndefined($scope.book)){
                    $scope.book = $rootScope.active_book;
                }
                $scope.book_loading = true;
                
                google.load("books", "0", {callback: load_book});
            }());
        }
    };
}]);

homeApp.directive('recommend', ["$rootScope", "userService", "sharedService", function($rootScope, userService, sharedService){
    return{
        restrict: 'E',
        scope: {user: '=', book: '='},
        controller: ['$scope', function($scope){
            $scope.recommend_friend = function(){

                var _handle_todo_update = function(){
                    var todo = getCookie("todo");
                    if(todo){
                        todo = JSON.parse(todo);
                        if(!todo.book.recommend){
                            deleteCookie("todo");
                            userService.update_todo_key('book/recommend');
                        }
                    }
                }

                _handle_todo_update();

                var friends_id = $scope.user.id;
                var book_id = $scope.book.id || $rootScope.active_book.id || $rootScope.active_book.book_id;
                $scope.recommending = true;
                userService.recommend(friends_id, book_id).then(function(){
                    $scope.recommending = false;
                    $scope.recommended = true;
                });
            }

            var _init = function(){
                $scope.recommending = false;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/recommend.html'
    }
}]);

homeApp.directive('basicBook', ["$rootScope", "bookService", "sharedService", function($rootScope, bookService, sharedService){
    return {
        restrict: 'E',
        scope : {book: '='},
        controller: ["$scope", function($scope){

            $scope.render_page = function(event){
                sharedService.render_page(event);
            }

            var _init = function(){
                bookService.get_primary_info($scope.book.id).then(function(data){
                    $scope.book = angular.extend($scope.book, data);
                });
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/basic_book.html'
    };
}]);

homeApp.directive('bookInfo', ["$rootScope", "bookService", 'sharedService', function($rootScope, bookService, sharedService){
    return {
        restrict: 'E',
        scope : {book: '=', info: '='},
        controller: ["$scope", function($scope){
            $scope.show_book_dialog = function(book, event){
                sharedService.show_book_dialog($rootScope, $scope, book, event);
            }

            var _init = function(){
                if(angular.isUndefined($scope.book.description)){
                    $scope.book_loading = true;
                    bookService.get_basic_book_details($scope.book.id).then(function(data){
                        $scope.book = angular.extend($scope.book, data);
                        $scope.book_loading = false;
                    });
                }
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/shared/partials/book_info.html'
    };
}]);

homeApp.directive('bookmark', ["$rootScope", 'feedService', '$timeout', '$mdSidenav', function($rootScope, feedService, $timeout, $mdSidenav){
    return {
        restrict: 'E',
        scope : {bookmarkId: '=', bookmarkType: '=', shelves: '=', custom: '=', count: '=', info: '='},
        controller: ["$scope", function($scope){

            var _unauthenticated_user = function(){
                return ((getCookie("logged") == "") || (getCookie("logged") == null));
            }

            $scope.show_shelves = function(event){
                if(_unauthenticated_user()){
                    $mdSidenav('signup').toggle();
                }
                else{
                    $scope.shelves_loading = true;
                    feedService.get_bookmarks($scope.bookmarkId, $scope.bookmarkType).then(function(data){
                        $rootScope.shelves = data;
                        $scope.shelves_loading = false;
                        $rootScope.bookmark_object = {"id": $scope.bookmarkId, "type": $scope.bookmarkType};
                        $mdSidenav('right_bookmark').toggle();
                    });
                }
                event.stopPropagation();
            }

        }],
        templateUrl: '/assets/angular/html/shared/bookmark.html'
    };
}]);


homeApp.directive('communityFeed', ["$rootScope", 'websiteService', '$timeout', '$mdDialog', '$sce', '$location', '$rootScope', 'sharedService', function($rootScope, websiteService, $timeout, $mdDialog, $sce, $location, $rootScope, sharedService){
    return {
        restrict: 'E',
        scope : {communityFeed: '='},
        controller: ["$scope", function($scope){
            $scope.toggle_expand = function(){
                $scope.communityFeed.expand = !$scope.communityFeed.expand;
            }

            $scope.render_page = function(event){
                sharedService.render_page(event);
            }

            $scope.remove_news = function(){
                var news_id = $scope.communityFeed.news_id;
                var regex = /[?&]([^=#]+)=([^&#]*)/g;
                var url_parsed = regex.exec($location.absUrl());
                if(url_parsed != null){
                    var id = url_parsed[2];
                    websiteService.remove_news(news_id, id);
                    window.location.reload();
                }
            }

            $scope.show_news = function(event){
                var url = $scope.communityFeed.news_url || $scope.communityFeed.url;
                url ="https://api.embed.ly/1/extract?key=0038e86d5e754f8d9a0c3823e338563d&url="+url+"&format=json";
                $scope.cirular_loading = true;
                if(angular.isUndefined($scope.communityFeed.data)){
                    websiteService.extract_embed(url).then(function(data){
                        $scope.cirular_loading = false;
                        $scope.communityFeed.data = data;
                    });
                }
                if(angular.isDefined($rootScope.containers)){
                    var container = {"url": "read_news", "data": $scope.communityFeed};
                    $rootScope.containers.push(container);
                    var container = angular.element(document.getElementById('browseScreen'));
                    var length = $rootScope.containers.length;
                    container.scrollLeft(length*600, 1000);
                }
                else{
                    $mdDialog.show({
                        templateUrl: '/assets/angular/html/news/iframe.html',
                        scope: $scope,
                        preserveScope: true,
                        clickOutsideToClose: true,
                        targetEvent: event
                    });
                }
                event.stopPropagation();
            }

            var _init = function(){
                if(angular.isDefined($rootScope.user)){
                    $scope.user = $rootScope.user;
                }
                $scope.communityFeed.expand = false;
            }

            _init();
        }],
        templateUrl: '/assets/angular/html/home/_community_feed.html'
    };
}]);


homeApp.directive('setFocus', ["$timeout", "$parse", "$rootScope", function($timeout, $parse, $rootScope){
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.setFocus);
            scope.$watch(model, function(value) {
                if(value == true) { 
                    $timeout(function() {
              	         if($rootScope.keyCode){
                	       element[0].value = String.fromCharCode($rootScope.keyCode);
              	         }
                        element[0].focus();
                        // $speechSynthetis.speak("You are at ReadersDoor. How can I help you?", 'en-UK');
                    });
                }
            });
        }
    };
}]);

homeApp.directive('rdSticky', ["$timeout", "$parse", "$rootScope", "$document", function($timeout, $parse, $rootScope, $document){
    return {
        link: function(scope, element, attrs) {
            var elem = element[0];
            var position = elem.scrollTop;
            $document.bind('scroll', function(){
                console.log(" new scrollTop ", elem.offsetTop);
                // if(elem.scrollTop <= position){
                //     scope.$apply(attrs.checkScrollUp);
                // }
                // position = elem.scrollTop;
            });
        }
    };
}]);

homeApp.directive('compile', ["$compile", function($compile){
	return ['scope', 'element', 'attrs', function(scope, element, attrs){
				var ensureCompileRunsOnce = scope.$watch(function(scope){
	            	// watch the 'compile' expression for changes
	            	return scope.$eval(attrs.compile);
	            },
	            function(value){
	              	// when the 'compile' expression changes
	              	// assign it into the current DOM
	              	element.html(value);

	              	// compile the new DOM and link it to the current
	              	// scope.
	              	// NOTE: we only compile .childNodes so that
	              	// we don't get into infinite loop compiling ourselves
	              	$compile(element.contents())(scope);
	                
	              	// Use Angular's un-watch feature to ensure compilation only happens once.
	              	ensureCompileRunsOnce();
	            });
			}]
}]);

homeApp.directive('checkScrollBottom', function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs){
            var elem = element[0];
            element.bind('scroll', function(){
            	var buffer = 1400;
                if((elem.scrollTop + elem.offsetHeight + buffer) > elem.scrollHeight){
                    scope.$apply(attrs.checkScrollBottom);
                }
            });
        }
    };
});

homeApp.directive('checkScrollUp', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var elem = element[0];
            var position = elem.scrollTop;
            element.bind('scroll', function(){
                if(elem.scrollTop <= position){
                	scope.$apply(attrs.checkScrollUp);
                }
                position = elem.scrollTop;
            });
        }
    };
});

homeApp.directive('checkScrollDown', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var elem = element[0];
            var position = elem.scrollTop;
            element.bind('scroll', function(){
                if(elem.scrollTop > position){
                	scope.$apply(attrs.checkScrollDown);
                }
                position = elem.scrollTop;
            });
        }
    };
});

homeApp.directive('focusOut',function(){
	return function postLink(scope, element, attrs) {
        element.bind('blur', function () {
            scope.$apply(attrs.focusOut);
        });
	};
});

homeApp.directive('calendar', ["$rootScope", function($rootScope){
  return{
    restrict: 'E',
    scope : {saveDate: '&'},
    controller: ["$scope", function($scope){
      $scope.date_check = function(){
        var month = $scope.months.indexOf($scope.selectedMonth) + 1;
        var no_days = new Date($scope.selectedYear, month, 0).getDate();
        $scope.days = new Array(no_days)
              .join()
              .split(',')
              .map(function(item, index){return ++index;});
      }

      $scope.save_date = function(selectedYear, selectedMonth, selectedDay){
        $rootScope.user.selectedDay = selectedDay;
        $rootScope.user.selectedMonth = selectedMonth;
        $rootScope.user.selectedYear = selectedYear;
        $scope.saveDate();
      }

      _init =function(){
        $scope.days = new Array(31)
              .join()
              .split(',')
              .map(function(item, index){return ++index;});
        $scope.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        $scope.years = [];
        if(angular.isDefined($rootScope.user)){
            $scope.selectedDay = $rootScope.user.selectedDay;
        }
        if(angular.isDefined($rootScope.user)){
            $scope.selectedMonth = $rootScope.user.selectedMonth;
        }
        if(angular.isDefined($rootScope.user)){
            $scope.selectedYear = $rootScope.user.selectedYear;
        }
        var currentYear = new Date().getFullYear();
        for(var i=currentYear; i>1904; i--){
          $scope.years.push(i);
        }
      }

      _init();
    }],
    templateUrl: '/assets/angular/html/shared/calendar.html'
  }
}]);

 //   homeApp.directive('rate', ["$rootScope", "$timeout", function($rootScope, $timeout){
//   	return{
//     	restrict: 'E',
//     	scope: {'rate_object': '=data'},
//     	controller: ["$scope", function($scope){
//       		$scope.show_if_rated = function(index){
//         		$scope.temp_rating = $scope.rate_object.user_rating;
//         		$scope.rate_object.user_rating = parseInt(index) + 1;
//         		$scope.ready_to_rate = true;
//       		}

//       		$scope.reset_rating = function(){
//         		$scope.ready_to_rate = false;
//         		$scope.rate_object.user_rating = $scope.temp_rating;
//       		}

//       		_add_notification = function(){
//         		var name = $rootScope.user.email;
//         		if(angular.isDefined($rootScope.user.name)){
//           			name = $rootScope.user.name;
//         		}

//         		var message = "<span>gave "+$scope.rate_object.user_rating+"/10 stars to&nbsp;</span><span class='site_color'>"+$scope.rate_object.title+"</span>";
//         		var notification = {
//           			"thumb":$rootScope.user.thumb,
//           			"message":message,
//           			"timestamp":new Date().getTime(),
//           			"book":{
//             			"id":$scope.rate_object.id,
//             			"title":$scope.rate_object.title,
//             			"author_name":$scope.rate_object.author_name,
//             			"isbn":$scope.rate_object.isbn
//           			},
//           			"user":{
//             		"id":$rootScope.user.id,
//             		"name":name
//           		}
//         	}
//         	$scope.$emit('addToNotifications', notification);
//       	}

//       	_gamify = function(){
//         	if(!$scope.rate_object.rated){
//           		$scope.$emit('gamifyCount', 10, true);
//         	}
//       	}

//       	$scope.mark_as_rated = function(index, event){
//         	_gamify();
//         	$scope.rate_object.rated = true;
//         	$scope.rate_object.user_rating = parseInt(index) + 1;
//         	$scope.temp_rating = parseInt(index) + 1;
//         	var timeout_event = notify($rootScope, "SUCCESS-Thanks, This will help us to recommend you better books.", $timeout);

//         	$scope.$on('destroy', function(){
//           		$timeout.cancel(timeout_event);
//         	});
//         	var params = {"id":$scope.rate_object.id, "data":$scope.rate_object.user_rating};

//         	//ONLY FOR BOOKS
//         	if(angular.isUndefined($scope.rate_object.status) || !$scope.rate_object.status){
//           		sharedService.mark_as_read($scope, $scope.rate_object, event);
//         	}
//         	widgetService.rate_this_book(params);
//         	_add_notification();
//         	event.stopPropagation();
//       	}

//       	$scope.is_active = function(index){
//         	var is_active = false;
//         	if($scope.rate_object){
//           	var rating = parseInt(index) + 1;
//           	if(rating <= $scope.rate_object.user_rating){
//             	is_active = true;
//           	}
//         }
//         return is_active;
//      }

//     }],
//     templateUrl: '/assets/angular/views/shared/rate.html'
//   	}
// }]);
