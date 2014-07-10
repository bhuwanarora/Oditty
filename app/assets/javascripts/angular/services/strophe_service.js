websiteApp.service('stropheService', ['$rootScope', function ($rootScope) {
  this.start_connection = function(){
    var on_status = function(status){
      console.log(status, Strophe.Status);
      if(status == Strophe.Status.CONNECTED){
        //query for the roster
        var stanza = new Strophe.Builder("presence");
        console.log("send initial presence...", stanza.tree());
        // debugger
        // var xmp = "";
        this.connection.send(stanza);
        this.connection.addHandler(function(presence){
          return true;
        }, null, "presence");
      }
      return true;
    }
    var jabber_id = $rootScope.user.email.split("@");
    jabber_id[0] = jabber_id[0].concat("@misha-pc");
    var pwd = $rootScope.user.password;
    this.connection = new Strophe.Connection("http://localhost:5280/http-bind");
    this.connection.connect(jabber_id[0], pwd, on_status);
    // this.connection.addTimeHandler(100, send_flood);
    // this.connection.addHandler(on_version, null, "iq", null, "disco-1");
    // this.connection.addHandler(on_iq_version, "jabber:iq:version", "iq", "get");
  }

  this.send_notification = function(message){
    var on_message = function(message){
      console.log("on_message");
      //extract message body
      // display text
      alert("message");
      return true;
    }
    var stanza = new Strophe.Builder("message", {"to": "abclearner2@misha-pc", "type": "notification"})
                  .c("body")
                  .t(message);
    this.connection.addHandler(on_message, null, "message", "notification");
    this.connection.send(stanza);
  }
}]);