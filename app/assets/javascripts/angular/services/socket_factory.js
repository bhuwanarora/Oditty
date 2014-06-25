websiteApp.factory('appSocket', ['socketFactory', function(socketFactory){
  var appSocket = socketFactory();
  appSocket.forward('error');
  return appSocket;
}]);