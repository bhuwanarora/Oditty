ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "get_similar_books"                      => 'books_api#get_similar_books',                  :via => [:put, :get, :post]
      match "get_similar_authors"                    => 'authors_api#get_similar_authors',              :via => [:put, :get, :post]
      match "get_book_details"                       => 'books_api#get_book_details',                   :via => [:put, :get, :post]
      match "get_author_details"                     => 'authors_api#get_author_details',               :via => [:put, :get, :post]
      match "recommended_books"                      => 'recommendations_api#books',                    :via => [:put, :get, :post]
      match "recommendations"                        => 'recommendations_api#recommendations',          :via => [:put, :get, :post]
      match "track"                                  => 'analytics#track',                              :via => [:put, :get, :post]
      match "search"                                 => 'search_api#search',                             :via => [:put, :get, :post]
    end
  end
end
