homeApp.controller("shelfController",["$scope","$mdBottomSheet","$mdToast","shelfService","$rootScope","sharedService",function(a,b,c,d,e,f){a.listItemClick=function(c){var d=a.items[c];b.hide(d)},a.toggle_bookmark=function(a,b){f.toggle_bookmark(a,b)},a.add_new_label=function(){var b=!1;angular.isUndefined(a.new_label)||""==a.new_label?alert("Enter a valid shelf."):(angular.forEach(e.labels,function(c){c.label_name.toLowerCase()==a.new_label.toLowerCase()&&(b=!0)}),b?(alert("Shelf already exists."),a.new_label=""):d.add_new_label(a.new_label))};!function(){a.toast_position={bottom:!1,top:!0,left:!1,right:!0}}()}]);