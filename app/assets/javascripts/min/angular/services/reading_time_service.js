homeApp.service("readingTimeService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_read_times=function(){return _deferred_request("/api/v0/read_times",b,a)}}]);