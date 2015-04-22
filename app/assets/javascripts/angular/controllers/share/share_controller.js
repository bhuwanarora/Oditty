homeApp.controller('shareController', ["$scope", "$rootScope", "$timeout", 'ShareOptions', '$routeParams', '$mdBottomSheet', 'statusService', 'WebsiteUIConstants', 'bookService', 'ColorConstants', function($scope, $rootScope, $timeout, ShareOptions, $routeParams, $mdBottomSheet, statusService, WebsiteUIConstants, bookService, ColorConstants){

    $scope.show_share_options = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/share/_share_options.html',
            controller: 'optionsController',
            scope: $scope,
            preserveScope: true,
            targetEvent: event
        }).then(function(value){
            debugger
        });
    };

    $scope.back = function($event){
        $scope.info.show_share = false;
        $scope.info.show_book_share = false;
        event.stopPropagation();
    }

    $scope.search_books = function(q){
        $scope.info.loading = true;
        $scope.searched_books = [];
        bookService.search_books(q, 10).then(function(data){
            $scope.info.loading = false;
            $scope.did_you_mean = true;
            angular.forEach(data, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                if(angular.isUndefined(value.fuzzy)){
                    value = angular.extend(value, {"color": ColorConstants.value[random_int]});
                    this.push(value);
                }
            }, $scope.searched_books);
        });
    }

    $scope.add_book = function(book){
        $scope.info.book = book;
    }

    $scope.show_share_page = function(event) {
        if(!$scope.info.show_share){
            $scope.info.show_share = true;
        }
        else{
            var status = {};
            if(angular.isDefined($scope.info.feelings) && ($scope.info.feelings.length > 0)){
                status = angular.extend(status, {"feelings": $scope.info.feelings});
            }
            if(angular.isDefined($scope.info.reading_status_value)){
                status = angular.extend(status, {"reading_status_value": $scope.info.reading_status_value});
            }
            if(angular.isDefined($scope.info.book)){
                status = angular.extend(status, {"book_id": $scope.info.book.id});
            }
            if(angular.isDefined($scope.info.mentioned_users_ids) && ($scope.info.mentioned_users_ids.length > 0)){
                status = angular.extend(status, {"mentioned_users_ids": $scope.info.mentioned_users_ids});
            }
            if(angular.isDefined($scope.info.mentioned_authors_ids) && ($scope.info.mentioned_authors_ids.length > 0)){
                status = angular.extend(status, {"mentioned_authors_ids": $scope.info.mentioned_authors_ids});
            }
            if(angular.isDefined($scope.info.hash_tags) && ($scope.info.hash_tags.length > 0)){
                status = angular.extend(status, {"hash_tags": $scope.info.hash_tags});
            }
            if(angular.isDefined($scope.info.status) && ($scope.info.status.length > 0)){
                status = angular.extend(status, {"content": $scope.info.status});
            }
            if(angular.isDefined($scope.info.wrapper_status) && ($scope.info.wrapper_status.length > 0)){
                status = angular.extend(status, {"wrapper_content": $scope.info.wrapper_status});
            }
            if(angular.isDefined($scope.info.book_exchange_status)){
                status = angular.extend(status, {"book_exchange_status": $scope.info.book_exchange_status})
            }

            statusService.post_status(status);
            $scope.info.status = "";
            $scope.info.wrapper_status = "";
            $scope.type_icon_pressed = {"margin-right": "60vw"};
            $timeout(function(){
                $scope.type_icon_pressed = {"margin-right": "0px"};
            }, 100);
        }
    };

    $scope.handle_text_input = function(event){
        var key = {};
        var _init = (function(){
            key = $scope._detect_key(event);
            if($scope.info.status.trim() == ""){
                $scope.is_new_word_initiation = true;
            }
            var text_state = {
                "string_array": $scope.info.status.split(" "),
                "current_character": String.fromCharCode(event.keyCode),
                "split_string_length": $scope.info.status.split(" ").length,
                "old_string": $scope.info.status.split(" ").slice(0, ($scope.info.status.split(" ").length)-1).join(" "),
                "current_element": $scope.info.status.split(" ").pop(),
                "is_new_word_initiation": $scope.is_new_word_initiation,
                "under_a_tag": $scope.hash_tagging,
                "html_array": $scope.info.wrapper_status.split(" "),
                "old_html": $scope.info.wrapper_status.split(" ").slice(0, ($scope.info.status.split(" ").length)-1).join(" "),
                "current_html": $scope.info.wrapper_status.split(" ").pop(),
                "hash_tagging": $scope.hash_tagging
            }

            return{
                backspace: function(){
                    $scope.show_interaction_links = true;
                    if(text_state.split_string_length != 1){
                        old_string = text_state.old_string + " ";
                        old_html = text_state.old_html + " ";
                    }

                    if(text_state.current_element == "#"){
                        $scope.hash_tagging = false;
                        // delete $scope.info.hash_tags;
                        $scope.info.wrapper_status = text_state.old_html; 
                    }
                    else{
                        var hash_tagging_breaking_in_betwen = text_state.old_html.split("<a>").length != text_state.old_html.split("</a>").length;
                        var inside_a_hashtag = text_state.current_html[text_state.current_html.length - 1] == ">";
                        var has_next_line_character = text_state.current_html.indexOf("<br/>") >= 0;

                        var _handle_next_line_character = function(){
                            text_state.html_array = text_state.old_html.split("<br/>");
                            text_state.split_string_length = text_state.html_array.length;
                            text_state.old_html = text_state.html_array.slice(0, text_state.split_string_length-1).join("<br/>");
                            old_string = text_state.old_html.replace(/<br\/>/, "");
                        }

                        var _handle_hash_tagging_breaking_in_between = function(){
                            text_state.html_array = text_state.old_html.split("<a>");
                            text_state.split_string_length = text_state.html_array.length;
                            text_state.old_html = text_state.html_array.slice(0, text_state.split_string_length-1).join("<a>");
                            old_string = text_state.old_html.replace(/<a>/, "").replace(/<\/a>/, "");
                        }

                        var _handle_hash_tags = function(){
                            $scope.info.wrapper_status = text_state.old_html;
                            $scope.info.status = text_state.old_string;
                            $scope.is_new_word_initiation = true;
                            $scope.hash_tagging = false;
                            // delete $scope.info.hash_tags;
                            event.preventDefault();
                        }

                        // console.debug("handle_backspace ", hash_tagging_breaking_in_betwen, inside_a_hashtag, has_next_line_character);

                        if(has_next_line_character){
                            _handle_next_line_character();
                        }

                        if(hash_tagging_breaking_in_betwen){
                            _handle_hash_tagging_breaking_in_between();
                        }

                        if(text_state.hash_tagging || inside_a_hashtag){
                            _handle_hash_tags();
                        }
                        else{
                            var html = $scope.info.wrapper_status;
                            $scope.info.wrapper_status = html.substring(0, html.length-1); 
                        }

                        if(!$scope.info.status || $scope.info.status == ""){
                            $scope.info.wrapper_status = "";
                        }
                    }
                    event.stopPropagation();
                },
                enter: function(){
                    if($scope.info.hash_tags){
                        event.preventDefault();
                        $scope.handle_selection($scope.currentItem);
                    }
                    else{
                        $scope.hash_tagging = false;
                        $scope.is_new_word_initiation = true;
                        $scope.info.wrapper_status = $scope.info.wrapper_status+"<br/>";
                    }
                },
                left: function(){

                },
                right: function(){
                    
                },
                special_character: function(){
                    var special_character = {
                        "hash": (String.fromCharCode(event.keyCode) == 3),
                        "plus": (String.fromCharCode(event.keyCode) == '='),
                        "at_the_rate": (String.fromCharCode(event.keyCode) == 2)
                    }
                    // console.debug(special_character, String.fromCharCode(event.keyCode), event.keyCode);
                    if(text_state.is_new_word_initiation && special_character.hash){
                        var html = "<a>#</a>";
                        $scope.hash_tagging = true;
                        $scope.info.wrapper_status = $scope.info.wrapper_status + html;
                    }
                    // else if(text_state.is_new_word_initiation && special_character.plus){
                    //     var html = "<a>+</a>";
                    //     $scope.hash_tagging = true;
                    //     $scope.info.wrapper_status = $scope.info.wrapper_status + html;
                    //     $scope.search_for = "TAGS";
                    // }
                    // else if(text_state.is_new_word_initiation && special_character.at_the_rate){
                    //     var html = "<a>@</a>";
                    //     $scope.hash_tagging = true;
                    //     $scope.info.wrapper_status = $scope.info.wrapper_status + html;
                    //     $scope.search_for = "[AUTHORS, READERS]";
                    // }
                },
                alphabet: function(){
                    if(text_state.current_character == " "){
                        if(text_state.hash_tagging){
                            text_state.current_element = text_state.current_element.slice(1);
                            $scope.info.hash_tags.push(text_state.current_element);
                        }
                        $scope.hash_tagging = false;
                        $scope.info.wrapper_status = $scope.info.wrapper_status + text_state.current_character;
                        delete $scope.search_for;
                    }
                    else{
                        if($scope.hash_tagging){
                            var hash_tagged = $scope.info.wrapper_status.split("</a>");
                            var length = hash_tagged.length;
                            if(length > 2){
                                var last = hash_tagged[length - 2]+text_state.current_character+"</a>"+hash_tagged[length - 1];
                                $scope.info.wrapper_status = hash_tagged.slice(0, length - 2).join("</a>")+"</a>"+last;
                            }
                            else{
                                var last = hash_tagged[length - 2]+text_state.current_character+"</a>"+hash_tagged[length - 1];
                                $scope.info.wrapper_status = last;
                            }
                        }
                        else{
                            console.debug($scope.info.wrapper_status, text_state.current_character);
                            $scope.info.wrapper_status = $scope.info.wrapper_status+text_state.current_character;
                        }
                    }
                    if($scope.search_for){
                        // if(current_element.length > 2){
                        //     string_to_be_searched = current_element.slice(1, current_element.length)+""+text_state.current_character;
                        //     websiteService.search(string_to_be_searched.trim(), $scope.search_for, 3).then(function(result) {
                        //         $scope.info.hash_tags = [];
                        //         var data = result.results.data;
                        //         for(var i=0; i < data.length; i++){
                        //             var json = {"name": data[i][0]};
                        //             $scope.info.hash_tags.push(json);
                        //         }
                        //     });
                        // }
                    }

                    if(text_state.current_character == " "){
                        $scope.is_new_word_initiation = true;
                    }
                    else{
                        $scope.is_new_word_initiation = false; 
                    }   
                }
            }
        }());

        if(key.enter){
            _init.enter();
        }
        else if(key.backspace_or_delete){
            _init.backspace();
        }
        else if(key.left){
        }
        else if(key.right){

        }
        else if(key.up){

        }
        else if(key.down){

        }
        else if(key.shift){
            _init.special_character();
        }
        else if(key.command){

        }
        else{
            _init.alphabet();
        }

        event.stopPropagation();
    }

    $scope._detect_key = function(event){
        var backspace_or_delete = (event.keyCode == WebsiteUIConstants.Backspace) || (event.keyCode == WebsiteUIConstants.Delete);
        var keyUp = event.keyCode == WebsiteUIConstants.KeyUp;
        var keyDown = event.keyCode == WebsiteUIConstants.KeyDown;
        var keyLeft = event.keyCode == WebsiteUIConstants.KeyLeft;
        var keyRight = event.keyCode == WebsiteUIConstants.KeyRight;
        var enter = event.keyCode == WebsiteUIConstants.Enter;
        var shift = (event.keyCode == WebsiteUIConstants.LeftShift) || (event.keyCode == WebsiteUIConstants.RightShift);
        var command = (event.keyCode == WebsiteUIConstants.LeftCommand) || (event.keyCode == WebsiteUIConstants.RightCommand);
        return {"backspace_or_delete": backspace_or_delete, "up": keyUp, "down": keyDown, "left": keyLeft, "right": keyRight, "enter": enter, "shift": shift, "command": command};
    }

    $scope.handle_selection = function(selected_item){
        $scope.current = 0;
        var string_array = $scope.info.status.split(" ");
        var html_array = $scope.info.wrapper_status.split(" ");
        var current_character = String.fromCharCode(event.keyCode);
        var split_string_length = string_array.length;
        if(split_string_length == 1){
          var old_string = string_array.slice(0, split_string_length-1).join(" ").trim();
          var old_html = html_array.slice(0, split_string_length-1).join(" ").trim();
        }
        else{
          var old_string = string_array.slice(0, split_string_length-1).join(" ")+" ";
          var old_html = html_array.slice(0, split_string_length-1).join(" ")+" ";
        }
        var current_element = string_array.pop();
        var current_html = html_array.pop();
        // var is_backspace = event.keyCode == WebsiteUIConstants.Enter;
        var hash_tagging = $scope.hash_tagging;
        $scope.info.wrapper_status = old_html+"<a>"+selected_item+"</a>";
        $scope.info.status = old_string+selected_item;
        // delete $scope.info.hash_tags;
        event.stopPropagation();
        //TODO: SET FOCUS ON CLICK
    }

    $scope.share_post = function(){
        var message = $scope.info.wrapper_status
                                .replace(/<a>/, "<a>")
                                .replace(/<\/a>/, "<\/a>");
        var tweet = {"message": message,
                     "user": {
                        "name": $rootScope.user.name,
                        "thumb": $rootScope.user.thumb
                     }};
        tweet = _add_labels_to_tweet(tweet);
        var book = $scope.selected_interact_book;
        tweet = _add_comment(tweet, book);
        if(angular.isDefined($rootScope.focused_book)){
            if($rootScope.focused_book.tweets.length == 0){
                $rootScope.focused_book.tweets = $rootScope.focused_book.tweets.concat([tweet]);
            }
            else{
                $rootScope.focused_book.tweets.push(tweet);
            }
        }
    }

    var _init = (function(){
        $scope.info.status = "";
        $scope.info.hash_tags = [];
        $scope.info.wrapper_status = "";
    }());
}]);