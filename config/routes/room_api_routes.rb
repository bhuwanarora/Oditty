ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match 'book_shelves'                             => 'room_api#get_books',                          :via => [:put, :get, :post]    
      match 'article_shelves'                          => 'room_api#get_articles',                       :via => [:put, :get, :post]    
      match 'visited_books'                           => 'room_api#get_visited_books',                  :via => [:put, :get, :post]    
      match 'visited_articles'                        => 'room_api#get_visited_articles',               :via => [:put, :get, :post]    

    end
  end
end