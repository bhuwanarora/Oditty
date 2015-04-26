homeApp.controller("profileController",["$scope","userService","$rootScope","WebsiteUIConstants","ColorConstants","$location","bookService",function(a,b,c,d,e,f,g){var h=function(c){b.get_detailed_info(c).then(function(b){if(0!=b.length){b=b[0];var c=[];angular.forEach(b.categories_id,function(a,c){var e=d.GenreAWS+b.categories_aws_key[c],f={root_category_id:a,root_category_name:b.categories_name[c],url:e,status:!0};this.push(f)},c);var f=[];angular.forEach(b.books_id,function(a,c){var d=Math.floor(Math.random()*e.value.length),f=e.value[d],g={color:f,book_id:a,title:b.books_title[c],author_name:b.books_author_name[c],isbn:b.books_isbn[c],random_style:{"background-color":f}};this.push(g)},f),a.profile_user=angular.extend(a.profile_user,b),a.profile_user=angular.extend(a.profile_user,{favourite_categories:c}),a.profile_user=angular.extend(a.profile_user,{influential_books:f})}})},i=function(c){var d=function(a){var b="";switch(a.label){case"BookmarkNode":b="Added to "+a.node.key;break;case"Listopia":break;case"CommunityNode":break;case"BlogNode":break;case"StatusNode":b=a.node.wrapper_content;break;case"EndorseNode":b="Endorsed this book.";break;case"RatingNode":b="Gave "+a.node.content+" rating on 10."}return b},f=function(){var b=[],c=function(a,b){var c=!1,d=0;return a.length>0&&angular.forEach(a,function(a,e){angular.isDefined(a.book)&&a.book.id==b&&(c=!0,d=e)}),{status:c,index:d}};angular.forEach(a.personal_feed,function(a){if(angular.isDefined(a.book)){var d=c(b,a.book.id);d.status?(delete a.book,b[d.index].data.push(a)):(angular.isDefined(a.book)&&(d={book:a.book},delete a.book,a=angular.extend(d,{data:[a]})),this.push(a))}else this.push(a)},b),a.personal_feed=b};b.get_personal_feed(c).then(function(b){a.personal_feed=[],angular.forEach(b,function(a){var b=Math.floor(Math.random()*e.value.length);angular.isDefined(a.book)&&(a.book=angular.extend(a.book,{color:e.value[b]})),this.push(a)},a.personal_feed),f(),angular.forEach(a.personal_feed,function(a){if(angular.isDefined(a.book))g.get_basic_book_details(a.book.id).then(function(b){a.book=angular.extend(a.book,b),angular.forEach(a.data,function(a){var b=d(a);a=angular.extend(a,{message:b})})});else{var b=d(a),c=angular.extend(a,{message:b});a.data=[c]}})})};a.write_reading_journey=function(){a.info.show_share=!0,a.info.show_book_share=!0},a.search_book=function(){},a.follow_user=function(){a.profile_user.status=!a.profile_user.status,b.follow(a.profile_user.id,a.profile_user.status)};!function(){a.profile_user={};var b=/[?&]([^=#]+)=([^&#]*)/g,d=b.exec(f.absUrl());if(angular.isDefined(d)&&null!=d){var e=d[2];a.info.my_profile=angular.isDefined(c.user)&&c.user.id==e?!0:!1}else{var e=a.profile_user.id;a.info.my_profile=!0}h(e),i(e)}()}]);