homeApp.controller("shelfController",["$scope","$mdBottomSheet","$mdToast","shelfService","$rootScope","sharedService",function(a,b,c,d,e,f){a.listItemClick=function(c){var d=a.items[c];b.hide(d)},a.toggle_bookmark=function(b,c){f.toggle_bookmark(b,c,a.bookmark_object)},a.add_new_label=function(b){var c=!1;angular.isUndefined(a.new_label)||""==a.new_label?alert("Enter a valid shelf."):(angular.forEach(e.labels,function(b){b.label_name.toLowerCase()==a.new_label.toLowerCase()&&(c=!0)}),c?(alert("Shelf already exists."),a.new_label=""):d.add_new_label(a.new_label,b).then(function(b){angular.isUndefined(a.labels)&&(a.labels=[]),a.labels.push(b)}))},a.toggle_shelves=function(){a.show_all=!a.show_all};(function(){a.toast_position={bottom:!1,top:!0,left:!1,right:!0}})()}]);