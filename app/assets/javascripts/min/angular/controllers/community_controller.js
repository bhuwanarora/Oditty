homeApp.controller("communityController",["$scope","$mdSidenav","communityService","$location","$rootScope","$mdDialog","ColorConstants",function(a,b,c,d,e,f,g){a.toggle_details=function(){b("right").toggle(),c.get_detailed_community_info(a.active_tag.id).then(function(b){a.active_tag=angular.extend(a.active_tag,b);var c=a.active_tag.follow_node;angular.isDefined(c)&&null!=c&&(a.active_tag.status=!0)})},a.toggle_follow=function(){a.active_tag.status=!a.active_tag.status,c.follow(a.active_tag.id,a.active_tag.status)},a.show_book_dialog=function(a,b){e.active_book=a,e.active_book.show_info_only=!0,f.show({templateUrl:"/assets/angular/html/community/book.html",targetEvent:b}),b.stopPropagation()},a.refresh_data=function(b){a.active_tag=b,c.get_community_details(a.active_tag.id).then(function(b){a.active_tag=b[0].most_important_tag[0],angular.forEach(a.active_tag.books,function(a){var b=Math.floor(Math.random()*g.value.length),c=g.value[b];a.color=c})})};!function(){var b=/[?&]([^=#]+)=([^&#]*)/g,f=b.exec(d.absUrl());if(null!=f)var h=f[2];if(angular.isDefined(h))var i=h;else var i=e.active_community.news_id;a.newsTags=[],a.info.active_tag=a.active_tag,a.info.loading=!0,c.get_news_info(i).then(function(b){a.info.loading=!1,b=b[0],a.active_tag=b.most_important_tag[0];var c={name:a.active_tag.name,view_count:a.active_tag.view_count,id:a.active_tag.id,image_url:a.active_tag.image_url};a.newsTags.push(c),b.other_tags.shift(),a.newsTags=a.newsTags.concat(b.other_tags),angular.forEach(a.newsTags,function(a){a.view_count=Math.floor(100*Math.random()+50)}),angular.forEach(a.active_tag.books,function(a){var b=Math.floor(Math.random()*g.value.length),c=g.value[b];a.color=c})}),c.get_chronological_news(i).then(function(b){a.news=b,angular.forEach(a.news,function(b,c){b.community_info.name==a.active_tag.name&&(a.selectedIndex=c)})})}()}]);