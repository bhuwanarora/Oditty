ReadersDoor::Application.routes.draw do
    #############################################
    #API ROUTES
    #############################################
    namespace :api do
        namespace :v0 do
            match 'fb_likes'                               => 'likes_api#fb_likes',                         :via => [:put, :get, :post]
            match 'set_info'                               => 'likes_api#set_info',                         :via => [:put, :get, :post]
            match 'get_likes'                              => 'likes_api#get_likes',                         :via => [:put, :get, :post]
        end
    end
end