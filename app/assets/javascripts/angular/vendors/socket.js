angular.module('socket-io', []).
  provider('socketFactory', function () {

    'use strict';

    // when forwarding events, prefix the event name
    var defaultPrefix = 'socket:',
      ioSocket;

    // expose to provider
    this.$get = function ($rootScope, $timeout) {

      var asyncAngularify = function (socket, callback) {
        return callback ? function () {
          var args = arguments;
          $timeout(function () {
            callback.apply(socket, args);
          }, 0);
        } : angular.noop;
      };

      return function socketFactory (options) {
        options = options || {};
        var socket = options.ioSocket || io.connect();
        var prefix = options.prefix || defaultPrefix;
        var defaultScope = options.scope || $rootScope;

        var addListener = function (eventName, callback) {
          socket.on(eventName, callback.__ng = asyncAngularify(socket, callback));
        };

        var addOnceListener = function (eventName, callback) {
          socket.once(eventName, callback.__ng = asyncAngularify(socket, callback));
        };

        var wrappedSocket = {
          on: addListener,
          addListener: addListener,
          once: addOnceListener,

          emit: function (eventName, data, callback) {
            var lastIndex = arguments.length - 1;
            var callback = arguments[lastIndex];
            if(typeof callback == 'function') {
              callback = asyncAngularify(socket, callback);
              arguments[lastIndex] = callback;
            }
            return socket.emit.apply(socket, arguments);
          },

          removeListener: function (ev, fn) {
            if (fn && fn.__ng) {
              arguments[1] = fn.__ng;
            }
            return socket.removeListener.apply(socket, arguments);
          },

          removeAllListeners: function() {
            return socket.removeAllListeners.apply(socket, arguments);
          },

          disconnect: function (close) {
            return socket.disconnect(close);
          },

          // when socket.on('someEvent', fn (data) { ... }),
          // call scope.$broadcast('someEvent', data)
          forward: function (events, scope) {
            if (events instanceof Array === false) {
              events = [events];
            }
            if (!scope) {
              scope = defaultScope;
            }
            events.forEach(function (eventName) {
              var prefixedEvent = prefix + eventName;
              var forwardBroadcast = asyncAngularify(socket, function (data) {
                scope.$broadcast(prefixedEvent, data);
              });
              scope.$on('$destroy', function () {
                socket.removeListener(eventName, forwardBroadcast);
              });
              socket.on(eventName, forwardBroadcast);
            });
          }
        };

        return wrappedSocket;
      };
    };
  });

// angular.module("socket-io",[]).provider("socketFactory",function(){"use strict";var n="socket:";this.$get=["$rootScope","$timeout",function(t,e){var o=function(n,t){return t?function(){var o=arguments;e(function(){t.apply(n,o)},0)}:angular.noop};return function(e){e=e||{};var r=e.ioSocket||io.connect(),u=e.prefix||n,c=e.scope||t,i=function(n,t){r.on(n,t.__ng=o(r,t))},a=function(n,t){r.once(n,t.__ng=o(r,t))},s={on:i,addListener:i,once:a,emit:function(n,t,e){var u=arguments.length-1,e=arguments[u];return"function"==typeof e&&(e=o(r,e),arguments[u]=e),r.emit.apply(r,arguments)},removeListener:function(n,t){return t&&t.__ng&&(arguments[1]=t.__ng),r.removeListener.apply(r,arguments)},removeAllListeners:function(){return r.removeAllListeners.apply(r,arguments)},disconnect:function(n){return r.disconnect(n)},forward:function(n,t){n instanceof Array==!1&&(n=[n]),t||(t=c),n.forEach(function(n){var e=u+n,c=o(r,function(n){t.$broadcast(e,n)});t.$on("$destroy",function(){r.removeListener(n,c)}),r.on(n,c)})}};return s}}]});