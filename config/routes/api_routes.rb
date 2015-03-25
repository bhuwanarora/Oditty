ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "popular_authors"                        => 'authors_api#get_popular_authors',              :via => [:put, :get, :post]

      match "get_similar_books"                      => 'books_api#get_similar_books',                  :via => [:put, :get, :post]
      match "book"                                   => 'books_api#get_book_details',                   :via => [:put, :get, :post]
      match "basic_book"                             => 'books_api#get_basic_book_details',             :via => [:put, :get, :post]
      match "book_feed"                              => 'books_api#get_feed',                           :via => [:put, :get, :post]
      match "tooltip"                                => 'books_api#tooltip',                            :via => [:put, :get, :post]
      match "moments"                                => 'books_api#moments',                            :via => [:put, :get, :post]
      match "affiliate_links"                        => 'books_api#affiliate_links',                    :via => [:put, :get, :post]
      match "popular_books"                          => 'books_api#get_popular_books',                  :via => [:put, :get, :post]
      match "books_on_signup"                        => 'books_api#books_on_signup',                    :via => [:put, :get, :post]
      match "add_thumbnail"                          => 'books_api#add_thumbnail',                      :via => [:put, :get, :post]
      match "get_root_categories"                    => 'books_api#get_root_categories',                 :via => [:put, :get, :post]                                              

      match "get_similar_authors"                    => 'authors_api#get_similar_authors',              :via => [:put, :get, :post]
      match "get_author_details"                     => 'authors_api#get_author_details',               :via => [:put, :get, :post]

      match "grid"                                   => 'recommendations_api#grid',                     :via => [:put, :get, :post]
      match "recommended_books"                      => 'recommendations_api#books',                    :via => [:put, :get, :post]
      match "push_recommendations"                   => 'recommendations_api#push_recommendations',     :via => [:put, :get, :post]
      match "filters"                                => 'recommendations_api#filters',                  :via => [:put, :get, :post]
      match "recommendations"                        => 'recommendations_api#recommendations',          :via => [:put, :get, :post]
      match "random_books"                           => 'recommendations_api#random_books',             :via => [:put, :get, :post]

      match "track"                                  => 'analytics#track',                              :via => [:put, :get, :post]
      match "search"                                 => 'search_api#search',                            :via => [:put, :get, :post]
      match "search_books"                           => 'search_api#search_books',                      :via => [:put, :get, :post]
      match "search_authors"                         => 'search_api#search_authors',                    :via => [:put, :get, :post]
      match "search_genres"                          => 'search_api#search_genres',                     :via => [:put, :get, :post]
      
      match "fb_books_map"                           => 'website_api#fb_books_map',                     :via => [:put, :get, :post]
      match "book_lists"                             => 'website_api#book_lists',                       :via => [:put, :get, :post]
      match "genres"                                 => 'website_api#genres',                           :via => [:put, :get, :post]
      match "countries"                              => 'website_api#countries',                        :via => [:put, :get, :post]
      match "times"                                  => 'website_api#times',                            :via => [:put, :get, :post]
      match "labels"                                 => 'website_api#labels',                           :via => [:put, :get, :post]
      match "add_label"                               => 'website_api#add_label',                       :via => [:put, :get, :post]

      match "read_times"                             => 'website_api#read_times',                       :via => [:put, :get, :post]
      match "notifications"                          => 'website_api#notifications',                    :via => [:put, :get, :post]
      match "latest_notification"                    => 'website_api#latest_notification',              :via => [:put, :get, :post]
      match "trends"                                 => 'website_api#trends',                           :via => [:put, :get, :post]
      match "save_feedback"                          => 'website_api#save_feedback',                    :via => [:put, :get, :post]
      match 'fb_books'                               => 'website_api#fb_books',                         :via => [:put, :get, :post]

      
      match "user_details"                            => 'users_api#get_user_details',                  :via => [:put, :get, :post]
      match "user_profile_info"                       => 'users_api#user_profile_info',                 :via => [:put, :get, :post]
      match "authenticate"                            => 'users_api#authenticate',                      :via => [:put, :get, :post]
      match "profile"                                 => 'users_api#update_profile',                    :via => [:put, :get, :post]
      match "image"                                   => 'users_api#image',                             :via => [:put, :get, :post]
      match "personal_notifications"                  => 'users_api#notifications',                     :via => [:put, :get, :post]
      match "recover_password"                        => 'users_api#recover_password',                  :via => [:put, :get, :post]
      match "logout"                                  => 'users_api#logout',                            :via => [:put, :get, :post]
      match 'save_info'                               => 'users_api#save_info',                         :via => [:put, :get, :post]
      match 'mar'                                     => 'users_api#mark_as_read',                      :via => [:put, :get, :post]
      match 'recommend'                               => 'users_api#recommend',                         :via => [:put, :get, :post]
      match 'bookmark'                                => 'users_api#bookmark',                          :via => [:put, :get, :post]
      match 'comment'                                 => 'users_api#comment',                           :via => [:put, :get, :post]
      match 'wdyf'                                    => 'users_api#what_do_you_feel_about_this_book',  :via => [:put, :get, :post]
      match 'time'                                    => 'users_api#time',                              :via => [:put, :get, :post]
      match 'rate'                                    => 'users_api#rate',                              :via => [:put, :get, :post]
      match 'own'                                     => 'users_api#own',                               :via => [:put, :get, :post]
      match 'like'                                    => 'users_api#like',                              :via => [:put, :get, :post]
      match 'dislike'                                 => 'users_api#dislike',                           :via => [:put, :get, :post]
      match 'post_review'                             => 'users_api#post_review',                       :via => [:put, :get, :post]
      match 'edit_review'                             => 'users_api#edit_review',                       :via => [:put, :get, :post]
      match 'follow'                                  => 'users_api#follow',                            :via => [:put, :get, :post]
      match "endorse_book"                            => 'users_api#endorse_book',                      :via => [:put, :get, :post]
      match "tiny_reads"                              => 'users_api#get_tiny_reads',                    :via => [:put, :get, :post]
      match "books_from_likeable_category"            => 'users_api#get_books_from_likeable_category',  :via => [:put, :get, :post]
      match "books_from_most_read_author"             => 'users_api#get_books_from_most_read_author',   :via => [:put, :get, :post]
      match "books_from_most_read_era"                => 'users_api#get_books_from_most_read_era',      :via => [:put, :get, :post]
      match "books_on_your_friends_shelves"           => 'users_api#books_on_your_friends_shelves',     :via => [:put, :get, :post]
      match "get_sorted_genres"                       => 'users_api#get_sorted_genres',                 :via => [:put, :get, :post]
      match "influential_books"                       => 'users_api#handle_influential_books',          :via => [:put, :get, :post]

      match 'user_info'                               => 'users_api#user_info',                         :via => [:put, :get, :post]
      match 'user'                                    => 'users_api#user',                              :via => [:put, :get, :post]
      match 'friends'                                 => 'users_api#get_most_connected_friends',        :via => [:put, :get, :post]
      match 'followed_by'                             => 'users_api#get_followed_by',                   :via => [:put, :get, :post]
      
      match 'info_data'                               => 'users_api#get_info_card_data',                :via => [:put, :get, :post]
      match 'books_read'                              => 'users_api#books_read',                        :via => [:put, :get, :post]
      match 'books_bookmarked'                        => 'users_api#books_bookmarked',                  :via => [:put, :get, :post]
      match 'fb'                                      => 'users_api#fb',                                :via => [:put, :get, :post]
      match 'google'                                  => 'users_api#google',                            :via => [:put, :get, :post]
      match 'small_reads'                             => 'users_api#get_small_reads',                   :via => [:put, :get, :post]
      match 'books_from_favourite_author'             => 'users_api#get_books_from_favourite_author',   :via => [:put, :get, :post]
      match 'books_from_favourite_category'           => 'users_api#get_books_from_favourite_category', :via => [:put, :get, :post]
      match 'books_from_favourite_era'                => 'users_api#get_books_from_favourite_era',      :via => [:put, :get, :post]
      match 'books_on_friends_shelves'                => 'users_api#get_books_on_friends_shelves',      :via => [:put, :get, :post]
      match 'books_from_unexplored_subjects'          => 'users_api#get_books_from_unexplored_subjects',:via => [:put, :get, :post]

      match 'author_details'                          => 'authors_api#details',                         :via => [:put, :get, :post]
      match 'feed'                                    => 'feeds_api#get_feed',                          :via => [:put, :get, :post]

      match 'bookshelves'                             => 'room_api#get_books',                          :via => [:put, :get, :post]    
      match 'articleshelves'                          => 'room_api#get_articles',                       :via => [:put, :get, :post]    
      match 'visited_books'                           => 'room_api#get_visited_books',                  :via => [:put, :get, :post]    
      match 'visited_articles'                        => 'room_api#get_visited_articles',               :via => [:put, :get, :post]    

    end
  end
end