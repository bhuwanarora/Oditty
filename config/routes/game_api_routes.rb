ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
	namespace :api do
		namespace :v0 do
			match 'get_game_books'                               => 'games_api#get_books',                         :via => [:put, :get, :post]
      match 'get_user_score'                               => 'games_api#get_score',                         :via => [:put, :get, :post]
      match 'save_score'                              => 'games_api#save_score',                         :via => [:put, :get, :post]
      match 'get_game_users'                              => 'games_api#get_users',                         :via => [:put, :get, :post]
		end
	end
end