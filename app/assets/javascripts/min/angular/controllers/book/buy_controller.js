homeApp.controller("buyController",["$scope","$rootScope","bookService","sharedService","$mdSidenav","$timeout",function(a,b,c,d,e,f){var g=function(){return""==getCookie("logged")||null==getCookie("logged")};(function(){a.info.loading=!0;var d=b.active_book.id||b.active_book.book_id;if(angular.isUndefined(a.book)&&(a.book=b.active_book),a.book_loading=!0,g())a.book_loading=!1,a.info.loading=!1;else{var e=f(function(){c.get_borrow_users(d).then(function(b){a.borrow_users=b,a.book_loading=!1,a.info.loading=!1})},100);a.$on("destroy",function(){f.cancel(e)})}})();a.notify_friends=function(){var a=""==getCookie("logged")||null==getCookie("logged");a&&e("signup").toggle()},a.toggle_bookmark=function(a){if(g())e("signup").toggle();else{var c=b.active_book.id||b.active_book.book_id,f={label_key:"IOwnThis"},h={type:"Book",id:c};d.toggle_bookmark(f,a,h)}}}]);