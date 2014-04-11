ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "get_similar_books"                      => 'books_api#get_similar_books',                  :via => [:put, :get, :post]
      match "book"                                   => 'books_api#get_book_details',                   :via => [:put, :get, :post]
      match "tooltip"                                => 'books_api#tooltip',                            :via => [:put, :get, :post]

      match "get_similar_authors"                    => 'authors_api#get_similar_authors',              :via => [:put, :get, :post]
      match "get_author_details"                     => 'authors_api#get_author_details',               :via => [:put, :get, :post]

      match "recommended_books"                      => 'recommendations_api#books',                    :via => [:put, :get, :post]
      match "push_recommendations"                   => 'recommendations_api#push_recommendations',     :via => [:put, :get, :post]
      match "filters"                                => 'recommendations_api#filters',                  :via => [:put, :get, :post]
      match "recommendations"                        => 'recommendations_api#recommendations',          :via => [:put, :get, :post]

      match "track"                                  => 'analytics#track',                              :via => [:put, :get, :post]
      match "search"                                 => 'search_api#search',                            :via => [:put, :get, :post]

      match "genres"                                 => 'website_api#genres',                           :via => [:put, :get, :post]
      match "countries"                              => 'website_api#countries',                        :via => [:put, :get, :post]
      match "user_details"                           => 'website_api#get_user_details',                 :via => [:put, :get, :post]
      match "authenticate"                           => 'website_api#authenticate',                     :via => [:put, :get, :post]
      match "profile"                                => 'website_api#update_profile',                   :via => [:put, :get, :post]
      match "image"                                  => 'website_api#image',                            :via => [:put, :get, :post]
    end
  end
end