homeApp.controller("signupController",["$scope","$rootScope","Facebook","$timeout","$cookieStore","LoginConstants","WebsiteUIConstants","$location","$routeParams","websiteService","$mdSidenav",function(a,b,c,d,e,f,g,h,i,j,k){a.close_signup_options=function(){k("signup").toggle()},a.submit=function(b){var c=b.keyCode==g.Enter;c&&a.authenticate(!0),b.stopPropagation()},a.recover_password=function(){var c=function(c){a.loading_icon=!1,a.user.error_message=c.message,b.user.password=null},d=function(c){a.$apply(function(){a.loading_icon=!1,a.user.error_message=c.message,b.user.password=null})};b.user.email?(a.loading_icon=!0,j.recover_password("email="+b.user.email).then(c,d)):a.user.error_message=f.EmailNotPresent},a.authenticate=function(c){c?a.show_sign_up=!1:a.show_sign_up=!0;var d=b.user.email,g=b.user.password,h=new RegExp("^.{8,}$"),i=new RegExp("^(.)\\1{7,16}$"),k=new RegExp("^.{100,}$"),m={email:d,password:g,old_user:c},n=function(c){b.user=c.user,e.put("user",c.user),a._init_user(),l(),a.info.hide_signin=!0},o=function(c){a.loading_icon=!1,a.user.error_message=c.data.message,b.user.password=null};b.user.email?b.user.password?h.test(b.user.password)||c?i.test(b.user.password)&&!c?a.user.error_message=f.ChooseAMoreSecurePassword:k.test(b.user.password)&&!c?a.user.error_message=f.MaximumPasswordLengthError:(a.loading_icon=!0,j.authenticate(m).then(n,o)):a.user.error_message=f.PasswordLengthError:a.user.error_message=f.PasswordNotPresent:a.user.error_message=f.EmailNotPresent},a.intent_login=function(){a.loading_icon=!0,b.user.fb_connect?(b.logged=!0,a.me()):a.login()},a.login=function(){c.login(function(b){b.status==f.FacebookLoginStatusCheck&&a.me()},{scope:"email"})},a.me=function(){deleteCookie("redirect_url"),setCookie("redirect_url",h.$$absUrl),c.api("/me",function(c){angular.isUndefined(b.user)&&(b.user={}),j.handle_facebook_user(c).then(function(c){b.user=angular.extend(b.user,c),a._init_user(),l()}),b.user=angular.extend(b.user,c)})};var l=function(){var a=getCookie("redirect_url");1==b.user.login_count?a="/customise":(!a||a.indexOf("signup")>0)&&(a="/home"),window.location.href=a};a._init_user=function(){b.user.logged=!0,setCookie("logged",!0,31),setCookie("logged",b.user.id,31)},a._is_logged_in=function(){j.get_user().then(function(c){c.logged_in&&(b.user.logged=!0,b.user.id=c.id,j.get_user_details().then(function(a){angular.extend(b.user,a)}),a._init_user())})};(function(){b.user={books:{bookmarked:[],read:[]},authors:{bookmarked:[],follow:[]},readers:{follow:[]},logged:!1},a.$on("Facebook:statusChange",function(a,b){FB.logout()})})()}]);