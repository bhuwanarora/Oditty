websiteApp.directive('track', function($rootScope){
	return{
		restrict: 'A',
		link: function(scope, element, attrs){
			element.bind('mouseleave', function(event){
				_record_details(event)
			})

			element.bind('mouseenter', function(event){
				_record_details(event)
			})

			element.bind('click', function(event){
				_record_details(event)
			})

			_record_details = function(event){
				node_name = event.currentTarget.nodeName
				time_stamp = event.timeStamp
				thousand_milliseconds = 100000
				time_stamp = thousand_milliseconds * ((time_stamp % thousand_milliseconds)/thousand_milliseconds)
				action_type = event.type

				if(node_name == "A"){
					node_name = event.currentTarget.href
				}
				id = event.currentTarget.id
				uid = node_name+":"+id
				array = id.split("-")
				containsCategory = array.length > 1
				if(containsCategory){
					category = array[0]
					book_id = array[1]
				}
				else{
					category = ""
					book_id = ""
				}
				data_json = [{"time_stamp": time_stamp, 
							"action_type": action_type, 
							"node_name": node_name, 
							"uid": uid,
							"category": category,
							"book_id": book_id}]
				$rootScope.data = $rootScope.data.concat(data_json)
			}
		}
	}
})


websiteApp.directive('horizontalScroller', function(){
	return{
		restrict: 'E',
		templateUrl: "/assets/angular/widgets/base/horizontal_scroller.html"
	}
})

websiteApp.directive('setFocus', function($timeout, $parse, $rootScope) {
  return {
    link: function(scope, element, attrs) {
      var model = $parse(attrs.setFocus);
      scope.$watch(model, function(value) {
        if(value === true) { 
          $timeout(function() {
            element[0].value = String.fromCharCode($rootScope.keyCode);
            element[0].focus(); 
          });
        }
      });
    }
  };
});

websiteApp.directive('pushNotification', function($rootScope, $parse, $timeout){
	return{
		link: function(scope, element, attrs){
			var model = $parse(attrs.pushNotification);
			scope.$watch(model, function(value){
				if(value == true){
					element[0].innerHTML = $rootScope.message
					$timeout(function(){
						$rootScope.notification_active = false
						$rootScope.message = ""
					}, 10000)
				}
			})
		}
	}
})