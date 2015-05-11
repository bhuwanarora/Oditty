homeApp.service("userService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c){this.recover_password=function(c){return _deferred_request("/api/v0/recover_password?"+c,b,a)},this.get_user=function(){return _deferred_request("/api/v0/user",b,a)},this.get_detailed_info=function(c){return angular.isDefined(c)?_deferred_request("/api/v0/user_profile_info?id="+c,b,a):_deferred_request("/api/v0/user_profile_info",b,a)},this.logout=function(){return _deferred_request("/api/v0/logout",b,a)},this.get_followed_by=function(){return _deferred_request("/api/v0/followed_by",b,a)},this.save_feedback=function(c){return _deferred_post_request("/api/v0/save_feedback",c,b,a)},this.save_user_info=function(c){return _deferred_post_request("/api/v0/save_info",c,b,a)},this.handle_facebook_user=function(c){return _deferred_post_request("/api/v0/fb",c,b,a)},this.handle_google_user=function(c){return _deferred_post_request("/api/v0/google",c,b,a)},this.authenticate=function(c){return _deferred_post_request("/api/v0/authenticate",c,b,a)},this.update_profile=function(c){return _deferred_post_request("/api/v0/profile",c,b,a)},this.get_user_details=function(c){return angular.isDefined(c)?_deferred_request("/api/v0/user_details?id="+c,b,a):_deferred_request("/api/v0/user_details",b,a)},this.get_personal_notifications=function(){return _deferred_request("/api/v0/personal_notifications",b,a)},this.get_notifications=function(c,d,e){return angular.isDefined(d)?angular.isDefined(e)?_deferred_request("/api/v0/notifications?skip_count="+c+"&id="+d+"&debug="+!0,b,a):_deferred_request("/api/v0/notifications?skip_count="+c+"&id="+d,b,a):_deferred_request("/api/v0/notifications?skip_count="+c,b,a)},this.get_influential_books=function(){return _deferred_request("/api/v0/get_influential_books",b,a)},this.get_latest_notification=function(){return _deferred_request("/api/v0/latest_notification",b,a)},this.get_info_data=function(){return _deferred_request("/api/v0/info_data",b,a)},this.get_personal_feed=function(c,d){return d=d||0,angular.isDefined(c)?_deferred_request("/api/v0/notifications?id="+c+"&skip="+d,b,a):_deferred_request("/api/v0/notifications?skip="+d,b,a)},this.get_feed=function(c){return angular.isDefined(c)?_deferred_request("/api/v0/feed_news?id="+c,b,a):_deferred_request("/api/v0/feed_news",b,a)},this.news_visited=function(c){return _deferred_request("/api/v0/news_visited?id="+c,b,a)},this.follow=function(c,d){return _deferred_post_request("/api/v0/follow?id="+c+"&status="+d,b,a)},this.get_blog_feed=function(c,d){return c=c||0,d=d||!1,_deferred_request("/api/v0/feed_blog?skip_count="+c+"&multiple="+d,b,a)},this.get_last_blog=function(){return _deferred_request("/api/v0/last_blog",b,a)},this.get_regions=function(){return _deferred_request("/api/v0/regions",b,a)}}]);