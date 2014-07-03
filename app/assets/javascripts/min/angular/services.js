websiteApp.service("recommendationService",["$http","$q","$rootScope",function(a,b,c){this.get_recommendations=function(){var a=angular.toJson(c.filters);return _deferred_request("/api/v0/recommendations?count=5&q="+a)},this.push_recommendations=function(){return _deferred_request("/api/v0/push_recommendations")},this.get_filters=function(){return _deferred_request("/api/v0/filters")},this.get_genres=function(a){return _deferred_request("/api/v0/genres?"+a)},this.get_countries=function(a){return _deferred_request("/api/v0/countries?"+a)},this.get_time_groups=function(){return _deferred_request("/api/v0/times")},this.get_read_times=function(){return _deferred_request("/api/v0/read_times")},this.get_labels=function(){return _deferred_request("/api/v0/labels")},_deferred_request=function(d){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){c.loading=!1,500==a.status&&alert("internal server error")};return a.get(d).then(f,g),e.promise}}]);;websiteApp.factory("appSocket",function(a){var b=a();return b.forward("error"),b});;websiteApp.service("websiteService",["$http","$q","$rootScope",function(a,b){this.get_book_details=function(a){return _deferred_request("/api/v0/book?"+a)},this.authenticate=function(a){return _deferred_post_request("/api/v0/authenticate",a)},this.update_profile=function(a){return _deferred_post_request("/api/v0/profile",a)},this.get_user_details=function(a){return _deferred_request("/api/v0/user_details?"+a)},this.get_genres=function(){return _deferred_request("/api/v0/genres")},this.get_background_image=function(){return _deferred_request("/api/v0/image")},this.get_notifications=function(a){return _deferred_request("/api/v0/notifications?id="+a.id)},this.search=function(a,b,c){return _deferred_request("/api/v0/search?count="+c+"&q="+a+"&t="+b)},this.get_info_data=function(){return _deferred_request("/api/v0/info_data")},this.get_popular_books=function(){return _deferred_request("/api/v0/popular_books")},_deferred_request=function(c){var d=b.defer(),e=function(a){return d.resolve(a.data)},f=function(a){500==a.status&&alert("internal server error")};return a.get(c).then(e,f),d.promise},_deferred_post_request=function(c,d){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){if(500==a.status)alert("internal server error");else if(403==a.status)return e.reject(a)};return a.post(c,d).then(f,g),e.promise}}]);;websiteApp.service("widgetService",["$http","$q","$rootScope",function(a,b){this.populate_tooltips=function(a){return _deferred_request("/api/v0/tooltip?id="+a)},this.mark_as_read=function(a,b){return _deferred_post_request("/api/v0/mar",{book_id:a,data:b})},this.recommend=function(a,b,c){return _deferred_post_request("/api/v0/recommend",{id:b,type:a,data:c})},this.bookmark=function(a,b,c){return _deferred_post_request("/api/v0/bookmark",{id:b,type:a,data:c})},this.comment=function(a,b,c){return _deferred_post_request("/api/v0/comment",{id:a,type:b,data:c})},this.what_do_you_feel=function(a,b,c){return _deferred_post_request("/api/v0/wdyf",{id:a,type:b,data:c})},this.record_time=function(a,b){return _deferred_post_request("/api/v0/time",{id:a,data:b})},this.rate_this_book=function(a,b){return _deferred_post_request("/api/v0/rate",{id:a,data:b})},this.own_this_book=function(a,b){return _deferred_post_request("/api/v0/own",{book_id:a,data:b})},this.like=function(a,b){return _deferred_post_request("/api/v0/like",{id:a,type:b})},this.dislike=function(a,b){return _deferred_post_request("/api/v0/dislike",{id:a,type:b})},this.post_a_review=function(a,b){return _deferred_post_request("/api/v0/post_review",{book_id:id,data:b})},this.follow=function(a,b,c){return _deferred_post_request("/api/v0/follow",{id:a,type:b,data:c})},this.get_moments=function(){return _deferred_request("/api/v0/moments?id=1")},this.get_friends=function(a){return _deferred_request("/api/v0/friends?id="+a)},this.get_labels=function(){return _deferred_request("/api/v0/labels")},this.get_affiliate_links=function(a,b){return _deferred_request("/api/v0/affiliate_links?title="+a+"&author_name="+b)},this.add_thumbnail=function(a){return _deferred_post_request("/api/v0/add_thumbnail",a)},_deferred_request=function(c){var d=b.defer(),e=function(a){return d.resolve(a.data)},f=function(a){500==a.status&&alert("internal server error")};return a.get(c).then(e,f),d.promise},_deferred_post_request=function(c,d){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert("internal server error")};return a.post(c,d).then(f,g),e.promise}}]);