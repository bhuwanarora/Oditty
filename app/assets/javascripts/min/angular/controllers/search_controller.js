homeApp.controller("searchController",["$scope","searchService","$location",function(a,b,c){a.query_search=function(c){b.raw(c).then(function(b){if(a.search_results=b,a.did_you_mean=!1,angular.forEach(b,function(b){b.fuzzy&&(a.did_you_mean=!0)}),a.did_you_mean){var d={name:"Did you mean",labels:[]};a.search_results.splice(0,0,d)}var d={name:"Show all results",show_all:!0,labels:[],search_text:c};a.search_results.push(d)})},a.show_all_results=function(c,d){b.raw(c,d).then(function(b){a.all_results=b})},a.on_select=function(a){if(angular.isDefined(a)){var b=a.labels.indexOf("Book")>=0,c=a.labels.indexOf("Author")>=0,d="";b?d="/book?q="+a.id:c?d="/author?q="+a.id:a.show_all&&(d="/search?q="+a.search_text),""!=d&&(window.location.href=d)}},a.reload_results=function(a){switch(a){case"Book":break;case"Author":break;case"Community":break;case"Blog":break;case"Person":break;case"News":}};!function(){var b=function(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b=new RegExp("[\\?&]"+a+"=([^&#]*)"),c=b.exec(location.search);return null===c?"":decodeURIComponent(c[1].replace(/\+/g," "))};a.info.mobile_search=!0,a.search_results=[];var d=/[?&]([^=#]+)=([^&#]*)/g,e=d.exec(c.absUrl()),f=c.$$absUrl.indexOf("search")>=0;if(angular.isDefined(e)&&null!=e&&f){var g=b("q"),h=b("type");a.show_all_results(g,h),a.display_results_for=g}}()}]);