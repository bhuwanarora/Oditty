homeApp.controller("timelineController",["$scope","$rootScope","bookService","$location","userService","$mdDialog","$mdSidenav","$timeout",function(a,b,c,d,e,f,g,h){var i=function(){return""==getCookie("logged")||null==getCookie("logged")};a.write_reading_journey_for=function(){i()?g("signup").toggle():(a.info.show_share=!0,f.hide())},a.get_feed=function(){angular.isUndefined(a.book_feed)&&(a.book_feed=[]);var d=a.book_feed.length,f=function(a){var c="";switch(a.label){case"BookmarkNode":c=a.node.key?"Added to "+a.node.key:"Added "+b.active_book.title+" to a Shelf.";break;case"Listopia":break;case"CommunityNode":break;case"BlogNode":break;case"StatusNode":c=a.node.wrapper_content;break;case"EndorseNode":c="Endorsed this book.";break;case"RatingNode":c="Gave "+a.node.content+" rating on 10.";break;case"RecommendNode":c="Recommended this book to a friend."}return c};c.get_feed(a.book_id,d).then(function(b){a.book_feed=b,angular.forEach(a.book_feed,function(a){var b=f(a);if(a=angular.extend(a,{message:b}),angular.isDefined(a.user))e.get_user_details(a.user.id).then(function(b){a.user=angular.extend(a.user,b)});else{var b=f(a);a=angular.extend(a,{message:b})}})})};(function(){var c=/[?&]([^=#]+)=([^&#]*)/g,e=c.exec(d.absUrl());if(null!=e)var f=e[2];if(angular.isDefined(b.active_book))var g=b.active_book.book_id||b.active_book.id;else var g=f;angular.isUndefined(g)&&b.pages&&(g=getCookie("id")),a.book_id=g;var i=h(function(){a.get_feed()},100);a.$on("destroy",function(){h.cancel(i)})})()}]);