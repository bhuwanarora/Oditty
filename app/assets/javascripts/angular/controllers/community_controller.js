homeApp.controller('communityController', ["$scope", "$mdSidenav", 'communityService', '$location', '$rootScope', '$mdDialog', 'ColorConstants', function($scope, $mdSidenav, communityService, $location, $rootScope, $mdDialog, ColorConstants){
    $scope.toggle_details = function(){
        $mdSidenav('right').toggle();
        $scope.show_details = true;
        communityService.get_detailed_community_info($scope.active_tag.id).then(function(data){
            $scope.active_tag = angular.extend($scope.active_tag, data);
        });
    };

    $scope.show_book_dialog = function(book, event){
        $rootScope.active_book = book;
        $rootScope.active_book.show_info_only = true;
        $mdDialog.show({
            templateUrl: '/assets/angular/html/community/book.html',
            targetEvent: event,
        });
        event.stopPropagation();
    }

    $scope.refresh_data = function(active_item){
        $scope.active_tag = active_item;
        communityService.get_community_details($scope.active_tag.id).then(function(data){
            $scope.active_tag = data[0].most_important_tag[0];
            angular.forEach($scope.active_tag.books, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var color = ColorConstants.value[random_int];
                value.color = color;
            });
        });
    }

    var _init = (function(){
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var url_parsed = regex.exec($location.absUrl());
        if(url_parsed != null){
            var id = url_parsed[2];
        }

        if(angular.isDefined(id)){
            var news_id = id;
        }
        else{
            var news_id = $rootScope.active_community.news_id;
        }

        $scope.show_details = false;

        $scope.newsTags = [];
        $scope.info.active_tag = $scope.active_tag;

        communityService.get_news_info(news_id).then(function(data){
            data = {"most_important_tag":[{"image_url":null,"name":"Television","view_count":null,"users":[{"first_name":null,"selectedMonth":null,"id":null,"last_name":null,"init_book_read_count":null,"about":null,"selectedYear":null,"selectedDay":null}],"id":2586424,"books":[{"popularity":25,"published_year":"January 1st 1976","pages_count":null,"author_name":"@Horace Newcomb","id":765792,"isbn":"0195301161,9780195301168","title":"Television: The Critical View"},{"popularity":36865,"published_year":"1997","pages_count":null,"author_name":"@Jean-Philippe Toussaint","id":723321,"isbn":"1564783723,9781564783721","title":"Television"},{"popularity":0,"published_year":null,"pages_count":null,"author_name":"@Margaret Haerens","id":1595239,"isbn":null,"title":"Television"},{"popularity":26310,"published_year":"1996","pages_count":null,"author_name":"@Pierre Bourdieu","id":668967,"isbn":null,"title":"On Television"},{"popularity":0,"published_year":null,"pages_count":null,"author_name":"@Michele Hilmes","id":765809,"isbn":"0851709885,9780851709888","title":"The Television History Book"}]}],"other_tags":[{"view_count":null,"name":"Broadcasting","id":2586425,"image_url":null},{"view_count":null,"name":"Television in the United States","id":2586423,"image_url":null}]};
            $scope.active_tag = data.most_important_tag[0];
            var most_important_tag = {"name": $scope.active_tag.name, 
                                "view_count": $scope.active_tag.view_count, 
                                "id": $scope.active_tag.id, 
                                "image_url": $scope.active_tag.image_url};
            $scope.newsTags.push(most_important_tag);
            $scope.newsTags = $scope.newsTags.concat(data.other_tags);
            angular.forEach($scope.newsTags, function(value){
                value.view_count = 100;
            });
            angular.forEach($scope.active_tag.books, function(value){
                var random_int = Math.floor(Math.random()*ColorConstants.value.length);
                var color = ColorConstants.value[random_int];
                value.color = color;
            });
        });

        communityService.get_chronological_news(news_id).then(function(data){
            data = [{"id":2586419,"url":"http://www.telegraph.co.uk/news/worldnews/europe/italy/11525096/Four-killed-including-judge-as-man-opens-fire-at-Milan-courthouse.html","image_url":null,"title":null,"description":null,"created_at":1428586558,"community_info":{"view_count":null,"name":"Milan","id":2586421,"image_url":null}},{"id":2586431,"url":"http://www.wsj.com/articles/tsipras-tells-russia-greece-helped-prevent-broader-eu-sanctions-1428577645","image_url":null,"title":null,"description":null,"created_at":1428586604,"community_info":{"view_count":null,"name":"World Wide Web","id":2586405,"image_url":null}},{"id":2586422,"url":"http://www.foxnews.com/world/2015/04/09/french-tv-network-hacked-by-group-claiming-ties-to-isis/","image_url":null,"title":null,"description":null,"created_at":1428586570,"community_info":{"view_count":null,"name":"Television","id":2586424,"image_url":null}},{"id":2586436,"url":"http://www.abc.net.au/7.30/content/2015/s4213668.htm","image_url":null,"title":null,"description":null,"created_at":1428586617,"community_info":{"view_count":null,"name":"Chloe","id":2586438,"image_url":null}},{"id":2586427,"url":"http://www.theguardian.com/us-news/2015/apr/09/south-carolina-shooting-passenger-walter-scotts-car-during-traffic-stop","image_url":null,"title":null,"description":null,"created_at":1428586589,"community_info":{"view_count":null,"name":"Charleston–North Charleston–Summerville metropolitan area","id":2586430,"image_url":null}}];
            $scope.news = data;
        });
    }());

}]);