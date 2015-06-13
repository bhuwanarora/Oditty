ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do

      match "get_similar_books"                      => 'books_api#get_similar_books',                  :via => [:put, :get, :post]
      match "book"                                   => 'books_api#get_book_details',                   :via => [:put, :get, :post]
      match "basic_book"                             => 'books_api#get_basic_feed_info',                :via => [:put, :get, :post]
      match "book_primary_info"                      => 'books_api#get_primary_info',                   :via => [:put, :get, :post]
      match "book_feed"                              => 'books_api#get_feed',                           :via => [:put, :get, :post]
      match "tooltip"                                => 'books_api#tooltip',                            :via => [:put, :get, :post]
      match "moments"                                => 'books_api#moments',                            :via => [:put, :get, :post]
      match "affiliate_links"                        => 'books_api#affiliate_links',                    :via => [:put, :get, :post]
      match "popular_books"                          => 'books_api#get_popular_books',                  :via => [:put, :get, :post]
      match "books_on_signup"                        => 'books_api#books_on_signup',                    :via => [:put, :get, :post]
      match "add_thumbnail"                          => 'books_api#add_thumbnail',                      :via => [:put, :get, :post]
      match "get_root_categories"                    => 'books_api#get_root_categories',                :via => [:put, :get, :post]
      match "update_visited"                         => 'books_api#update_visited',                     :via => [:put, :get, :post]
      match "get_interesting_info"                   => 'books_api#get_interesting_info',               :via => [:put, :get, :post]
    end
  end
end