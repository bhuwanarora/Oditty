angular.module("d3",[]).service("d3Service",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e;return e}]);;homeApp.service("searchService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(e){var f=b.defer(),g=function(a){return f.resolve(a.data)},h=function(a){c.user.loading=!1,500==a.status&&alert(d.ServerError)};return a.get(e).then(g,h),f.promise};this.raw=function(a,b){return e(angular.isDefined(b)?"/api/v0/search?q="+a+"&type="+b:"/api/v0/search?q="+a)},this.raw_detailed=function(a,b){return e(angular.isDefined(b)?"/api/v0/search_detailed?q="+a+"&type="+b:"/api/v0/search_detailed?q="+a)}}]);;homeApp.service("statusService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(c,e){var f=b.defer(),g=function(a){return f.resolve(a.data)},h=function(a){if(500==a.status)alert(d.ServerError);else if(403==a.status)return f.reject(a)};return a.post(c,e).then(g,h),f.promise};this.post_status=function(a){var a=angular.toJson(a);return e("/api/v0/create_status",a)}}]);;homeApp.service("feedService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(c){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert(d.ServerError)};return a.get(c).then(f,g),e.promise};this.get_feed=function(a){return e("/api/v0/feed?skip_count="+a)},this.get_notifications=function(){return e("/api/v0/personal_notifications")}}]);;homeApp.service("userService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(c){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert(d.ServerError)};return a.get(c).then(f,g),e.promise},f=function(c,e){var f=b.defer(),g=function(a){return f.resolve(a.data)},h=function(a){if(500==a.status)alert(d.ServerError);else if(403==a.status)return f.reject(a)};return a.post(c,e).then(g,h),f.promise};this.recover_password=function(a){return e("/api/v0/recover_password?"+a)},this.get_user=function(){return e("/api/v0/user")},this.get_detailed_info=function(a){return e(angular.isDefined(a)?"/api/v0/user_profile_info?id="+a:"/api/v0/user_profile_info")},this.logout=function(){return e("/api/v0/logout")},this.get_followed_by=function(){return e("/api/v0/followed_by")},this.save_feedback=function(a){return f("/api/v0/save_feedback",a)},this.save_user_info=function(a){return f("/api/v0/save_info",a)},this.handle_facebook_user=function(a){return f("/api/v0/fb",a)},this.handle_google_user=function(a){return f("/api/v0/google",a)},this.authenticate=function(a){return f("/api/v0/authenticate",a)},this.update_profile=function(a){return f("/api/v0/profile",a)},this.get_user_details=function(a){return e(angular.isDefined(a)?"/api/v0/user_details?id="+a:"/api/v0/user_details")},this.get_personal_notifications=function(){return e("/api/v0/personal_notifications")},this.get_notifications=function(a,b,c){return e(angular.isDefined(b)?angular.isDefined(c)?"/api/v0/notifications?skip_count="+a+"&id="+b+"&debug="+!0:"/api/v0/notifications?skip_count="+a+"&id="+b:"/api/v0/notifications?skip_count="+a)},this.get_influential_books=function(){return e("/api/v0/get_influential_books")},this.get_latest_notification=function(){return e("/api/v0/latest_notification")},this.get_info_data=function(){return e("/api/v0/info_data")},this.get_personal_feed=function(a){return e(angular.isDefined(a)?"/api/v0/notifications?id="+a:"/api/v0/notifications")},this.get_feed=function(){return e("/api/v0/get_feed")},this.news_visited=function(a){return e("/api/v0/news_visited?id="+a)},this.follow=function(a,b){return f("/api/v0/follow?id="+a+"&status="+b)}}]);;homeApp.service("genreService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(c){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert(d.ServerError)};return a.get(c).then(f,g),e.promise};this.search_genres=function(a){return e("/api/v0/search?q="+a+"&type=Genre")},this.get_genres=function(){return e("/api/v0/genres")}}]);;homeApp.service("bookService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(){if(angular.isDefined(c.reader))var a=c.reader.id;else var a=c.user.id;return a},f=function(c){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert(d.ServerError)};return a.get(c).then(f,g),e.promise},g=function(c,e){var f=b.defer(),g=function(a){return f.resolve(a.data)},h=function(a){if(500==a.status)alert(d.ServerError);else if(403==a.status)return f.reject(a)};return a.post(c,e).then(g,h),f.promise};this.get_basic_book_details=function(a){return f("/api/v0/basic_book?id="+a)},this.handle_facebook_books=function(a){return g("/api/v0/fb_books",a)},this.get_book_details=function(a){return f("/api/v0/book?"+a)},this.handle_influential_books=function(a,b){return f("/api/v0/influential_books?id="+a+"&status="+b)},this.get_books_bookmarked=function(a){return f("/api/v0/books_bookmarked?skip_count="+a+"&id="+e())},this.get_books_read=function(a){return f("/api/v0/books_read?skip_count="+a+"&id="+e())},this.search_books=function(a,b){return f("/api/v0/search?q="+a+"&skip="+b+"&type=Book")},this.get_popular_books=function(a){return f("/api/v0/popular_books?q="+a)},this.books_on_signup=function(a){return f("/api/v0/books_on_signup?q="+a)},this.endorse_book=function(a,b){return f("/api/v0/endorse_book?id="+a+"&status="+b)},this.update_visited=function(a){return f("/api/v0/update_visited?id="+a)},this.get_feed=function(a,b){return f("/api/v0/book_feed?id="+a+"&skip_count="+b)},this.rate_book=function(a,b){return f("/api/v0/rate?id="+a+"&data="+b)},this.get_real_news=function(a){return f("/api/v0/book_news?id="+a)},this.get_borrow_users=function(a){return f("/api/v0/borrow_users?id="+a)}}]);;homeApp.service("authorService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(c){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert(d.ServerError)};return a.get(c).then(f,g),e.promise};this.search_authors=function(a){return e("/api/v0/search?q="+a+"&type=Author")},this.get_popular_authors=function(a){return e("/api/v0/popular_authors?skip_count="+a)},this.get_details=function(a){return e("/api/v0/author_details?id="+a)}}]);;homeApp.service("shelfService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(e){var f=b.defer(),g=function(a){return f.resolve(a.data)},h=function(a){c.user.loading=!1,500==a.status&&alert(d.ServerError)};return a.get(e).then(g,h),f.promise};this.get_all_shelves=function(){return e("/api/v0/labels")},this.add_new_label=function(a){return e("/api/v0/add_new_label?label="+a)},this.bookmark=function(a){return a=angular.toJson(a),e("/api/v0/bookmark?q="+a)}}]);;homeApp.service("sharedService",["$timeout","$rootScope","ColorConstants","$location","bookService","shelfService","$mdToast",function(a,b,c,d,e,f,g){this.get_popular_books=function(a){var b=!(a.info.loading||a.constant.show_book||a.info.author_filter||a.info.group_by_alphabet||a.info.reading_time_filter||a.info.published_era_filter||a.info.custom_loading||a.info.subject_filter||!a.active_tab.infinity);b&&(a.info.loading=!0,this.load_popular_books(a))},this.toggle_bookmark=function(a,c){var d={bottom:!1,top:!0,left:!1,right:!0},e=function(){return Object.keys(d).filter(function(a){return d[a]}).join(" ")};if(angular.isUndefined(c)||!c)var h=!0;else var h=!1;var i=b.bookmark_object.id,j=b.bookmark_object.type,k=a.label_key,l={id:i,type:j,shelf:k,status:h};f.bookmark(l),g.show({controller:"toastController",templateUrl:"assets/angular/html/shared/toast/bookmark_action.html",hideDelay:6e3,position:e()})},this.load_popular_books=function(a){if(angular.isDefined(a.info.books))var b=a.info.books.length;else{a.info.books=[];var b=0}var d=angular.extend(a.filters,{skip_count:b});d=angular.toJson(d);var f=function(b){var c=!1;return angular.forEach(a.info.categories,function(a){angular.equals(a,b)&&(c=!0)}),!c};e.get_popular_books(d).then(function(b){var d=function(a){if(a.pages_count<50)var b="For a flight journey";else if(a.pages_count<100)var b="For a weekend getaway";else if(a.pages_count<=250)var b="For a week holiday";else if(a.pages_count>250)var b="For a month vacation";else var b="Dont Know";return b},e=function(a){if(a.published_year>2e3)var b="Contemporary";else if(a.published_year>=1939&&a.published_year<2e3)var b="Post Modern Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Modernism";else if(a.published_year>=1837&&a.published_year<1901)var b="Victorian Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Romanticism";else if(a.published_year>=1798&&a.published_year<1837)var b="Neo Classical Period";else if(a.published_year>=1900&&a.published_year<1939)var b="English Renaissance";else if(a.published_year>=1660&&a.published_year<1798)var b="Middle English Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Old English Literature";else var b="Don't Know";return b};angular.forEach(b,function(b){angular.forEach(b.root_category,function(b){0==a.info.categories.length?null!=b.name&&a.info.categories.push(b):angular.forEach(a.info.categories,function(a){!angular.equals(b,a)&&f(b)&&null!=b.name&&this.push(b)},a.info.categories)});var g=Math.floor(Math.random()*c.value.length),h=null!=b.status,i=d(b),j=e(b),k={published_era:j,reading_time:i,status:h,isBook:!0,colspan:1,color:c.value[g],rowspan:1,alphabet:b.title[0]};k=angular.extend(b,k),this.push(k)},a.info.books),a.info.loading=!1})}}]);