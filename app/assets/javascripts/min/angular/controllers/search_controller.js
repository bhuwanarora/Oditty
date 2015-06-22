homeApp.controller("searchController",["$scope","searchService","$location",function(a,b,c){a.query_search=function(c){c.length>2?(a.info.loading=!0,params={q:c,count:4},b.raw(params).then(function(b){if(delete a.info.search_results,a.info.loading=!1,a.did_you_mean=!1,angular.forEach(b,function(b){b.fuzzy&&(a.did_you_mean=!0),b.first_name&&(b.name=b.first_name+" "+b.last_name)}),a.info.search_results=b,a.did_you_mean){var d={name:"Did you mean",labels:[]};a.info.search_results.splice(0,0,d)}if(b.length>0){var d={name:"Show all results",show_all:!0,labels:[],search_text:c};a.info.search_results.push(d)}})):a.info.search_results=[]},a.get_default_results=function(c,d){(angular.isUndefined(c)||""==c)&&(angular.isUndefined(a.top_searches)?b.get_top_searches().then(function(b){a.info.search_results=b,a.top_searches=b}):a.info.search_results=a.top_searches),d.stopPropagation()},a.on_select=function(b){if(delete a.info.search_results,angular.isDefined(b)){var c=b.labels.indexOf("Book")>=0,d=b.labels.indexOf("Author")>=0,e="User"==b.labels,f="Blog"==b.labels,g="News"==b.labels,h="Community"==b.labels,i="";c?i="/book?q="+b.id:d?i="/author?q="+b.id:e?i="/profile?q="+b.id:f?i=b.blog_url:g?i="/news?q="+b.id:h?i="/room?q="+b.id:b.show_all&&(i="/search?q="+b.search_text),""!=i&&(window.location.href=i)}};(function(){a.info.mobile_search=!0,a.info.search_results=[]})()}]);