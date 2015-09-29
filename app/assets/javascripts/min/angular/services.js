angular.module("d3",[]).service("d3Service",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e;return e}]);;homeApp.service("searchService",["$http","$q","$rootScope","WebsiteUIConstants","search_service_url",function(a,b,c,d,e){this.raw=function(c){var d=c.q,f=c.type,g=c.skip,h=c.count;return params_string="q="+d,angular.isDefined(f)&&(params_string=params_string+"&type="+f),g&&(params_string=params_string+"&skip="+g),h&&(params_string=params_string+"&count="+h),_deferred_request("/api/v0/search?"+params_string,b,a,e)},this.raw_detailed=function(c,d){return angular.isDefined(d)?_deferred_request("/api/v0/search_detailed?q="+c+"&type="+d,b,a,e):_deferred_request("/api/v0/search_detailed?q="+c,b,a,e)},this.get_top_searches=function(){return _deferred_request("/api/v0/top_searches",b,a,e)},this.get_top_results=function(){return _deferred_request("/api/v0/top_results",b,a,e)}}]);;homeApp.service("statusService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.post_status=function(c){var c=angular.toJson(c);return _deferred_post_request("/api/v0/create_status",c,b,a)}}]);;homeApp.service("feedService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_feed=function(c){return _deferred_request("/api/v0/feed?skip_count="+c,b,a)},this.get_notifications=function(){return _deferred_request("/api/v0/personal_notifications",b,a)},this.get_bookmarks=function(c,d){return _deferred_request("/api/v0/get_bookmarks?id="+c+"&type="+d,b,a)}}]);;homeApp.service("userService",["$http","$q","$rootScope","WebsiteUIConstants","todo_service_url",function(a,b,c,d,e){this.room_suggestions=function(c){return _deferred_request("/api/v0/room_suggestions?skip="+c,b,a)},this.update_todo_key=function(c){var d={type:c};return _deferred_post_request("/api/v0/set_todos",d,b,a,e)},this.get_social_feed=function(c,d){return angular.isUndefined(c)&&(c=0),angular.isUndefined(d)&&(d=10),_deferred_request("/api/v0/get_social_feed?skip="+c+"&count="+d,b,a)},this.invite=function(c){return _deferred_request("/api/v0/invite?email="+c,b,a)},this.get_todos=function(c){return _deferred_request("/api/v0/get_todos?type="+c,b,a,e)},this.get_global_feed=function(c,d){return angular.isUndefined(c)&&(c=0),angular.isUndefined(d)&&(d=10),_deferred_request("/api/v0/get_global_feed?skip="+c+"&count="+d,b,a)},this.recover_password=function(c){return _deferred_request("/api/v0/recover_password?"+c,b,a)},this.get_user=function(){return _deferred_request("/api/v0/user",b,a)},this.get_detailed_info=function(c){return angular.isDefined(c)?_deferred_request("/api/v0/user_profile_info?id="+c,b,a):_deferred_request("/api/v0/user_profile_info",b,a)},this.logout=function(){return _deferred_request("/api/v0/logout",b,a)},this.get_followed_by=function(){return _deferred_request("/api/v0/followed_by",b,a)},this.save_feedback=function(c){return _deferred_post_request("/api/v0/save_feedback",c,b,a)},this.save_user_info=function(c){return _deferred_post_request("/api/v0/save_info",c,b,a)},this.handle_facebook_user=function(c){return _deferred_post_request("/api/v0/fb",c,b,a)},this.handle_google_user=function(c){return _deferred_post_request("/api/v0/google",c,b,a)},this.authenticate=function(c){return _deferred_post_request("/api/v0/authenticate",c,b,a)},this.update_profile=function(c){return _deferred_post_request("/api/v0/profile",c,b,a)},this.get_user_details=function(c){return angular.isDefined(c)?_deferred_request("/api/v0/user_details?id="+c,b,a):_deferred_request("/api/v0/user_details",b,a)},this.add_book=function(c,d){return _deferred_request("/api/v0/add_book?id="+c+"&book_id="+d,b,a)},this.get_personal_notifications=function(){return _deferred_request("/api/v0/personal_notifications",b,a)},this.get_notifications=function(c,d,e){return angular.isDefined(d)?angular.isDefined(e)?_deferred_request("/api/v0/notifications?skip_count="+c+"&id="+d+"&debug="+!0,b,a):_deferred_request("/api/v0/notifications?skip_count="+c+"&id="+d,b,a):_deferred_request("/api/v0/notifications?skip_count="+c,b,a)},this.get_influential_books=function(){return _deferred_request("/api/v0/get_influential_books",b,a)},this.get_latest_notification=function(){return _deferred_request("/api/v0/latest_notification",b,a)},this.get_info_data=function(){return _deferred_request("/api/v0/info_data",b,a)},this.get_personal_feed=function(c,d){return d=d||0,angular.isDefined(c)?_deferred_request("/api/v0/notifications?id="+c+"&skip="+d,b,a):_deferred_request("/api/v0/notifications?skip="+d,b,a)},this.get_feed=function(c){return angular.isDefined(c)?_deferred_request("/api/v0/feed_news?skip="+c,b,a):_deferred_request("/api/v0/feed_news",b,a)},this.follow=function(c,d){return _deferred_request("/api/v0/follow?id="+c+"&status="+d,b,a)},this.get_blog_feed=function(c,d){return c=c||0,d=d||!1,_deferred_request("/api/v0/feed_blog?skip_count="+c+"&multiple="+d,b,a)},this.get_last_blog=function(){return _deferred_request("/api/v0/last_blog",b,a)},this.get_regions=function(){return _deferred_request("/api/v0/regions",b,a)},this.suggest_communities=function(){return _deferred_request("/api/v0/suggest_communities",b,a)},this.recommend=function(c,d){return _deferred_request("/api/v0/recommend?friends_id="+c+"&book_id="+d,b,a)},this.get_communities=function(c){return angular.isDefined(c)?_deferred_request("/api/v0/get_communities?id="+c,b,a):_deferred_request("/api/v0/get_communities",b,a)},this.get_social_books=function(){return _deferred_request("/api/v0/social_books",b,a)},this.get_facebook_likes=function(){return _deferred_request("/api/v0/get_likes",b,a)},this.suggest_friends=function(){return _deferred_request("/api/v0/get_friends_of_friend",b,a)}}]);;homeApp.service("genreService",["$http","$q","$rootScope","WebsiteUIConstants","search_service_url",function(a,b,c,d){this.search_genres=function(c){return _deferred_request("/api/v0/search?q="+c+"&type=Genre",b,a)},this.search_star_genres=function(c){return _deferred_request("/api/v0/search_star_genre?q="+c,b,a)},this.get_genres=function(){return _deferred_request("/api/v0/genres",b,a)},this.get_categories=function(){return _deferred_request("/api/v0/categories",b,a)},this.get_basic_details=function(c){return _deferred_request("/api/v0/genre_details?id="+c,b,a)}}]);;homeApp.service("bookService",["$http","$q","$rootScope","WebsiteUIConstants","search_service_url","price_service_url",function(a,b,c,d,e,f){var g=function(){if(angular.isDefined(c.reader))var a=c.reader.id;else var a=c.user.id;return a};this.get_basic_book_details=function(c){return _deferred_request("/api/v0/basic_book?id="+c,b,a)},this.handle_facebook_books=function(c){return _deferred_post_request("/api/v0/fb_books",c,b,a)},this.get_book_details=function(c){return _deferred_request("/api/v0/book?"+c,b,a)},this.handle_influential_books=function(c,d){return _deferred_request("/api/v0/influential_books?id="+c+"&status="+d,b,a)},this.get_books_bookmarked=function(c){return _deferred_request("/api/v0/books_bookmarked?skip_count="+c+"&id="+g(),b,a)},this.get_books_read=function(c){return _deferred_request("/api/v0/books_read?skip_count="+c+"&id="+g(),b,a)},this.search_books=function(c,d){return _deferred_request("/api/v0/search?q="+c+"&skip="+d+"&type=Book",b,a,e)},this.get_popular_books=function(c){return _deferred_request("/api/v0/popular_books?q="+c,b,a)},this.books_on_signup=function(c){return _deferred_request("/api/v0/books_on_signup?q="+c,b,a)},this.endorse_book=function(c,d){return _deferred_request("/api/v0/endorse_book?id="+c+"&status="+d,b,a)},this.update_visited=function(c){return _deferred_request("/api/v0/update_visited?id="+c,b,a)},this.get_feed=function(c,d){return _deferred_request("/api/v0/book_feed?id="+c+"&skip_count="+d,b,a)},this.rate_book=function(c,d){return _deferred_request("/api/v0/rate?id="+c+"&data="+d,b,a)},this.get_real_news=function(c){return _deferred_request("/api/v0/book_news?id="+c,b,a)},this.get_borrow_users=function(c){return _deferred_request("/api/v0/borrow_users?id="+c,b,a)},this.get_interesting_info=function(c){return _deferred_request("/api/v0/get_interesting_info?id="+c,b,a)},this.get_top_searches=function(){return _deferred_request("/api/v0/top_searches",b,a,e)},this.get_community_news=function(c,d){return _deferred_request("/api/v0/community_news?id="+c+"&skip="+d,b,a)},this.get_primary_info=function(c){return _deferred_request("/api/v0/book_primary_info?id="+c,b,a)},this.send_borrow_notification=function(c){return _deferred_request("/api/v0/notify_borrow?id="+c,b,a)},this.all_prices=function(c){return _deferred_request("/api/v0/all_prices?isbn="+c,b,a,f)},this.more_prices=function(c){return _deferred_request("/api/v0/more_prices?isbn="+c,b,a,f)}}]);;homeApp.service("authorService",["$http","$q","$rootScope","WebsiteUIConstants","base_url","search_service_url",function(a,b,c,d,e,f){this.search_authors=function(c){return _deferred_request("/api/v0/search?q="+c+"&type=Author",b,a,f)},this.get_popular_authors=function(c){return _deferred_request("/api/v0/popular_authors?skip_count="+c,b,a,f)},this.get_details=function(c,d){return _deferred_request("/api/v0/author_details?id="+c+"&skip="+d,b,a)},this.follow=function(c,d){return _deferred_request("/api/v0/follow_author?id="+c+"&status="+d,b,a)},this.get_interview_details=function(c){return _deferred_request("/api/v0/author_interview?id="+c,b,a)},this.get_basic_info=function(c){return _deferred_request("/api/v0/author_basic_info?id="+c,b,a)},this.get_authors_interviewed=function(c){return _deferred_request("/api/v0/get_authors_interviewed?skip="+c,b,a)}}]);;homeApp.service("shelfService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_all_shelves=function(){return _deferred_request("/api/v0/labels",b,a)},this.add_new_label=function(c,d){return _deferred_request("/api/v0/add_new_label?label="+c+"&type="+d,b,a)},this.bookmark=function(c){return _deferred_post_request("/api/v0/bookmark",c,b,a)}}]);;homeApp.service("infinityService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_books=function(d){e=angular.extend(c.filters,{skip_count:d});var e=angular.toJson(e);return _deferred_request("/api/v0/get_filtered_books?q="+e,b,a)},this.get_small_reads=function(){return _deferred_request("/api/v0/small_reads",b,a)},this.get_books_from_favourite_author=function(){return _deferred_request("/api/v0/books_from_favourite_author",b,a)},this.get_books_from_favourite_category=function(){return _deferred_request("/api/v0/books_from_favourite_category",b,a)},this.get_books_from_favourite_era=function(){return _deferred_request("/api/v0/books_from_favourite_era",b,a)},this.get_books_on_friends_shelves=function(){return _deferred_request("/api/v0/books_on_friends_shelves",b,a)},this.get_books_from_unexplored_subjects=function(){return _deferred_request("/api/v0/books_from_unexplored_subjects",b,a)}}]);;homeApp.service("networkService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_followers=function(c,d){var e="";return angular.isDefined(c)&&(e="skip="+c),angular.isDefined(d)&&(""!=e&&(e+="&"),e=e+"id="+d),""!=e&&(e="?"+e),_deferred_request("/api/v0/followers"+e,b,a)},this.get_users_followed=function(c,d){var e="";return angular.isDefined(c)&&(e="skip="+c),angular.isDefined(d)&&(""!=e&&(e+="&"),e=e+"id="+d),""!=e&&(e="?"+e),_deferred_request("/api/v0/users_followed"+e,b,a)},this.search_friends=function(c){return _deferred_request("/api/v0/search_friends?q="+c,b,a)}}]);;homeApp.service("newsService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_news_info=function(c,d){return angular.isDefined(d)&&""!=d?_deferred_request("/api/v0/news_info?id="+c+"&tag_id="+d,b,a):_deferred_request("/api/v0/news_info?id="+c,b,a)},this.get_chronological_news=function(c){return _deferred_request("/api/v0/chronological_news?id="+c,b,a)},this.get_community_details=function(c){return _deferred_request("/api/v0/basic_community_info?id="+c,b,a)},this.get_metadata=function(c){return _deferred_request("/api/v0/metadata?url="+c,b,a)},this.get_detailed_community_info=function(c){return _deferred_request("/api/v0/detailed_community_info?id="+c,b,a)},this.follow=function(c,d){return _deferred_request("/api/v0/follow_community?id="+c+"&status="+d,b,a)},this.get_feed_info=function(c){return _deferred_request("/api/v0/feed_community_info?id="+c,b,a)},this.news_visited=function(c){return _deferred_request("/api/v0/news_visited?id="+c,b,a)},this.get_community_news=function(c,d,e){return angular.isDefined(e)?_deferred_request("/api/v0/get_community_news?id="+c+"&skip="+d+"&time="+e,b,a):_deferred_request("/api/v0/get_community_news?id="+c+"&skip="+d,b,a)}}]);;homeApp.service("sharedService",["$timeout","$rootScope","ColorConstants","$location","bookService","shelfService","$mdToast","infinityService","userService","$location","newsService","Years","Months","websiteService","$document",function(a,b,c,d,e,f,g,h,i,d,j,k,l,m,n){this.get_popular_books=function(a,b){var c=!(a.info.loading||!angular.isUndefined(a.constant)&&a.constant.show_book||!angular.isUndefined(a.info.author_filter)&&a.info.author_filter||!angular.isUndefined(a.info.group_by_alphabet)&&a.info.group_by_alphabet||a.info.reading_time_filter||a.info.published_era_filter||a.info.custom_loading||a.info.subject_filter||!(a.info.infinity||angular.isUndefined(a.info.infinity)||angular.isDefined(b)));c&&this.load_popular_books(a,b)};var o=function(a){if(null==a.page_count)var b="Dont Know";else if(a.page_count=parseInt(a.page_count),a.page_count<50)var b="For a flight journey";else if(a.page_count<100)var b="For a weekend getaway";else if(a.page_count<=250)var b="For a week holiday";else if(a.page_count>250)var b="For a month vacation";else var b="Dont Know";return b},p=function(a){if(a.published_year>2e3)var b="Contemporary";else if(a.published_year>=1939&&a.published_year<2e3)var b="Post Modern Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Modernism";else if(a.published_year>=1837&&a.published_year<1901)var b="Victorian Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Romanticism";else if(a.published_year>=1798&&a.published_year<1837)var b="Neo Classical Period";else if(a.published_year>=1900&&a.published_year<1939)var b="English Renaissance";else if(a.published_year>=1660&&a.published_year<1798)var b="Middle English Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Old English Literature";else var b="Don't Know";return b};this.show_book_dialog=function(a,b,c,d){var e=c.book_id||c.id;window.location.href="/book?id="+e},this.filtered_books=function(a){a.info.loading=!0,a.info.fetching_books=!0;var b=a.info.books.length;h.get_books(b).then(function(b){null!=b&&(angular.forEach(b.books,function(a){var b=null!=a.status,c=o(a),d=p(a);if(null!=a.title){var e=a.title[0],f={published_era:d,reading_time:c,status:b,isBook:!0,colspan:1,rowspan:1,alphabet:e};f=angular.extend(a,f),this.push(f)}},a.info.books),delete b.books,a.info.other_info=b),a.info.fetching_books=!1,a.info.loading=!1})},this.render_page=function(a){if(angular.isDefined(b.containers)){var c=a.target,e=String(c.textContent).replace(/^\s+|\s+$/g,"");if("Go to Book"==e)var c=c.parentElement;var f=c.getAttribute("data-url"),g=c.getAttribute("data-id"),h=f.toCamel();if(angular.isUndefined(g)||null==g||"null"==g)var i={id:g,url:f,full_url:f,header:h};else var i={id:g,url:f,full_url:f+"?id="+g,header:h};b.containers.push(i);var i=angular.element(document.getElementById("browseScreen")),j=b.containers.length;return i.scrollLeft(600*j,1e3),d.path(null),!1}},this.toggle_bookmark=function(a,b,c,d){var e=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.filters.shelf||(deleteCookie("todo"),i.update_todo_key("filters/shelf")))};if(e(),angular.isUndefined(d.info)&&(d.info={loading:!1}),!d.info.loading){d.info.loading=!0;var h={bottom:!1,top:!0,left:!1,right:!0},j=function(){return Object.keys(h).filter(function(a){return h[a]}).join(" ")};if(angular.isUndefined(b)||!b)var k=!0;else var k=!1;var l=c.id,m=c.type,n=a.label_key||a.key,o={id:l,type:m,shelf:n,status:k};f.bookmark(o).then(function(){d.info.loading=!1,g.show({controller:"toastController",templateUrl:"assets/angular/html/shared/toast/bookmark_action.html",hideDelay:3e3,position:j()})})}},this.get_community_news=function(a){var b="/room/books"!=d.path()&&"/room/videos"!=d.path()&&"/room/wiki"!=d.path(),c=a.active_tag.id;if(angular.isUndefined(a.active_tag.news)&&(a.active_tag.news=[]),b){var e=a.active_tag.news.length,f=l.indexOf(a.info.active_month);if(!a.info.loading){a.info.loading=!0;var g=a.info.active_time;if("recent"==g&&(g=2015),angular.isUndefined(a.info.active_month))var g=g+"/12";else var g=g+"/"+(12-f);j.get_community_news(c,e,g).then(function(b){if(null!=b&&b.length>0)b=b[0],a.active_tag.news=a.active_tag.news.concat(b.news);else if(11==f){if("1998"!=g){var c=k.indexOf(g);g=k[c+1],a.info.active_month=l[0]}}else a.info.active_month=l[f+1];a.info.loading=!1})}}},this.load_popular_books=function(a,b){a.info.loading=!0,angular.isUndefined(b)&&(angular.isUndefined(a.info.books)&&(a.info.books=[]),b=a.info.books);var c=b.length;angular.isUndefined(a.filters)&&(a.filters={});var d=angular.extend(a.filters,{skip_count:c});d=angular.toJson(d);var f=function(b){var c=!1;return angular.forEach(a.info.categories,function(a){angular.equals(a,b)&&(c=!0)}),!c};e.get_popular_books(d).then(function(c){angular.forEach(c,function(b){angular.isDefined(a.info.categories)&&angular.forEach(b.root_category,function(b){0==a.info.categories.length?null!=b.name&&a.info.categories.push(b):angular.forEach(a.info.categories,function(a){!angular.equals(b,a)&&f(b)&&null!=b.name&&this.push(b)},a.info.categories)});var c=null!=b.status,d=o(b),e=p(b),g={published_era:e,reading_time:d,status:c,isBook:!0,colspan:1,rowspan:1,alphabet:b.title[0],root_category:b.root_category};g=angular.extend(b,g),this.push(g)},b),a.info.loading=!1})}}]);