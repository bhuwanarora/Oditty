app.service("websiteService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(c){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert(d.ServerError)};return a.get(c).then(f,g),e.promise},f=function(c,e){var f=b.defer(),g=function(a){return f.resolve(a.data)},h=function(a){if(500==a.status)alert(d.ServerError);else if(403==a.status)return f.reject(a)};return a.post(c,e).then(g,h),f.promise};this.recover_password=function(a){return e("/api/v0/recover_password?"+a)},this.fb_books_map=function(a){return e("/api/v0/fb_books_map?id="+a)},this.handle_facebook_books=function(a){return f("/api/v0/fb_books",a)},this.get_user=function(){return e("/api/v0/user")},this.logout=function(){return e("/api/v0/logout")},this.save_user_info=function(a){return f("/api/v0/save_info",a)},this.handle_facebook_user=function(a){return f("/api/v0/fb",a)},this.handle_google_user=function(a){return f("/api/v0/google",a)},this.authenticate=function(a){return f("/api/v0/authenticate",a)},this.get_user_details=function(a){return e(angular.isDefined(a)?"/api/v0/user_details?id="+a:"/api/v0/user_details")}}]);