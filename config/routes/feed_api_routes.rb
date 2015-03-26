ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match 'feed'                                    => 'feeds_api#get_feed',                          :via => [:put, :get, :post]
    end
  end
end