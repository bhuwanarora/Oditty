homeApp.controller('homeController', ["$scope", "$rootScope", "$timeout", "$mdSidenav", "$log", '$q', '$mdBottomSheet', '$mdDialog', 'scroller', '$document', 'feedService', '$mdToast', 'userService', function($scope, $rootScope, $timeout, $mdSidenav, $log, $q, $mdBottomSheet, $mdDialog, scroller, $document, feedService, $mdToast, userService){

	$scope.goto_community_page = function(id){
		userService.news_visited(id);
		window.location.href = "/community?q="+id;
	}

    var _init = (function(){
        userService.get_feed().then(function(data){
            // $scope.feed = data.posts;
            // angular.forEach($scope.feed, function(value){
            //     value.image_url = value.attachments[parseInt(Object.keys(value.attachments)[0])].URL;
            // });
        	$scope.feed = data;
        });
    // 	var json = {
    // 		"communities": [
	   //  		{
				// 	"view_count": 10,
				// 	"name": "Television in Australia",
				// 	"id": 2586375,
				// 	"image_url": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR3GiVC6v1vlQ84mlFqE-oqwzt_gW7RAo4XFAh2BFSZglMOhHYl"
				// },
				// {
				// 	"view_count": 11,
				// 	"name": "Sky News",
				// 	"id": 2586392,
				// 	"image_url": "http://upload.wikimedia.org/wikipedia/en/f/fe/Sky_News_Weather_Channel_Logo.jpg"
				// },
				// {
				// 	"view_count": 11,
				// 	"name": "Sky News Test",
				// 	"id": 2586392,
				// 	"image_url": "https://pbs.twimg.com/profile_images/502491052243038208/gKEvCXwg.png"
				// }
    // 		],
    // 		"description": "A mother has been released by police in Melbourne but the investigation into the deaths of three of her children after she drove into a lake is ongoing.",
    // 		"title": "Mum questioned, released over lake crash deaths",
    // 		"id": 2586408,
    // 		"image_url": "http://www.sbs.com.au/news/sites/sbs.com.au.news/files/lake_car_aap_0.jpg"
    // 	};
    // 	$scope.feed = [json];
    }());

}]);