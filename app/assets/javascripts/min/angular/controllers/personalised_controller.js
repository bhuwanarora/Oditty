homeApp.controller("personalisedController",["$scope","userService","$rootScope","WebsiteUIConstants","ColorConstants","$location","bookService","newsService","$mdDialog","infinityService",function(a,b,c,d,e,f,g,h,i,j){var k=function(a,b){return angular.forEach(a,function(a){var b=Math.floor(Math.random()*e.value.length),c={colspan:1,color:e.value[b],rowspan:1};a=angular.extend(a,c),this.push(a)},b),b};a.show_unexplored_subject_books=function(){angular.isUndefined(a.books_from_unexplored_subjects)&&(a.info.loading=!0,j.get_books_from_unexplored_subjects().then(function(b){a.books_from_unexplored_subjects=b.books,a.unexplored_subject=b.info,a.info.loading=!1}))},a.goto_user_profile=function(){window.location.href="/profile?id="+a.info.active_tag.id},a.goto_author_profile=function(){window.location.href="/author?id="+a.info.active_tag.id},a.show_books_on_friend_shelves=function(){if(angular.isUndefined(a.friends)||0==a.friends.length)a.info.active_tab="friend_shelves",a.info.loading=!0,j.get_books_on_friends_shelves().then(function(b){angular.forEach(b,function(a){if(null==a.info[0].image_url||""==a.info[0].image_url)var b="http://www.sessionlogs.com/media/icons/defaultIcon.png";else var b=a.info[0].image_url;var c={image_url:b,view_count:100,name:a.info[0].first_name,id:a.info[0].id};a=angular.extend(a,c),a.books=k(a.books,[]),null!=a.name&&this.push(a)},a.friends),a.info.active_tag=a.friends[0],a.info.loading=!1});else{var b=a.friends;a.friends=[],a.info.loading=!0;var c=$timeout(function(){a.info.loading=!1,a.friends=b,a.info.active_tag=a.friends[0]},1e3);a.$on("destroy",function(){$timeout.cancel(c)})}},a.show_book_dialog=function(b,d){c.active_book=b,c.active_book.show_info_only=!0,i.show({templateUrl:"/assets/angular/html/news/book.html",scope:a,preserveScope:!0,clickOutsideToClose:!0,targetEvent:d}),d.stopPropagation()},a.show_books_for_era=function(){angular.isUndefined(a.books_from_favourite_era)&&(a.info.loading=!0,delete a.info.active_tag,j.get_books_from_favourite_era().then(function(b){b=b[0],a.books_from_favourite_era=[],k(b.books,a.books_from_favourite_era),a.likeable_era=b.info,a.info.loading=!1}))},a.show_books_for_category=function(){angular.isUndefined(a.books_from_favourite_category)&&(a.info.loading=!0,delete a.info.active_tag,j.get_books_from_favourite_category().then(function(b){a.books_from_favourite_category=[],k(b.books,a.books_from_favourite_category),a.likeable_category=b.info,a.info.loading=!1}))},a.show_books_for_author=function(){a.info.selectedIndex=0,angular.isUndefined(a.books_from_favourite_author)?(a.books_from_favourite_author=[],a.info.active_tab="favourite_author",a.info.loading=!0,j.get_books_from_favourite_author().then(function(b){angular.forEach(b,function(a){var b={image_url:"http://rd-authors.readersdoor.netdna-cdn.com/"+a.id+"/M.png",view_count:100};a=angular.extend(a,b),a.books=k(a.books,[]),this.push(a)},a.books_from_favourite_author),a.info.active_tag=a.books_from_favourite_author[0],a.info.loading=!1})):a.info.active_tag=a.books_from_favourite_author[0]},a.refresh_data=function(b){a.info.active_tag=b},a.show_small_reads=function(){angular.isUndefined(a.small_reads)&&(a.info.loading=!0,a.info.active_tab="small_read",delete a.info.active_tag,j.get_small_reads().then(function(b){a.small_reads=[],k(b,a.small_reads),a.info.loading=!1}))};(function(){a.info.books=[],a.active_tab={},a.friends=[],a.show_books_for_author()})()}]);