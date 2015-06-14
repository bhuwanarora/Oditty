ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      # match "community_books"                                  => 'community_api#get_books',              :via => [:put, :get, :post]
      # match "communities"                                      => 'community_api#get_communities_chronologically',        :via => [:put, :get, :post]
      match "get_community_books"					=> 'community_api#get_books',		:via => [:get]
    end
  end
end