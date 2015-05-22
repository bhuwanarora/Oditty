homeApp.service("bookService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(){if(angular.isDefined(c.reader))var a=c.reader.id;else var a=c.user.id;return a};this.get_basic_book_details=function(c){return _deferred_request("/api/v0/basic_book?id="+c,b,a)},this.handle_facebook_books=function(c){return _deferred_post_request("/api/v0/fb_books",c,b,a)},this.get_book_details=function(c){return _deferred_request("/api/v0/book?"+c,b,a)},this.handle_influential_books=function(c,d){return _deferred_request("/api/v0/influential_books?id="+c+"&status="+d,b,a)},this.get_books_bookmarked=function(c){return _deferred_request("/api/v0/books_bookmarked?skip_count="+c+"&id="+e(),b,a)},this.get_books_read=function(c){return _deferred_request("/api/v0/books_read?skip_count="+c+"&id="+e(),b,a)},this.search_books=function(c,d){return _deferred_request("/api/v0/search?q="+c+"&skip="+d+"&type=Book",b,a)},this.get_popular_books=function(c){return _deferred_request("/api/v0/popular_books?q="+c,b,a)},this.books_on_signup=function(c){return _deferred_request("/api/v0/books_on_signup?q="+c,b,a)},this.endorse_book=function(c,d){return _deferred_request("/api/v0/endorse_book?id="+c+"&status="+d,b,a)},this.update_visited=function(c){return _deferred_request("/api/v0/update_visited?id="+c,b,a)},this.get_feed=function(c,d){return _deferred_request("/api/v0/book_feed?id="+c+"&skip_count="+d,b,a)},this.rate_book=function(c,d){return _deferred_request("/api/v0/rate?id="+c+"&data="+d,b,a)},this.get_real_news=function(c){return _deferred_request("/api/v0/book_news?id="+c,b,a)},this.get_borrow_users=function(c){return _deferred_request("/api/v0/borrow_users?id="+c,b,a)},this.get_interesting_info=function(c){return _deferred_request("/api/v0/get_interesting_info?id="+c,b,a)},this.get_top_searches=function(){return _deferred_request("/api/v0/top_searches",b,a)}}]);