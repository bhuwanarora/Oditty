homeApp.service("roomsService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_rooms=function(c){return _deferred_request("/api/v0/get_rooms?skip="+c,b,a)}}]);