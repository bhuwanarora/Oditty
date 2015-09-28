homeApp.controller('rdContainerController', ["websiteService", "$scope", '$rootScope', '$document', 'sharedService', function(websiteService, $scope, $rootScope, $document, sharedService){

	$scope.render_page = function(event){
        sharedService.render_page(event);
	}

    $scope.goto_page = function(container){
        window.open(container.full_url, '_blank').focus();
    }

	$scope.remove_container = function(index){
		$rootScope.containers.splice(index, 1);
	}

	var _init = (function(){
		$rootScope.pages = true;
        $rootScope.containers = [];
		var _add_groups = function(){
			var container = {"url": "news_group", "full_url": "news_group"};
			$rootScope.containers.push(container);
		}
		_add_groups();
	}());
}]);

document.onclick = function(e){
  	e = e ||  window.event;
  	var element = e.target || e.srcElement;
    var content = String(element.textContent).replace(/^\s+|\s+$/g, '');
  	if(element.tagName == 'A') {
  		e.preventDefault();
    	return false; // prevent default action and stop event propagation
  	}
  	else if(element.tagName == 'FIGCAPTION'){
  		e.preventDefault();
  		element = element.getElementsByClassName('no_anchor');
  		return false; // prevent default action and stop event propagation
  	}
  	else if(element.classList.contains("no_anchor")){
  		e.preventDefault();
  		return false; // prevent default action and stop event propagation	
  	}
    else if(content == "Go to Book"){
        e.preventDefault();
        return false; // prevent default action and stop event propagation  
    }
};