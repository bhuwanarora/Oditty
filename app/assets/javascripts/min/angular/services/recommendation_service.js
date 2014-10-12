websiteApp.service("recommendationService",["$http","$q","$rootScope","WebsiteUIConstants",function(a,b,c,d){this.get_recommendations=function(){var a=angular.toJson(c.filters);return _deferred_request("/api/v0/recommendations?count=5&id="+c.user.id+"&q="+a)},this.get_random_books=function(){return _deferred_request("/api/v0/random_books")},this.get_grid_books=function(){return _deferred_request("/api/v0/grid")},this.get_book_lists=function(){return _deferred_request("/api/v0/book_lists")},this.push_recommendations=function(){return _deferred_request("/api/v0/push_recommendations")},this.get_filters=function(){return _deferred_request("/api/v0/filters")},this.get_genres=function(a){return _deferred_request("/api/v0/genres?"+a)},this.get_countries=function(a){return _deferred_request("/api/v0/countries?"+a)},this.get_time_groups=function(){return _deferred_request("/api/v0/times")},this.get_read_times=function(){return _deferred_request("/api/v0/read_times")},this.get_labels=function(a){return _deferred_request(angular.isDefined(a)?"/api/v0/labels?id="+a:"/api/v0/labels")},_deferred_request=function(c){var e=b.defer(),f=function(a){return e.resolve(a.data)},g=function(a){$rootscope.user.loading=!1,500==a.status&&alert(d.ServerError)};return a.get(c).then(f,g),e.promise}}]);