var screen_width = screen.width;
var width = screen_width*(1220/1320)-60; //1220
var height = screen.height*(864/1064)-50; //864
var page_numbers = {
  content: 3,
  first_sentence: 4, 
  characters: 5, 
  quotes: 6, 
  themes: 7,
  subject_places: 8,
  movies_based: 9,
  tags: 10,
  readers: 11,
  news: 12,
  reviews: 13,
  discussions: 14,
  about_author: 16
};

bookApp.directive('dock', function($rootScope, $timeout){
  return{
    restrict: 'E',
    compile: function(tElement, tAttrs, transclude){

    },
    controller: function($scope){
      $scope.turn_page = function(page){
        $scope.$emit('turnPage', page);
      }
    },
    templateUrl: "/assets/angular/widgets/partials/dock.html"
  }
});

bookApp.directive('flipbook', function($rootScope, $timeout){
	return{
		restrict: 'E',
    replace: true,
    compile: function(tElement, tAttrs, transclude) {
        var width_edition_factor = width*(10/1320);
        var height_edition_factor = height*(20/1064);
        var image_width = width/2+width_edition_factor;
        var image_height = height+height_edition_factor;

        _set_elements_height = function(){
          var div_height = height - height_edition_factor*6;
          $('.elements').css('height', div_height);
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
          $('.author_thumb').css('width', width/2-width_edition_factor);
          $('.author_thumb').css('height', height - height_edition_factor*6);

          _set_depth();
          _set_elements_height();
        }
        
        _set_post_css = function(){
          $('.front-side').addClass('fixed');
          $('#coverImage').css('width', image_width);
          $('#coverImage').css('height', image_height);
          $('#frontCoverFold').css('width', image_width);
          $('#frontCoverFold').css('height', image_height);

          $('.detailed_book').css('position', 'fixed');

          _set_depth();
          // _set_elements_height();
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
              $comment_box.focus();
            });

            iElement.on('keypress', '.comment_box', function(e){
              if(e.which == 10 || e.which == 13) {
                var $this = $(this);
                var $discussion = $this.parent().parent().parent().parent();
                var review_scope = $discussion.parent().parent().parent().parent().scope();
                var $index = review_scope.$index;
                var val = $this.val();
                var comment = {"comment": val, "timestamp": "Just now", "user": {}};
                var $discussion_index = $discussion.scope().$index;
                var comments = scope.detailed_book.book.reviews[$index].comments[$discussion_index].comments;
                var no_nested_comments = comments == null;
                scope.$apply(function(){
                  if(no_nested_comments){
                    scope.detailed_book.book.reviews[$index].comments[$discussion_index].comments = [comment];
                  }
                  else{
                    scope.detailed_book.book.reviews[$index].comments[$discussion_index].comments.push(comment);
                  }
                });
                var $comment = $($($this.parent()).siblings()[1]);
                $comment.show();
                $this.hide();
              }
            });

            iElement.on('click', '.review .header', function(e){
              var $review_content = $($($(this)).siblings()[0]);
              if($review_content.css("display") == "block"){
                $('.review .content').css('display', 'none');
              }
              else{
                $('.review .content').css('display', 'none');
                $review_content.show(); 
              }
            });

            iElement.on('click', '.like', function(e){
              var $this = $(this);
              if($this.hasClass('like_selected')){
                $this.removeClass('like_selected');
              }
              else{
                var $dislike = $this.siblings('.dislike');
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
                var $like = $this.siblings('.like');
                $this.addClass('dislike_selected');
                $like.removeClass('like_selected');
              }
            });

            iElement.on('click', '.close_book', function(){
              scope.destroy_book();
            });

            iElement.on('focusout', ".detailed_book", function(){
              alert("focusout");
            });

            iElement.on('click', '.write_review', function(){
              $('.reviews .elements').hide();
              $('.reviews .text_editor').show();
              $('.close_review').css('display', 'block');
              $('.write_review').hide();
            });

            iElement.on('click', '.close_review', function(){
              $('.reviews .elements').show();
              $('.reviews .text_editor').hide();
              $('.close_review').hide();
              $('.write_review').css('display', 'block');
            });

            iElement.on('click', '.book_tag', function(){
              var $quotes = $(this).children('.tag_quotes');
              var $loading_icons = $('.loading_icon')
              var $loading_icon = $(this).find('.loading_icon');
              $loading_icons.hide();
              $('.tag_quotes').hide();
              $loading_icon.css('display', 'block');
              // $quotes.css('display', 'block');
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
      }

      _click_outside_close = function(){
        $('.detailed_book').click(function(){
          event.stopPropagation();
        })

        $('.book_footer').click(function(){
          event.stopPropagation();
        })

        $('html').click(function(event){
          $rootScope.show_book = false;
        });
      }

      _set_css = function(){
        var $book = $('.detailed_book');
        $book.show();
        var pos_x = $rootScope.book_x;
        var screen_x = $rootScope.screen_x;
        var total_x = $rootScope.total_x;
        if (pos_x > screen_x){
          var left_margin = pos_x - screen_x;
          $book.css('margin-left', left_margin+"px");
        }
      }

      _add_listeners = function(){
        $rootScope.$on('turnPage', function(event, page){
          var page_number = page_numbers[page];
          $('.detailed_book').turn('page', page_number);
        })
      }

      _init = function(){
        _set_css();
        _add_listeners();
        _click_outside_close();
        $timeout(function(){
          var $book = $('.detailed_book');
          var init_page = $rootScope.initPage;
          $book.turn("page", init_page);
          $($('.review .content')[0]).css('display', 'block');
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