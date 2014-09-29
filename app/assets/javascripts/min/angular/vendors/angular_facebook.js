!function(a,b){"use strict";var c,d={},e={sdk:!1,ready:!1};b.module("facebook",[]).value("settings",d).value("flags",e).provider("Facebook",[function(){d.appId=null,this.setAppId=function(a){d.appId=a},this.getAppId=function(){return d.appId},d.locale="en_US",this.setLocale=function(a){d.locale=a},this.getLocale=function(){return d.locale},d.status=!0,this.setStatus=function(a){d.status=a},this.getStatus=function(){return d.status},d.channelUrl=null,this.setChannel=function(a){d.channelUrl=a},this.getChannel=function(){return d.channelUrl},d.cookie=!0,this.setCookie=function(a){d.cookie=a},this.getCookie=function(){return d.cookie},d.xfbml=!0,this.setXfbml=function(a){d.xfbml=a},this.getXfbml=function(){return d.xfbml},this.setAuthResponse=function(a){d.authResponse=a||!0},this.getAuthResponse=function(){return d.authResponse},d.frictionlessRequests=!1,this.setFrictionlessRequests=function(a){d.frictionlessRequests=a},this.getFrictionlessRequests=function(){return d.frictionlessRequests},d.hideFlashCallback=null,this.setHideFlashCallback=function(a){d.hideFlashCallback=a||null},this.getHideFlashCallback=function(){return d.hideFlashCallback},this.setInitCustomOption=function(a,c){return b.isString(a)?(d[a]=c,d[a]):!1},this.getInitOption=function(a){return b.isString(a)&&d.hasOwnProperty(a)?d[a]:!1},d.loadSDK=!0,this.setLoadSDK=function(a){d.loadSDK=!!a},this.getLoadSDK=function(){return d.loadSDK},d.version="v2.0",this.setSdkVersion=function(a){d.version=a},this.getSdkVersion=function(){return d.version},this.init=function(a,c){b.isString(a)&&(d.appId=a),b.isNumber(a)&&(d.appId=a.toString()),b.isObject(a)&&b.extend(d,a),b.isDefined(c)&&(d.loadSDK=!!c)},this.$get=["$q","$rootScope","$timeout","$window",function(a,f,g,h){function i(){this.appId=d.appId}return i.prototype.isReady=function(){return e.ready},i.prototype.login=function(){var c,d,e=a.defer(),f=Array.prototype.slice.call(arguments);return b.forEach(f,function(a,e){b.isFunction(a)&&(c=a,d=e)}),b.isFunction(c)&&b.isNumber(d)&&f.splice(d,1,function(a){g(function(){a&&b.isUndefined(a.error)?e.resolve(a):e.reject(a),b.isFunction(c)&&c(a)})}),this.isReady()?h.FB.login.apply(h.FB,f):g(function(){e.reject("Facebook.login() called before Facebook SDK has loaded.")}),e.promise},b.forEach(["logout","api","ui","getLoginStatus"],function(d){i.prototype[d]=function(){var e,f,i=a.defer(),j=Array.prototype.slice.call(arguments);return b.forEach(j,function(a,c){b.isFunction(a)&&(e=a,f=c)}),b.isFunction(e)&&b.isNumber(f)&&j.splice(f,1,function(a){g(function(){a&&b.isUndefined(a.error)?i.resolve(a):i.reject(a),b.isFunction(e)&&e(a)})}),g(function(){c.promise.then(function(){h.FB[d].apply(FB,j)})}),i.promise}}),i.prototype.parseXFBML=function(){var b=a.defer();return g(function(){c.promise.then(function(){h.FB.XFBML.parse(),b.resolve()})}),b.promise},b.forEach(["subscribe","unsubscribe"],function(d){i.prototype[d]=function(){var e,f,i=a.defer(),j=Array.prototype.slice.call(arguments);return b.forEach(j,function(a,c){b.isFunction(a)&&(e=a,f=c)}),b.isFunction(e)&&b.isNumber(f)&&j.splice(f,1,function(a){g(function(){a&&b.isUndefined(a.error)?i.resolve(a):i.reject(a),b.isFunction(e)&&e(a)})}),g(function(){c.promise.then(function(){h.FB.Event[d].apply(FB,j)})}),i.promise}}),new i}]}]).run(["$rootScope","$q","$window","$timeout",function(a,f,g,h){c=f.defer();var i=d.loadSDK;delete d.loadSDK,g.fbAsyncInit=function(){h(function(){if(!d.appId)throw"Missing appId setting.";FB.init(d),e.ready=!0,b.forEach({"auth.login":"login","auth.logout":"logout","auth.prompt":"prompt","auth.sessionChange":"sessionChange","auth.statusChange":"statusChange","auth.authResponseChange":"authResponseChange","xfbml.render":"xfbmlRender","edge.create":"like","edge.remove":"unlike","comment.create":"comment","comment.remove":"uncomment"},function(b,c){FB.Event.subscribe(c,function(c){h(function(){a.$broadcast("Facebook:"+b,c)})})}),a.$broadcast("Facebook:load"),c.resolve(FB)})},function(){var a=document.getElementById("fb-root");return a||(a=document.createElement("div"),a.id="fb-root",document.body.insertBefore(a,document.body.childNodes[0])),a}(),i&&!function(){var a="//connect.facebook.net/"+d.locale+"/sdk.js",b=document.createElement("script");b.id="facebook-jssdk",b.async=!0,-1!==g.location.protocol.indexOf("file:")&&(a="https:"+a),b.src=a,b.onload=function(){e.sdk=!0},document.getElementsByTagName("head")[0].appendChild(b)}()}])}(window,angular);