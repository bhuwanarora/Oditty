ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "popular_authors"                        => 'authors_api#get_popular_authors',              :via => [:put, :get, :post]

      match "get_similar_books"                      => 'books_api#get_similar_books',                  :via => [:put, :get, :post]
      match "book"                                   => 'books_api#get_book_details',                   :via => [:put, :get, :post]
      match "book_feed"                              => 'books_api#get_feed',                           :via => [:put, :get, :post]
      match "tooltip"                                => 'books_api#tooltip',                            :via => [:put, :get, :post]
      match "moments"                                => 'books_api#moments',                            :via => [:put, :get, :post]
      match "affiliate_links"                        => 'books_api#affiliate_links',                    :via => [:put, :get, :post]
      match "popular_books"                          => 'books_api#get_popular_books',                  :via => [:put, :get, :post]
      match "add_thumbnail"                          => 'books_api#add_thumbnail',                      :via => [:put, :get, :post]

      match "get_similar_authors"                    => 'authors_api#get_similar_authors',              :via => [:put, :get, :post]
      match "get_author_details"                     => 'authors_api#get_author_details',               :via => [:put, :get, :post]

      match "grid"                                   => 'recommendations_api#grid',                     :via => [:put, :get, :post]
      match "recommended_books"                      => 'recommendations_api#books',                    :via => [:put, :get, :post]
      match "push_recommendations"                   => 'recommendations_api#push_recommendations',     :via => [:put, :get, :post]
      match "filters"                                => 'recommendations_api#filters',                  :via => [:put, :get, :post]
      match "recommendations"                        => 'recommendations_api#recommendations',          :via => [:put, :get, :post]

      match "track"                                  => 'analytics#track',                              :via => [:put, :get, :post]
      match "search"                                 => 'search_api#search',                            :via => [:put, :get, :post]
      match "search_books"                           => 'search_api#search_books',                      :via => [:put, :get, :post]

      match "genres"                                 => 'website_api#genres',                           :via => [:put, :get, :post]
      match "countries"                              => 'website_api#countries',                        :via => [:put, :get, :post]
      match "times"                                  => 'website_api#times',                            :via => [:put, :get, :post]
      match "labels"                                 => 'website_api#labels',                           :via => [:put, :get, :post]
      match "read_times"                             => 'website_api#read_times',                       :via => [:put, :get, :post]
      match "user_details"                           => 'website_api#get_user_details',                 :via => [:put, :get, :post]
      match "authenticate"                           => 'website_api#authenticate',                     :via => [:put, :get, :post]
      match "profile"                                => 'website_api#update_profile',                   :via => [:put, :get, :post]
      match "image"                                  => 'website_api#image',                            :via => [:put, :get, :post]
      match "notifications"                          => 'website_api#notifications',                    :via => [:put, :get, :post]
      match "latest_notification"                    => 'website_api#latest_notification',              :via => [:put, :get, :post]
      match "trends"                                 => 'website_api#trends',                           :via => [:put, :get, :post]

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
      match 'unfollow'                                => 'users_api#unfollow',                          :via => [:put, :get, :post]
      match 'user_info'                               => 'users_api#user_info',                         :via => [:put, :get, :post]
      match 'user'                                    => 'users_api#user',                              :via => [:put, :get, :post]
      match 'friends'                                 => 'users_api#get_most_connected_friends',        :via => [:put, :get, :post]
      match 'info_data'                               => 'users_api#get_info_card_data',                :via => [:put, :get, :post]
      match 'books_read'                              => 'users_api#books_read',                        :via => [:put, :get, :post]
      match 'books_bookmarked'                        => 'users_api#books_bookmarked',                  :via => [:put, :get, :post]
      match 'fb'                                      => 'users_api#fb',                                :via => [:put, :get, :post]
      match 'google'                                  => 'users_api#google',                            :via => [:put, :get, :post]
    end
  end
end