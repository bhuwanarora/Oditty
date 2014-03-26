var screen_width = screen.width;
var width = screen_width*(1220/1320); //1220
var height = screen.height*(864/1064); //864
var page_numbers = {
  first_sentence: 4, 
  characters: 5, 
  quotes: 6, 
  themes: 7,
  subject_placces: 8,
  movies_based: 9,
  tags: 10,
  readers: 11,
  news: 12,
  reviews: 13,
  discussions: 14,
  about_author: 15
};

bookApp.directive('flipbook', function($rootScope, $timeout){
	return{
		restrict: 'E',
    replace: true,
    compile: function(tElement, tAttrs, transclude) {
        var width_edition_factor = width*(20/1320)
        var height_edition_factor = height*(40/1064)
        var image_width = width/2+width_edition_factor;
        var image_height = height+height_edition_factor;

        _set_elements_height = function(){
          height_edition_factor = height_edition_factor*2;

          var div_height = height - height_edition_factor;
          $('.elements').css('height', div_height);
          $('.elements').css('overflow-y', "scroll");
        }

        _set_depth = function(){
          $('.depth').css('height', image_height-height_edition_factor/2);
        }

        _set_pre_css = function(){
          $('.own-size').css('width', image_width);
          $('.own-size').css('height', image_height);

          $('.back-side').addClass('fixed');
          $('#backCoverFold').css('width', image_width);
          $('#backCoverFold').css('height', image_height);

          _set_depth();
          _set_elements_height();
        }
        
        _set_post_css = function(){
          $('.front-side').addClass('fixed');
          $('#coverImage').css('width', image_width);
          $('#coverImage').css('height', image_height);
          $('#frontCoverFold').css('width', image_width);
          $('#frontCoverFold').css('height', image_height);

          $('.detailed_book').css('position', 'absolute');

          _set_depth();
          _set_elements_height();
        }

        _update_depth = function(book, newPage){
            var page = book.turn('page'),
          pages = book.turn('pages'),
          depthWidth = 16*Math.min(1, page*2/pages);

          newPage = newPage || page;

          if (newPage>3){
            $('.detailed_book .p2 .depth').css({
              width: depthWidth,
              left: 20 - depthWidth
            });
          }
          else{
            $('.detailed_book .p2 .depth').css({width: 0});
          }

          depthWidth = 16*Math.min(1, (pages-page)*2/pages);

          if (newPage<pages-3){
            $('.detailed_book .p17 .depth').css({
              width: depthWidth,
              right: 20 - depthWidth
            });
          }
          else{
            $('.detailed_book .p17 .depth').css({width: 0});
          }
        }

        return {
          pre: function(scope, iElement, iAttrs, controller) { 
            iElement.on('click', '[data-page]', function(e){
              var page_number = page_numbers[$(e.target).data('page')];
              iElement.turn('page', page_number);
            });

            iElement.on('click', '.post_comment', function(e){
              var $comment = $($(this).parent());
              var $comment_box = $($comment.siblings()[1]);
              $comment.hide();
              $comment_box.show();
            });

            iElement.on('click', '.comment_big_box .cancel', function(e){
              var $comment_box = $($(this)).parent();
              var $comment = $($comment_box.siblings()[1]);
              $comment_box.hide();
              $comment.show();
            });

            iElement.on('click', '.comment_big_box .post', function(e){
              var $comment_box = $($(this)).parent();
              var $comment = $($comment_box.siblings()[1]);
              $comment_box.hide();
              $comment.show();
            });

            iElement.on('click', '.review .header', function(e){
              var $review_content = $($($(this)).siblings()[0]);
              $('.review .content').css('display', 'none');
              $review_content.show();
            });

            iElement.on('click', '.like', function(e){
              var $this = $(this);
              if($this.hasClass('like_selected')){
                $this.removeClass('like_selected');
              }
              else{
                var $dislike = $($(this).siblings()[0]);
                $this.addClass('like_selected');
                $dislike.removeClass('dislike_selected');
              }
            });

            iElement.on('click', '.dislike', function(e){
              var $this = $(this);
              if($this.hasClass('dislike_selected')){
                $this.removeClass('dislike_selected');
              }
              else{
                var $like = $($(this).siblings()[0]);
                $this.addClass('dislike_selected');
                $like.removeClass('like_selected');
              }
            });

            iElement.on('click', '.close_book', function(){
              scope.destroy_book();
            });

            _set_pre_css();
            
          },
          post: function(scope, iElement, iAttrs, controller) {
            iElement.turn({
              width: width,
              height: height,
              when: {
                turning: function(event, page, pageObject){
                  var book = $(this),
                    currentPage = book.turn('page'),
                    pages = book.turn('pages');

                  _update_depth(book, page);
            
                  if (page>=2){
                    if(!$('.detailed_book .p2').hasClass('fixed')){
                      $('.detailed_book .p2').addClass('fixed');
                    }
                  }
                  else{
                    $('.detailed_book .p2').removeClass('fixed');
                  }

                  if (page<book.turn('pages')){
                    if(!$('.detailed_book .p17').hasClass('fixed')){
                      $('.detailed_book .p17').addClass('fixed');
                    }
                  }
                  else{
                    $('.detailed_book .p17').removeClass('fixed');
                  }
                },
                turned: function(event, page, view){
                  var book = $(this),
                  pages = book.turn('pages');

                  _update_depth(book);

                  if (page==2 || page==3) {
                    book.turn('peel', 'br');
                  }
                }
              }
            }).turn('peel','br');
            
            _set_post_css();
          }
        }
    },
    controller: function($scope){
      $scope.is_even = function(index){
        var isEven = false;
        if(index%2==0){
          isEven = true;
        }
        return isEven;
      }

      $scope.is_image = function(type){
        var isImage = false;
        if(type=="img"){
          isImage = true;
        }
        return isImage;
      }

      $scope.peel = function(){
        $(".detailed_book").turn("peel", "br");
      }

      $scope.remove_peel = function(){
        $(".detailed_book").turn("peel", false); 
      }

      $scope.zoom_in = function(){
        
      
      }

      $scope.destroy_book = function(event){
        $rootScope.show_book = false;
        // $('.detailed_book').turn('destroy');
      }

      $scope.share_quote = function(){
        console.log("share_quote");
      }

      _init = function(){
        var $book = $('.detailed_book');
        var pos_x = $rootScope.book_x;
        var screen_x = $rootScope.screen_x;
        if (pos_x > screen_x){
          var left_margin = (pos_x - screen_x)+"px";
          $book.css('margin-left', left_margin);
        }

        $timeout(function(){
          var init_page = $rootScope.initPage;
          $book.turn("page", init_page);
          $($('.review .content')[0]).css('display', 'block');
          console.log(left_margin);
        }, 1000);
      }

      _init();
    },
    templateUrl: "/assets/angular/widgets/partials/book.html"
  }
});

bookApp.directive('discussion', function(){
  return{
    restrict: 'E',
    scope: {"discussion": "=data",
        "index": "=index"},
    compile: function(tElement, tAttrs, transclude) {
      show_nested_discussion = function(){
        var discussion_id = scope.discussion.id;
      }


      return {
        pre: function(scope, iElement, iAttrs, controller) {
          
        },
        post: function(scope, iElement, iAttrs, controller) {
             
        }
      }
    },
    controller: function($scope){
      $scope.is_even = function(index){
        var isEven = false;
        if(index%2==0){
          isEven = true;
        }
        return isEven;
      }

    },
    templateUrl: "/assets/angular/widgets/partials/book/discussion.html"
  }
});