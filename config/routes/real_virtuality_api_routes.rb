ReadersDoor::Application.routes.draw do
    #############################################
    #API ROUTES
    #############################################
    namespace :api do
        namespace :v0 do
            match 'book_news'                              => 'real_virtuality_api#book_news',                        :via => [:put, :get, :post]
            match 'community_detailed_info'				   => 'real_virtuality_api#community_news',   :via => [:put, :get, :post]
        end
    end
end