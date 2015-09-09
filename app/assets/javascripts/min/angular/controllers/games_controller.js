homeApp.controller("gamesController",["$scope","gamesService","$rootScope","$timeout","feedService","sharedService","$mdSidenav",function(a,b,c,d,e,f,g){a.get_books=function(){b.get_books().then(function(b){a.books=b,a.set_book()})},a.set_book=function(){delete a.book;var b={title:a.books[a.active_index].title,author_name:a.books[a.active_index].author_name,page_count:a.books[a.active_index].page_count,published_year:a.books[a.active_index].published_year,author_id:a.books[a.active_index].author_id,book_id:a.books[a.active_index].id||a.books[a.active_index].book_id,isbn:a.books[a.active_index].isbn,goodness_index:a.books[a.active_index].goodness_index,book_reader_relationship_index:a.books[a.active_index].book_reader_relationship_index,likability_index:a.books[a.active_index].likeability_index,popularity_index:a.books[a.active_index].popularity_index};a.book=b,a.book.isbn=a.book.isbn.split(",")[0],a.game_background={"background-image":"url('http://rd-images.readersdoor.netdna-cdn.com/"+a.book.isbn+"/L.jpg')"},delete a.shelves,e.get_bookmarks(a.book.book_id,"Book").then(function(b){a.shelves=b}),a.book.user_rating=0,a.disbale=!0,d(function(){a.disbale=!1},3e3)},a.toggle_bookmark=function(b){var c={type:"Book",id:a.book.book_id};f.toggle_bookmark(b,b.status,c,a),b.status=!b.status},a.get_users=function(){angular.isUndefined(a.users)&&(a.users=[]);var c=a.users.length;b.get_users(c).then(function(b){b&&b.length<10&&(a.hide_show_more=!0),a.users=a.users.concat(b)})},a.start_playing=function(){angular.isUndefined(c.user.id)?g("signup").toggle():(a.score=0,a.play=!1,a.done=!1,delete a.message,a.active_index=0,a.get_books(),a.get_users())},a.next_book=function(){if(a.next)a.next=!1,6==a.active_index?(a.message="<h1>Done!</h1>",a.done=!0,a.play=!0,a.score=parseInt(a.score),a.accuracy=parseInt(100*(a.score/a.book_count)),a.save_score(),angular.isUndefined(a.total_score)&&(a.total_score=0),a.total_score=a.total_score+a.score,a.play_message="PLAY AGAIN"):(a.active_index=a.active_index+1,a.set_book());else{a.next=!0,angular.isUndefined(a.book.user_rating)&&(a.book.user_rating=0);var b=Math.abs(a.book.user_rating-a.book.goodness_index);if(a.score=a.score+(10-b)/10,0==b)var c="<h1>Perfect<h1>";else if(1>b)var c="<h1>Excellent<h1>";else if(3>b)var c="<h1>Good<h1>";else if(4>b)var c="<h1>Not Bad<h1>";else if(7>b)var c="<h1>Too Bad<h1>";else var c="<h1>Don't judge a book by its cover<h1>";a.message=c,d(function(){delete a.message},1e3)}},a.save_score=function(){var c={score:a.score};b.save_score(c)},a.get_user_score=function(){b.get_user_score().then(function(b){angular.isDefined(b)&&angular.isDefined(b.ranking)&&(a.ranking=b.ranking,a.score=b.score,a.games=b.games)})};(function(){a.play=!0,a.get_user_score(),a.play_message="GOT IT",a.book_count=7,a.message="<div class='guide'><div><b>How to Play</b></div><br/><div>We'll serve up "+a.book_count+" book covers in a row. Just slide the circle and rate the book based off its cover. Then click JUDGE.</div><br/><div>Got it?</div></div>"})()}]);