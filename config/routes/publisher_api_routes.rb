ReadersDoor::Application.routes.draw do
	namespace :api do
		namespace :v0 do
	    	match "publishers_info"                        => 'publisher_api#get_info',                :via => [:get]
	    	match "publishers_books"                       => 'publisher_api#get_books',                :via => [:get]
	    end
	end
end