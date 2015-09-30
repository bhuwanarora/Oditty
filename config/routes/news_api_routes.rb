ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
  	namespace :v0 do
  		 match 'create_custom_news'                               => 'news_api#create',                         :via => [:put, :get, :post]
  	end
  end
end
