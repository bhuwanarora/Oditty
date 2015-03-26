ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "track"                                  => 'analytics#track',                              :via => [:put, :get, :post]
    end
  end
end