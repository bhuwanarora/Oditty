websiteApp.factory('appSocket', function (socketFactory) {
  var appSocket = socketFactory();
  appSocket.forward('error');
  return appSocket;
});