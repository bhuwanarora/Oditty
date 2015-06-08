homeApp.controller('shareController', ["$scope", "$rootScope", "$timeout", 'ShareOptions', '$routeParams', '$mdBottomSheet', 'statusService', 'WebsiteUIConstants', 'bookService', 'ColorConstants', 'sharedService', 'Emotions', function($scope, $rootScope, $timeout, ShareOptions, $routeParams, $mdBottomSheet, statusService, WebsiteUIConstants, bookService, ColorConstants, sharedService, Emotions){

    $scope.play_type_key = function(event){
        if($scope.info.show_share){
            document.getElementById('audiotag1').play();
            // if(angular.isUndefined($scope.current_track) || $scope.current_track == 0){
            //     $scope.current_track = 1;
            // }
            // else if($scope.current_track == 1){
            //     $scope.current_track = 2;
            //     document.getElementById('audiotag2').play();
            // }
            // else{
            //     $scope.current_track = 0;
            //     document.getElementById('audiotag3').play();
            // }
            event.stopPropagation();
        }
    }

    
    $scope.set_pages = function(current_page, page_count){
        $scope.info.page_count = page_count;
        $scope.info.current_page = current_page;
        $scope.hide_page_count = true;
    }

    $scope.show_page_count = function(){
        $scope.hide_page_count = false;      
    }

    $scope.toggle_buy = function(){
        $scope.hide_buy = !$scope.hide_buy;
    }

    $scope.toggle_borrow = function(){
        $scope.hide_borrow = !$scope.hide_borrow;
    }

    $scope.deselect_book = function(){
        delete $scope.info.page_count;
        delete $scope.info.current_page;
        delete $scope.active_book;
        delete $rootScope.active_book
        $scope.deselect_emotion();
        delete $scope.related_info;
        delete $scope.info.status_books;
        $scope.show_relevant_books();
    }

    $scope.show_interesting_details = function(book){
        $scope.active_book = book;
        $scope.info.book = book;
        $rootScope.active_book = book;
        $scope.info.status_books = [book];
        $scope.info.share_loading = true;


        var _get_interesting_details = function(){
            var id = book.book_id || book.id;
            bookService.get_interesting_info(id).then(function(data){
                $scope.related_info = [];
                if(angular.isDefined(data[0])){
                    angular.forEach(data[0].info, function(value){
                        var label = value.labels[0];
                        var info = value.info.data;
                        var id = value.id;

                        if(label == "Author"){
                            delete info.indexed_main_author_name;
                            delete info.gr_url;
                            delete info.search_index;
                            var json = {"id": id, "label": "Author"};
                            info = angular.extend(info, json);
                        }
                        else if(label == "Year"){
                            var json = {"label": "Year"};
                            info = angular.extend(info, json);
                        }
                        else{
                        }
                        this.push(info);
                        $scope.info.share_loading = false;
                    }, $scope.related_info);
                }
            });
        }
        var interesting_details_timeout = $timeout(_get_interesting_details(), 100);
        $scope.$on('destroy', function(){
            $timeout.cancel(interesting_details_timeout);
        });
    }

    $scope.show_share_options = function(event){
        $mdBottomSheet.show({
            templateUrl: 'assets/angular/html/share/_share_options.html',
            controller: 'optionsController',
            scope: $scope,
            preserveScope: true,
            targetEvent: event
        }).then(function(value){
            // debugger
        });
    };

    $scope.back = function($event){
        $scope.info.show_share = false;
        $scope.info.show_book_share = false;
        delete $rootScope.active_shelf;
        event.stopPropagation();
    }

    $scope.handle_backspace = function(event){
        var key = $scope._detect_key(event)
        if(key.backspace_or_delete){
            $scope.init_reading_options();
        }
    }

    $scope.search_status_books = function(q){
        $scope.info.status_books = [];
        $scope.search_books(q, $scope.info.status_books);
    }

    $scope.search_books = function(q, books){
        if(angular.isUndefined(books)){
            $scope.searched_books = [];
            books = $scope.searched_books;
        }
        $scope.info.share_loading = true;
        bookService.search_books(q, 10).then(function(data){
            $scope.info.share_loading = false;
            $scope.did_you_mean = true;
            angular.forEach(data, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                if(angular.isUndefined(value.fuzzy)){
                    value = angular.extend(value, {"color": ColorConstants.value[random_int]});
                    this.push(value);
                }
            }, books);
        });
    }

    $scope.add_book = function(book){
        if($rootScope.active_shelf){
            var bookmark_object = {"id": (book.id || book.book_id), "type": 'Book'};
            sharedService.toggle_bookmark($rootScope.active_shelf, false, bookmark_object);
            delete $rootScope.active_shelf;
            $scope.info.show_share = false;
        }
        else{
            $scope.info.book = book;
        }
    }

    $scope.post_status = function(){
        $scope.posting = true;
        $scope.info.share_loading = true;
        var status = {};

        if($scope.reading_status_selected && $scope.active_book){
            if(!$scope.active_emotion){
                $scope.info.status = $scope.reading_options[$scope.active_id].status;
                $scope.info.wrapper_status = "<span><span class='custom_title light_title'><span>"+$scope.reading_options[$scope.active_id].status+"</span></span>"
            }
            else{
                $scope.info.status = "Feeling "+ $scope.active_emotion.name + $scope.reading_options[$scope.active_id].emotion_status;
                $scope.info.wrapper_status = "<span class='custom_title light_title'><span>Feeling "+$scope.active_emotion.name+"  </span><span>"+$scope.reading_options[$scope.active_id].emotion_status+"</span></span>";
            }
            $scope.info.status = $scope.info.status + " " + $scope.active_book.title + " by " + $scope.active_book.author_name;
            $scope.info.wrapper_status = $scope.info.wrapper_status + "<span class='big_title bold_light_title'>"+$scope.active_book.title+" </span><span class='less_important'>by "+$scope.active_book.author_name+"</span>";
            if($scope.info.current_page){
                $scope.info.status = $scope.info.status + " on page " + $scope.info.current_page;
                $scope.info.wrapper_status = $scope.info.wrapper_status + "<span> on page <b>"+$scope.info.current_page+"</b></span>";
            }
            if($scope.info.page_count){
                $scope.info.status = $scope.info.status + "/"+ $scope.info.page_count;
                $scope.info.wrapper_status = $scope.info.wrapper_status + "<span><b>/{{info.page_count}}</b>.</span>";
            }
        }

        if(angular.isDefined($scope.info.feelings) && ($scope.info.feelings.length > 0)){
            status = angular.extend(status, {"feelings": $scope.info.feelings});
        }
        if(angular.isDefined($scope.info.reading_status_value)){
            status = angular.extend(status, {"reading_status_value": $scope.info.reading_status_value});
        }
        if(angular.isDefined($scope.info.book)){
            status = angular.extend(status, {"book_id": ($scope.info.book.id || $scope.info.book.book_id)});
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
            status = angular.extend(status, {"book_exchange_status": $scope.info.book_exchange_status});
        }
        if(angular.isDefined($scope.info.page_count)){
            status = angular.extend(status, {"total_page_count": $scope.info.page_count});
        }
        if(angular.isDefined($scope.info.current_page)){
            status = angular.extend(status, {"current_page": $scope.info.current_page});
        }

        if(Object.keys(status).length != 0){
            statusService.post_status(status).then(function(){
                $scope.posting = false;
                $scope.info.share_loading = false;
                // $scope.post_again = true;
            });
            $scope.info.status = "";
            $scope.info.wrapper_status = "";
            $scope.type_icon_pressed = {"margin-right": "60vw"};
            $timeout(function(){
                $scope.type_icon_pressed = {"margin-right": "0px"};
            }, 100);
        }
    }

    $scope.show_share_page = function(event){
        if(!$scope.info.show_share){
            $scope.info.show_share = true;
        }
        else{
            $scope.post_status();
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

    $scope.make_active = function(id){
        delete $rootScope.active_book;
        $scope.active_id = id;
        $scope.info.reading_status_value = id;
        $scope.show_relevant_books();
    }

    $scope.init_reading_options = function(){
        if(angular.isUndefined($scope.reading_options) || ($scope.reading_options.length != 3)){
            $scope.reading_options = [
                {"name": "Which Book do you plan to Read?", "id": 0, "status": "Planning to Read", "emotion_status": "while planning to read"}, 
                {"name": "What are you Currently Reading?", "id": 1, "status": "Currently Reading", "emotion_status": "while reading"}, 
                {"name": "Which Book did you Recently Read?", "id": 2, "status": "Recently Read", "emotion_status": "after reading"}
            ];
        }
        $scope.reading_status_selected = false;
        $scope.active_id = 0;
        $scope.info.status_books = [];
        $scope.related_info = [];
        delete $scope.active_book;
        delete $rootScope.active_book
        $scope.deselect_emotion();
    }

    $scope.show_relevant_books = function(){
        $scope.reading_status_selected = true;
        if(angular.isUndefined($scope.active_book)){
            $scope.info.status_books = [];
            $scope.info.share_loading = true;
            var top_searches = [{"title":"The Giver","description":"Jonas' world is perfect. Everything is under control. There is no war or fear or pain. There are no choices. Every person is assigned a role in the Community. When Jonas turns twelve, he is singled out to receive special training from The Giver. The Giver alone holds the memories of the true pain and pleasure of life. Now, it is time for Jonas to receive the truth. There is no turning back.","isbn":"0385732554,9780385732550","author_name":"Lois Lowry","author_id":390175,"degree":369,"base_rating":4.11,"base_ratings_count":746618,"base_reviews_count":30671,"labels":"Book","id":2364530},{"title":"The Awakening","description":"This story of a woman's struggle with oppressive social structures received much public contempt at its first release; put aside because of initial controversy, the novel gained popularity in the 1960s, some six decades after its first publication, and has since remained a favorite of many readers. Chopin's depiction of a married woman, bound to her family and with no way to assert a fulfilling life of her own, has become a foundation for feminism and a classic account of gender crises in the late Victorian era.","isbn":"0543898083,9780543898081","author_name":"Kate Chopin","author_id":389970,"degree":363,"base_rating":3.6,"base_ratings_count":2368,"base_reviews_count":108,"labels":"Book","id":389969},{"title":"Harry Potter and the Half-Blood Prince","description":"The war against Voldemort is not going well; even the Muggle governments are noticing. Ron scans the obituary pages of the Daily Prophet, looking for familiar names. Dumbledore is absent from Hogwarts for long stretches of time, and the Order of the Phoenix has already suffered losses. And yet, as with all wars, life goes on. Sixth-year students learn to Apparateâand lose a few eyebrows in the process. Teenagers flirt and fight and fall in love. Classes are never straightforward, though Harry receives some extraordinary help from the mysterious Half-Blood Prince.So it's the home front that takes center stage in the multilayered sixth installment of the story of Harry Potter. Here at Hogwarts, Harry will search for the full and complex story of the boy who became Lord Voldemortâand thereby find what may be his only vulnerability.","isbn":"0439785960,9780439785969","author_name":"J. K. Rowling","author_id":390054,"degree":359,"base_rating":4.47,"base_ratings_count":1088335,"base_reviews_count":15638,"labels":"Book","id":395599},{"title":"Eclipse","description":"In the dead silence, all the details suddenly fell into place for me with a burst of intuition.Something Edward didn't want me to know. Something Jacob wouldn't have kept from me...It was never going to end, was it?As Seattle is ravaged by a string of mysterious killings and a malicious vampire continues her quest for revenge, Bella once again finds herself surrounded by danger. In the midst of it all, she is forced to choose between her love for Edward and her friendship with Jacob - knowing that her decision has the potential to ignite the ageless struggle between vampire and werewolf. With her graduation quickly approaching, Bella has one more decision to make: life or death. But which is which?","isbn":"0316160202,9780316160209","author_name":"Stephenie Meyer","author_id":395656,"degree":358,"base_rating":3.73,"base_ratings_count":1054,"base_reviews_count":161,"labels":"Book","id":395892}];
            // bookService.get_top_searches().then(function(data){
            //     $scope.info.share_loading = false;
            //     $scope.info.status_books = data;
            // });
            $scope.info.share_loading = false;
            $scope.info.status_books = top_searches;
        }
    }

    $scope.toggle_options = function(){
        $scope.show_options = !$scope.show_options;
    }

    $scope.set_emotion = function(emotion){
        $scope.active_emotion = emotion;
        if(angular.isUndefined($scope.info.feelings)){
            $scope.info.feelings = [];
        }
        $scope.info.feelings.push(emotion.name);
    }

    $scope.deselect_emotion = function(){
        delete $scope.active_emotion;
    }

    var _init = (function(){
        $scope.info.status = "";
        $scope.info.hash_tags = [];
        $scope.info.wrapper_status = "";
        $scope.init_reading_options();
        $scope.emotions = Emotions;
    }());
}]);