homeApp.controller("newsController",["$scope","$mdSidenav","newsService","$location","$rootScope","$mdDialog","ColorConstants","$timeout","sharedService",function(a,b,c,d,e,f,g,h,i){a.toggle_details=function(){b("right").toggle()},a.get_detailed_community_info=function(){c.get_detailed_community_info(a.active_tag.id).then(function(b){a.active_tag=angular.extend(a.active_tag,b);var c=a.active_tag.follow_node;angular.isDefined(c)&&null!=c&&(a.active_tag.status=!0),a._check_users()})},a.toggle_follow=function(){var d=""==getCookie("logged")||null==getCookie("logged");d?b("signup").toggle():(a.active_tag.status=!a.active_tag.status,c.follow(a.active_tag.id,a.active_tag.status))},a.show_book_dialog=function(b,c){i.show_book_dialog(e,a,b,c)},a.refresh_data=function(b){delete a.active_tag,a.info.loading=!0,c.get_community_details(b.id).then(function(c){a.active_tag=b,a.active_tag=c[0].most_important_tag[0],angular.forEach(a.active_tag.books,function(a){var b=Math.floor(Math.random()*g.value.length),c=g.value[b];a.color=c}),a.info.loading=!1}),a.info.circles,a.get_detailed_community_info()},a._check_users=function(){if(1==a.active_tag.users.length){var b=a.active_tag.users[0].first_name;(angular.isUndefined(b)||null==b)&&(a.active_tag.users=[])}},a.get_news_info=function(b){c.get_news_info(b,e.active_community).then(function(b){a.info.loading=!1,b=b[0],a.active_tag=b.most_important_tag[0];var c={name:a.active_tag.name,view_count:a.active_tag.view_count,id:a.active_tag.id,image_url:a.active_tag.image_url};a.newsTags.push(c),a.newsTags=a.newsTags.concat(b.other_tags),angular.forEach(a.active_tag.books,function(a){var b=Math.floor(Math.random()*g.value.length),c=g.value[b];a.color=c}),a._check_users(),a.get_detailed_community_info()})};(function(){var b=/[?&]([^=#]+)=([^&#]*)/g,c=b.exec(d.absUrl());if(null!=c)var f=c[2];if(angular.isDefined(f))var g=f;else var g=e.active_community.news_id;a.info.active_news_id=g,a.newsTags=[],a.info.active_tag=a.active_tag,a.info.loading=!0;var i=h(function(){a.get_news_info(g)},100);a.$on("destroy",function(){h.cancel(i)})})()}]);