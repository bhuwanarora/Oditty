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
  .filter('choose_medium_thumb', function() {
    return function(input) {
      var external_thumb = angular.isDefined(input.external_thumb) && input.external_thumb != null;
      if(external_thumb){
        output = input.external_thumb;
      }
      else{
        if(input.isbn){
          var isbn = input.isbn.split(",");
          output = "http://covers.openlibrary.org/b/isbn/"+isbn[0]+"-M.jpg"
        }
      }
      return output;
    };
  })
  .filter('summary', function() {
    return function(input) {
      var output = input;
      if(angular.isDefined(input) && input != "" && input != null){
        output = "<span><b>"+input[0]+"</b></span><span>"+input.substring(1, input.length)+"</span>"
      }
      return output;
    };
  })
  .filter('header_title', function(){
    return function(input){
      output = input;
      if(angular.isUndefined(input) || input == ""){
        output = "Recommendations";
      }
      return output;
    }
  })
  .filter('heading', function(){
    return function(input){
      var output = input;
      if(angular.isDefined(input)){
        if(input.length > 40){
          input = input.slice(0, 37)+"...";
        }
        input = input.split(" ");
        output = "";
        for(var i=0; i<input.length; i++){
          var value = input[i];
          output = output + "<span><b>"+value[0]+"</b><span>"+value.substring(1, value.length)+"</span> "
        }
      }
      return output;
    }
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
  .filter('book_tag', function(){
    return function(input){
      if(angular.isDefined(input)){
        if(input.length > 28){
          input = input.slice(0, 25)+"...";
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
      var output = input;
      if(angular.isDefined(input)){
        output = input.slice().reverse();
      }
      return output;
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
  .filter('thumb_backup', function(){
    return function(input){
      var output = input;
      if(angular.isUndefined(input) || input == "" || input == null){
        output = "assets/profile_pic.jpeg"
      }
      return output;
    }
  })
  .filter('blob_backup', function(){
    return function(input){
      var output = input.thumb;
      if(angular.isUndefined(output) || output == "" || output == null){
        output = input.thumb_blob;
        if(angular.isUndefined(output)){
          output = "assets/profile_pic.jpeg"
        }
      }
      return output;
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