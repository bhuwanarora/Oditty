bookApp.controller('bookAppController', function($scope, $timeout){

	$scope.show_page = function(page_name){
		console.log('page_name', page_name);
		$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
	}

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
		$("#detailedBook").turn("peel", "br");
	}

	$scope.remove_peel = function(){
		$("#detailedBook").turn("peel", false);	
	}

	$scope.zoom_in = function(){
		
	}

	_set_image_sizes = function(){
    	var image_width = $scope.width/2+20;
    	var image_height = $scope.height+40;
    	$('.own-size').css('width', image_width);
    	$('.own-size').css('height', image_height);
    	$('#coverImage').css('width', image_width);
    	$('#coverImage').css('height', image_height);
    	$('#frontCoverFold').css('width', image_width);
    	$('#frontCoverFold').css('height', image_height);
    	$('#backCoverFold').css('width', image_width);
    	$('#backCoverFold').css('height', image_height);
    	$('.depth').css('height', image_height-20);
    }

    _set_div_sizes = function(){
    	var div_height = $scope.height - 80;
    	$('.elements').css('height', div_height);
    	$('.elements').css('overflow-y', "scroll");
    }

    _update_depth = function(book, newPage){
    	var page = book.turn('page'),
		pages = book.turn('pages'),
		depthWidth = 16*Math.min(1, page*2/pages);

		newPage = newPage || page;

		if (newPage>3){
			$('#detailedBook .p2 .depth').css({
				width: depthWidth,
				left: 20 - depthWidth
			});
		}
		else{
			$('#detailedBook .p2 .depth').css({width: 0});
		}

		depthWidth = 16*Math.min(1, (pages-page)*2/pages);

		if (newPage<pages-3){
			$('#detailedBook .p17 .depth').css({
				width: depthWidth,
				right: 20 - depthWidth
			});
		}
		else{
			$('#detailedBook .p17 .depth').css({width: 0});
		}
    }

    _init_turnjs = function(){
		$timeout(function(){
			_set_image_sizes();
			_set_div_sizes();
			$("#detailedBook").turn({
				width: $scope.width,
				height: $scope.height,
				page: 1,
				// autoCenter: true,
				when: {
					turning: function(event, page, pageObject) {
						var book = $(this),
							currentPage = book.turn('page'),
							pages = book.turn('pages');

						_update_depth(book, page);
			
						if (page>=2){
							if(!$('#detailedBook .p2').hasClass('fixed')){
								$('#detailedBook .p2').addClass('fixed');
							}
						}
						else{
							$('#detailedBook .p2').removeClass('fixed');
						}

						if (page<book.turn('pages')){
							if(!$('#detailedBook .p17').hasClass('fixed')){
								$('#detailedBook .p17').addClass('fixed');
							}
						}
						else{
							$('#detailedBook .p17').removeClass('fixed');
						}

						
					},
					turned: function(event, page, view){
						var book = $(this),
						pages = book.turn('pages');

						_update_depth(book);

						if (page==2 || page==3) {
							book.turn('peel', 'br');
						}

						// book.turn('center');
					}
				}
			});
			$timeout(function(){
				$("#detailedBook").turn("page", 3);
			}, 500);
			_init_page_bindings();
		}, 100);
    }

    _resize_viewport = function(){
	    var width = $(window).width(),
	        height = $(window).height(),
	        options = $('#detailedBook').turn('options');

	    $('#flipbookViewport').css({
	        width: width,
	        height: height
	    }).zoom('resize');
    }

    _init_viewport_change_handle = function(){
    	$(window).resize(function() {
	        _resize_viewport();
	    }).bind('orientationchange', function() {
	        _resize_viewport();
	    });
    }

    _init_page_bindings = function(){
		$scope.page_numbers = {
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

		$('#firstSentence').on('click', function(){
			var page_name = "first_sentence";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#characters').on('click', function(){
			var page_name = "characters";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#quotes').on('click', function(){
			var page_name = "quotes";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);	
		});

		$('#themes').on('click', function(){
			var page_name = "themes";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#subjectPlaces').on('click', function(){
			var page_name = "subject_placces";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#moviesBased').on('click', function(){
			var page_name = "movies_based";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#tags').on('click', function(){
			var page_name = "tags";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#reviews').on('click', function(){
			var page_name = "reviews";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#readers').on('click', function(){
			var page_name = "readers";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#discussions').on('click', function(){
			var page_name = "discussions";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#news').on('click', function(){
			var page_name = "news";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

		$('#aboutAuthor').on('click', function(){
			var page_name = "about_author";
			$("#detailedBook").turn("page", $scope.page_numbers[page_name]);
		});

    }

    _init_keyboard_bindings = function(){
    	$(window).bind('keydown', function(e){
	        if (e.keyCode==37)
	            $('#detailedBook').turn('previous');
	        else if (e.keyCode==39)
	            $('#detailedBook').turn('next');
	             
	    });
    }

    _init_zoom_viewport = function(){
    	$("#flipbookViewport").zoom({
			flipbook: $("#detailedBook")
		});
		$('#flipbookViewport').bind('zoom.tap', _zoomTo);
		console.log("zoom initialised");
		// $("#newsElement").turn("zoomIn");
    }

    _zoomTo = function(){
        setTimeout(function() {
            if ($('#flipbookViewport').data().regionClicked) {
                $('#flipbookViewport').data().regionClicked = false;
            } else {
                if ($('#flipbookViewport').zoom('value')==1) {
                    $('#flipbookViewport').zoom('zoomIn', event);
                } else {
                    $('#flipbookViewport').zoom('zoomOut');
                }
            }
        }, 1);
    }

	_init = function(){
		$scope.width = screen.width-100;
		$scope.height = screen.height-200;
		_init_turnjs();
		_init_keyboard_bindings();
	}

	_init();

});