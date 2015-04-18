;!function(a,b,c){"use strict";b.module("ngCookies",["ng"]).factory("$cookies",["$rootScope","$browser",function(a,d){var e,f={},g={},h=!1,i=b.copy,j=b.isUndefined;return d.addPollFn(function(){var b=d.cookies();e!=b&&(e=b,i(b,g),i(b,f),h&&a.$apply())})(),h=!0,a.$watch(function(){var a,e,h;for(a in g)j(f[a])&&d.cookies(a,c);for(a in f)e=f[a],b.isString(e)?e!==g[a]&&(d.cookies(a,e),h=!0):b.isDefined(g[a])?f[a]=g[a]:delete f[a];if(h)for(a in e=d.cookies(),f)f[a]!==e[a]&&(j(e[a])?delete f[a]:f[a]=e[a])}),f}]).factory("$cookieStore",["$cookies",function(a){return{get:function(c){return(c=a[c])?b.fromJson(c):c},put:function(c,d){a[c]=b.toJson(d)},remove:function(b){delete a[b]}}}])}(window,window.angular);;!function(a,b){"use strict";var c,d={},e={sdk:!1,ready:!1};b.module("facebook",[]).value("settings",d).value("flags",e).provider("Facebook",function(){d.appId=null,this.setAppId=function(a){d.appId=a},this.getAppId=function(){return d.appId},d.locale="en_US",this.setLocale=function(a){d.locale=a},this.getLocale=function(){return d.locale},d.status=!0,this.setStatus=function(a){d.status=a},this.getStatus=function(){return d.status},d.channelUrl=null,this.setChannel=function(a){d.channelUrl=a},this.getChannel=function(){return d.channelUrl},d.cookie=!0,this.setCookie=function(a){d.cookie=a},this.getCookie=function(){return d.cookie},d.xfbml=!0,this.setXfbml=function(a){d.xfbml=a},this.getXfbml=function(){return d.xfbml},this.setAuthResponse=function(a){d.authResponse=a||!0},this.getAuthResponse=function(){return d.authResponse},d.frictionlessRequests=!1,this.setFrictionlessRequests=function(a){d.frictionlessRequests=a},this.getFrictionlessRequests=function(){return d.frictionlessRequests},d.hideFlashCallback=null,this.setHideFlashCallback=function(a){d.hideFlashCallback=a||null},this.getHideFlashCallback=function(){return d.hideFlashCallback},this.setInitCustomOption=function(a,c){return b.isString(a)?(d[a]=c,d[a]):!1},this.getInitOption=function(a){return b.isString(a)&&d.hasOwnProperty(a)?d[a]:!1},d.loadSDK=!0,this.setLoadSDK=function(a){d.loadSDK=!!a},this.getLoadSDK=function(){return d.loadSDK},d.version="v1.0",this.setSdkVersion=function(a){d.version=a},this.getSdkVersion=function(){return d.version},this.init=function(a,c){b.isString(a)&&(d.appId=a),b.isNumber(a)&&(d.appId=a.toString()),b.isObject(a)&&b.extend(d,a),b.isDefined(c)&&(d.loadSDK=!!c)},this.$get=["$q","$rootScope","$timeout","$window",function(a,f,g,h){function i(){this.appId=d.appId}return i.prototype.isReady=function(){return e.ready},i.prototype.login=function(){var c,d,e=a.defer(),f=Array.prototype.slice.call(arguments);return b.forEach(f,function(a,e){b.isFunction(a)&&(c=a,d=e)}),b.isFunction(c)&&b.isNumber(d)&&f.splice(d,1,function(a){g(function(){a&&b.isUndefined(a.error)?e.resolve(a):e.reject(a),b.isFunction(c)&&c(a)})}),this.isReady()?h.FB.login.apply(h.FB,f):g(function(){e.reject("Facebook.login() called before Facebook SDK has loaded.")}),e.promise},b.forEach(["logout","api","ui","getLoginStatus"],function(d){i.prototype[d]=function(){var e,f,i=a.defer(),j=Array.prototype.slice.call(arguments);return b.forEach(j,function(a,c){b.isFunction(a)&&(e=a,f=c)}),b.isFunction(e)&&b.isNumber(f)&&j.splice(f,1,function(a){g(function(){a&&b.isUndefined(a.error)?i.resolve(a):i.reject(a),b.isFunction(e)&&e(a)})}),g(function(){c.promise.then(function(){h.FB[d].apply(FB,j)})}),i.promise}}),i.prototype.parseXFBML=function(){var b=a.defer();return g(function(){c.promise.then(function(){h.FB.XFBML.parse(),b.resolve()})}),b.promise},b.forEach(["subscribe","unsubscribe"],function(d){i.prototype[d]=function(){var e,f,i=a.defer(),j=Array.prototype.slice.call(arguments);return b.forEach(j,function(a,c){b.isFunction(a)&&(e=a,f=c)}),b.isFunction(e)&&b.isNumber(f)&&j.splice(f,1,function(a){g(function(){a&&b.isUndefined(a.error)?i.resolve(a):i.reject(a),b.isFunction(e)&&e(a)})}),g(function(){c.promise.then(function(){h.FB.Event[d].apply(FB,j)})}),i.promise}}),new i}]}).run(["$rootScope","$q","$window","$timeout",function(a,f,g,h){c=f.defer();var i=d.loadSDK;delete d.loadSDK,g.fbAsyncInit=function(){h(function(){if(!d.appId)throw"Missing appId setting.";FB.init(d),e.ready=!0,b.forEach({"auth.login":"login","auth.logout":"logout","auth.prompt":"prompt","auth.sessionChange":"sessionChange","auth.statusChange":"statusChange","auth.authResponseChange":"authResponseChange","xfbml.render":"xfbmlRender","edge.create":"like","edge.remove":"unlike","comment.create":"comment","comment.remove":"uncomment"},function(b,c){FB.Event.subscribe(c,function(c){h(function(){a.$broadcast("Facebook:"+b,c)})})}),a.$broadcast("Facebook:load"),c.resolve(FB)})},function(){var a=document.getElementById("fb-root");return a||(a=document.createElement("div"),a.id="fb-root",document.body.insertBefore(a,document.body.childNodes[0])),a}(),i&&!function(){var a="//connect.facebook.net/"+d.locale+"/sdk.js",b=document.createElement("script");b.id="facebook-jssdk",b.async=!0,-1!==g.location.protocol.indexOf("file:")&&(a="https:"+a),b.src=a,b.onload=function(){e.sdk=!0},document.getElementsByTagName("head")[0].appendChild(b)}()}])}(window,angular);;var timerModule=angular.module("timer",[]).directive("timer",["$compile",function(a){return{restrict:"EA",replace:!1,scope:{interval:"=interval",startTimeAttr:"=startTime",endTimeAttr:"=endTime",countdownattr:"=countdown",finishCallback:"&finishCallback",autoStart:"&autoStart",maxTimeUnit:"="},controller:["$scope","$element","$attrs","$timeout",function(b,c,d,e){function f(){b.timeoutId&&clearTimeout(b.timeoutId)}function g(){void 0!==d.startTime&&(b.millis=new Date-new Date(b.startTimeAttr)),b.maxTimeUnit&&"day"!==b.maxTimeUnit?"second"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3),b.minutes=0,b.hours=0,b.days=0,b.months=0,b.years=0):"minute"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4),b.hours=0,b.days=0,b.months=0,b.years=0):"hour"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5),b.days=0,b.months=0,b.years=0):"month"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24%30),b.months=Math.floor(b.millis/36e5/24/30),b.years=0):"year"===b.maxTimeUnit&&(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24%30),b.months=Math.floor(b.millis/36e5/24/30%12),b.years=Math.floor(b.millis/36e5/24/365)):(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24),b.months=0,b.years=0),b.secondsS=1===b.seconds?"":"s",b.minutesS=1===b.minutes?"":"s",b.hoursS=1===b.hours?"":"s",b.daysS=1===b.days?"":"s",b.monthsS=1===b.months?"":"s",b.yearsS=1===b.years?"":"s",b.secondUnit=function(a,c){return 1===b.seconds?a?a:"second":c?c:"seconds"},b.minuteUnit=function(a,c){return 1===b.minutes?a?a:"minute":c?c:"minutes"},b.hourUnit=function(a,c){return 1===b.hours?a?a:"hour":c?c:"hours"},b.dayUnit=function(a,c){return 1===b.days?a?a:"day":c?c:"days"},b.monthUnit=function(a,c){return 1===b.months?a?a:"month":c?c:"months"},b.yearUnit=function(a,c){return 1===b.years?a?a:"year":c?c:"years"},b.sseconds=b.seconds<10?"0"+b.seconds:b.seconds,b.mminutes=b.minutes<10?"0"+b.minutes:b.minutes,b.hhours=b.hours<10?"0"+b.hours:b.hours,b.ddays=b.days<10?"0"+b.days:b.days,b.mmonths=b.months<10?"0"+b.months:b.months,b.yyears=b.years<10?"0"+b.years:b.years}"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),b.autoStart=d.autoStart||d.autostart,c.append(0===c.html().trim().length?a("<span>{{millis}}</span>")(b):a(c.contents())(b)),b.startTime=null,b.endTime=null,b.timeoutId=null,b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>=0?parseInt(b.countdownattr,10):void 0,b.isRunning=!1,b.$on("timer-start",function(){b.start()}),b.$on("timer-resume",function(){b.resume()}),b.$on("timer-stop",function(){b.stop()}),b.$on("timer-clear",function(){b.clear()}),b.$on("timer-reset",function(){b.reset()}),b.$on("timer-set-countdown",function(a,c){b.countdown=c}),b.start=c[0].start=function(){b.startTime=b.startTimeAttr?new Date(b.startTimeAttr):new Date,b.endTime=b.endTimeAttr?new Date(b.endTimeAttr):null,b.countdown||(b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>0?parseInt(b.countdownattr,10):void 0),f(),h(),b.isRunning=!0},b.resume=c[0].resume=function(){f(),b.countdownattr&&(b.countdown+=1),b.startTime=new Date-(b.stoppedTime-b.startTime),h(),b.isRunning=!0},b.stop=b.pause=c[0].stop=c[0].pause=function(){var a=b.timeoutId;b.clear(),b.$emit("timer-stopped",{timeoutId:a,millis:b.millis,seconds:b.seconds,minutes:b.minutes,hours:b.hours,days:b.days})},b.clear=c[0].clear=function(){b.stoppedTime=new Date,f(),b.timeoutId=null,b.isRunning=!1},b.reset=c[0].reset=function(){b.startTime=b.startTimeAttr?new Date(b.startTimeAttr):new Date,b.endTime=b.endTimeAttr?new Date(b.endTimeAttr):null,b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>0?parseInt(b.countdownattr,10):void 0,f(),h(),b.isRunning=!1,b.clear()},c.bind("$destroy",function(){f(),b.isRunning=!1}),b.countdownattr?(b.millis=1e3*b.countdownattr,b.addCDSeconds=c[0].addCDSeconds=function(a){b.countdown+=a,b.$digest(),b.isRunning||b.start()},b.$on("timer-add-cd-seconds",function(a,c){e(function(){b.addCDSeconds(c)})}),b.$on("timer-set-countdown-seconds",function(a,c){b.isRunning||b.clear(),b.countdown=c,b.millis=1e3*c,g()})):b.millis=0,g();var h=function(){b.millis=new Date-b.startTime;var a=b.millis%1e3;return b.endTimeAttr&&(b.millis=b.endTime-new Date,a=b.interval-b.millis%1e3),b.countdownattr&&(b.millis=1e3*b.countdown),b.millis<0?(b.stop(),b.millis=0,g(),void(b.finishCallback&&b.$eval(b.finishCallback))):(g(),b.timeoutId=setTimeout(function(){h(),b.$digest()},b.interval-a),b.$emit("timer-tick",{timeoutId:b.timeoutId,millis:b.millis}),void(b.countdown>0?b.countdown--:b.countdown<=0&&(b.stop(),b.finishCallback&&b.$eval(b.finishCallback))))};(void 0===b.autoStart||b.autoStart===!0)&&b.start()}]}}]);"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports=timerModule);
