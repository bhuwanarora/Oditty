bookApp.directive('flipbook', function($rootScope, $timeout){
	return{
		restrict: 'E',
		link: function(scope, element, attr){
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

		    // Why this?  Chrome has the fault:
			// http://code.google.com/p/chromium/issues/detail?id=128488
			_is_chrome = function() {
				return navigator.userAgent.indexOf('Chrome')!=-1;
			}

			_init_turnjs = function(){
				$("#detailedBook").turn({
					width: scope.width,
					height: scope.height,
					page: 1,
					duration: 500,
					acceleration: !_is_chrome(),
					// elevation: 50,
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
						}
					}
				});
				$('.recommendations').hide();
				$('#flipbookViewport').show();
				$timeout(function(){
					var init_page = $rootScope.initPage;
					$("#detailedBook").turn("page", init_page);
				}, 1000);
				_init_page_bindings();
		    }

		    _init_page_bindings = function(){
				scope.page_numbers = {
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

				// $('#firstSentence').on('click', function(){
				// 	var page_name = "first_sentence";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#characters').on('click', function(){
				// 	var page_name = "characters";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#quotes').on('click', function(){
				// 	var page_name = "quotes";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);	
				// });

				// $('#themes').on('click', function(){
				// 	var page_name = "themes";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#subjectPlaces').on('click', function(){
				// 	var page_name = "subject_placces";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#moviesBased').on('click', function(){
				// 	var page_name = "movies_based";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#tags').on('click', function(){
				// 	var page_name = "tags";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#reviews').on('click', function(){
				// 	var page_name = "reviews";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#readers').on('click', function(){
				// 	var page_name = "readers";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#discussions').on('click', function(){
				// 	var page_name = "discussions";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#news').on('click', function(){
				// 	var page_name = "news";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

				// $('#aboutAuthor').on('click', function(){
				// 	var page_name = "about_author";
				// 	$("#detailedBook").turn("page", scope.page_numbers[page_name]);
				// });

		    }

			scope.show_page = function(page_name){
				console.log('page_name', page_name);
				$("#detailedBook").turn("page", scope.page_numbers[page_name]);
			}

			scope.is_even = function(index){
				var isEven = false;
				if(index%2==0){
					isEven = true;
				}
				return isEven;
			}

			scope.is_image = function(type){
				var isImage = false;
				if(type=="img"){
					isImage = true;
				}
				return isImage;
			}

			scope.peel = function(){
				$("#detailedBook").turn("peel", "br");
			}

			scope.remove_peel = function(){
				$("#detailedBook").turn("peel", false);	
			}

			scope.zoom_in = function(){
				
			
			}

			scope.destroy_book = function(event){
				// $('#flipbookViewport').hide();
				// $('#detailedBook').turn('destroy');
				event.stopPropagation();
				// alert("destroy triggered");
				// $().css('white-space', 'nowrap');
			}

			scope.share_quote = function(){
				console.log("share_quote");
			}

			_init_turnjs();

		},
		controller: function($scope){
			_set_image_sizes = function(){
				var width_edition_factor = $scope.width*(20/1320)
				var height_edition_factor = $scope.height*(40/1064)
		    	var image_width = $scope.width/2+width_edition_factor;
		    	var image_height = $scope.height+height_edition_factor;
		    	$('.own-size').css('width', image_width);
		    	$('.own-size').css('height', image_height);
		    	$('#coverImage').css('width', image_width);
		    	$('#coverImage').css('height', image_height);
		    	$('#frontCoverFold').css('width', image_width);
		    	$('#frontCoverFold').css('height', image_height);
		    	$('#backCoverFold').css('width', image_width);
		    	$('#backCoverFold').css('height', image_height);
		    	$('.depth').css('height', image_height-height_edition_factor/2);
		    	height_edition_factor = height_edition_factor*2;
		    	var div_height = $scope.height - height_edition_factor;
		    	$('.elements').css('height', div_height);
		    	$('.elements').css('overflow-y', "scroll");
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

		    _init_keyboard_bindings = function(){
		    	$(window).bind('keydown', function(e){
			        if (e.keyCode==37){
			            $('#detailedBook').turn('previous');
			        }
			        else if (e.keyCode==39){
			            $('#detailedBook').turn('next');
			        }
			             
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
				$scope.width = screen.width*(1220/1320); //1220
				$scope.height = screen.height*(864/1064); //864
				_init_keyboard_bindings();
				_set_image_sizes();
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
		link: function(scope, element, attr){
			scope.show_nested_discussion = function(){
				var discussion_id = scope.discussion.id;
			}

			scope.show_comment_box = function(){
				scope.comment_box = true;
				//focus the input box
			}
		},
		controller: function($scope){
			_init = function(){
				$scope.comment_box = false;
			}

			$scope.is_even = function(index){
				var isEven = false;
				if(index%2==0){
					isEven = true;
				}
				return isEven;
			}

			_init();
		},
		templateUrl: "/assets/angular/widgets/partials/book/discussion.html"
	}
});