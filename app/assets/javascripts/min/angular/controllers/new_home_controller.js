homeApp.controller("newHomeController",["$scope","$timeout","SearchUIConstants","ReadTimes","genreService","PopularGenres",function(a,b,c,d,e,f){a._get_genres=function(){angular.isUndefined(a.info.genres)||0==a.info.genres.length?(a.info.genres=[],e.get_genres().then(function(b){angular.forEach(b,function(a){var b=null!=a.status,c=angular.extend(a,{status:b});this.push(c)},a.info.genres)})):a.info.loading=!1},a.show_filter_results=function(){var b="";if(angular.isDefined(a.info.selected_duration)&&null!=a.info.selected_duration){var c="d="+a.info.selected_duration.id;b=c}if(angular.isDefined(a.info.selected_genre)&&null!=a.info.selected_genre){var d="g="+a.info.selected_genre.id;b=""!=b?b+"&"+d:d}""!=b?window.location.href="/filters?"+b:window.location.href="/filters"},a.search_genres=function(b){angular.isDefined(b)&&b.length>2?a.info.loading?a.info.genres=[]:(a.info.loading=!0,e.search_star_genres(b).then(function(b){a.info.loading=!1,a.info.genres=b})):(a.info.loading=!0,a._get_genres())},a.search_reading_time=function(){a.info.loading=!0,a.search_tag.read_time=""},a._get_reading_times=function(){readingTimeService.get_read_times().then(function(b){a.info.read_times=[],angular.forEach(b,function(a){var b={icon2:"icon-clock",type:c.Time,custom_option:!0};b=angular.extend(b,a),this.push(b)},a.info.read_times)})};(function(){a.info.read_times=[],a.info.genres=[],a.info.read_times=d,a.info.genres=f;var c=b(function(){a._get_reading_times(),a._get_genres()},100);a.$on("destroy",function(){b.cancel(c)}),a.filters={other:{}},a.search_tag={}})()}]);