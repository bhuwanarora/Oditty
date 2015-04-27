app.controller("signinController",["$scope","$rootScope","websiteService","Facebook","$timeout","$cookieStore","LoginConstants","WebsiteUIConstants","$location","$routeParams","sharedService",function(a,b,c,d,e,f,g,h,i,j,k,l){a.processAuth=function(b){b.access_token?a.signedIn=!0:"immediate_failed"==b.error&&(gapi.auth.authorize({client_id:"917672049716-pl6i0qbuen1so84tg2b5vijg7qfjhash.apps.googleusercontent.com",scope:"https://www.googleapis.com/auth/plus.login email",immediate:!0},function(a){a.status.signed_in}),a.signedIn=!1)},a.signInCallback=function(b){a.$apply(function(){a.processAuth(b)})},a.renderSignInButton=function(){gapi.signin.render("signInButton",{callback:a.signInCallback,clientid:"917672049716-pl6i0qbuen1so84tg2b5vijg7qfjhash.apps.googleusercontent.com",scope:"https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email",cookiepolicy:"single_host_origin"})},a.submit=function(b){var c=b.keyCode==i.Enter;c&&a.authenticate(!0),b.stopPropagation()},a.recover_password=function(){delete b.user.error_message;var d=function(c){a.loading_icon=!1,b.user.error_message=c.message,b.user.password=null},e=function(c){a.$apply(function(){a.loading_icon=!1,b.user.error_message=c.message,b.user.password=null})};b.user.email?(a.loading_icon=!0,c.recover_password("email="+b.user.email).then(d,e)):b.user.error_message=h.EmailNotPresent},a._on_authenticate=function(){l.set_labels(),l.set_friends(),l.get_news_feed(a)},a.authenticate=function(d){a.show_sign_up=d?!1:!0;var e=b.user.email,g=b.user.password,i=new RegExp("^.{8,}$"),j=new RegExp("^(.)\\1{7,16}$"),k=new RegExp("^.{100,}$");delete b.user.error_message;var l={email:e,password:g,old_user:d};a.loading_icon=!1;var m=function(c){b.user.error_message=c.message,b.user.profile_status=c.profile_status,b.user.logged=!0,b.user.id=c.user_id,a.loading_icon=!1;var d="INFO- Welcome back ",e=notify(b,d,f);a.$on("destroy",function(){f.cancel(e)}),a._is_logged_in(),a._redirect(),a._on_authenticate()},n=function(c){a.loading_icon=!1,b.user.error_message=c.data.message,b.user.password=null};b.user.email?b.user.password?i.test(b.user.password)||d?j.test(b.user.password)&&!d?b.user.error_message=h.ChooseAMoreSecurePassword:k.test(b.user.password)&&!d?b.user.error_message=h.MaximumPasswordLengthError:(a.loading_icon=!0,c.authenticate(l).then(m,n)):b.user.error_message=h.PasswordLengthError:b.user.error_message=h.PasswordNotPresent:b.user.error_message=h.EmailNotPresent},_bind_auth_listeners=function(){a.$on("event:google-plus-signin-success",function(b,d){c.handle_google_user(d),a._init_user()}),a.$on("event:google-plus-signin-failure",function(a,b){}),a.$on("Facebook:statusChange",function(b,c){c.status==h.FacebookLoginStatusCheck&&a.$apply(function(){})})},a.intent_login=function(){a.loading_icon=!0,b.user.fb_connect?(b.logged=!0,a.me()):a.login()},a.login=function(){d.login(function(b){b.status==h.FacebookLoginStatusCheck&&a.me()},{scope:"email"})},a.me=function(){d.api("/me",function(e){c.handle_facebook_user(e).then(function(){a._is_logged_in()}),b.user=e,a._init_user(),d.api("me/picture?redirect=false&type=large",function(a){c.save_user_info(a)})})},a._init_user=function(){b.user.profile_status=0,b.user.logged=!0},a._is_logged_in=function(){var d=function(){c.get_personal_notifications().then(function(a){b.user.push_notifications=[],angular.forEach(a,function(a){var b=angular.extend({id:a[1]},a[0].data);this.push(b)},b.user.push_notifications)})};c.get_user().then(function(e){e.logged_in&&(b.user.logged=!0,b.user.id=e.id,c.get_user_details().then(function(a){angular.extend(b.user,a)}),g.put("logged",!0),a._on_authenticate(),d())})},a._redirect=function(){angular.isDefined(k.url)&&j.path("/user/"+b.user.id+k.url)},_init=function(){a._is_logged_in(),_bind_auth_listeners(),b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1},b.user.fb_connect=!1,d.getLoginStatus(function(a){a.status===h.FacebookLoginStatusCheck&&(b.user.fb_connect=!0)});var c=0,e=500,g=function(b){a.description=[],a.description.splice(0,0,h.Description[b])};angular.forEach(h.Description,function(){0==c?(g(c),c+=1):f(function(){g(c),c+=1},e),e+=1500}),a.renderSignInButton()},_init()}]);