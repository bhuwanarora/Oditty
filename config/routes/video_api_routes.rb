ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "add_videos"                => 'videos_api#add',          :via => [:put, :get, :post]
    end
  end
end