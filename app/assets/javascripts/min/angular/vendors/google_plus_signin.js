"use strict";angular.module("directive.g+signin",[]).directive("googlePlusSignin",function(){var a=/\.apps\.googleusercontent\.com$/;return{restrict:"E",template:'<span class="g-signin"></span>',replace:!0,link:function(b,c,d){d.clientid+=a.test(d.clientid)?"":".apps.googleusercontent.com",d.$set("data-clientid",d.clientid);var e={callback:"signinCallback",cookiepolicy:"single_host_origin",requestvisibleactions:"http://schemas.google.com/AddActivity",scope:"https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email",width:"wide"};angular.forEach(Object.getOwnPropertyNames(e),function(a){d.hasOwnProperty(a)||d.$set("data-"+a,e[a])}),d.$observe("language",function(a){window.___gcfg={lang:a?a:"en"}}),function(){var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://apis.google.com/js/client:plusone.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()}}}).run(["$window","$rootScope",function(a,b){a.signinCallback=function(a){a&&a.access_token?b.$broadcast("event:google-plus-signin-success",a):b.$broadcast("event:google-plus-signin-failure",a)}}]);