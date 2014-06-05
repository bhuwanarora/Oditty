angular.module('filtersApp', [])
  .filter('integer', function() {
    return function(input) {
    	var output = input;
      if(input >= 1000000){
      	output = (input/1000000).toFixed(0)+"m";
      }
      else if(input >= 1000){
      	output = (input/1000).toFixed(0)+"k";
      }
      return output;
    };
  })
  .filter('rating', function(){
    return function(input){
      var output = input.toFixed(1);
      return output;
    }
  });