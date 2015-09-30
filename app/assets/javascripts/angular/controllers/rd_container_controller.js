homeApp.controller('rdContainerController', ["websiteService", "$scope", '$rootScope', '$document', 'sharedService', '$timeout', function(websiteService, $scope, $rootScope, $document, sharedService, $timeout){

	$scope.render_page = function(event){
        sharedService.render_page(event);
	}

    $scope.goto_page = function(container){
        window.open(container.full_url, '_blank').focus();
    }

	$scope.remove_container = function(index){
        delete $rootScope.containers[index];
        $timeout(function(){
            $rootScope.containers.splice(index, 1);
        }, 100);
	}

    var _go_fullscreen = function(){
        var elem = document.documentElement;
        if(elem.requestFullscreen){
            elem.requestFullscreen();
        }
        else if(elem.msRequestFullscreen){
            elem.msRequestFullscreen();
        }
        else if(elem.mozRequestFullScreen){
            elem.mozRequestFullScreen();
        }
        else if(elem.webkitRequestFullscreen){
            elem.webkitRequestFullscreen();
        }
    }

	var _init = (function(){
		$rootScope.pages = true;
        $rootScope.containers = [];
		var _add_groups = function(){
            var containers = [{"url": "rooms", "full_url": "rooms", "header": "Rooms"}, {"url": "news_group", "full_url": "news_group", "header": "News Group"}, {"url": "books", "full_url": "books", "header": "Books"}, {"url": "spaces", "full_url": "spaces", "header": "Spaces"}];
            $rootScope.containers = containers.sample_range(2);
        }
        
        // _go_fullscreen();
		_add_groups();
	}());
}]);

document.onclick = function(e){
  	e = e ||  window.event;
  	var element = e.target || e.srcElement;
    var content = String(element.textContent).replace(/^\s+|\s+$/g, '');

  	if(element.tagName == 'A') {
      if(!element.classList.contains("anchor")){
    		e.preventDefault();
      	return false;
      }
  	}
  	else if(element.tagName == 'FIGCAPTION'){
  		e.preventDefault();
  		element = element.getElementsByClassName('no_anchor');
  		return false;
  	}
  	else if(element.classList.contains("no_anchor")){
  		e.preventDefault();
  		return false;
  	}
    else if(content == "Go to Book"){
        e.preventDefault();
        return false;
    }
};

String.prototype.toCamel = function(){
    return this.replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');});
};

Array.prototype.sample_range = function(n) {
    var sample = [];
    for(var i=0;i<n;i++) {
        sample = sample.concat(this.splice(Math.random()*this.length,1));
    }
    return sample;
};