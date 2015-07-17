ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "search"                                 => 'search_api#search',                            :via => [:put, :get, :post]
      match "search_star_genre"                      => 'search_api#search_star_genre',                 :via => [:put, :get, :post]
      match "top_searches"                           => 'search_api#top_searches',                      :via => [:put, :get, :post]
    end
  end
end