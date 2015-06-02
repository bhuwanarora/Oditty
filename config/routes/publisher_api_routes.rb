ReadersDoor::Application.routes.draw do
	namespace :api do
		namespace :v0 do
	    	match "get_info"                        => 'publisher_api#get_info',                 :via => [:get]
	    end
	end
end