angular.module('websiteApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/assets/angular/views/book_widget/footer.html',
    "<div class=\"bottom_widget\" ng-click=\"stop_propagation($event)\"><div ng-init=\"setStatus(book.status)\"></div><div class=\"tag_bookmark\"><input placeholder=\"{{label_placeholder}}\" class=\"input_bookmark\" ng-model=\"book.custom_bookmark\" ng-keypress=\"handle_enter($event)\" ng-click=\"show_bookmark_options($event)\"><book-bookmark></book-bookmark></div><label-popup></label-popup></div>"
  );


  $templateCache.put('/assets/angular/views/book_widget/partials/bookmark.html',
    "<div itemscope=\"\" itemtype=\"http://schema.org/BookmarkAction\" class=\"left_action action_button\" ng-click=\"toggle_bookmarked($event)\" ng-class=\"{'left_action_active':book.bookmark_status}\" ng-model=\"book.bookmark_status\" title=\"bookmark\"><tooltip prepend-text=\"Add \" text=\"book.title\" append-text=\" to a shelf.\" position=\"top\"></tooltip><span class=\"icon-bookmark3 table_cell table_cell_icon\"></span><div></div></div>"
  );


  $templateCache.put('/assets/angular/views/book_widget/partials/label_popup.html',
    "<form ng-if=\"book.show_labels\"><div class=\"arrow_down\"></div><ul class=\"label_dropdown scrollbar\" ng-click=\"stop_propagation($event)\" msd-wheel=\"stop_horizontal_scroll($event)\" ng-model=\"book.labels\"><div class=\"icon-close-popup\" ng-click=\"book.show_labels=false;\"></div><li ng-repeat=\"label in book.labels track by $index\" class=\"animate-fast\" title=\"{{label.name | lowercase}}\" ng-click=\"select_label($index);\"><label><span class=\"bookmark_label\"><span>{{label.name | lowercase | reduced_label}}</span></span></label><input type=\"checkbox\" ng-checked=\"label.checked\" ng-value=\"label.name\" class=\"custom_bookmark_radio icon-checkbox-unchecked\"></li><li ng-if=\"book.labels.length == 0\"><span class=\"bookmark_label\">Add a shelf...</span></li></ul></form>"
  );


  $templateCache.put('/assets/angular/views/book_widget/show.html',
    "<div itemscope=\"\" itemtype=\"http://schema.org/Book\" ng-style=\"randomise_position\" class=\"animate-fast widget\"><div ng-model=\"book\" ng-click=\"show_focused_tooltip($event)\" class=\"card animate-slow\"><book-interact data=\"book\" track=\"\"></book-interact><widget-thumb track=\"\" ng-show=\"book.isbn\"></widget-thumb><div class=\"card_summary animate-fast\"><div><tooltip text=\"book.title\" position=\"top\" ng-if=\"!user.show_profile\"></tooltip><b><span class=\"header_font\">{{book.title | reduced_title}}</span></b><br><span ng-show=\"book.author_name\">by {{book.author_name}}</span></div><div ng-if=\"book.isbn\"><tooltip text=\"book.summary\" position=\"bottom\" scroll=\"true\" ng-if=\"!user.show_profile\"></tooltip><span ng-if=\"book.summary\" class=\"normal_text\">{{book.summary | reduced_summary}}</span></div><div ng-if=\"!book.isbn\" class=\"scrollbar summary\" msd-wheel=\"stop_propagation($event)\"><span ng-if=\"book.summary\" class=\"normal_text\">{{book.summary}}</span></div></div></div></div><div class=\"base\" ng-click=\"show_book(3)\"></div>"
  );


  $templateCache.put('/assets/angular/views/book_widget/thumb.html',
    "<div class=\"animate-fast widget_thumb\" ng-class=\"{'widget_thumb_focus': hovered}\" ng-style=\"thumb_style\"></div><div class=\"description\" ng-style=\"random_background\"></div>"
  );


  $templateCache.put('/assets/angular/views/cover/left_panel.html',
    "<div class=\"user_profile\" ng-if=\"user.show_profile\" msd-wheel=\"stop_propagation($event)\"><div ng-include=\"\" src=\"'/assets/angular/views/cover/profile/partials/reader.html'\"></div><div ng-include=\"\" src=\"'/assets/angular/views/cover/profile/partials/personal.html'\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/cover/navbar.html',
    "<div id=\"recommendationFooter\" ng-class=\"{'compact_footer': compact_footer}\"><a class=\"right_links animate-fast\" ng-class=\"{'right_links_shifted': user.show_profile}\" ng-href=\"#user/{{user.id}}/recommendations/books\" ng-if=\"$routeParams.trend_id || $routeParams.grid_id || $routeParams.filter_id || $routeParams.label_id\"><div class=\"link tab active_tab\" title=\"{{main_header}}\"><span ng-bind-html=\"main_header | heading | lowercase\" class=\"table_cell\"></span> <span>&nbsp;&nbsp;</span> <span class=\"table_cell icon-close light_red_color\"></span></div></a><div class=\"shelf_nav_links animate-fast\" ng-class=\"{'shelf_nav_links_shifted': user.show_profile}\"><a class=\"link tab\" title=\"Recommendations\" ng-href=\"#user/{{user.id}}/recommendations/books\" ng-if=\"$routeParams.trend_id || $routeParams.grid_id || $routeParams.filter_id || $routeParams.label_id\" style=\"margin-left:0px\"><span class=\"table_cell\">&nbsp;<b>Recommendations</b></span></a><div ng-class=\"{'inactive':read_selected || bookmark_selected || user.show_profile, \r" +
    "\n" +
    "\t\t                'active_tab':!read_selected && !bookmark_selected && !user.show_profile}\" class=\"link tab\" ng-hide=\"$routeParams.trend_id || $routeParams.grid_id || $routeParams.filter_id || $routeParams.label_id || $routeParams.type == 'profile'\" title=\"{{main_header}}\" style=\"margin-left:0px\" ng-click=\"toggle_recommendations()\"><span ng-if=\"!$routeParams.trend_id && !$routeParams.grid_id && !$routeParams.filter_id && !$routeParams.label_id\" class=\"table_cell\"><span ng-if=\"$routeParams.type == 'books'\">{{recommendations.books.count}}</span> <span ng-if=\"$routeParams.type == 'authors'\">{{recommendations.authors.count}}</span> <span ng-if=\"$routeParams.type == 'readers'\">{{recommendations.readers.count}}</span> <span>&nbsp;<b>Recommendations</b></span></span> </div><div ng-class=\"{'inactive':!bookmark_selected, \r" +
    "\n" +
    "\t\t\t\t\t\t'active_tab':bookmark_selected && !user.show_profile}\" class=\"link tab\" title=\"Books saved\" ng-click=\"toggle_bookmarked($event)\"><span ng-if=\"$routeParams.type == 'books'\" class=\"table_cell\"><span>&nbsp;<b>My Library</b></span></span> <span ng-if=\"$routeParams.type == 'authors'\" class=\"table_cell\"><span>&nbsp;<b>Authors Saved</b></span></span> <span ng-if=\"$routeParams.type == 'profile'\" class=\"table_cell\"><span>&nbsp;<b>{{reader.gender_prefix}} Library</b></span></span></div></div><div class=\"filter_status\"><span class=\"selected_filters\"></span> </div></div>"
  );


  $templateCache.put('/assets/angular/views/cover/profile/name.html',
    "<div ng-if=\"$routeParams.type != 'profile'\"><div class=\"user_name animate-fast\" ng-class=\"{'user_name_shifted': user.show_profile}\" ng-click=\"toggle_profile(user.id, $event)\"><span ng-show=\"user.name\" class=\"capitalise animate-fast\"><b>{{user.name}}</b></span> <span ng-show=\"!user.name\">{{user.email}}</span> <span>&nbsp;</span> <span>{{user.total_count | integer}}</span><span>&nbsp;</span> <span>{{user.book_read_count | integer}}</span> <span class=\"icon-books\"></span> <span>&nbsp;</span> <span>{{user.bookmark_count | integer}}</span> <span class=\"icon-bookmarks\"></span> <span>&nbsp;</span></div></div><div ng-if=\"$routeParams.type == 'profile'\"><div class=\"user_name animate-fast\" ng-class=\"{'user_name_shifted': user.show_profile}\" ng-click=\"toggle_profile(reader.id, $event)\"><span ng-show=\"reader.name\" class=\"capitalise animate-fast\"><b>{{reader.name}}</b></span> <span ng-show=\"!reader.name\">{{reader.email}}</span> <span>&nbsp;</span> <span>{{reader.total_count | integer}}</span><span>&nbsp;</span> <span>{{reader.book_read_count | integer}}</span> <span class=\"icon-books\"></span> <span>&nbsp;</span> <span>{{reader.bookmark_count | integer}}</span> <span class=\"icon-bookmarks\"></span> <span>&nbsp;</span></div></div>"
  );


  $templateCache.put('/assets/angular/views/cover/profile/partials/personal.html',
    "<div ng-if=\"!reader\" class=\"user_profile_block scrollbar\"><div class=\"header\"><b>About {{user.name | first_name}}&nbsp;&nbsp;</b><span class=\"click float_right\" ng-click=\"goto_info_card(0)\">Edit</span></div><div class=\"content\"><div class=\"init_block\"><div><b>{{user.total_count | integer}}</b></div><div>Cookies</div></div><div class=\"init_block\"><div><span><b>{{user.book_read_count | integer}}</b></span> <span class=\"icon-books\"></span></div><div>Books Read</div></div><div class=\"init_block\"><div><span><b>{{user.bookmark_count | integer}}</b></span> <span class=\"icon-bookmarks\"></span></div><div>Books in Shelves</div></div></div><div class=\"content\"><span ng-show=\"user.init_book_read_count\">Reader of {{user.init_book_read_count}}</span><br><span ng-show=\"user.selectedDay\">Birthday: {{user.selectedDay}} {{user.selectedMonth}}</span><br><span ng-show=\"user.last_login\">Last Login: {{user.last_login}}</span></div><div class=\"header\"><b>Likes&nbsp;&nbsp;</b> <span class=\"click float_right\" ng-click=\"edit_genres_like()\">Edit</span></div><div class=\"content\"><div ng-repeat=\"like in user.likes\" class=\"category_block table\"><div class=\"{{like.icon}} table_cell category_icon\"></div><br><div class=\"table_cell\">{{like.name}}</div></div><div ng-show=\"user.likes.length == 0\">This will help us to recommend you better books...</div></div><div class=\"header\"><b>Books that left a mark on you&nbsp;&nbsp;</b> <span class=\"click float_right\" ng-click=\"edit_books_read()\">Edit</span></div><div class=\"content\"><div ng-repeat=\"book in user.influential_books\"><div><b class=\"site_color\">{{book.title}}</b>, Book by {{book.author_name}}</div></div><div ng-show=\"user.influential_books.length == 0\">We will notify you with any activity on these books...</div></div><div class=\"header\"><b>{{user.friends_count}} Friends</b></div><div class=\"friends_grid scrollbar\"><div ng-repeat=\"friend in user.friends\" class=\"friend_block animate-fast\"><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/shared/friend_grid.html'\"></div></div></div><div class=\"content click\" ng-click=\"show_all_friends()\" ng-if=\"!user.all_friends_shown\">Show all friends</div><div class=\"padder content\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/cover/profile/partials/reader.html',
    "<div ng-if=\"reader\" class=\"user_profile_block scrollbar\"><div class=\"header\" ng-show=\"reader.influential_books.length > 0\"><b>Books that left a mark on {{reader.name | first_name}}</b></div><div class=\"block\"><div ng-repeat=\"book in reader.influential_books\"><div><b class=\"site_color\">{{book.title}}</b>, Book by {{book.author_name}}</div></div></div><div class=\"header\"><b>About {{reader.name | first_name}}</b></div><div class=\"content\"><div class=\"init_block\"><div><b>{{reader.total_count | integer}}</b></div><div>Cookies</div></div><div class=\"init_block\"><div><span><b>{{reader.book_read_count | integer}}</b></span> <span class=\"icon-books\"></span></div><div>Books Read</div></div><div class=\"init_block\"><div><span><b>{{reader.bookmark_count | integer}}</b></span> <span class=\"icon-bookmarks\"></span></div><div>Books in Shelves</div></div></div><div class=\"content\"><span ng-show=\"reader.init_book_read_count\">Reader of {{reader.init_book_read_count}}</span><br><span ng-show=\"reader.selectedDay\">Birthday: {{reader.selectedDay}} {{reader.selectedMonth}}</span><br><span ng-show=\"reader.last_login\">Last Login: {{reader.last_login}}</span></div><div class=\"header\" ng-show=\"reader.likes.length > 0\"><b>Likes</b></div><div class=\"content\"><div ng-repeat=\"like in reader.likes\" class=\"category_block table\"><div class=\"{{like.icon}} table_cell category_icon\"></div><br><div class=\"table_cell\">{{like.name}}</div></div></div><div class=\"header\"><b>{{reader.friends_count}} Friends</b></div><div class=\"friends_grid scrollbar\"><div ng-repeat=\"friend in reader.friends\" class=\"friend_block animate-fast\"><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/shared/friend_grid.html'\"></div></div></div><div class=\"content click\" ng-click=\"show_all_friends()\" ng-if=\"!reader.all_friends_shown\">Show all friends</div><div class=\"padder content\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/cover/right_panel.html',
    "<div class=\"feed_group\" ng-if=\"!reader\"><div class=\"notifications\"><div class=\"notification_stable\"><b>News Feed</b></div></div><div ng-include=\"\" src=\"'/assets/angular/views/shared/feed/news.html'\" msd-wheel=\"stop_propagation($event)\" class=\"feed_block notifications\"></div></div><div class=\"feed_group\" ng-if=\"reader\"><div ng-show=\"reader.name\" class=\"notifications\"><div class=\"notification_stable\"><b>{{reader.name | first_name}}'s Timeline</b></div></div><div ng-include=\"\" src=\"'/assets/angular/views/shared/feed/readers.html'\" msd-wheel=\"stop_propagation($event)\" class=\"feed_block\"></div><div ng-include=\"\" src=\"'/assets/angular/views/shared/feed/news.html'\" msd-wheel=\"stop_propagation($event)\" ng-if=\"user.id == 4084079\" class=\"feed_block notifications trending_block\"></div><div ng-if=\"user.id == 4084079\" class=\"notifications\"><div class=\"notification_stable\"><span class=\"click\" ng-click=\"fetch_new_feed()\">Show {{reader.name | first_name}}'s News Feed</span><br><span class=\"click\" ng-click=\"fetch_new_feed(reader.id)\">Show {{reader.name | first_name}}'s Personal Feed</span><br></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/cover/show.html',
    "<div class=\"share_wrapper animate-slow\" ng-style=\"cover_image\" ng-class=\"{'share_wrapper_shifted scrollbar': user.show_profile}\" msd-wheel=\"stop_propagation($event)\"><div class=\"thumb_wrapper animate-fast\" ng-class=\"{'thumb_wrapper_shifted': user.show_profile}\"><img ng-src=\"{{user.thumb | thumb_backup}}\" ng-show=\"!reader\"> <img ng-src=\"{{reader.thumb | thumb_backup}}\" ng-show=\"reader\"></div><div ng-include=\"\" src=\"'/assets/angular/views/cover/left_panel.html'\"></div><div ng-include=\"\" src=\"'/assets/angular/views/cover/right_panel.html'\" ng-if=\"user.show_profile\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/feed/book_timeline.html',
    "<div class=\"scrollbar tweets\" ng-click=\"stop_propagation($event)\"><img ng-src=\"{{focused_book.isbn | thumb}}\" class=\"profile_thumb\"><div class=\"tweet\"><div><b><div>Book Timeline</div></b><div><span class=\"site_color\">{{focused_book.title}}</span> by {{focused_book.author_name}}</div></div><div ng-include=\"\" src=\"'/assets/angular/views/shared/partials/book_info.html'\"></div></div><div class=\"tweet animate-fast\" ng-repeat=\"tweet in focused_book.tweets | reverse\"><div class=\"thumb\"><img ng-src=\"{{tweet.user.thumb | thumb_backup}}\"></div><div class=\"tweet_text\"><b><div ng-bind-html=\"tweet.user.name\"></div></b><timestamp data=\"notification.timestamp\"></timestamp><div ng-bind-html=\"tweet.tag\"></div><div ng-bind-html=\"tweet.message\"></div></div></div><div class=\"tweet animate-fast\">You've reached the end of Book Timeline.</div></div>"
  );


  $templateCache.put('/assets/angular/views/feed/comment_box.html',
    "<div class=\"interaction_box animate-fast\" ng-click=\"stop_propagation($event)\"><div ng-if=\"level1_option || level2_option || selected_interact_book\" class=\"second_input site_color\"><span ng-if=\"show_search || selected_interact_book\"><input set-focus=\"start_searching\" ng-keydown=\"search_interact_books($event)\" ng-model=\"user.interact_book\" placeholder=\"Add the book...\"><div class=\"interaction_box_book_options\"><div ng-repeat=\"item in user.interact_books track by $index\" ng-click=\"handle_interact_book_selection(item)\" ng-class=\"{active:is_current_interact_book($index, item)}\" ng-mouseenter=\"set_current_interact_book($index)\" class=\"option\"><div class=\"title\">{{item.title}}</div><div ng-show=\"item.author_name\">by {{item.author_name}}</div></div><div ng-if=\"user.interact_book.length != 0 && !loading && !selected_interact_book\" class=\"option\">No results found {{selected_interact_book}}</div></div><div class=\"interact_book\" ng-click=\"remove_selected_book()\" ng-model=\"selected_interact_book\" ng-if=\"selected_interact_book\"><b>{{selected_interact_book.title | book_tag}}</b></div></span> <span ng-if=\"level2_option.name\">{{level2_option.name}} {{level2_option.link}}&nbsp;</span> <span>&nbsp;{{level1_option.name}}&nbsp;</span> <span ng-if=\"!level2_option.icon\" class=\"{{level1_option.icon}}\"></span> <span class=\"{{level2_option.icon}}\"></span> <span>-&nbsp;</span></div><div class=\"relative\"><div class=\"interaction_box_options\" ng-if=\"hash_tags\"><div ng-repeat=\"item in hash_tags track by $index\" ng-click=\"handle_selection(item.name)\" ng-class=\"{active:is_current($index, item.name)}\" ng-mouseenter=\"set_current($index)\" class=\"option\"><div class=\"title\">{{item.name}}</div><div ng-show=\"item.author_name\">by {{item.author_name}}</div></div></div><div class=\"interaction_box_options\" ng-if=\"level1_options\"><div ng-repeat=\"option in level1_options\" ng-click=\"select_level1(option, $event)\" ng-if=\"!option.SearchBook\" class=\"option\"><span class=\"{{option.icon}}\"></span> <span>{{option.name}}</span> <span class=\"right_icon {{option.icon2}}\"></span></div></div><div class=\"interaction_box_options interaction_box_options_level2 scrollbar\" ng-if=\"level2_options\"><div ng-repeat=\"option in level2_options\" ng-if=\"!option.SearchBook\" ng-click=\"select_level2(option, $event)\" class=\"option\"><span class=\"{{option.icon}}\"></span> <span>{{option.name}}</span> <span class=\"right_icon {{option.icon2}}\"></span></div></div><span class=\"highlighter\" ng-bind-html=\"user.hash_tagged_comment\"></span> <div class=\"bubble_pointer\"></div><textarea itemprop=\"commentText\" itemtype=\"http://schema.org/UserComments\" set-focus=\"user.interact\" type=\"text\" ng-paste=\"update_hashtagged_comment()\" ng-model=\"user.current_comment\" ng-keydown=\"handle_backspace($event)\" placeholder=\"{{placeholder}}\" class=\"comment_box animate-fast\" ng-keypress=\"handle_hash_tags($event)\" ng-keyup=\"key_up()\" rows=\"1\">\r" +
    "\n" +
    "\t\t</textarea></div><div class=\"interaction_links\"><span class=\"icon-happy interaction_icons\" ng-click=\"show_interaction_options('Emotion', $event)\"></span> <span class=\"icon-feed interaction_icons\" ng-click=\"show_interaction_options('Shout', $event)\"></span>   <button class=\"share_status blue_button\" ng-click=\"share_post()\" ng-disabled=\"!((level1_option && selected_interact_book) || (user.current_comment.length > 0 && !level1_option))\">Share</button> <span class=\"site_color status_message\">{{status_message}}</span></div></div>"
  );


  $templateCache.put('/assets/angular/views/feed/news_feed.html',
    "<div class=\"scrollbar tweets\" check-scroll-bottom=\"get_notifications()\" ng-click=\"stop_propagation($event)\"><div class=\"tweet\"><b><div>News Feed</div></b></div><div ng-repeat=\"notification in news_feed | reverse\" class=\"tweet animate-fast\"><div ng-include=\"\" src=\"'/assets/angular/views/feed/partials/notification_block.html'\"></div></div><div class=\"tweet animate-fast\">You've reached end of the news feed.</div></div>"
  );


  $templateCache.put('/assets/angular/views/feed/partials/notification_block.html',
    "<div class=\"thumb\"><img ng-src=\"{{notification.thumb | thumb_backup}}\"></div><img ng-src=\"{{notification.book.isbn | thumb}}\" class=\"book_thumb\" ng-show=\"notification.book.isbn\"><div class=\"tweet_text\" ng-class=\"{'compressed_tweet_text': notification.book.isbn}\"><b><div class=\"capitalise\" ng-bind-html=\"notification.user.name\"></div></b> <b><a ng-href=\"{{notification.url}}\" target=\"_blank\"><div ng-bind-html=\"notification.title\"></div></a></b><timestamp data=\"notification.timestamp\"></timestamp><div class=\"trending_background site_color\" ng-show=\"notification.title\"><a ng-href=\"#user/{{user.id}}/trending/books/id/{{notification.id}}/name/{{notification.name}}\">Check out books related to <b>{{notification.keywords}}</b></a></div><div ng-bind-html=\"notification.tag\"></div><div ng-bind-html=\"notification.message\"></div><img ng-show=\"notification.large_image\" ng-src=\"{{notification.large_image}}\" class=\"large_thumb\"></div>"
  );


  $templateCache.put('/assets/angular/views/feed/personal_feed.html',
    "<div class=\"scrollbar tweets\" check-scroll-bottom=\"get_notifications(false, user.id)\" ng-click=\"stop_propagation($event)\"><img ng-src=\"{{user.thumb}}\" class=\"profile_thumb\"><div class=\"tweet\"><b><div>Personal Feed</div></b></div><div ng-repeat=\"notification in personal_notifications | reverse\" class=\"tweet animate-fast\"><div ng-include=\"\" src=\"'/assets/angular/views/feed/partials/notification_block.html'\"></div></div><div class=\"tweet animate-fast\">You've reached the end of your personal feed.</div></div>"
  );


  $templateCache.put('/assets/angular/views/feed/readers_timeline.html',
    "<div class=\"scrollbar tweets\" check-scroll-bottom=\"get_notifications(false, reader.id)\" ng-click=\"stop_propagation($event)\"><img ng-src=\"{{reader.thumb}}\" class=\"profile_thumb\"><div class=\"tweet\"><b><div>{{reader.name | first_name}}'s timeline</div></b></div><div ng-repeat=\"notification in readers_notifications | reverse\" class=\"tweet animate-fast\"><div ng-include=\"\" src=\"'/assets/angular/views/feed/partials/notification_block.html'\"></div></div><div class=\"tweet animate-fast\">No new notifications from {{reader.name | first_name}}.</div></div>"
  );


  $templateCache.put('/assets/angular/views/feed/show.html',
    "<div class=\"wrapper animate-slow\" style=\"z-index:12\" ng-click=\"close_interaction_box()\" msd-wheel=\"stop_horizontal_scroll($event)\"><div class=\"interaction_group\"><div class=\"icon-close-popup\" ng-click=\"close_interaction_box();\"></div><div ng-include=\"\" src=\"'/assets/angular/views/feed/comment_box.html'\"></div><div ng-include=\"\" src=\"'/assets/angular/views/feed/book_timeline.html'\" ng-if=\"focused_book\"></div><div ng-include=\"\" src=\"'/assets/angular/views/feed/trending.html'\" ng-if=\"!focused_book && show_feed.trending\"></div><div ng-include=\"\" src=\"'/assets/angular/views/feed/news_feed.html'\" ng-if=\"!focused_book && show_feed.news\"></div><div ng-include=\"\" src=\"'/assets/angular/views/feed/readers_timeline.html'\" ng-if=\"!focused_book && show_feed.readers\"></div><div ng-include=\"\" src=\"'/assets/angular/views/feed/personal_feed.html'\" ng-if=\"!focused_book && show_feed.personal\"></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/feed/trending.html',
    "<div class=\"scrollbar tweets\" check-scroll-bottom=\"get_notifications(true)\" ng-click=\"stop_propagation($event)\"><div class=\"tweet\"><b><div>Trending</div></b></div><div ng-repeat=\"notification in trending_feed | reverse\" class=\"tweet animate-fast\"><div ng-include=\"\" src=\"'/assets/angular/views/feed/partials/notification_block.html'\"></div></div><div class=\"tweet animate-fast\">You've reached end of the trending list.</div></div>"
  );


  $templateCache.put('/assets/angular/views/footer/feedback_popup.html',
    "<div class=\"feedback_popup animate-fast\" ng-if=\"popups.get_feedback\" ng-class=\"{'feedback_box': popups.get_feedback}\"><div class=\"icon-close-popup\" ng-click=\"popups.get_feedback=false;\"></div><div ng-click=\"popups.get_feedback = !popups.get_feedback\" class=\"site_color\"><b>{{feedback_text}}</b></div><div><textarea placeholder=\"Please give your valuable feedback...\" ng-model=\"user.feedback\"></textarea><div class=\"feedback_sumbit blue_button\" ng-click=\"handle_feedback($event)\">Submit</div></div></div><div class=\"feedback floating_icon\"><div ng-click=\"popups.get_feedback = !popups.get_feedback\" class=\"table_cell\"><b>F</b></div></div>"
  );


  $templateCache.put('/assets/angular/views/getting_started/shared/calendar.html',
    "<span><select ng-model=\"selectedYear\" ng-options=\"selectedYear for selectedYear in years\" ng-change=\"date_check()\"><option value=\"\">Year</option></select><select ng-model=\"selectedMonth\" ng-options=\"selectedMonth for selectedMonth in months\" ng-change=\"date_check()\" ng-disabled=\"!selectedYear\"><option value=\"\">Month</option></select><select ng-model=\"selectedDay\" ng-options=\"selectedDay for selectedDay in days\" ng-change=\"date_check(); save_date(selectedYear, selectedMonth, selectedDay);\" ng-disabled=\"!selectedYear || !selectedMonth\"><option value=\"\">Day</option></select></span>"
  );


  $templateCache.put('/assets/angular/views/getting_started/shared/cropme.html',
    "<div ng-show=\"showButton\"><input type=\"file\"><div class=\"cropme-button grey_button\" ng-click=\"browseFiles()\"><b><span ng-if=\"!set\">Upload Profile Picture</span> <span ng-if=\"set\">Change profile Picture</span></b></div><div ng-if=\"error\" class=\"error\">{{error}}</div></div><div ng-show=\"!showButton\" class=\"background\"><div ng-show=\"!showButton\" class=\"profile\"><div class=\"heading\">Crop and Set Profile Photo</div><div class=\"step-2\" ng-show=\"!showButton\" ng-style=\"{'width': img_width + 'px'}\" ng-mousemove=\"mousemove($event)\" ng-mousedown=\"mousedown($event)\" ng-mouseup=\"mouseup($event)\" ng-mouseleave=\"deselect()\" ng-class=\"{'col-resize': colResizePointer}\"><img ng-src=\"{{imgSrc}}\" ng-style=\"{'width': img_width + 'px'}\"><div class=\"overlay-tile\" ng-style=\"{'top': 0, 'left': 0, 'width': xCropZone + 'px', 'height': yCropZone + 'px'}\"></div><div class=\"overlay-tile\" ng-style=\"{'top': 0, 'left': xCropZone + 'px', 'width': widthCropZone + 'px', 'height': yCropZone + 'px'}\"></div><div class=\"overlay-tile\" ng-style=\"{'top': 0, 'left': xCropZone + widthCropZone + 'px', 'right': 0, 'height': yCropZone + 'px'}\"></div><div class=\"overlay-tile\" ng-style=\"{'top': yCropZone + 'px', 'left': xCropZone + widthCropZone + 'px', 'right': 0, 'height':  heightCropZone + 'px'}\"></div><div class=\"overlay-tile\" ng-style=\"{'top': yCropZone + heightCropZone + 'px', 'left': xCropZone + widthCropZone + 'px', 'right': 0, 'bottom': 0}\"></div><div class=\"overlay-tile\" ng-style=\"{'top': yCropZone + heightCropZone + 'px', 'left': xCropZone + 'px', 'width': widthCropZone + 'px', 'bottom': 0}\"></div><div class=\"overlay-tile\" ng-style=\"{'top': yCropZone + heightCropZone + 'px', 'left': 0, 'width': xCropZone + 'px', 'bottom': 0}\"></div><div class=\"overlay-tile\" ng-style=\"{'top': yCropZone + 'px', 'left': 0, 'width': xCropZone + 'px', 'height': heightCropZone + 'px'}\"></div><div class=\"overlay-border\" ng-style=\"{'top': (yCropZone - 2) + 'px', 'left': (xCropZone - 2) + 'px', 'width': widthCropZone + 'px', 'height': heightCropZone + 'px'}\"></div></div><div class=\"cropme-footer\" ng-show=\"!showButton\"><button id=\"cropme-ok\" ng-click=\"ok()\">Set as Profile Photo</button> <button id=\"cropme-cancel\" ng-click=\"cancel()\" class=\"button_effect\">Cancel</button></div></div></div><canvas width=\"{{destinationWidth}}\" height=\"{{destinationHeight}}\" ng-style=\"{'width': width_vh + 'vh', 'height': height_vh + 'vh'}\"></canvas>"
  );


  $templateCache.put('/assets/angular/views/getting_started/shared/invite.html',
    "<script src=\"http://connect.facebook.net/en_US/all.js\"></script><div id=\"fb-root\"></div><div onclick=\"facebook_invite()\" class=\"invite_friends red_button\"><b>Invite Friends</b></div><script type=\"text/javascript\">if (top.location!= self.location)\r" +
    "\n" +
    "{\r" +
    "\n" +
    "top.location = self.location\r" +
    "\n" +
    "}</script>"
  );


  $templateCache.put('/assets/angular/views/getting_started/shared/toggle.html',
    "<div ng-class=\"{'site_color':obj.status}\" class=\"filter toggle_filter inactive_filter\" ng-click=\"toggle()\"><span class=\"{{obj.icon}}\" ng-class=\"{'light_grey_color':!obj.status}\"></span>&nbsp; <span>{{obj.name | uppercase}}</span></div>"
  );


  $templateCache.put('/assets/angular/views/getting_started/show.html',
    "<div ng-if=\"!user.compressed_info\"><div class=\"compressed_info_card animate-fast grey_color\"><div class=\"block\" ng-click=\"edit_genres_like();\" title=\"Edit genres you like\"><span ng-class=\"{'site_color': user.profile_status==1}\"><span class=\"icon-tags\"></span> <span>&nbsp;Genres</span></span></div><div class=\"block\" ng-click=\"edit_books_read();\" title=\"Edit books you have read\"><span ng-class=\"{'site_color': user.profile_status==2}\"><span class=\"icon-books\"></span> <span>&nbsp;Influential Books</span></span></div><div class=\"block\" ng-click=\"goto_info_card(); user.profile_status=3;\" title=\"Invite friends\"><span ng-class=\"{'site_color': user.profile_status==3}\"><span class=\"icon-users\"></span> <span>&nbsp;Barter</span></span></div><div class=\"block\" ng-click=\"goto_info_card(); user.profile_status=0;\" title=\"Edit personal details\"><span ng-class=\"{'site_color': user.profile_status==0}\"><span class=\"icon-cogs\"></span> <span>&nbsp;Settings</span></span></div></div><div class=\"wrapper\" msd-wheel=\"stop_propagation($event);\" ng-click=\"close_edit_profile($event);\" ng-show=\"!user.compressed_info\"><div ng-click=\"stop_propagation($event);\" class=\"info_cards animate-fast\" ng-switch=\"\" on=\"user.profile_status\" ng-model=\"user.profile_status\"><div class=\"icon-close-popup\" ng-click=\"user.compressed_info = true;\"></div><div class=\"profile_status_logo\"></div><div ng-switch-when=\"0\"><div class=\"sub_header\"><b>Tell us about yourself, <span class=\"site_color capitalise\">{{user.name}}</span></b></div><div><input class=\"input_30\" ng-model=\"user.name\" placeholder=\"Enter your name\" spellcheck=\"false\" focus-out=\"set_user_name()\"><input class=\"input_50\" type=\"email\" ng-model=\"user.email\" placeholder=\"Enter your email id\" spellcheck=\"false\" focus-out=\"set_email()\"></div><div class=\"header\"><label for=\"birthday\">Born on</label>&nbsp;&nbsp;<calendar save-date=\"set_date_of_birth()\"></calendar></div><div class=\"header\"><form name=\"gender_form\"><label for=\"gender\">Gender</label>&nbsp;&nbsp;<input type=\"radio\" ng-model=\"user.gender\" value=\"Male\" id=\"male\" ng-change=\"set_gender()\" class=\"custom_radio icon-checkbox-unchecked\">&nbsp;<label for=\"male\">Male&nbsp;&nbsp;&nbsp;</label><input type=\"radio\" ng-model=\"user.gender\" value=\"Female\" id=\"female\" ng-change=\"set_gender()\" class=\"custom_radio icon-checkbox-unchecked\">&nbsp;<label for=\"female\">Female&nbsp;&nbsp;&nbsp;</label><input type=\"radio\" ng-model=\"user.gender\" value=\"Other\" id=\"other\" ng-change=\"set_gender()\" class=\"custom_radio icon-checkbox-unchecked\">&nbsp;<label for=\"other\">Other&nbsp;&nbsp;&nbsp;</label></form></div><div class=\"header\"><form name=\"book_count_form\"><label>I have read</label>&nbsp;&nbsp;<label ng-repeat=\"book_count in book_counts\"><input type=\"radio\" ng-model=\"user.init_book_read_count\" ng-change=\"set_init_book_read_count()\" ng-value=\"book_count.name\" class=\"custom_radio icon-checkbox-unchecked\">&nbsp;{{book_count.name}}&nbsp;&nbsp;&nbsp;</label></form></div><div ng-if=\"user.thumb\"><img ng-src=\"{{user.thumb}}\" class=\"profile_pic\"></div></div><div ng-switch-when=\"1\"><div class=\"sub_header\"><b>Which genres do you like</b></div><div class=\"header\">This will help us to recommend you better books...</div><div class=\"header center scrollbar\" msd-wheel=\"stop_horizontal_scroll($event)\"><div ng-repeat=\"genre in info.genres  | orderBy:genre.name\" class=\"block3\"><toggle data=\"genre\" on-select=\"save_genre(genre)\" on-deselect=\"remove_genre(genre)\"></toggle></div></div></div><div ng-switch-when=\"2\"><div class=\"sub_header\"><b>Add books which've left a mark on you</b></div><div class=\"header\">We will notify you with any activity on these books...</div><input ng-keydown=\"search_info_card($event, 'BOOK')\" ng-model=\"info.search_book\" placeholder=\"Search books...\"><div class=\"scrollbar header\" msd-wheel=\"stop_horizontal_scroll($event)\" check-scroll-bottom=\"get_popular_books()\"><div class=\"book_column\" ng-repeat=\"book in popular_books\" ng-class=\"{'selected': book.status}\" ng-click=\"mark_as_read(book, $event);\"><img ng-src=\"{{book.isbn | small_thumb}}\" class=\"book_thumb\"><div class=\"book_details\"><div><span><b ng-bind-html=\"book.title\"></b></span><br><span ng-show=\"book.author_name\">Book by {{book.author_name}}</span></div><div>&nbsp;</div><div ng-show=\"book.id\" class=\"light_grey_color\"><div ng-show=\"book.status\"><rate data=\"book\"></rate><span class=\"site_color\">Added.</span> <span ng-hide=\"book.user_rating\" class=\"site_color\">Also rate this book.</span></div><div ng-show=\"!book.status\"><span>Add to</span> <span class=\"icon-books\"></span> <span>Books Read</span></div></div></div></div><div class=\"book_column\"><img src=\"assets/loader2.gif\" width=\"20px\" ng-show=\"loading\" class=\"loading_icon\"></div></div></div><div ng-switch-when=\"3\"><div class=\"sub_header\"><b>Share and borrow books from readers in your area <span class=\"red_color\">(Coming Soon)</span>...</b></div><div class=\"header\">Please share your location...</div><div ng-include=\"\" src=\"'/assets/angular/views/getting_started/shared/invite.html'\"></div><map style=\"display:block; height:50vh; width: 101%; margin-top: 10px\"><marker position=\"current\" centered=\"true\"></marker></map></div><div class=\"footer\"><span class=\"prev icon-angle-left grey_button\" ng-click=\"prev_profile_state()\"></span> <span class=\"next icon-angle-right grey_button\" ng-click=\"next_profile_state()\"></span></div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/header/modals/notifications.html',
    "<div class=\"notifications_popup scrollbar\" ng-click=\"stop_horizontal_scroll($event)\" msd-wheel=\"stop_horizontal_scroll($event)\"><div class=\"relative_position\"><div class=\"notification_stable animate-fast\"><b>Notifications</b></div></div><div class=\"relative_position\"><div class=\"notification_stable animate-fast light_grey\"><div class=\"float_left instruct_block site\"><span class=\"icon-book\"></span></div><div class=\"block\"><div class=\"notification_message\"><b>Welcome to Reader's Door</b></div><div class=\"notification_message\">Explore and find your next precious read like never before.</div></div></div></div><div class=\"relative_position\"><div class=\"notification_stable animate-fast light_grey\"><div class=\"float_left instruct_block green\"><span class=\"icon-user22\"></span></div><div class=\"block\"><div class=\"notification_message\"><b>Help us recommend you better</b></div><div class=\"notification_message\">Rate, tag books, create virtual book shelves and tell us what you have read.</div></div></div></div><div class=\"relative_position\"><div class=\"notification_stable animate-fast light_grey\"><div class=\"float_left instruct_block purple_background\"><span class=\"icon-cool2\"></span></div><div class=\"block\"><div class=\"notification_message\"><b>Use arrow keys to scroll through books</b></div><div class=\"notification_message\"><span class=\"icon-arrow-left keyboard_keys\"></span> <span class=\"icon-arrow-right keyboard_keys\"></span></div></div></div></div><div class=\"relative_position\"><div class=\"notification_stable animate-fast light_grey\"><div class=\"float_left instruct_block red\"><span class=\"icon-bars\"></span></div><div class=\"block\"><div class=\"notification_message\"><b>Explore books on trending topics</b></div></div></div></div><div class=\"relative_position\"><div class=\"notification_stable animate-fast\">You've reached the end of notifications.</div></div></div>"
  );


  $templateCache.put('/assets/angular/views/header/modals/settings.html',
    "<ul class=\"settings_popup\"><li ng-click=\"goto_info_card()\">Edit profile</li><li ng-click=\"getting_started_tour()\">Getting started</li><hr><li ng-click=\"logout()\">Logout</li></ul>"
  );


  $templateCache.put('/assets/angular/views/header/partials/profile_link.html',
    "<div class=\"header_navbar\" id=\"editProfile\" ng-if=\"user.logged\"><img ng-src=\"{{user | blob_backup}}\" class=\"profile_small_thumb\" ng-if=\"user\"><div class=\"user_details\"><div class=\"animate-slow count\" ng-class=\"{'green': is_additive, 'magenta': !is_additive}\" ng-show=\"count && !initiate_counting\"><span ng-if=\"is_additive\">+</span><span ng-if=\"!is_additive\">-</span>{{count}}</div><span class=\"capitalise\"><b>{{user.name | first_name}}</b></span></div></div>"
  );


  $templateCache.put('/assets/angular/views/header/show.html',
    "<div class=\"main_header\"><a class=\"site_logo\" ng-href=\"#/user/{{$routeParams.id}}/search\" ng-if=\"$routeParams.type\"><tooltip prepend-text=\"Back to search page\" position=\"bottom\"></tooltip><span>r</span> <span>e</span> <span>a</span> <span>d</span> <span>e</span> <span>r</span> <span>'</span> <span>s</span> <span>&nbsp;</span> <span>d</span> <span>o</span> <span>o</span> <span>r</span></a><div class=\"table_cell header_wrapper\" ng-if=\"!$routeParams.type\"><a class=\"site_logo\" ng-href=\"#/user/{{user.id}}/recommendations/books\"><span>r</span> <span>e</span> <span>a</span> <span>d</span> <span>e</span> <span>r</span> <span>'</span> <span>s</span> <span>&nbsp;</span> <span>d</span> <span>o</span> <span>o</span> <span>r</span></a></div><div class=\"header_icon\" ng-click=\"toggle_settings_popup($event)\" ng-if=\"$routeParams.type\"><span class=\"icon-angle-down table_cell\"></span></div><div class=\"header_icon\" ng-class=\"{'site_color': popups.show_notifications_popup}\" ng-click=\"toggle_notification_popup($event)\"><span class=\"icon-earth table_cell\"></span><div class=\"notification_circle table_cell\" ng-hide=\"hide_notification_circle\">4</div></div><a ng-href=\"#/user/{{user.id}}/recommendations/books\"><profile-link></profile-link></a><div ng-controller=\"searchController\" ng-if=\"$routeParams.type && !reader\"><search-bar></search-bar></div><div class=\"header_navbar click\" ng-click=\"show_interaction_box(user.id)\" ng-if=\"$routeParams.type\" id=\"share\"><span class=\"table_cell\"><b>Share</b></span></div><div ng-if=\"popups.show_notifications_popup\" ng-include=\"\" src=\"'/assets/angular/views/header/modals/notifications.html'\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/home.html',
    "<div msd-wheel=\"bindHorizontalScroll($event, $delta, $deltaX, $deltaY)\" ng-swipe-left=\"move_right($event)\" ng-swipe-right=\"move_left($event)\" ng-animate=\"msd-wheel\" class=\"recommendations\" style=\"height:100%; white-space:nowrap\" ng-intro-options=\"getting_started_tour_options\" ng-intro-method=\"getting_started_tour\" ng-intro-autostart=\"should_auto_start()\" ng-controller=\"recommendationsController\" ng-click=\"hide_popups()\"><header></header><navbar></navbar><div ng-include=\"\" src=\"'/assets/angular/views/cover/profile/name.html'\"></div><div class=\"grey_wrapper click\" ng-show=\"user.show_profile\" ng-click=\"toggle_profile(user.id, $event)\"></div><div class=\"vertical_padder_active animate-fast\" ng-class=\"{'vertical_padder_shifted': user.show_profile}\"></div><div ng-include=\"\" src=\"'/assets/angular/views/cover/show.html'\"></div><div class=\"info_card_placeholder animate-fast\" ng-class=\"{'horizontal_padder_active': !user.collapsed_left_column}\"></div><div ng-switch=\"\" on=\"panel_selected\" class=\"full_height\"><div ng-switch-when=\"BOOKMARK\" class=\"full_height\"><div ng-include=\"\" src=\"'/assets/angular/views/home/library.html'\"></div></div><div ng-switch-when=\"READ\" class=\"full_height\"><div ng-include=\"\" src=\"'/assets/angular/views/home/read.html'\"></div></div><div ng-switch-default=\"\" class=\"full_height\"><div ng-include=\"\" src=\"'/assets/angular/views/home/recommendations.html'\"></div></div></div><div class=\"left_panel animate-fast\" ng-class=\"{'hidden': user.show_profile}\" ng-style=\"popups.left_panel_width\" msd-wheel=\"stop_propagation($event)\" ng-click=\"stop_propagation($event)\"><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/shelves.html'\"></div><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/friends_list.html'\"></div><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/news_feed.html'\"></div><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/trending_list.html'\" ng-if=\"$routeParams.type != 'profile'\"></div><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/listopia.html'\" ng-if=\"$routeParams.type != 'profile'\"></div><span class=\"icon-lock lock\" ng-if=\"!user.collapsed_left_column && user.locked\" ng-click=\"user.locked = false\"></span> <span class=\"icon-unlocked lock\" ng-if=\"!user.collapsed_left_column && !user.locked\" ng-click=\"user.locked = true\"></span></div><div class=\"focused_tooltip animate-faster\" ng-style=\"focused_book.reposition_tooltip\" ng-click=\"stop_propagation($event)\" ng-if=\"focused_book\"><book-info></book-info></div><div class=\"ticker_popup\" ng-if=\"ticker_popup\" ng-class=\"{'ticker_popup_shifted': user.show_profile}\" ng-style=\"ticker_popup_style\" msd-wheel=\"handle_height_of_popup($event)\" check-scroll-down=\"handle_height_of_popup($event, true)\"><div class=\"scrollbar shift_right\"><ticker-popup></ticker-popup></div></div><div ng-if=\"focused_author\"><focused-author></focused-author></div><div ng-if=\"focused_reader\"><focused-reader></focused-reader></div><div class=\"top_hover_detector\"></div><div class=\"scroller animate-fast\" ng-class=\"{'hidden': user.show_profile}\" id=\"scroller\"><span class=\"scroller-left icon-angle-left\" ng-mouseover=\"move_left($event)\" ng-click=\"move_left($event)\" title=\"Scroll left\"></span> <span class=\"scroller-right icon-angle-right\" ng-mouseover=\"move_right($event)\" ng-click=\"move_right($event)\" title=\"Scroll right\"></span></div><getting-started></getting-started><div ng-include=\"\" src=\"'/assets/angular/views/header/modals/settings.html'\" ng-show=\"popups.settings_popup\"></div></div><feed ng-if=\"user.interact\"></feed><div feedback-popup=\"\"></div><user-add></user-add>"
  );


  $templateCache.put('/assets/angular/views/home/library.html',
    "<div ng-model=\"user.books.bookmarked\"><div ng-switch=\"\" on=\"user.books.bookmarked.length\"><div ng-switch-when=\"0\"><div class=\"recommendation_block\"><div class=\"widget bookmark_instruct\"></div></div></div><div ng-switch-default=\"\"><div ng-repeat=\"user_book in user.books.bookmarked\" class=\"recommendation_block\"><book track=\"\" id=\"{{user_book.category.name | lowercase}}-{{user_book.id}}\" data=\"user_book\"></book></div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/home/partials/book_grid.html',
    "<div class=\"grid1\"><a ng-href=\"#user/{{user_id}}/grid/books/id/{{grid.id}}/name/{{grid.grid_text}}\" class=\"header animate-fast\"><div class=\"text\" ng-bind-html=\"grid.grid_text\"></div></a> <img ng-src=\"{{grid.grid_books[0] | choose_medium_thumb}}\" class=\"first\"> <img ng-src=\"{{grid.grid_books[1] | choose_medium_thumb}}\" class=\"second\"> <img ng-src=\"{{grid.grid_books[2] | choose_medium_thumb}}\" class=\"third\"> <img ng-src=\"{{grid.grid_books[3] | choose_medium_thumb}}\" class=\"fourth\"> <img ng-src=\"{{grid.grid_books[4] | choose_medium_thumb}}\" class=\"fifth\"> <img ng-src=\"{{grid.grid_books[5] | choose_medium_thumb}}\" class=\"sixth\"></div>"
  );


  $templateCache.put('/assets/angular/views/home/read.html',
    "<div ng-model=\"user.books.read\"><div ng-switch=\"\" on=\"user.books.read.length\"><div ng-switch-when=\"0\"><div class=\"recommendation_block\"><div class=\"widget mark_as_read_instruct\"></div></div></div><div ng-switch-default=\"\"><div ng-repeat=\"user_book in user.books.read\" class=\"recommendation_block\"><book track=\"\" id=\"{{user_book.category.name | lowercase}}-{{user_book.id}}\" data=\"user_book\"></book></div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/home/recommendations.html',
    "<div ng-if=\"$routeParams.type == 'books'\" ng-model=\"recommendations.books\" class=\"full_height\"><div ng-if=\"!grid_view\"><div ng-repeat=\"recommendation in recommendations.books\" ng-class=\"{'recommendation_block': !recommendation.is_grid, 'grid': recommendation.is_grid}\"><book track=\"\" id=\"{{recommendation.category.name | lowercase}}-{{recommendation.id}}\" data=\"recommendation\" ng-if=\"!recommendation.is_grid\"></book><book-grid data=\"recommendation\" ng-if=\"recommendation.is_grid\"></book-grid><div ng-if=\"recommendation.padding\"></div></div><div class=\"recommendation_block\" animate-fast=\"\"><div class=\"widget loading_widget\"><div class=\"loading_thumb\"></div></div></div></div><div ng-if=\"grid_view\"><div ng-repeat=\"recommendation in recommendations.books\" ng-class=\"{'small_block': !recommendation.is_grid}\"><img ng-src=\"{{recommendation.isbn | medium_thumb}}\" class=\"\"></div></div></div><div ng-if=\"$routeParams.type == 'readers'\" class=\"full_height\"><div ng-repeat=\"recommendation in recommendations.readers\" class=\"recommendation_block\"><reader track=\"\" id=\"{{recommendation.category.name | lowercase}}-{{recommendation.id}}\" data=\"recommendation\"></reader></div></div><div ng-if=\"$routeParams.type == 'authors'\" class=\"full_height\"><div ng-repeat=\"recommendation in recommendations.authors\" class=\"recommendation_block\"><author track=\"\" id=\"{{recommendation.category.name | lowercase}}-{{recommendation.id}}\" data=\"recommendation\"></author></div></div>"
  );


  $templateCache.put('/assets/angular/views/home/shared/book_info.html',
    "<div class=\"arrow\" ng-class=\"{'arrow_left': on_left, 'arrow_right': !on_left}\"></div><div class=\"icon-close-popup\" ng-click=\"hide_popups()\"></div><div class=\"header\"><div class=\"title site_color header_font\" title=\"{{focused_book.title}}\"><b>{{focused_book.title | book_title}}</b></div><div class=\"author site_color\">by <b>{{focused_book.author_name}}</b></div><div class=\"author\"><span ng-if=\"focused_book.published_year\">{{focused_book.published_year | published_year}}</span> <span>{{focused_book.page_count | page_count}}</span></div></div><div class=\"tabs\"><div ng-click=\"get_book_overview();\" ng-class=\"{'active_tab2': !show_buy && !show_author}\" class=\"tab tab2\"><span><b>Overview</b></span><span class=\"\"></span></div><div class=\"tab tab2\" ng-click=\"get_author_details();\" ng-class=\"{'active_tab2': show_author && !show_buy}\"><span><b>About author</b></span><span class=\"\"></span></div><div ng-click=\"get_buy_links();\" class=\"tab tab2\" ng-class=\"{'active_tab2': show_buy && !show_author}\"><span><b>Buy this book</b></span><span class=\"\"></span></div></div><div class=\"book_info\" ng-if=\"!show_buy && !show_author\"><div ng-include=\"\" src=\"'/assets/angular/views/shared/partials/book_info.html'\"></div><div ng-if=\"!show_buy && !show_author\" ng-disabled=\"!focused_book.status\"><rate data=\"focused_book\"></rate></div></div><div class=\"scrollbar description\" ng-class=\"{'long_description': !focused_book.users_count || focused_book.users_count == 0}\" msd-wheel=\"stop_horizontal_scroll($event)\" ng-if=\"!show_buy && !show_author\"><span itemprop=\"description\" ng-bind-html=\"focused_book.summary | summary\"></span><br><br><br></div><div class=\"user_box\" ng-if=\"!show_author && !show_buy && focused_book.users_count && focused_book.users_count > 0\"><div class=\"heading\">{{focused_book.users_count}} friends have read this</div><div class=\"users\"><div ng-repeat=\"user in focused_book.users\"><img ng-src=\"{{user.thumb}}\"></div></div></div><div class=\"book_info scrollbar author_book_info\" ng-if=\"show_author && !show_buy\"><div class=\"image_wrapper\"><img ng-src=\"{{focused_book.author_details.image_url}}\"></div><div class=\"text\" msd-wheel=\"stop_horizontal_scroll($event)\">{{focused_book.author_details.about}}<br><br><br><br></div></div><div class=\"user_box_wrapper animate-fast\" ng-click=\"get_book_from_author()\" ng-show=\"show_author && !show_buy\"><div class=\"text\"><b>More Books from {{focused_book.author_name}}</b></div></div><div class=\"user_box\" ng-if=\"show_author && !show_buy\"><div class=\"heading\">{{focused_book.author_details.book_ids.length}} more books from author</div><img ng-src=\"{{book_isbn | small_thumb}}\" ng-repeat=\"book_isbn in focused_book.author_details.book_isbns | limitTo: 7 track by $index\" class=\"book_thumb\"> </div><div ng-if=\"show_buy && !show_author\" class=\"buy_column\"><div ng-if=\"focused_book.bnn_links\"><span>Buy from&nbsp;</span><em><span>Barnes & Nobles</span></em> <span ng-repeat=\"link in focused_book.bnn_links track by $index\"><a ng-href=\"{{link}}\" target=\"_blank\" class=\"site_color\">Link{{$index+1}}</a>&nbsp;</span></div><div ng-if=\"!focused_book.bnn_links || focused_book.bnn_links.length == 0\">Sorry! Could find this book on <em>Barnes & Nobles</em>.</div></div><div class=\"time_to_read\" ng-if=\"show_buy && !show_author\"><div class=\"header\">Describe the reading length of this book</div><div ng-click=\"record_read_time(0, $event)\" class=\"tab read_block\" ng-class=\"{'active_tab':is_timer(0)}\">Tiny Read</div><div ng-click=\"record_read_time(1, $event)\" class=\"tab read_block\" ng-class=\"{'active_tab':is_timer(1)}\">Small Read</div><div ng-click=\"record_read_time(2, $event)\" class=\"tab read_block\" ng-class=\"{'active_tab':is_timer(2)}\">Normal Read</div><div ng-click=\"record_read_time(3, $event)\" class=\"tab read_block\" ng-class=\"{'active_tab':is_timer(3)}\">Long Read</div></div><div class=\"tweet_link site_color\" ng-click=\"user.interact = true;\"><img ng-src=\"{{focused_book.display_profile}}\" class=\"inline_block\"><div class=\"comment_link\"><span ng-model=\"focused_book.display_tweet\" class=\"table_cell\">Share your reading journey...</span></div></div><div class=\"footer\"><recommend data=\"focused_book\"></recommend></div>"
  );


  $templateCache.put('/assets/angular/views/home/shared/recommend.html',
    "<span ng-click=\"recommend()\" class=\"red_button recommend\" title=\"Recommend book to friends\"><b>Recommend to friends</b></span><div class=\"wrapper\" ng-if=\"recommend_object.recommended\" style=\"z-index:1\" ng-click=\"recommend_object.recommended = false;\" msd-wheel=\"stop_propagation($event)\"><div class=\"recommendation_box animate-slow\" ng-click=\"stop_propagation($event)\"><div class=\"icon-close-popup\" ng-click=\"recommend_object.recommended = false;\"></div><div class=\"header\"><span><b>Select friends whom you want to recommend</b></span><br><span class=\"site_color\">{{recommend_object.title}} by {{recommend_object.author_name}}</span></div><div class=\"friend_grid scrollbar\"><div ng-repeat=\"friend in user.followers\" class=\"block\" data-selected=\"false\" title=\"{{friend.name}}\" ng-click=\"select_thumb($event, friend.id)\"><div class=\"table\"><div class=\"friend_thumb_wrapper\"><img ng-src=\"{{friend | blob_backup}}\" class=\"friend_thumb\"></div><div class=\"friend_name table_cell\" ng-show=\"friend.name\">{{friend.name}}</div></div></div></div><div class=\"footer\"><button class=\"done blue_button\" ng-click=\"recommend()\" ng-disabled=\"!user.selected_followers || user.selected_followers.length == 0\">Done</button></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/home/shared/user_add.html',
    "<ul class=\"user_add_popup animate-fast\" ng-if=\"popups.add_popup\"><div class=\"icon-close-popup\" ng-click=\"popups.add_popup=false;\"></div><li ng-click=\"show_interaction_box(user.id)\">Share your book reading journey</li><li onclick=\"facebook_invite()\">Invite Friends</li></ul><div class=\"user_add floating_icon\"><div ng-click=\"popups.add_popup = !popups.add_popup\" class=\"table_cell\"><span class=\"icon-plus\"></span></div></div>"
  );


  $templateCache.put('/assets/angular/views/left_panel/friends_list.html',
    "<div class=\"animate-fast\" id=\"friendsList\" msd-wheel=\"stop_propagation($event)\" ng-class=\"{'left_column_collapsed left_column_collapsed2': user.collapsed_friends, \r" +
    "\n" +
    "\t \t\t\t'left_column_shifted left_column_shifted1': !user.collapsed_filters,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted2': !user.collapsed_trends,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted3': !user.collapsed_lists,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted4': !user.collapsed_column,\r" +
    "\n" +
    "\t            'left_column': !user.collapsed_friends}\"><div class=\"collapse_icon\" ng-click=\"user.collapsed_friends = true; user.collapsed_left_column = true; collapse_left_panel();\" ng-if=\"!user.collapsed_friends\"><span class=\"icon-angle-left\"></span></div><div class=\"left_column_tab\" ng-class=\"{'left_column_tab_compressed': !user.collapsed_left_column}\" ng-hide=\"!user.collapsed_friends\" ng-click=\"show_friends_list();\"><span class=\"table_cell\"><span class=\"icon-users green_color header_font\" ng-if=\"user.collapsed_friends\"></span> <span ng-show=\"user.collapsed_left_column\">&nbsp;&nbsp;Friends</span></span></div><div class=\"header\" ng-if=\"!user.collapsed_friends\" ng-click=\"handle_friends_grid_size(undefined, true)\"><span ng-if=\"!$routeParams.type != 'profile'\"><b>Friends</b></span> <span ng-if=\"!$routeParams.type == 'profile'\"><b>Friends</b></span></div><div ng-if=\"!user.collapsed_friends && $routeParams.type != 'profile'\" class=\"friends_grid scrollbar\"><div ng-repeat=\"friend in user.friends\" class=\"friend_block animate-fast\"><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/shared/friend_grid.html'\"></div></div></div><div ng-if=\"!user.collapsed_friends && $routeParams.type == 'profile'\" class=\"friends_grid scrollbar\"><div ng-repeat=\"friend in reader.friends\" class=\"friend_block animate-fast\"><div ng-include=\"\" src=\"'/assets/angular/views/left_panel/shared/friend_grid.html'\"></div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/left_panel/listopia.html',
    "<div class=\"animate-fast\" id=\"listopia\" msd-wheel=\"stop_propagation($event)\" ng-class=\"{'left_column_collapsed left_column_collapsed4': user.collapsed_lists, \r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted1': !user.collapsed_column,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted2': !user.collapsed_friends,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted3': !user.collapsed_filters,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted4': !user.collapsed_trends,\r" +
    "\n" +
    "\t            'left_column': !user.collapsed_lists}\"><div class=\"collapse_icon\" ng-click=\"user.collapsed_lists = true; user.collapsed_left_column = true; collapse_left_panel();\" ng-if=\"!user.collapsed_lists\"><span class=\"icon-angle-left\"></span></div><div class=\"left_column_tab\" ng-class=\"{'left_column_tab_compressed': !user.collapsed_left_column}\" ng-hide=\"!user.collapsed_lists\" ng-click=\"user.collapsed_lists = false; \r" +
    "\n" +
    "\t \t           user.collapsed_left_column = false;\r" +
    "\n" +
    "\t \t           user.collapsed_column = true; \r" +
    "\n" +
    "\t \t           user.collapsed_trends = true;\r" +
    "\n" +
    "\t \t           user.collapsed_filters = true;\r" +
    "\n" +
    "\t \t           user.collapsed_friends = true;\r" +
    "\n" +
    "\t \t           expand_left_panel();\"><span class=\"table_cell\"><span class=\"icon-list purple_color header_font\" ng-if=\"user.collapsed_lists\"></span> <span ng-show=\"user.collapsed_left_column\">&nbsp;&nbsp;Listopia</span></span></div><div class=\"header\" ng-if=\"!user.collapsed_lists\"><span><b>Explore Listopia</b></span></div><div class=\"filters_panel_large scrollbar\" ng-if=\"!user.collapsed_lists\"><div class=\"filters_group\"><div ng-repeat=\"filter in book_lists\"><filter data=\"filter\" hide-icon=\"true\" icon-class=\"icon-list\" url=\"grid/{{$routeParams.type}}/id/{{filter.id}}/name/{{filter.name}}\"></filter></div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/left_panel/news_feed.html',
    "<div class=\"expand_notifications\" ng-if=\"reader\" ng-class=\"{'expand_notifications_shift': user.collapsed_column}\" ng-click=\"show_interaction_box(reader.id)\"><span class=\"icon-expand2\"></span></div><div class=\"expand_notifications\" ng-if=\"!reader\" ng-class=\"{'expand_notifications_shift': user.collapsed_column}\" ng-click=\"show_interaction_box()\"><span class=\"icon-expand2\"></span></div><div class=\"animate-fast\" id=\"newsFeed\" ng-class=\"{'left_column_collapsed left_column_collapsed3': user.collapsed_column, \r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted1': !user.collapsed_friends,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted2': !user.collapsed_filters,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted3': !user.collapsed_trends,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted4': !user.collapsed_lists,\r" +
    "\n" +
    "\t            'left_column': !user.collapsed_column}\"><div class=\"collapse_icon\" ng-click=\"user.collapsed_column = true; user.collapsed_left_column = true; collapse_left_panel();\" ng-if=\"!user.collapsed_column\"><span class=\"icon-angle-left\"></span></div><div ng-if=\"user.collapsed_column && !reader\" class=\"animate-fast left_column_tab\" ng-class=\"{'left_column_tab_compressed': !user.collapsed_left_column}\" ng-click=\"get_news_feed();\"><span class=\"table_cell\"><span class=\"icon-newspaper site_color header_font\"></span> <span class=\"shelves\" ng-show=\"user.collapsed_left_column\">&nbsp;&nbsp;News Feed</span></span></div><div ng-if=\"user.collapsed_column && reader\" class=\"animate-fast left_column_tab\" ng-class=\"{'left_column_tab_compressed': !user.collapsed_left_column}\" ng-click=\"get_news_feed(reader.id);\"><span class=\"table_cell\"><span class=\"icon-newspaper site_color header_font\"></span> <span class=\"shelves\" ng-show=\"user.collapsed_left_column\">&nbsp;&nbsp;{{reader.gender_prefix}} Timeline</span></span></div><div class=\"header\" ng-if=\"!user.collapsed_column && reader\"><span><b>&nbsp;&nbsp;{{reader.name | first_name}}'s Timeline</b></span></div><div ng-include=\"\" src=\"'/assets/angular/views/shared/feed/readers.html'\" ng-if=\"show_notifications && !user.collapsed_column && reader\"></div><div class=\"header\" ng-if=\"!user.collapsed_column && !reader\"><span><b>&nbsp;&nbsp;News Feed</b></span></div><div ng-include=\"\" src=\"'/assets/angular/views/shared/feed/news.html'\" ng-if=\"show_notifications && !user.collapsed_column && !reader\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/left_panel/partials/filter.html',
    "<a ng-href=\"#/user/{{$routeParams.id}}/{{url}}\"><div ng-class=\"{'site_color':active, 'inactive_filter':!active}\" class=\"filter capitalise\"><span>{{filter.name | lowercase}}</span> <span class=\"{{iconClass}} float_right\" ng-hide=\"hideIcon\"></span></div></a>"
  );


  $templateCache.put('/assets/angular/views/left_panel/partials/notification.html',
    "<div class=\"relative_position\"><div class=\"arrow_left ng-scope\" ng-style=\"ticker_position\" ng-if=\"ticker_popup\"></div><div ng-if=\"!seen\" ng-click=\"toggle_ticker_popup($event, notification)\" ng-class=\"{'notification': notification.book.id != null || notification.title, 'selected_notification': ($routeParams.trend_id == notification.id) && notification.id}\" class=\"notification_stable animate-fast\"><div class=\"float_left\"><img ng-src=\"{{notification.thumb | thumb_backup}}\"></div><img ng-src=\"{{notification.book.isbn | small_thumb}}\" class=\"book_thumb\" ng-show=\"notification.book.isbn\"><div class=\"block\" ng-class=\"{'compressed_block': notification.book.isbn}\"><div class=\"notification_message\"><b><div class=\"capitalise\" ng-bind-html=\"notification.user.name\"></div></b><timestamp data=\"notification.timestamp\"></timestamp><div ng-show=\"notification.title\"><b><div ng-bind-html=\"notification.title\"></div></b> <span class=\"delay_site_color animate-fast\">Check out related books</span></div><div ng-bind-html=\"notification.tag\"></div></div><div class=\"notification_message\" ng-hide=\"notification.title\" ng-bind-html=\"notification.message\"></div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/left_panel/shared/friend_grid.html',
    "<div class=\"image_wrapper\"><img ng-src=\"{{friend.thumb | thumb_backup}}\" class=\"friend_thumb\"></div><div class=\"friend_details\"><div class=\"click capitalise\" ng-if=\"friend.name && friend.id == user.id\"><b><a ng-href=\"#user/{{user.id}}/recommendations/books\">{{friend.name}}</a></b></div><div class=\"click\" ng-if=\"!friend.name && friend.id == user.id\"><b><a ng-href=\"#user/{{user.id}}/recommendations/books\">{{friend.email}}</a></b></div><div class=\"click capitalise\" ng-if=\"friend.name && friend.id != user.id\"><b><a ng-href=\"#reader/{{friend.id}}/profile\">{{friend.name}}</a></b></div><div class=\"click\" ng-if=\"!friend.name && friend.id != user.id\"><b><a ng-href=\"#reader/{{friend.id}}/profile\">{{friend.email}}</a></b></div><div ng-if=\"friend.init_book_read_count\">Reader of {{friend.init_book_read_count}}</div><div><span>{{friend.total_count | integer}}</span> <span>·</span> <span>{{friend.book_read_count | integer}}</span> <span class=\"icon-books\"></span> <span>·</span> <span>{{friend.bookmark_count| integer}}</span> <span class=\"icon-bookmarks\"></span> <span>·</span></div><div class=\"normal_text\" ng-if=\"friend.fav_categories\">Likes {{friend.fav_categories}} books</div></div>"
  );


  $templateCache.put('/assets/angular/views/left_panel/shared/ticker_popup.html',
    "<div class=\"ticker_overflow\" ng-style=\"ticker_popup_style\"><div class=\"recommendation_block\"><book data=\"ticker_popup\"></book></div><book-interact data=\"ticker_popup\" track=\"\"></book-interact></div>"
  );


  $templateCache.put('/assets/angular/views/left_panel/shelves.html',
    "<div class=\"animate-fast\" id=\"shelves\" msd-wheel=\"stop_propagation($event)\" ng-class=\"{'left_column_collapsed left_column_collapsed1': user.collapsed_filters, \r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted1': !user.collapsed_trends,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted2': !user.collapsed_lists,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted3': !user.collapsed_column,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted4': !user.collapsed_friends,\r" +
    "\n" +
    "\t            'left_column': !user.collapsed_filters}\"><div class=\"collapse_icon\" ng-click=\"user.collapsed_filters = true; user.collapsed_left_column = true; collapse_left_panel();\" ng-if=\"!user.collapsed_filters\"><span class=\"icon-angle-left\"></span></div><div class=\"left_column_tab\" ng-class=\"{'left_column_tab_compressed': !user.collapsed_left_column}\" ng-hide=\"!user.collapsed_filters\" ng-click=\"user.collapsed_filters = false; \r" +
    "\n" +
    "\t \t \t\t   user.collapsed_left_column = false;\r" +
    "\n" +
    "\t \t           user.collapsed_column = true; \r" +
    "\n" +
    "\t \t           user.collapsed_trends = true;\r" +
    "\n" +
    "\t \t           user.collapsed_lists = true;\r" +
    "\n" +
    "\t \t           user.collapsed_friends = true;\r" +
    "\n" +
    "\t \t           expand_left_panel();\"><span class=\"table_cell\"><span class=\"icon-bookmark2 yellow_color header_font\" ng-if=\"user.collapsed_filters\"></span> <span ng-show=\"user.collapsed_left_column\">&nbsp;&nbsp;Shelves</span></span></div><div class=\"header\" ng-if=\"!user.collapsed_filters\"><span><b>&nbsp;Explore Shelves</b></span></div><div class=\"filters_panel_large scrollbar\" ng-if=\"!user.collapsed_filters\"><div class=\"filters_group\"><div ng-repeat=\"filter in labels\"><filter data=\"filter\" icon-class=\"icon-bookmark3\" url=\"recommendations/{{$routeParams.type}}/label/{{filter.id}}/name/{{filter.name}}\"></filter></div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/left_panel/trending_list.html',
    "<div class=\"expand_notifications\" ng-class=\"{'expand_notifications_shift': user.collapsed_trends}\" ng-click=\"show_trending_options()\"><span class=\"icon-expand2\"></span></div><div class=\"animate-fast scrollbar\" id=\"trendingList\" msd-wheel=\"stop_propagation($event)\" ng-class=\"{'left_column_collapsed left_column_collapsed5': user.collapsed_trends, \r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted1': !user.collapsed_lists,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted2': !user.collapsed_column,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted3': !user.collapsed_friends,\r" +
    "\n" +
    "\t            'left_column_shifted left_column_shifted4': !user.collapsed_filters,\r" +
    "\n" +
    "\t            'left_column': !user.collapsed_trends}\"><div class=\"collapse_icon\" ng-click=\"user.collapsed_trends = true; user.collapsed_left_column = true; collapse_left_panel();\" ng-if=\"!user.collapsed_trends\"><span class=\"icon-angle-left\"></span></div><div class=\"left_column_tab\" ng-class=\"{'left_column_tab_compressed': !user.collapsed_left_column}\" ng-hide=\"!user.collapsed_trends\" ng-click=\"user.collapsed_trends = false; \r" +
    "\n" +
    "\t \t           user.collapsed_left_column = false;\r" +
    "\n" +
    "\t \t           user.collapsed_column = true; \r" +
    "\n" +
    "\t \t           user.collapsed_filters = true;\r" +
    "\n" +
    "\t \t           user.collapsed_lists = true;\r" +
    "\n" +
    "\t \t           user.collapsed_friends = true;\r" +
    "\n" +
    "\t \t           expand_left_panel();\"><span class=\"table_cell\"><span class=\"icon-bars red_color header_font\" ng-if=\"user.collapsed_trends\"></span> <span ng-show=\"user.collapsed_left_column\">&nbsp;&nbsp;Trending</span></span></div><div class=\"header\" ng-if=\"!user.collapsed_trends\"><span><b>Trending</b></span></div><div ng-include=\"\" src=\"'/assets/angular/views/shared/feed/trending.html'\" ng-if=\"!user.collapsed_trends\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/search/login_form.html',
    "<div class=\"wrapper\" ng-if=\"!user.logged && show_login_form\" ng-controller=\"loginController\"><div class=\"login_box animate-fast\" ng-if=\"!user.logged && show_login_form\"><div class=\"header\"><div class=\"logo white_color\"><span>r</span> <span>e</span> <span>a</span> <span>d</span> <span>e</span> <span>r</span> <span>'</span> <span>s</span> <span>&nbsp;</span> <span>d</span> <span>o</span> <span>o</span> <span>r</span> <span class=\"beta_label\">BETA</span></div><div class=\"tagline\"><span>LIVE AND BUILD THE YEARS WITH BOOKS.</span> </div><hr></div><div class=\"fb\" ng-show=\"!user.logged\" ng-click=\"intent_login()\">Sign in with Facebook</div><a class=\"white_color\" ng-click=\"show_other_options=true;\" ng-hide=\"show_other_options\">Don't have a facebook account</a> <form class=\"login_form\" ng-show=\"show_other_options\"><input class=\"email\" type=\"email\" ng-keydown=\"submit($event)\" value=\"test@gmail.com\" ng-model=\"user.email\" placeholder=\"Email\" spellcheck=\"false\" required=\"\"><br><input class=\"password\" type=\"password\" ng-model=\"user.password\" placeholder=\"Password\" spellcheck=\"false\" ng-keydown=\"submit($event)\" required=\"\"><br><div class=\"authenticate authenticate_left blue_button\" ng-click=\"authenticate(true)\" type=\"button\"><span>LOG IN</span></div><div class=\"authenticate blue_button\" ng-click=\"authenticate(false)\" type=\"button\"><span>SIGN UP</span></div><div class=\"white_color link\"><span ng-click=\"recover_password()\" class=\"table_cell\">Forgot Password?</span></div></form><div class=\"login_status\"><span ng-if=\"user.error_message\" ng-bind-html=\"user.error_message\"></span> <img src=\"assets/loader2.gif\" width=\"20px\" ng-show=\"loading_icon\"></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/search/partials/search_bar.html',
    "<div class=\"wrapper\" ng-click=\"reset_search_bar($event)\" ng-if=\"$routeParams.type && !hide_options\"></div><div class=\"search_typeahead_group animate-fast\"><div class=\"compressed_filters\" ng-show=\"$routeParams.type && hide_options && filters_added.length > 0\"><div ng-repeat=\"item in filters_added\" class=\"compressed_filter_icon\" ng-click=\"remove_filter(item, $event)\"><span ng-show=\"item.icon2\" class=\"{{item.icon2}}\"></span> <span>{{item.name}}</span></div></div><div class=\"input_wrapper\" ng-class=\"{'search_input_shifted': $routeParams.type && hide_options}\" ng-hide=\"hide_input_field\"><input set-focus=\"website.searching\" ng-keypress=\"get_search_results($event)\" ng-keydown=\"key_down($event)\" ng-model=\"search_tag.input\" id=\"searchInput\" ng-click=\"handle_options($event)\" class=\"search_input\" placeholder=\"{{search_tag.placeholder}}\"><div ng-include=\"'/assets/angular/views/search/partials/search_icon.html'\"></div></div><div class=\"website_search_helpers animate-fast\" ng-show=\"active_nest && !($routeParams.type && hide_options)\"><div class=\"direction_option faded_site_color\" ng-click=\"handle_base_selection()\"><tooltip prepend-text=\"Search books\" position=\"left\"></tooltip><span class=\"icon-book\"></span></div><div class=\"direction_option light_grey_color\"><span class=\"icon-angle-right\"></span></div><div class=\"compressed_option tab\" ng-click=\"handle_selection_option(item, $event)\" ng-repeat=\"item in base_book_options\" ng-class=\"{'active_tab': is_active_nest(item), 'faded_site_color': item.active}\"><tooltip text=\"item.name\" position=\"top\" ng-if=\"!$routeParams.type\"></tooltip><tooltip text=\"item.name\" position=\"right\" ng-if=\"$routeParams.type\"></tooltip><span class=\"capitalise\">{{item.type | lowercase}}</span> </div></div><div class=\"filters_added website_search_options\" ng-hide=\"$routeParams.type && hide_options\"><div ng-repeat=\"item in filters_added\" ng-click=\"remove_filter(item, $event)\" msd-wheel=\"stop_horizontal_scroll($event)\" class=\"option site_color animate-fast\"><tooltip prepend-text=\"Remove filter\" position=\"left\" ng-if=\"!$routeParams.type\"></tooltip><tooltip prepend-text=\"Remove filter\" position=\"right\" ng-if=\"$routeParams.type\"></tooltip><div class=\"title\"><span ng-show=\"item.icon2\" class=\"{{item.icon2}} faded_site_color\">&nbsp;</span> <b><span ng-bind-html=\"item.name\"></span></b> <span class=\"right_icon icon-close close_icon\"></span> <span class=\"right_icon\">&nbsp;</span></div><div ng-show=\"item.author_name\">by {{item.author_name}}</div></div></div><div class=\"input_wrapper\" ng-show=\"show_secondary_input && !($routeParams.type && hide_options)\"><input placeholder=\"{{custom_input_placeholder}}\" class=\"search_input box-shadow animate-fast\" ng-model=\"search_tag.custom_input\" ng-keypress=\"search_custom($event)\" ng-keydown=\"key_down($event)\" set-focus=\"website.searching_custom\"><div ng-include=\"'/assets/angular/views/search/partials/search_icon.html'\"></div></div><div class=\"website_search_helpers animate-fast\" ng-show=\"!($routeParams.type && hide_options)\"><div class=\"title\" ng-show=\"search_display\" ng-bind-html=\"search_display\"></div></div><div class=\"animate-fast website_search_options scrollbar init_filter\" ng-if=\"search_results.length > 0 && !($routeParams.type && hide_options) && !show_compressed_base\"><div class=\"large_font inline_block green_color left_icon\"><span class=\"icon-books\"></span></div><div class=\"inline_block right_tab\"><div class=\"large_font light_grey_color\">Add Filters</div><div><span ng-repeat=\"item in search_results | limitTo: search_tag.result_count+1 | filter:search_tag.custom_input | orderBy: item.name track by $index \" ng-click=\"handle_selection_option(item, $event)\" ng-mouseenter=\"set_current($index)\" msd-wheel=\"stop_horizontal_scroll($event)\"><span ng-bind-html=\"item.type | lowercase\" class=\"capitalise click\"></span><span>&nbsp;</span></span></div></div></div><div class=\"animate-fast website_search_options scrollbar\" ng-mouseleave=\"remove_active_state()\" ng-if=\"search_results.length > 0 && !($routeParams.type && hide_options) && show_compressed_base\"><div ng-repeat=\"item in search_results | limitTo: search_tag.result_count+1 | filter:search_tag.custom_input | orderBy: item.name track by $index \" ng-click=\"handle_selection_option(item, $event)\" ng-class=\"{'light_gray_background':is_current($index, item)}\" ng-mouseenter=\"set_current($index)\" msd-wheel=\"stop_horizontal_scroll($event)\" class=\"option\"><div class=\"title\"><span ng-show=\"item.icon\" class=\"{{item.icon}} light_grey_color\">&nbsp;</span> <span ng-bind-html=\"item.name\"></span> <span class=\"{{item.icon2}} right_icon\"></span> <span class=\"right_icon\">{{item.label}}&nbsp;</span></div><div ng-show=\"item.author_name\" class=\"light_grey_color\">Book by {{item.author_name}}</div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/search/partials/search_icon.html',
    "<div class=\"search_icon animate-fast\" ng-click=\"handle_search_request($event)\"><span class=\"icon-search table_cell\"></span></div>"
  );


  $templateCache.put('/assets/angular/views/search/show.html',
    "<div class=\"home_page_base\"><div class=\"search_animate animate-very-slow\" ng-click=\"stopSearching($event)\" ng-controller=\"searchController\"><div class=\"desaturate\" ng-class=\"{'search_page_wrapper': !user.logged}\" ng-style=\"search_style\"></div><div class=\"search_page\" ng-if=\"user.logged\" ng-click=\"hide_popups($event)\"><header></header><search-bar></search-bar><div ng-include=\"'/assets/angular/views/search/trending.html'\"></div></div><div ng-include=\"'/assets/angular/views/search/login_form.html'\"></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/search/trending.html',
    "<div class=\"notifications trending_header\" ng-hide=\"active_base || filters_added.length > 0\"><div class=\"notification_stable\"><b>Check out books related to trending topics</b></div></div><div ng-include=\"\" src=\"'/assets/angular/views/shared/feed/trending.html'\" ng-hide=\"active_base || filters_added.length > 0\" class=\"trending_panel animate-fast\"></div><div class=\"trending_panel animate-fast trending_panel_shift\" ng-click=\"reset_base_selection()\" ng-hide=\"!active_base\"><div class=\"notification_stable click\">Check out books related to trending topics</div></div>"
  );


  $templateCache.put('/assets/angular/views/shared/feed/news.html',
    "<div class=\"notifications animate-fast scrollbar\" check-scroll-bottom=\"get_notifications()\"><div class=\"full_height\"><notification data=\"notification\" ng-repeat=\"notification in notifications | reverse\"></notification><div class=\"notification_stable\">You've reached the end of your news feed.</div></div></div>"
  );


  $templateCache.put('/assets/angular/views/shared/feed/readers.html',
    "<div class=\"notifications animate-fast scrollbar\" check-scroll-bottom=\"get_notifications(reader.id)\"><div class=\"full_height\"><notification data=\"notification\" ng-repeat=\"notification in readers_notifications | reverse\"></notification><div class=\"notification_stable\">No new notifications from {{reader.name | first_name}}.</div></div></div>"
  );


  $templateCache.put('/assets/angular/views/shared/feed/trending.html',
    "<div class=\"notifications scrollbar\"><notification data=\"notification\" ng-repeat=\"notification in trends\"></notification><div class=\"notification_stable\">You have reached end of the trending list.</div></div>"
  );


  $templateCache.put('/assets/angular/views/shared/partials/book_info.html',
    "<div class=\"instruct_block\"><span><span class=\"site_color\"><span>{{focused_book.readers_count | integer}}</span> <span>Readers</span> <span class=\"icon-users2\"></span></span></span> <span itemprop=\"aggregateRating\" itemscope=\"\" itemtype=\"http://schema.org/AggregateRating\"><span>&nbsp;</span> <span class=\"site_color\"><span>{{focused_book.bookmark_count | integer}}</span> <span>Tags</span> <span class=\"icon-tags\"></span></span></span> <span><span>&nbsp;</span> <span class=\"site_color\"><span>{{focused_book.comment_count | integer}}</span> <span>Comments</span> <span class=\"icon-bubbles2\"></span></span></span></div>"
  );


  $templateCache.put('/assets/angular/views/shared/rate.html',
    "<div itemprop=\"review\" itemscope=\"\" itemtype=\"http://schema.org/Review\" class=\"rate\"><div class=\"rate_radio_buttons\"><span type=\"radio\" class=\"rate_radio\" ng-class=\"{'yellow_color icon-star22':is_active($index) && !rate_object.rated,\r" +
    "\n" +
    "\t\t\t   'icon-star':!is_active($index),\r" +
    "\n" +
    "\t\t\t   'site_color icon-star22':ready_to_rate && is_active($index),\r" +
    "\n" +
    "\t\t\t   'purple_color icon-star22':rate_object.rated && is_active($index) && !ready_to_rate}\" ng-mouseenter=\"show_if_rated($index)\" ng-mouseleave=\"reset_rating()\" ng-click=\"mark_as_rated($index, $event)\" ng-repeat=\"i in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\"></span>  <span ng-model=\"rate_object.user_rating\">{{rate_object.user_rating/2}}/5</span></div></div>"
  );


  $templateCache.put('/assets/angular/views/shared/timestamp.html',
    "<div class=\"light_grey_color\" ng-show=\"timestamp\"><span>{{timestamp | date:'MMMM d'}}</span> <span ng-show=\"timestamp\">at {{timestamp | date:'h:mm a'}}</span></div>"
  );


  $templateCache.put('/assets/angular/views/shared/tooltip.html',
    "<div class=\"tooltip animate-fast\" ng-class=\"{'scrollbar': scroll}\" msd-wheel=\"stop_horizontal_scroll($event)\"><div><span ng-show=\"prependText\">{{prependText}}&nbsp;</span> <span ng-show=\"text\">{{text}}{{pluralize}}&nbsp;</span> <span>{{appendText}}</span></div><div class=\"arrow_down tooltip_arrow\" ng-show=\"position == 'top'\"></div><div class=\"arrow_up tooltip_arrow\" ng-show=\"position == 'bottom'\"></div><div class=\"arrow_left tooltip_arrow\" ng-show=\"position == 'right'\"></div><div class=\"arrow_right tooltip_arrow\" ng-show=\"position == 'left'\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/author/author_interact.html',
    "<div class=\"bottom_widget\"><follow track=\"\"></follow><author-bookmark track=\"\"></author-bookmark></div>"
  );


  $templateCache.put('/assets/angular/views/unused/author/author_widget.html',
    "<div class=\"animate-fast widget\"><div ng-model=\"author\" ng-mouseenter=\"discovered = true\" ng-mouseover=\"hover()\" ng-mouseout=\"mouseout()\" ng-click=\"show_focused_tooltip($event)\" ng-class=\"{'discovered': hovered, 'undiscovered': !hovered}\" class=\"card animate-fast\"><widget-thumb track=\"\"></widget-thumb><author-interact track=\"\"></author-interact></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/author/bookmark.html',
    "<div itemscope=\"\" itemtype=\"http://schema.org/BookmarkAction\" class=\"left_action action_button\" ng-click=\"toggle_bookmarked($event)\" ng-class=\"{'left_action_active':author.bookmark_status}\" ng-model=\"author.bookmark_status\" title=\"bookmark\"><span class=\"icon-bookmark3 table_cell table_cell_icon\"></span><div></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/author/focused_author.html',
    "<div class=\"focused_tooltip animate-fast\" ng-style=\"focused_author.reposition_tooltip\" ng-click=\"stop_propagation($event)\" ng-if=\"focused_author\"><div class=\"close_button button_effect\" ng-click=\"close_focused_tooltip()\">x</div><div class=\"book_info\"><span>·</span> <span class=\"book_link\"><span class=\"count\"><span>{{focused_author.readers_count}}</span> <span class=\"icon-users2\"></span></span> <span>&nbsp;&nbsp;Readers</span></span> · <span itemprop=\"aggregateRating\" itemscope=\"\" itemtype=\"http://schema.org/AggregateRating\" class=\"book_link\"><span class=\"count\"><span>{{focused_author.reviews_count}}</span> <span class=\"icon-pencil2\"></span></span> <span>&nbsp;&nbsp;Reviews</span></span> · <span class=\"book_link\"><span class=\"count\"><span>{{focused_author.discussions_count}}</span> <span class=\"icon-bubbles2\"></span></span> <span>&nbsp;&nbsp;Discussions</span></span> ·</div><hr><div class=\"description\" msd-wheel=\"stop_horizontal_scroll($event)\"><span itemprop=\"description\">{{focused_author.summary}}</span></div><hr><div class=\"users_count\">{{focused_author.users_count}} friends are follwing him his/her</div><div class=\"users\"><div ng-repeat=\"user in focused_author.users\"><img ng-src=\"{{user.thumb}}\"></div></div><div class=\"footer\"><span class=\"interact\" ng-click=\"focused_author.interact = true;\">What do you feel about this author</span></div><feed></feed></div>"
  );


  $templateCache.put('/assets/angular/views/unused/book.html',
    "<div ng-model=\"detailed_book.book\" class=\"detailed_book\"><div><div class=\"left_column\"></div><div class=\"content\"><div class=\"header\"><span>{{detailed_book.book.title | uppercase}} by</span><span data-page=\"about_author\">{{detailed_book.book.author_name | uppercase}}</span></div><div><div class=\"element\" data-page=\"gallery\"><span class=\"icon-picture\"></span> GALLERY<div class=\"page_number\"></div></div><div class=\"sub-links\"><div class=\"element\" id=\"firstSentence\" data-page=\"first_sentence\"><span class=\"icon-pen\"></span> First Sentence<div class=\"page_number\"></div></div><div class=\"element\" id=\"characters\" data-page=\"characters\"><span class=\"icon-user\"></span> Characters<div class=\"page_number\"></div></div><div class=\"element\" id=\"quotes\" data-page=\"quotes\"><span class=\"icon-quote-left\"></span> Quotes<div class=\"page_number\"></div></div><div class=\"element\" id=\"themes\" data-page=\"themes\"><span class=\"icon-dice\"></span> Themes<div class=\"page_number\"></div></div><div class=\"element\" id=\"subjectPlaces\" data-page=\"subject_places\"><span class=\"icon-earth\"></span> Subject Places<div class=\"page_number\"></div></div><div class=\"element\" id=\"moviesBased\" data-page=\"movies_based\"><span class=\"icon-film\"></span> Movies based<div class=\"page_number\"></div></div><div class=\"element\" id=\"tags\" data-page=\"tags\"><span class=\"icon-tags\"></span> Tags<div class=\"page_number\"></div></div></div></div><div><div class=\"element\" id=\"readers\" data-page=\"readers\"><span class=\"icon-users\"></span> READERS<div class=\"page_number\"></div></div></div><div><div class=\"element\" id=\"news\" data-page=\"news\"><span class=\"icon-newspaper\"></span> NEWS<div class=\"page_number\"></div></div></div><div><div class=\"element\" id=\"reviews\" data-page=\"reviews\"><span class=\"icon-pencil2\"></span> REVIEWS<div class=\"page_number\"></div></div></div><div><div class=\"element\" id=\"discussions\" data-page=\"discussions\"><span class=\"icon-bubbles2\"></span> DISCUSSIONS<div class=\"page_number\"></div></div></div><div><div class=\"element\" id=\"aboutAuthor\" data-page=\"about_author\"><span class=\"icon-user2\"></span> ABOUT AUTHOR<div class=\"page_number\"></div></div></div><div class=\"note_for_parents\" ng-model=\"detailed_book['book'].note_for_parents\"><div class=\"header\"><span class=\"icon-pushpin\"></span> Note For Parents</div><div class=\"share\">{{detailed_book['book'].note_for_parents}}</div></div></div><div class=\"right_column\"></div></div><div><div class=\"left_column\"></div><div class=\"first_sentence\" ng-model=\"detailed_book['book'].first_sentence\"><div class=\"header\"><span class=\"icon-pen\"></span> FIRST SENTENCE</div><div class=\"sentence share\">{{detailed_book['book'].first_sentence}}</div></div><div class=\"right_column\"></div></div><div><div class=\"left_column\"></div><div class=\"characters\" ng-model=\"detailed_book['book'].characters\"><div class=\"header\"><span class=\"icon-user\"></span> CHARACTERS</div><div class=\"elements\"><div class=\"character share\" ng-repeat=\"character in detailed_book['book'].characters\"><p>{{character.name}}<br><em>{{character.description}}</em></p></div></div></div><div class=\"right_column\"></div></div><div><div class=\"left_column\"></div><div class=\"quotes\" ng-model=\"detailed_book['book'].quotes\"><div class=\"header\"><span class=\"icon-quote-left\"></span> QUOTES</div><div class=\"elements\"><div class=\"quote share\" ng-click=\"share_quote()\" ng-repeat=\"quote in detailed_book['book'].quotes\"><div><span class=\"icon-quote-left\"></span>&nbsp;&nbsp;{{quote.quote}}&nbsp;&nbsp;<span class=\"icon-quote-right\"></span><br><br><em>{{quote.from}}</em><br><br></div><div class=\"description\"><span>{{quote.like_count}} likes ·</span> <span>{{quote.dislike_count}} dislikes ·</span> <span>{{quote.share_count}} shares ·</span> <span class=\"like\">Like</span> · <span class=\"dislike\">Dislike</span></div></div></div></div><div class=\"right_column\"></div></div><div><div class=\"left_column\"></div><div class=\"themes\" ng-model=\"detailed_book['book'].themes\"><div class=\"header\"><span class=\"icon-dice\"></span> THEMES</div><div class=\"elements\"><div class=\"theme share\" ng-repeat=\"theme in detailed_book['book'].themes\">{{theme.title}} {{theme.description}}</div></div></div><div class=\"right_column\"></div></div><div itemscope=\"\" itemtype=\"http://schema.org/Place\"><div class=\"left_column\"></div><div class=\"subject_places\" ng-model=\"detailed_book['book'].subject_places\"><div class=\"header\"><span class=\"icon-earth\"></span> SUBJECT PLACES</div><div><div class=\"subject_place share\" ng-repeat=\"subject_place in detailed_book['book'].subject_places\"><span itemprop=\"name\">{{subject_place}}</span></div></div></div><div class=\"right_column\"></div></div><div itemscope=\"\" itemtype=\"http://schema.org/Movie\"><div class=\"left_column\"></div><div class=\"movies_based\" ng-model=\"detailed_book['book'].movies_based\"><div class=\"header\"><span class=\"icon-film\"></span> MOVIES BASED</div><div><div class=\"movie_based share\" ng-repeat=\"movie_based in detailed_book['book'].movies_based\"><span itemprop=\"name\">{{movie_based}}</span></div></div></div><div class=\"right_column\"></div></div><div><div class=\"left_column\"></div><div class=\"book_tags\" ng-model=\"detailed_book['book'].tags\"><div class=\"header\"><span class=\"icon-tags\"></span> TAGS</div><div class=\"elements\"><div class=\"book_tag\" ng-repeat=\"tag in detailed_book['book'].tags\"><div class=\"header\"><div><span class=\"loading_icon\" style=\"display:none\"><img src=\"assets/download.gif\"></span></div><div class=\"tag_content\"><a href=\"{{tag.url}}\"><span itemprop=\"genre\">{{tag.name | uppercase}}</span></a><br><span class=\"description\"><a ng-href=\"{{tag.books_url}}\"><span>{{tag.book_count}} Books</span> ·</a> <span>{{tag.like_count}} <span class=\"icon-thumbs-up\"></span></span> · <span>{{tag.dislike_count}} <span class=\"icon-thumbs-up2\"></span></span> · <span class=\"like\">Like</span> · <span class=\"dislike\">Dislike</span></span></div></div><div class=\"tag_quotes\"></div></div></div></div><div class=\"right_column\"></div></div><div><div class=\"left_column\"></div><div class=\"readers\"><div class=\"header\"><span class=\"icon-users\"></span> READERS</div></div><div class=\"right_column\"></div></div><div itemscope=\"\" itemtype=\"http://schema.org/NewsArticle\"><div class=\"left_column\"></div><div class=\"news\" id=\"newsElement\"><div class=\"header\"><span class=\"icon-newspaper\"></span> NEWS</div><div class=\"elements\"><div class=\"news_element share\" ng-repeat=\"news in detailed_book['book'].news\"><div class=\"container\"><span class=\"header\" itemprop=\"name\">{{news.title}}</span> <span class=\"timestamp\">{{news.timestamp}}</span> <img ng-src=\"{{news.thumb}}\" ng-if=\"is_image(news.type)\"><embed name=\"player1\" ng-if=\"!is_image(news.type)\" src=\"http://s.ytimg.com/yts/swfbin/player-vflkbQlej/watch_as3.swf\" bgcolor=\"#000000\" allowfullscreen=\"true\" wmode=\"transparent\" allowscriptaccess=\"always\" flashvars=\"view_count=11575&amp;is_html5_mobile_device=false&amp;eurl=http%3A%2F%2Fwww.synthtopia.com%2Fcontent%2F2014%2F02%2F28%2Fsiddhartha-by-herman-hesse-with-musical-interpretation-by-william-corgan%2F&amp;el=embedded&amp;fs=1&amp;iv_load_policy=1&amp;rel=1&amp;enablejsapi=1&amp;allow_ratings=0&amp;authuser=0&amp;hl=en_GB&amp;user_display_name=Bhuwan%20Arora&amp;iurl=http%3A%2F%2Fi1.ytimg.com%2Fvi%2FC3tV8n-CVnA%2Fhqdefault.jpg&amp;cr=IN&amp;user_display_image=https%3A%2F%2Fyt3.ggpht.com%2F-ylXtTSmH1GM%2FAAAAAAAAAAI%2FAAAAAAAAAAA%2Fa_lGY0TmAVM%2Fs28-c-k-no%2Fphoto.jpg&amp;title=%22SIDDHARTHA%22%20BY%20HERMAN%20HESSE%2C%20WITH%20MUSICAL%20INTE...&amp;probably_logged_in=1&amp;fexp=930403%2C942000%2C941404%2C914088%2C916626%2C929313%2C936119%2C933610%2C937417%2C913434%2C936910%2C936913%2C934022%2C3300006%2C3300101%2C3300133%2C3300137%2C3300164%2C3310621%2C3310649&amp;sendtmp=1&amp;sentiment=2&amp;ldpj=-20&amp;showinfo=1&amp;avg_rating=0&amp;allow_embed=1&amp;idpj=-4&amp;video_id=C3tV8n-CVnA&amp;showsearch=0&amp;length_seconds=28794&amp;watch_xlb=http%3A%2F%2Fs.ytimg.com%2Fyts%2Fxlbbin%2Fwatch-strings-en_GB-vflXa_Lse.xlb&amp;loaderUrl=http%3A%2F%2Fwww.synthtopia.com%2Fcontent%2F2014%2F02%2F28%2Fsiddhartha-by-herman-hesse-with-musical-interpretation-by-william-corgan%2F&amp;playerapiid=player1&amp;framer=http%3A%2F%2Fwww.synthtopia.com%2Fcontent%2F2014%2F02%2F28%2Fsiddhartha-by-herman-hesse-with-musical-interpretation-by-william-corgan%2F\"></div><div class=\"description\"><span itemprop=\"description\">{{news.description}}</span></div><div itemprop=\"sourceOrganization\" itemscope=\"\" itemtype=\"http://schema.or/Organization\" class=\"source\"><span itemprop=\"name\">Source: {{news.source}}</span></div></div></div></div><div class=\"right_column\"></div></div><div itemprop=\"review\" itemscope=\"\" itemtype=\"http://schema.org/Review\"><div class=\"left_column\"></div><div class=\"reviews\"><div itemscope=\"\" itemtype=\"http://schema.org/AggregateRating\" class=\"header\"><span class=\"icon-pencil2\"></span> <span itemprop=\"reviewCount\">{{detailed_book['book'].total_reviews_count}} REVIEWS</span> <span style=\"display:block\" class=\"write_review\"><span class=\"icon-plus\"></span> Write a review</span> <span style=\"display:none\" class=\"close_review\"><span class=\"icon-close\"></span> Back to reviews</span></div><div class=\"text_editor\" style=\"display:none\"><textarea angularte=\"\" ng-model=\"descrizione\"></textarea></div><div class=\"elements\"><div ng-repeat=\"review in detailed_book['book'].reviews\" class=\"review\"><div class=\"header\"><img ng-src=\"{{review.user.thumb}}\" class=\"review_thumb\" ns-popover=\"\" ns-popover-hide-on-click=\"false\" ns-popover-template=\"userPopover\" ns-popover-trigger=\"mouseover\" ns-popover-timeout=\"0\" ns-popover-placement=\"bottom|left\"> <span itemscope=\"\" itemtype=\"http://schema.org/UserComments\"><span itemprop=\"commentTime\">{{review.timestamp}}</span></span> <span>{{review.comment_count}} comments ·</span> <span>{{review.dislike_count}} <span class=\"icon-thumbs-up2\"></span> ·</span> <span>{{review.like_count}} <span class=\"icon-thumbs-up\"></span> ·</span> <span><a ng-href=\"{{review.user.url}}\">{{review.user.name}}</a> ·</span> <span class=\"review_header\"><b>{{review.heading}}</b></span></div><div class=\"review_content\"><span itemprop=\"reviewBody\">{{review.content}}</span><div class=\"comments\"><div ng-repeat=\"discussion in review.comments\"><discussion data=\"discussion\" index=\"$index\"></discussion><div class=\"nested_comments\"><div ng-repeat=\"discussion in discussion.comments\"><discussion data=\"discussion\" index=\"$index\"></discussion></div></div></div></div></div></div></div></div><div class=\"right_column\"></div></div><div><div class=\"left_column\"></div><div class=\"discussions\"><div class=\"header\"><span class=\"icon-bubbles2\"></span> DISCUSSIONS</div><div class=\"elements\"><div ng-if=\"detailed_book['book'].total_discussions_count == 0\"><h1>What do you feel about this book. Start the discussion.</h1><img src=\"assets/discussions.png\" width=\"250px\"></div><div ng-repeat=\"discussion in detailed_book['book'].discussions\"><discussion data=\"discussion\" index=\"$index\"></discussion><div class=\"nested_comments\"><div ng-repeat=\"discussion in discussion.comments\"><discussion data=\"discussion\" index=\"$index\"></discussion></div></div></div><div class=\"more_comments\">{{detailed_book['book'].left_discussions_count}} More Discussions</div></div></div><div class=\"right_column\"></div></div><div itemprop=\"author\" itemscope=\"\" itemptype=\"http://schema.org/Person\"><div class=\"left_column\"></div><div class=\"about_author\"><div class=\"header\"><span class=\"icon-user2\"></span> <span itemprop=\"description\">ABOUT AUTHOR</span></div><img ng-src=\"{{detailed_book['book'].author.thumb}}\" class=\"author_thumb\"></div><div class=\"right_column\"></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/book_navbar.html',
    "<div class=\"book_navbar_base\"><div class=\"heading animate_fast\" ng-click=\"show_book(9)\"><h2>{{book.readers_count}}{{show_book}}</h2><span class=\"icon-users2\"></span> READERS</div><div class=\"heading animate_fast\" ng-click=\"show_book(12)\"><h2>{{book.discussions_count}}</h2><span class=\"icon-bubbles2\"></span> DISCUSSIONS</div><div class=\"heading animate_fast\" ng-click=\"show_book(11)\"><h2><span itemprop=\"aggregateRating\" itemscope=\"\" itemtype=\"http://schema.org/AggregateRating\"><span itemprop=\"reviewCount\">{{book.reviews_count}}</span></span></h2><span class=\"icon-pencil2\"></span> REVIEWS</div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/book_tags.html',
    "<div class=\"tags\"><div ng-model=\"tags\" ng-repeat=\"tag in book.tags\" class=\"tag animate-fast\" ng-show=\"hovered\" ng-hide=\"!hovered\" ng-click=\"show_book(10)\"><span itemprop=\"genre\"><span class=\"icon-tag\"></span> +{{tag.name | uppercase}}</span></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/category.html',
    "<div class=\"category\" ng-class=\"{'category_hovered': discovered}\" ng-mouseenter=\"hovered=true; category_hovered=true\" ng-mouseleave=\"hovered=false; category_hovered=false\" ng-init=\"initVerticalText()\"><div class=\"book_rating\">{{rating | rating}}</div><div class=\"category_character_top category_character\">&nbsp;</div><div ng-repeat=\"i in nameArray track by $index\" class=\"category_character\">{{i | uppercase}}<br></div><div class=\"category_character_bottom category_character\">&nbsp;</div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/discussion.html',
    "<div class=\"discussion\" ng-class=\"{'grey_background':!is_even({{index}})}\"><div class=\"user\" ns-popover=\"\" ns-popover-template=\"userPopover\" ns-popover-trigger=\"mouseover\" ns-popover-timeout=\"0\" hide-on-click=\"false\" ns-popover-ns-popover-placement=\"bottom|left\"><img ng-src=\"{{discussion.user.thumb}}\" class=\"thumb\"></div><div class=\"comment\" itemscope=\"\" itemtype=\"http://schema.org/UserComments\"><div class=\"username\"><div itemprop=\"creator \" itemscope=\"\" itemtype=\"http://schema.org/Person\"><span itemprop=\"name\">{{discussion.user.name}}</span> {{index}}</div></div><div class=\"comment_text\"><span itemprop=\"commentText\">{{discussion.comment}}</span></div><div class=\"footer\"><span class=\"like\">Like</span> <span class=\"dislike\">Dislike</span> <span class=\"post_comment\"><u>Comment</u></span> <span itemprop=\"commentTime\">{{discussion.timestamp}}</span></div><div class=\"comment_big_box\" style=\"display:none\"><input class=\"comment_box\" placeholder=\"Press enter to send...\"></div></div></div><script type=\"text/ng-template\" id=\"userPopover\"><div class=\"triangle\"></div>\r" +
    "\n" +
    "  \t<div class=\"tooltip user_tooltip\">\r" +
    "\n" +
    "    \t<div class=\"header\">\r" +
    "\n" +
    "    \t\tUsername from Country or state\r" +
    "\n" +
    "    \t</div>\r" +
    "\n" +
    "    \t<hr>\r" +
    "\n" +
    "    \t<div class=\"details\">\r" +
    "\n" +
    "    \t\t<span class=\"count\">N </span><span>books read</span> · \r" +
    "\n" +
    "    \t\t<span class=\"count\">N </span><span>profile views</span> · \r" +
    "\n" +
    "    \t\t<span class=\"count\">N </span><span>followers</span> · \r" +
    "\n" +
    "    \t\t<span>Following</span><span class=\"count\"> N</span><span> readers</span>\r" +
    "\n" +
    "    \t</div>\r" +
    "\n" +
    "    \t<div class=\"recommends\">\r" +
    "\n" +
    "    \t</div>\r" +
    "\n" +
    "    \t<div class=\"footer\">\r" +
    "\n" +
    "    \t\t<span class=\"timestamp\">Member Since</span>\r" +
    "\n" +
    "    \t\t<span class=\"follow\">Follow</span>\r" +
    "\n" +
    "    \t\t<span class=\"send_message\">Message</span>\r" +
    "\n" +
    "    \t</div>\r" +
    "\n" +
    "  </div></script>"
  );


  $templateCache.put('/assets/angular/views/unused/dock.html',
    "<ul class=\"book_footer\"><li ng-click=\"turn_page('content')\" class=\"content\"><div class=\"icon-file3 gallery_icon\"></div></li><li ng-click=\"turn_page('first_sentence')\" class=\"first_sentence\"><div class=\"icon-pen first_sentence_icon\"></div></li><li ng-click=\"turn_page('characters')\" class=\"characters\"><div class=\"icon-user characters_icon\"></div></li><li ng-click=\"turn_page('quotes')\" class=\"quotes\"><div class=\"icon-quote-left quotes_icon\"></div></li><li ng-click=\"turn_page('themes')\" class=\"themes\"><div class=\"icon-dice themes_icon\"></div></li><li ng-click=\"turn_page('subject_places')\" class=\"subject_places\"><div class=\"icon-earth subject_places_icon\"></div></li><li ng-click=\"turn_page('movies_based')\" class=\"movies_based\"><div class=\"icon-film movies_based_icon\"></div></li><li ng-click=\"turn_page('tags')\" class=\"footer_tags\"><div class=\"icon-tags tags_icon\"></div></li><li ng-click=\"turn_page('readers')\" class=\"readers\"><div class=\"icon-users readers_icon\"></div></li><li ng-click=\"turn_page('news')\" class=\"news\"><div class=\"icon-newspaper news_icon\"></div></li><li ng-click=\"turn_page('reviews')\" class=\"reviews\"><div class=\"icon-pencil2 reviews_icon\"></div></li><li ng-click=\"turn_page('discussions')\" class=\"discussions\"><div class=\"icon-bubbles2 discussions_icon\"></div></li><li ng-click=\"turn_page('about_author')\" class=\"about_author\"><div class=\"icon-user2 about_author_icon\"></div></li></ul>"
  );


  $templateCache.put('/assets/angular/views/unused/follow.html',
    "<div class=\"left_action button_effect action_button\" ng-class=\"{'left_action_active':reader.follow || author.follow}\" ng-click=\"toggle_follow()\"><span ng-show=\"!reader.follow && !author.follow\">Follow</span> <span ng-show=\"reader.follow || author.follow\">Unfollow</span></div>"
  );


  $templateCache.put('/assets/angular/views/unused/horizontal_scroller.html',
    "<div class=\"horizontal_scroller_left horizontal_scroller\" ng-click=\"scrollOnePageLeft($event)\"></div><div class=\"horizontal_scroller_right horizontal_scroller\" ng-click=\"scrollOnePageRight($event)\"></div>"
  );


  $templateCache.put('/assets/angular/views/unused/mark_as_read.html',
    "<div class=\"right_action action_button\" ng-class=\"{'dark_green_color':book.status}\" title=\"Mark as Read\" ng-click=\"mark_as_read($event)\"><span class=\"icon-books table_cell table_cell_icon\"></span></div>"
  );


  $templateCache.put('/assets/angular/views/unused/message.html',
    "<div ng-if=\"!message_closed\" class=\"message animate-slow\"><span>{{message}}</span> <span ng-click=\"close_message()\" class=\"close\">UNDERSTOOD</span></div>"
  );


  $templateCache.put('/assets/angular/views/unused/message_app.html',
    "<div class=\"right_action button_effect\" ng-click=\"toggle_message_box()\"><span class=\"icon-message\"></span> <span>Message</span></div>"
  );


  $templateCache.put('/assets/angular/views/unused/more_filters.html',
    "<div class=\"more_filters animate-fast\" ng-hide=\"user.collapsed_column\" ng-click=\"stop_click_propagation($event)\"><div ng-if=\"!bookmark_selected && !read_selected\"><div class=\"full_width\" ng-if=\"$routeParams.type == 'books'\"><div class=\"filter_header\" ng-click=\"show_lists = false; handle_left_columns();\"><span><span class=\"icon-filter2\"></span> <span>&nbsp;&nbsp;Filter Books</span></span> <a ng-href=\"#/user/{{$routeParams.id}}/recommendations/{{$routeParams.type}}\" ng-click=\"reset_filters()\" class=\"reset_filters\"><span>RESET</span></a></div><div class=\"filter_group\" ng-if=\"!show_lists && column_heights.show_filters\"><div class=\"filters_panel\"><type-ahead items=\"genres\" prompt=\"Books by Genre\" title=\"name\" icon-class=\"icon-shapes filter_icon green_color\" custom-options=\"z_index_two genre_typeahead_options\" custom=\"input_filter\" model=\"genre\" item-id=\"itemId\" on-clear=\"clear_filter('BOOK', 'genre')\" on-select=\"on_genre_selection(itemId)\" auto-populate=\"show_genre_options('BOOK', genre)\" ng-keypress=\"show_genre_options('BOOK', genre)\" focus-when=\"genre_selected\"></type-ahead><type-ahead items=\"authors\" prompt=\"Books from Author\" title=\"name\" icon-class=\"icon-pen filter_icon purple_color\" custom-options=\"author_typeahead_options\" custom=\"input_filter\" model=\"author\" item-id=\"itemId\" on-clear=\"clear_filter('BOOK', 'author')\" on-select=\"on_author_selection(itemId)\" ng-keypress=\"show_author_options('BOOK', author)\" focus-when=\"author_selected\"></type-ahead></div><div class=\"filters_panel_right\"><div class=\"inline_block_left\" dropdown-select=\"countryOptions\" dropdown-onchange=\"advance_filter_changed(selected, 'country')\" dropdown-model=\"countrySelected\" dropdown-item-label=\"name\"></div><div class=\"inline_block_left\" dropdown-select=\"readTimeOptions\" dropdown-onchange=\"advance_filter_changed(selected, 'readingTime')\" dropdown-model=\"readTimeSelected\" dropdown-item-label=\"name\"></div><div class=\"inline_block_left\" dropdown-select=\"timeOptions\" dropdown-onchange=\"advance_filter_changed(selected, 'timeGroup')\" dropdown-model=\"timeSelected\" dropdown-item-label=\"name\"></div></div></div><div ng-click=\"show_lists = true; handle_left_columns();\" class=\"filter_header\"><span class=\"icon-menu2\"></span><span>&nbsp;&nbsp;&nbsp;Show Lists</span></div><div class=\"filters_panel_large\" ng-if=\"show_lists && column_heights.show_filters\"><div class=\"filters_group\" ng-if=\"more_filters[0]['book']\"><div ng-repeat=\"filter in more_filters[0]['book']\"><filter data=\"filter\"></filter></div></div><div class=\"filters_group\" ng-if=\"!more_filters[0]['book']\">Coming Soon...</div></div></div><div class=\"full_width\" ng-if=\"$routeParams.type == 'authors'\"><div class=\"filters_panel_large\"><div class=\"filters_group\"><div ng-repeat=\"filter in more_filters[0]['author']\"><filter data=\"filter\"></filter></div></div></div><div class=\"filters_panel\"><type-ahead items=\"genres\" prompt=\"GENRE\" title=\"name\" custom-options=\"genre_typeahead_options\" custom=\"input_filter\" model=\"genre\" on-select=\"on_genre_selection()\" ng-keypress=\"show_genre_options('BOOK', genre)\"></type-ahead></div><div class=\"filters_panel_right\"></div></div><div class=\"full_width\" ng-if=\"$routeParams.type == 'readers'\"><div class=\"filters_panel_large\"><div class=\"filters_group\"><div ng-repeat=\"filter in more_filters[0]['reader']\"><filter data=\"filter\"></filter></div></div></div><div class=\"filters_panel\"><type-ahead items=\"genres\" prompt=\"GENRE\" title=\"name\" custom-options=\"genre_typeahead_options\" custom=\"input_filter\" model=\"genre\" on-select=\"on_genre_selection()\" ng-keypress=\"show_genre_options('BOOK', genre)\"></type-ahead></div><div class=\"filters_panel_right\"><div class=\"header\"></div></div></div></div><div ng-if=\"bookmark_selected\"><div class=\"filter_header\" ng-click=\"show_lists = false; handle_left_columns();\"><span><span class=\"icon-bookmark3\"></span> <span>&nbsp;&nbsp;Bookmark Tags</span></span></div><div class=\"full_width\" ng-if=\"$routeParams.type == 'books'\"><div class=\"filter_group\" ng-if=\"!show_lists && column_heights.show_filters\"><div class=\"filters_panel_large\"><div class=\"filters_group restrict_height scrollbar\" msd-wheel=\"stop_horizontal_scroll($event)\"><div ng-repeat=\"filter in labels\"><filter data=\"filter\"></filter></div></div></div></div></div><div class=\"full_width\" ng-if=\"$routeParams.type == 'authors'\">{{labels}}</div><div class=\"full_width\" ng-if=\"$routeParams.type == 'readers'\">{{labels}}</div></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/notification_link.html',
    "<div class=\"notification_link\" ng-class=\"{'site_color':show_notifications}\" title=\"Notifications\" ng-click=\"toggle_notifications()\"><div class=\"notification_circle\" ng-show=\"!notifications_seen\">{{notifications.length}}</div><span class=\"icon-bell\"></span></div>"
  );


  $templateCache.put('/assets/angular/views/unused/reader/focused_reader.html',
    "<div class=\"focused_tooltip animate-fast\" ng-style=\"focused_reader.reposition_tooltip\" ng-click=\"stop_propagation($event)\" ng-if=\"focused_reader\"><div class=\"close button_effect\" ng-click=\"close_focused_tooltip()\">x</div><div class=\"book_info\"><span>·</span> <span class=\"book_link\"><span class=\"count\"><span>{{focused_reader.readers_count}}</span> <span class=\"icon-users2\"></span></span> <span>&nbsp;&nbsp;Readers</span></span> · <span itemprop=\"aggregateRating\" itemscope=\"\" itemtype=\"http://schema.org/AggregateRating\" class=\"book_link\"><span class=\"count\"><span>{{focused_reader.reviews_count}}</span> <span class=\"icon-pencil2\"></span></span> <span>&nbsp;&nbsp;Reviews</span></span> · <span class=\"book_link\"><span class=\"count\"><span>{{focused_reader.discussions_count}}</span> <span class=\"icon-bubbles2\"></span></span> <span>&nbsp;&nbsp;Discussions</span></span> ·</div><hr><div class=\"description\" msd-wheel=\"stop_horizontal_scroll($event)\"><span itemprop=\"description\">{{focused_reader.summary}}</span></div><hr><div class=\"users_count\">{{focused_reader.users_count}} mutual friends</div><div class=\"users\"><div ng-repeat=\"user in focused_reader.users\"><img ng-src=\"{{user.thumb}}\"></div></div><div class=\"footer\"></div><feed></feed></div>"
  );


  $templateCache.put('/assets/angular/views/unused/reader/message_box.html',
    "<div class=\"message_box animate-fast action_button\" ng-if=\"reader.show_message_box\"><div class=\"close_button button_effect\" ng-click=\"close_message_box()\">x</div><textarea type=\"text\" placeholder=\"type and enter to send message..\" class=\"comment_box animate-fast\" rows=\"1\">\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/assets/angular/views/unused/reader/reader_interact.html',
    "<div class=\"bottom_widget\"><follow track=\"\"></follow><message-app track=\"\"></message-app><message-box></message-box></div>"
  );


  $templateCache.put('/assets/angular/views/unused/reader/reader_widget.html',
    "<div class=\"animate-fast widget\"><div ng-model=\"reader\" ng-mouseenter=\"discovered = true\" ng-mouseover=\"hover()\" ng-mouseout=\"mouseout()\" ng-click=\"show_focused_tooltip($event)\" ng-class=\"{'discovered': hovered, 'undiscovered': !hovered}\" class=\"card animate-fast\"><widget-thumb track=\"\"></widget-thumb><reader-interact track=\"\"></reader-interact></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/reviews.html',
    "<div itemprop=\"review\" itemscope=\"\" itemtype=\"http://schema.org/Review\"><div class=\"left_column\"></div><div class=\"reviews\"><div itemscope=\"\" itemtype=\"http://schema.org/AggregateRating\" class=\"header\"><span class=\"icon-pencil2\"></span> <span itemprop=\"reviewCount\">{{detailed_book['book'].total_reviews_count}} REVIEWS</span> <span style=\"display:block\" class=\"write_review\"><span class=\"icon-plus\"></span> Write a review</span> <span style=\"display:none\" class=\"close_review\"><span class=\"icon-close\"></span> Back to reviews</span></div><div class=\"text_editor\" style=\"display:none\"><textarea angularte=\"\" ng-model=\"descrizione\"></textarea></div><div class=\"elements\"><div ng-repeat=\"review in detailed_book['book'].reviews\" class=\"review\"><div class=\"header\"><img ng-src=\"{{review.user.thumb}}\" class=\"review_thumb\" ns-popover=\"\" ns-popover-hide-on-click=\"false\" ns-popover-template=\"userPopover\" ns-popover-trigger=\"mouseover\" ns-popover-timeout=\"0\" ns-popover-placement=\"bottom|left\"> <span itemscope=\"\" itemtype=\"http://schema.org/UserComments\"><span itemprop=\"commentTime\">{{review.timestamp}}</span></span> <span>{{review.comment_count}} comments ·</span> <span>{{review.dislike_count}} <span class=\"icon-thumbs-up2\"></span> ·</span> <span>{{review.like_count}} <span class=\"icon-thumbs-up\"></span> ·</span> <span><a ng-href=\"{{review.user.url}}\">{{review.user.name}}</a> ·</span> <span class=\"review_header\"><b>{{review.heading}}</b></span></div><div class=\"review_content\"><span itemprop=\"reviewBody\">{{review.content}}</span><div class=\"comments\"><div ng-repeat=\"discussion in review.comments\"><discussion data=\"discussion\" index=\"$index\"></discussion><div class=\"nested_comments\"><div ng-repeat=\"discussion in discussion.comments\"><discussion data=\"discussion\" index=\"$index\"></discussion></div></div></div></div></div></div></div></div><div class=\"right_column\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/s3_upload.html',
    ""
  );


  $templateCache.put('/assets/angular/views/unused/site_logo.html',
    "<span>r</span> <span>e</span> <span>a</span> <span>d</span> <span>e</span> <span>r</span> <span>'</span> <span>s</span> <span>&nbsp;</span> <span>d</span> <span>o</span> <span>o</span> <span>r</span>"
  );


  $templateCache.put('/assets/angular/views/unused/timeline.html',
    "<link rel=\"stylesheet\" type=\"text/css\" href=\"assets/book_timeline.css.scss\"><div class=\"timeline_wrapper\"><div class=\"book_timeline\" ng-controller=\"bookTimelineController\"><div class=\"header\"><span class=\"title\">Siddhartha</span> <span class=\"author\">by Hermann Hesse</span></div><div ng-repeat=\"moment in moments\" class=\"moment\"><div class=\"vote\">{{moment.votes}}</div><div class=\"moment_description\"><div class=\"quote\"><span class=\"icon-quote-left\"></span> <span>{{moment.quote}}</span> <span class=\"icon-quote-right\"></span></div><div class=\"description\">{{moment.moment}}</div></div></div></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/tour_tip.html',
    "<div class=\"tour_tip\" ng-class=\"{'scrollbar': scroll}\" msd-wheel=\"stop_horizontal_scroll($event)\"><div>{{prependText}}&nbsp;{{text}}{{pluralize}}&nbsp;{{appendText}}</div><div class=\"arrow_down tour_tip_arrow\" ng-show=\"position == 'top'\"></div><div class=\"arrow_up tour_tip_arrow\" ng-show=\"position == 'bottom'\"></div><div class=\"arrow_left tour_tip_arrow\" ng-show=\"position == 'right'\"></div><div class=\"arrow_right tour_tip_arrow\" ng-show=\"position == 'left'\"></div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/type_ahead.html',
    "<div class=\"typeahead_group {{customOptions}}\"><div class=\"typeahead_options\" ng-hide=\"selected\"><div ng-repeat=\"item in filtered = (items | filter:model)  track by $index\" ng-click=\"handle_selection(item)\" ng-class=\"{active:is_current($index, item)}\" ng-mouseenter=\"set_current($index)\" class=\"option\" ng-bind-html=\"highlight(model, item[title])\"></div></div><span class=\"{{iconClass}}\"></span><input type=\"text\" ng-model=\"model\" placeholder=\"{{prompt}}\" ng-keydown=\"selected=false\" ng-keypress=\"navigate_options()\" ng-keyup=\"key_up()\" ng-click=\"auto_populate()\" ng-mouseenter=\"focus_on_input($event)\" class=\"{{custom}}\" set-focus=\"{{focusWhen}}\"><div class=\"remove_filter\" ng-if=\"selected && model\" ng-click=\"remove_filter()\">x</div></div>"
  );


  $templateCache.put('/assets/angular/views/unused/user_thumb.html',
    "<img ng-src=\"{{user.thumb}}\" class=\"profile_small_thumb\" ng-if=\"user.thumb\"> <img src=\"assets/profile_pic.jpeg\" ng-if=\"!user.thumb\">"
  );

}]);
