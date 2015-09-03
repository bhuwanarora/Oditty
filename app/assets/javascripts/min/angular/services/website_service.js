homeApp.service("websiteService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_testimonials=function(c){return _deferred_request("/api/v0/get_testimonials?skip="+c,b,a)},this.add_testimonial=function(c){return _deferred_request("/api/v0/add_testimonial?data="+c,b,a)},this.save_ad=function(c){return _deferred_post_request("/api/v0/save_ad",c,b,a)},this.recover_password=function(c){return _deferred_request("/api/v0/recover_password?"+c,b,a)},this.add_video=function(c,d){return _deferred_request("/api/v0/add_video?id="+c+"&url="+d,b,a)},this.add_videos=function(c){return _deferred_request("/api/v0/add_videos?id="+c,b,a)},this.fb_books_map=function(c){return _deferred_request("/api/v0/fb_books_map?id="+c,b,a)},this.handle_facebook_books=function(c){return _deferred_post_request("/api/v0/fb_books",c,b,a)},this.get_user=function(){return _deferred_request("/api/v0/user",b,a)},this.logout=function(){return _deferred_request("/api/v0/logout",b,a)},this.save_user_info=function(c){return _deferred_post_request("/api/v0/save_info",c,b,a)},this.handle_facebook_user=function(c){return _deferred_post_request("/api/v0/fb",c,b,a)},this.handle_facebook_likes=function(c){return _deferred_post_request("/api/v0/fb_likes",c,b,a)},this.handle_google_user=function(c){return _deferred_post_request("/api/v0/google",c,b,a)},this.authenticate=function(c){return _deferred_post_request("/api/v0/authenticate",c,b,a)},this.get_user_details=function(c){return angular.isDefined(c)?_deferred_request("/api/v0/user_details?id="+c,b,a):_deferred_request("/api/v0/user_details",b,a)},this.get_personal_notifications=function(){return _deferred_request("/api/v0/personal_notifications",b,a)},this.set_like_info=function(c){return _deferred_post_request("/api/v0/set_like_info",c,b,a)},this.get_community_videos=function(c){return _deferred_request("/api/v0/get_community_videos?id="+c,b,a)}}]);