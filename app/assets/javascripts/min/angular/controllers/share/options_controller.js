homeApp.controller("optionsController",["$scope","$rootScope","$timeout","ShareOptions","$routeParams","$mdBottomSheet",function(a,b,c,d,e,f){(function(){a.share_options=d,a.data={selectedIndex:0}})();a.show_level1_options=function(b,e,f){a.first_option=b,delete a.second_option,delete a.level2_nested_options,delete a.info.book_exchange_status,delete a.info.feelings,a.data.selectedIndex=Math.min(a.data.selectedIndex+1,2),a.info.reading_status_value=e,a.loading=!0,angular.forEach(d.ReadingStage,function(d){if(angular.equals(d,b)){var e=c(function(){a.loading=!1,a.nested_options=b.nested_options},1e3);a.$on("destroy",function(){c.cancel(e)})}})},a.show_level2_options=function(b,d,e){if(delete a.info.feelings,a.second_option=b,a.data.selectedIndex=Math.min(a.data.selectedIndex+1,2),a.info.book_exchange_status=d,a.level2_loading=!0,angular.isDefined(a.second_option.search_book))delete a.level2_nested_options;else{c(function(){a.level2_loading=!1,a.level2_nested_options=a.second_option.value},1e3)}},a.post_status=function(b,c){a.info.feelings=[b.name]},a.previous=function(){a.data.selectedIndex=Math.max(a.data.selectedIndex-1,0)}}]);