homeApp.controller("communityController",["$scope","newsService","$rootScope","ColorConstants","$timeout","$location","$mdDialog","userService","$mdSidenav","sharedService","$sce",function(a,b,c,d,e,f,g,h,i,j,k){a.get_detailed_community_info=function(){b.get_detailed_community_info(a.active_tag.id).then(function(b){a.active_tag=angular.extend(a.active_tag,b);var c=a.active_tag.follows_node;a.active_tag.wiki_url&&null!=a.active_tag.wiki_url&&(a.active_tag.wiki_url=k.trustAsResourceUrl(a.active_tag.wiki_url+"?action=render")),angular.isDefined(c)&&null!=c&&(a.active_tag.status=!0)})},a.goto_news_page=function(a,b){h.news_visited(a),deleteCookie("active_community"),angular.isDefined(b)&&setCookie("active_community",b,1),window.location.href="/news?q="+a},a.get_active_class=function(a){var b=""==f.path().substr(1,a.length+1)&&"room/books"==a;return f.path().substr(1,a.length+1)==a||b?"bold red_color":"grey_color"},a.show_book_dialog=function(b,d){j.show_book_dialog(c,a,b,d)},a.toggle_follow=function(){var c=""==getCookie("logged")||null==getCookie("logged");c?i("signup").toggle():(a.active_tag.status=!a.active_tag.status,b.follow(a.active_tag.id,a.active_tag.status))},a.refresh_data=function(){b.get_community_details(a.active_tag.id).then(function(b){angular.isDefined(b[0])?(a.active_tag=angular.extend(a.active_tag,b[0].most_important_tag[0]),a.info.loading=!1):a.info.loading=!1})},a.get_community_news=function(){var c="/room/news"==f.path();if(angular.isDefined(a.active_tag)&&c){var d=a.active_tag.id,e=a.active_tag.news.length;a.info.loading||(a.info.loading=!0,b.get_community_news(d,e).then(function(b){null!=b&&b.length>0&&(b=b[0],a.active_tag.news=a.active_tag.news.concat(b.news)),a.info.loading=!1}))}};(function(){var b=/[?&]([^=#]+)=([^&#]*)/g,c=b.exec(f.absUrl());if(null!=c){a.info.loading=!0;var d=c[2];a.active_tag={id:d},a.get_detailed_community_info(),e(function(){a.refresh_data()},2e3)}else alert("Bad url");a.is_room=!0})()}]);