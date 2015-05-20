angular.module('filtersApp', [])
        .filter('integer', function() {
    return function(input) {
    	   var output = input;
            if(angular.isDefined(input) && input != null){
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
    .filter('first_isbn', function(){
      return function(input){
        var output = "";
        if(angular.isDefined(input)){
          isbn = input.split(",");
          output = isbn[0];
        }
        return output;
      }
    })
    .filter('search_item_type', function(){
        return function(input){
            var output = ""
            if(angular.isDefined(input)){
                var book_label = input.labels.indexOf("Book") >= 0;
                var author_label = input.labels.indexOf("Author") >= 0;
                if(book_label){
                    output = "Book";
                }
                else if(author_label){
                    output = "Author"
                }
            }
            return output;
        }
    })
    .filter('default_profile', function(){
      return function(input){
        var output = input;
        if(angular.isUndefined(input) || (input == "") || (input == null)){
          output = "http://www.sessionlogs.com/media/icons/defaultIcon.png";
        }
        return output;
      }
    })
    .filter('first_two', function(){
        return function(input){
            if(angular.isDefined(input)){
                input = input.slice(0, 2);
            }
            return input;
        }
    })
    .filter('flipkart_title', function(){
        return function(input){
            var output = input.replace(/the/gi, "")
                              .replace(/with/gi, "")
                              .toLowerCase();
            output = output.replace(/ /gi, "-");
            return output;
        }
    })
    .filter('category_group', function(){
        return function(books, category){
            output = []
            var _category_has_book = function(book){
                var has_book = false;
                if(book.root_category.length > 0){
                    angular.forEach(book.root_category, function(base_category){
                        if(base_category.name == category.name){
                            has_book = true;
                        }
                    });
                }
                return has_book;
            }

            angular.forEach(books, function(book){
                if(_category_has_book(book)){
                    this.push(book);
                }
            }, output);
            return output;
        }
    })
    .filter('trending_name', function(){
        return function(input){
            if(angular.isDefined(input)){
                input = "#"+input.replace(" ", "")
            }
            return input;
        }
    })
    .filter('reduced_label', function(){
        return function(input){
            if(angular.isDefined(input) && input.length > 20){
                input = input.slice(0, 20)+"...";
            }
            return input;
        }
    })
    .filter('first_name', function(){
        return function(input){
            if(angular.isDefined(input)){
                input = input.split(" ")[0];
            }
            return input;
        }
    })
    .filter('reduced_title', function(){
        return function(input){
            if(angular.isDefined(input)){
                if(input != null && input.length > 28){
                    input = input.slice(0, 25)+"...";
                }
            }
            return input;
        }
    })
    .filter('reduced_news_title', function(){
        return function(input){
            if(angular.isDefined(input)){
                if(input != null && input.length > 53){
                    input = input.slice(0, 50)+"...";
                }
            }
            return input;
        }
    })
    .filter('reduced_summary', function(){
        return function(input){
            if(angular.isDefined(input)){
                if(input != null && input.length > 303){
                    input = input.slice(0, 300)+"...";
                }
            }
            return input;
        }
    })
  .filter('compressed_filter', function(){
    return function(input){
      if(angular.isDefined(input)){
        if(input != null && input.length > 7){
          input = input.slice(0, 7)+"..";
        }
      }
      return input;
    }
  })
  .filter('author_thumb', function(){
    return function(input){
      var output = "";
      if(angular.isDefined(input) && input){
        output = "http://rd-authors.readersdoor.netdna-cdn.com/"+input+"/M.png"
      }
      return output;
    };
  })
  .filter('choose_medium_thumb', function() {
    return function(input){
      var output = "";
      if(angular.isDefined(input) && input){
        var external_thumb = angular.isDefined(input.external_thumb) && input.external_thumb != null;
        if(external_thumb){
          output = input.external_thumb;
        }
        else{
          if(input.isbn){
            var isbn = input.isbn.split(",");
            output = "http://rd-images.readersdoor.netdna-cdn.com/"+isbn[0]+"/M.jpg";
          }

        }
      }
      return output;
    };
  })
  .filter('summary', function() {
    return function(input) {
      var output = input;
      if(angular.isDefined(input) && input != "" && input != null){
        output = "<span><b>"+input[0]+"</b></span><span class='light_grey_color'>"+input.substring(1, 80)+"</span><span>"+input.substring(80, input.length)+"</span>"
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
        output = "<span>&nbsp;</span>";
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
        if(input.length > 50){
          input = input.slice(0, 47)+"...";
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
      if(input && input.length > 100){
        input = input.slice(0, 97)+"...";
      }
      return input; 
    }
  })
  .filter('large_thumb', function(){
    return function(input){
      var output = "";
      if(angular.isDefined(input) && input){
        var external_thumb = angular.isDefined(input.external_thumb) && input.external_thumb != null;
        if(external_thumb){
          output = input.external_thumb;
        }
        else{
          if(input.isbn){
            var isbn = input.isbn.split(",");
            output = "http://rd-images.readersdoor.netdna-cdn.com/"+isbn[0]+"/L.jpg"
          }
        }
      }
      return output;
    };
  })
  .filter('medium_thumb', function(){
    return function(isbn_string){
      var output = "";
      if(isbn_string){
        var isbn = isbn_string.split(",");
        angular.forEach(isbn, function(value){
          output = "http://rd-images.readersdoor.netdna-cdn.com/"+value+"/M.jpg";
        });
        return output;
      }
    }
  })
  .filter('small_thumb', function(){
    return function(isbn_string){
        var output = ""
        if(isbn_string){
            var isbn = isbn_string.split(",");
            angular.forEach(isbn, function(value){
            var img = new Image();
            img.src = "http://rd-images.readersdoor.netdna-cdn.com/"+value+"/S.jpg";
            // debugger
                output = img.src;
            if(img.height > 20 && output == ""){
            }
        });
        return output;
      }

    }
  })
    .filter('cdn_image', function(){
        return function(id, type){
            var output = "";
            if(id){
                output = "http://rd-images.readersdoor.netdna-cdn.com/"+id+"/"+type+".png";
            }
            return output;
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
  .filter('html', function($sce){
    return function(input){
      return $sce.trustAsHtml(input);
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
  })
  .filter('timestamp', function(){
    return function(utcSeconds){
      var date = new Date(0);
      return date.setUTCSeconds(utcSeconds);
    }
  })
  .filter('initial', function(){
    return function(input){
      try{
        var output = input.name.charAt(0);
      }
      catch(err){
        var output = "X";
      }
      return output;
    }
  })
  .filter('web_header', function(){
    return function(input){
      if(angular.isDefined(input.name)){
        input = input.name.split(" ")[0];
        if(angular.isDefined(input) || input == ""){
          var output = "";
          for(var i=0; i<input.length; i++){
            var character = input.charAt(i);
            output = output + "<span>"+character+"</span>";
          }
        }
        else{
          var output = "<span>r</span><span>e</span><span>a</span><span>d</span><span>e</span><span>r</span><span>'</span><span>s</span>";
        }
      }
      else{
        var output = "<span>r</span><span>e</span><span>a</span><span>d</span><span>e</span><span>r</span><span>'</span><span>s</span>";
      }
      output = output + "<span>&nbsp;</span><span>d</span><span>o</span><span>o</span><span>r</span>";
      console.error(output);
      return output;
    }
  });