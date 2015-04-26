ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "search"                                 => 'search_api#search',                            :via => [:put, :get, :post]
    end
  end
end