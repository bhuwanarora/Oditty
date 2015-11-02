var homeApp = angular.module('homeApp', ['ngAnimate', 'ngMaterial', 'ngMessages', 'duScroll', 'ngRoute', 'monospaced.mousewheel', 'appConstants', 'timer', 'duScroll', 'filtersApp', 'angular.filter', 'angular-parallax', 'ui.router', 'ngCookies', 'ngSanitize', 'facebook', 'ngMockE2E']);

homeApp.config(["FacebookProvider", "facebookAppId", function(FacebookProvider, facebookAppId){
    var myAppId = facebookAppId;
    FacebookProvider.init(myAppId);
  }
]);

homeApp.run(["$rootScope", "$location", "$cookieStore", "$cookies", "$http", "$state", function($rootScope, $location, $cookieStore, $cookies, $http, $state){
    var unauthenticated_user = getCookie("logged") == "";
    if(unauthenticated_user){
        var closed_urls = ($location.$$absUrl.indexOf("signup") < 0) && ($location.$$absUrl.indexOf("book") < 0) && ($location.$$absUrl.indexOf("author") < 0) && ($location.$$absUrl.indexOf("communities") < 0) && ($location.$$absUrl.indexOf("home") < 0) && ($location.$$absUrl.indexOf("room") < 0) && ($location.$$absUrl.indexOf("news") < 0) && ($location.$$absUrl.indexOf("news_group") < 0) && ($location.$$absUrl.indexOf("filters") < 0) && ($location.$$absUrl.indexOf("games") < 0) && ($location.$$absUrl.indexOf("publisher") < 0) && ($location.$$absUrl.indexOf("search") < 0) && ($location.$$absUrl.indexOf("profile") < 0) && ($location.$$absUrl.indexOf("quiz") < 0) && ($location.$$absUrl.indexOf("spaces") < 0) && ($location.$$absUrl.indexOf("journey") < 0) && ($location.$$absUrl.split("/")[3] != "") && ($location.$$absUrl.indexOf("products") < 0) ;
        var personal_profile = $location.$$absUrl.split("/")[3] == "profile";
        if(closed_urls || personal_profile){
            // $cookieStore.put('redirect_url', $location.$$absUrl);
            setCookie("redirect_url", $location.$$absUrl);
    		window.location.href = "/signup";
        }
	}
    // $state.go();
    // $route.reload();
    if(window.location.pathname == "/room"){
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.rooms.visit){
                    deleteCookie("continue_to");
                    setCookie("continue_to", $location.absUrl());
                    window.location.href = "/odit_room";
                }
            }
        }
        _handle_todo_update();
    }
    else if(window.location.pathname == "/book"){
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.filters.book){
                    deleteCookie("continue_to");
                    setCookie("continue_to", $location.absUrl());
                    window.location.href = "/odit_book";
                }
            }
        }
        _handle_todo_update();
    }
    else if(window.location.pathname == "/browse"){
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!$scope.todo.home.rooms){
                    deleteCookie("continue_to");
                    setCookie("continue_to", $location.absUrl());
                    window.location.href = "/odit_rooms";
                }
            }
        }
        _handle_todo_update();
    }
    else if(window.location.pathname == "/books"){
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.home.filters){
                    deleteCookie("continue_to");
                    setCookie("continue_to", $location.absUrl());
                    window.location.href = "/odit_filters";
                }
            }
        }
        _handle_todo_update();
    }
    else if(window.location.pathname == "/author"){
        var _handle_todo_update = function(){
            var todo = getCookie("todo");
            if(todo){
                todo = JSON.parse(todo);
                if(!todo.book.author){
                    deleteCookie("continue_to");
                    setCookie("continue_to", $location.absUrl());
                    window.location.href = "/odit_author";
                }
            }
        }

        _handle_todo_update();
    }

}]);

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/;";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function deleteCookie(name){
    setCookie(name, "", -1);
}

var _deferred_request = function(url, $q, $http, service_url){
    var deferred = $q.defer();
    var success_callback = function(result){
        return deferred.resolve(result.data); 
    }
    var error_callback = function(reason){
        if(reason.status == 500){
            alert("Something went wrong. If you're already Logged in. Try Logging out and Log in again.");
        }
    }
    if(angular.isDefined(service_url)){
        // $http.defaults.headers.config.withCredentials = true;
        $http.get(service_url + url, {"withCredentials": true}).then(success_callback, error_callback);
    }
    else{
        $http.get(url).then(success_callback, error_callback);
    }
    return deferred.promise;   
}



function detect_browser(){
    var alert_message = "Currently this browser is not supported. Please use Chrome for a better experience.";
    if(navigator.userAgent.indexOf("Chrome") != -1 ){
        
    }
    else if(navigator.userAgent.indexOf("Opera") != -1 ){
        alert(alert_message);
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ){
          
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){
        alert(alert_message); 
    }  
    else{
        alert(alert_message);
    }
}

var _deferred_post_request = function(url, params, $q, $http, service_url){
    var deferred = $q.defer();
    var success_callback = function(result){
        return deferred.resolve(result.data); 
    }
    var error_callback = function(reason){
        console.debug("error_callback service", reason);
        if(reason.status == 500){
            alert("Something went wrong. Our developers are working on this error.");
        }
        else if(reason.status == 403){
            // window.location.href = "/signup";
            console.debug("403 authenticate");
            return deferred.reject(reason);
        }
    }
    if(angular.isDefined(service_url)){
        $http.post(service_url + url, params).then(success_callback, error_callback);
    }
    else{
        $http.post(url, params).then(success_callback, error_callback);
    }
    return deferred.promise;
}

detect_browser();

JSON.flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}