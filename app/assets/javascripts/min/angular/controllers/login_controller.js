websiteApp.controller("loginController",["$scope","$rootScope","websiteService","Facebook","stropheService","$timeout","$cookieStore","LoginConstants","WebsiteUIConstants",function(a,b,c,d,e,f,g,h,i){a.submit=function(b){var c=b.keyCode==i.Enter;c&&a.authenticate(!0),b.stopPropagation()},a.recover_password=function(){delete b.user.error_message;var d=function(c){a.loading_icon=!1,b.user.error_message=c.message,b.user.password=null},e=function(c){a.loading_icon=!1,b.user.error_message=c.message,b.user.password=null};b.user.email?(a.loading_icon=!0,c.recover_password("email="+b.user.email).then(d,e)):b.user.error_message=h.EmailNotPresent},a.authenticate=function(d){var e=b.user.email,g=b.user.password,i=new RegExp("^.{8,}$"),j=new RegExp("^(.)\\1{7,16}$"),k=new RegExp("^.{100,}$");delete b.user.error_message;var l={email:e,password:g,old_user:d};a.loading_icon=!1;var m=function(c){b.user.error_message=c.message,b.user.profile_status=c.profile_status,b.user.logged=!0,b.user.id=c.user_id,a.loading_icon=!1;var d="INFO- Welcome back ",e=notify(b,d,f);a.$on("destroy",function(){f.cancel(e)}),_is_logged_in()},n=function(c){a.loading_icon=!1,b.user.error_message=c.data.message,b.user.password=null};b.user.email?b.user.password?i.test(b.user.password)||d?j.test(b.user.password)&&!d?b.user.error_message=h.ChooseAMoreSecurePassword:k.test(b.user.password)&&!d?b.user.error_message=h.MaximumPasswordLengthError:(a.loading_icon=!0,c.authenticate(l).then(m,n)):b.user.error_message=h.PasswordLengthError:b.user.error_message=h.PasswordNotPresent:b.user.error_message=h.EmailNotPresent},_bind_auth_listeners=function(){a.$on("event:google-plus-signin-success",function(b,d){c.handle_google_user(d),a._init_user()}),a.$on("event:google-plus-signin-failure",function(a,b){}),a.$on("Facebook:statusChange",function(b,c){c.status==h.FacebookLoginStatusCheck&&a.$apply(function(){})})},a.intent_login=function(){a.loading_icon=!0,d.getLoginStatus(function(c){c.status==h.FacebookLoginStatusCheck?(b.logged=!0,a.me()):a.login()})},a.login=function(){d.login(function(b){b.status==h.FacebookLoginStatusCheck&&a.me()})},a.me=function(){d.api("/me",function(d){c.handle_facebook_user(d),b.user=d,b.user.thumb=d.thumb,a._init_user()}),d.api("me/picture?redirect=false",function(a){c.test(a)})},a.fb_books=function(){var a=function(){FB.init({appId:"667868653261167",cookie:!0,status:!0,xfbml:!0})};a(),FB.api("/me/books",function(a){a&&!a.error&&c.handle_facebook_books(a)}),FB.api("/me/books.reads",function(a){a&&!a.error&&c.handle_facebook_books(a)}),FB.api("/me/books.rates",function(a){a&&!a.error&&c.handle_facebook_books(a)}),FB.api("/me/books.quotes",function(a){a&&!a.error&&c.handle_facebook_books(a)}),FB.api("/me/books.wants_to_read",function(a){a&&!a.error&&c.handle_facebook_books(a)})},a._init_user=function(){b.user.profile_status=0,b.user.logged=!0},_is_logged_in=function(){c.get_user().then(function(a){a.logged_in&&(b.user.logged=!0,b.user.id=a.id,c.get_user_details().then(function(a){angular.extend(b.user,a)}),g.put("logged",!0))})},(_init=function(){g.remove("tab"),_is_logged_in(),_bind_auth_listeners()})()}]);