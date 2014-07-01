websiteApp.directive("reader",["$rootScope","widgetService",function(a){return{restrict:"E",scope:{reader:"=data"},controller:["$scope",function(b){b.hover=function(){b.hovered=!0},b.mouseout=function(){b.hovered=!1},b.show_focused_tooltip=function(c){if(a.focused_reader!=b.reader){a.focused_reader=b.reader;var d=c.currentTarget.offsetParent.offsetParent.offsetLeft-c.pageX+c.clientX,e=screen.width-(d+c.currentTarget.offsetParent.scrollWidth),f=d;e>f?e>400?(d=d+c.currentTarget.offsetParent.scrollWidth-c.currentTarget.offsetLeft,a.focused_reader.reposition_tooltip={left:d+"px",top:"60px"}):a.focused_reader.reposition_tooltip={right:"0px",top:"60px"}:f>400?(d=screen.width-d,a.focused_reader.reposition_tooltip={right:d+"px",top:"60px"}):a.focused_reader.reposition_tooltip={left:"0px",top:"60px"}}else a.focused_reader=null;c.stopPropagation()},(_init=function(){b.active_reader_filter=!0})()}],templateUrl:"/assets/angular/widgets/base/reader/reader_widget.html"}}]),websiteApp.directive("focusedReader",["$rootScope","$timeout","widgetService",function(a){return{restrict:"E",controller:["$scope",function(b){b.stop_propagation=function(a){a.stopPropagation()},b.close_focused_tooltip=function(){a.focused_reader=null},b.close_interaction_box=function(){b.focused_reader.interact=!1,b.hash_tags=[]},b.stop_horizontal_scroll=function(a){a.stopPropagation()}}],templateUrl:"/assets/angular/widgets/base/reader/focused_reader.html"}}]),websiteApp.directive("messageBox",function(){return{restrict:"E",controller:["$scope",function(a){a.close_message_box=function(){a.reader.show_message_box=!1}}],templateUrl:"/assets/angular/widgets/base/reader/message_box.html"}}),websiteApp.directive("readerInteract",["websiteService",function(){return{restrict:"E",controller:["$scope",function(a){a.toggle_message_box=function(){a.reader.show_message_box=a.reader.show_message_box?!1:!0}}],templateUrl:"/assets/angular/widgets/base/reader/reader_interact.html"}}]);