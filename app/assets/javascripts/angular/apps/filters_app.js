angular.module('filtersApp', [])
  .filter('integer', function() {
    return function(input) {
    	var output = input;
      if(angular.isDefined(input)){
        if(input >= 1000000){
        	output = (input/1000000).toFixed(0)+"m";
        }
        else if(input >= 1000){
        	output = (input/1000).toFixed(0)+"k";
        }
      }
      else{
        output = 0;
      }
      return output;
    };
  })
  .filter('rating', function(){
    return function(input){
      if(angular.isDefined(input)){
        var output = input.toFixed(1);
      }
      return output;
    }
  })
  .filter('book_title', function(){
    return function(input){
      if(angular.isDefined(input)){
        if(input.length > 55){
          input = input.slice(0, 53)+"...";
        }
      }
      return input;
    }
  })
  .filter('published_year', function(){
    return function(input){
      var inputs = input.split(" ");
      var input = inputs[inputs.length-1];
      input = parseInt(input);
      var old_english_literature = input > 658 && input < 1100;
      var middle_english_literature = input > 1100 && input < 1500;
      var english_renaissance = input > 1500 && input < 1660;
      var neo_classical_period = input > 1660 && input < 1798;
      var romanticism = input > 1798 && input < 1837;
      var victorian_literature = input > 1837 && input < 1901;
      var modernism = input > 1901 && input < 1939;
      var post_modern_literature = input > 1939 && input < 2000;
      var twentieth_century_literature = input > 2000 && input < 2014;
      if(old_english_literature){
        output = "Old English Literature";
      }
      else if(middle_english_literature){
        output = "Middle English Literature";
      }
      else if(english_renaissance){
        output = "English Renaissance";
      }
      else if(neo_classical_period){
        output = "Neo Classical Period";
      }
      else if(romanticism){
        output = "Romanticism";
      }
      else if(victorian_literature){
        output = "Victorian Literature";
      }
      else if(modernism){
        output = "Modernism";
      }
      else if(post_modern_literature){
        output = "Post Modern Literature";
      }
      else if(twentieth_century_literature){
        output = "20th Century Literature";
      }
      else{
        output = "Invalid";
      }
      return output;
    }
  })
  .filter('page_count', function(){
    return function(input){
      var output = "-"+input+" pages";
      if(angular.isUndefined(input) || input == 0){
        output = ""  
      }
      return output;
    }
  })
  .filter('message', function(){
    return function(input){
      if(input.length > 55){
        // input = input.slice(0, 53)+"...";
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
      if(input && input.length > 70){
        input = input.slice(0, 70)+"...";
      }
      return input; 
    }
  })
  .filter('thumb', function(){
    return function(isbn_string){
      if(isbn_string){
        var isbn = isbn_string.split(",");
        var thumb = "http://covers.openlibrary.org/b/isbn/"+isbn[0]+"-L.jpg"
        return thumb;
      }
    }
  })
  .filter('medium_thumb', function(){
    return function(isbn_string){
      if(isbn_string){
        var isbn = isbn_string.split(",");
        var thumb = "http://covers.openlibrary.org/b/isbn/"+isbn[0]+"-M.jpg"
        return thumb;
      }
    }
  })
  .filter('small_thumb', function(){
    return function(isbn_string){
      if(isbn_string){
        var isbn = isbn_string.split(",");
        var thumb = "http://covers.openlibrary.org/b/isbn/"+isbn[0]+"-S.jpg"
        return thumb;
      }
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