homeApp.service("networkService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){var e=function(c){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){500==a.status&&alert(d.ServerError)};return a.get(c).then(f,g),e.promise};this.get_followers=function(){return e("/api/v0/followers")},this.get_users_followed=function(){return e("/api/v0/users_followed")}}]);