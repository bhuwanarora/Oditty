homeApp.directive("suggestCommunities",["$rootScope","userService","$timeout",function(a,b,c){return{restrict:"E",controller:["$scope",function(a){var d=function(){a.info.loading=!0;c(function(){b.suggest_communities().then(function(b){a.info.loading=!1,a.suggest_communities=b,a.show_suggestions=!0})},100)};a.toggle_suggestions=function(){a.show_suggestions=!a.show_suggestions},d()}],templateUrl:"/assets/angular/html/home/partials/community_suggestions.html"}}]),homeApp.directive("joinCommunity",["$rootScope","newsService","$mdSidenav",function(a,b,c){return{restrict:"E",scope:{community:"="},controller:["$scope",function(a){var d=function(){return""==getCookie("logged")||null==getCookie("logged")};a.toggle=function(){if(d())c("signup").toggle();else{var e=a.community.id;a.community.status=!a.community.status,b.follow(e,a.community.status)}}}],templateUrl:"/assets/angular/html/home/partials/community.html"}}]);