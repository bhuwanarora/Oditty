homeApp.controller("buyController",["$scope","$rootScope","bookService","sharedService","$mdSidenav","$timeout",function(a,b,c,d,e,f){var g=function(){return""==getCookie("logged")||null==getCookie("logged")};a.notify_friends=function(){var d=""==getCookie("logged")||null==getCookie("logged");if(d)e("signup").toggle();else{var f=b.active_book.id||b.active_book.book_id;a.info.loading||(a.info.loading=!0,c.send_borrow_notification(f).then(function(){a.info.loading=!1,a.hide_link=!0}))}},a.toggle_bookmark=function(a){if(g())e("signup").toggle();else{var c=b.active_book.id||b.active_book.book_id,f={label_key:"IOwnThis"},h={type:"Book",id:c};d.toggle_bookmark(f,a,h)}},a.get_prices_and_reviews=function(b){angular.isDefined(a.prices)?a.prices=a.prices.concat(b.prices):a.prices=b.prices,angular.isDefined(a.reviews)?a.reviews=a.reviews.concat(b.reviews):a.reviews=b.reviews};(function(){var d=b.active_book.id||b.active_book.book_id,e=b.active_book.isbn;if(angular.isUndefined(a.book)&&(a.book=b.active_book),!g()){var h=f(function(){c.get_borrow_users(d).then(function(b){a.borrow_users=b})},100);a.$on("destroy",function(){f.cancel(h)})}var i=f(function(){c.all_prices(e).then(function(b){a.get_prices_and_reviews(b)})},100),j=f(function(){a.loading_buy_options=!0,c.more_prices(e).then(function(b){a.get_prices_and_reviews(b),a.loading_buy_options=!1})},100);a.$on("destroy",function(){f.cancel(i),f.cancel(j)})})()}]);