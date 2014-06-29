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
        input = input.slice(0, 53)+"...";
      }
      return input;
    }
  })
  .filter('reverse', function(){
    return function(input){
      return input.slice().reverse();
    }
  })
  .filter('display_tweet', function(){
    return function(input){
      if(input && input.length > 40){
        input = input.slice(0, 40)+"...";
      }
      return input; 
    }
  })
  .filter('thumb', function(){
    return function(isbn_string){
      var isbn = isbn_string.split(",");
      var thumb = "http://covers.openlibrary.org/b/isbn/"+isbn[0]+"-L.jpg"
      return thumb;
    }
  })
  .filter('is_present', function(){
    return function(input){
      var is_present = false;
      if(input && input != ""){
        is_present = true;
      }
      return is_present;
    }
  });