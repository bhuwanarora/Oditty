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
  })
  .filter('published_year', function(){
    return function(input){
      var output = "("+input+")";
      return output;
    }
  })
  .filter('page_count', function(){
    return function(input){
      var output = "-"+input+" pages";
      return output;
    }
  })
  .filter('message', function(){
    return function(input){
      if(input.length > 55){
        input = input.slice(0, 53)+"..."
      }
      return input;
    }
  });