homeApp.controller("authorController",["$scope","$location","$mdSidenav","authorService","$mdDialog","userService","$filter","$sce","$rootScope","WebsiteUIConstants","$timeout","sharedService","$mdBottomSheet",function(a,b,c,d,e,f,g,h,i,j,k,l,m){a.toggle_follow=function(){if(angular.isDefined(a.author.status)){var b=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.author.follow||(deleteCookie("todo"),f.update_todo_key("author/follow")))};b(),a.author.status=!a.author.status,d.follow(a.author.id,a.author.status)}else c("signup").toggle()},a.show_todo_list=function(b){m.show({templateUrl:"assets/angular/html/todo/author.html",scope:a,preserveScope:!0,targetEvent:b})},a.show_more_books=function(){var b=a.author.books.length-a.limit_count;b>8?a.limit_count=a.limit_count+8:(a.hide_show_more=!0,a.limit_count=a.limit_count+b)},a.keypress_scroll=function(b){b.keyCode==j.KeyDown?a.active_index=a.next_block(a.active_index):b.keyCode==j.KeyUp&&(a.active_index=a.previous_block(a.active_index))},a.show_book_dialog=function(b,c){l.show_book_dialog(i,a,b,c)},a.scroll_wiki=function(){},a.toggle_wiki=function(){a.show_author_wiki=!a.show_author_wiki},a.show_authors_nav=function(a){c("authors_detail_sidenav").toggle(),a.stopPropagation()},a.load_books=function(){0==a.data.selectedIndex&&a.get_books()},a.get_books=function(b){if(angular.isUndefined(a.info.loading)||!a.info.loading){var c=function(b){b.indexOf("google")<0?a.author.wiki_url=b:a.author.wiki_url=b.substring(b.lastIndexOf("?q=")+3,b.lastIndexOf("&sa"))};if(angular.isUndefined(b)&&(b=a.author.id),a.info.loading=!0,angular.isDefined(a.author)&&angular.isDefined(a.author.books))var e=a.author.books.length;else var e=0;d.get_details(b,e).then(function(b){0==e?a.author=b:(1==b.books.length&&null==b.books[0].title&&(b.books=[]),a.author.books=a.author.books.concat(b.books)),null!=b.wiki_url&&""!=b.wiki_url&&(c(b.wiki_url),a.author.wiki_url=h.trustAsResourceUrl(a.author.wiki_url+"?action=render")),1==a.author.books.length&&null==a.author.books[0].title?a.author.books=[]:angular.forEach(a.author.books,function(b,c){var d=g("large_thumb")(b);if(""!=d)var e={custom_style:{"background-image":"url('"+d+"')"}};else var e={custom_style:{}};a.author.books[c]=angular.extend(a.author.books[c],e)}),a.info.loading=!1})}},a.get_active_class=function(a){var c=""==b.path().substr(1,a.length+1)&&"books"==a;return b.path().substr(1,a.length+1)==a||c?"bold red_color":"grey_color"};(function(){var c=/[?&]([^=#]+)=([^&#]*)/g,d=c.exec(b.absUrl())[2];angular.isUndefined(a.info)&&(a.info={}),a.active_index=0;var e=k(function(){a.get_books(d)},100);a.$on("destroy",function(){k.cancel(e)}),a.limit_count=8;var g=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.book.author||(deleteCookie("todo"),f.update_todo_key("book/author")))};g()})()}]);