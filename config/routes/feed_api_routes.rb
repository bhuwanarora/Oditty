ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
    namespace :api do
        namespace :v0 do
            match 'feed'                                    => 'feeds_api#get_feed',                          :via => [:put, :get, :post]
            match 'feed_news'                               => 'feeds_api#get_news',                          :via => [:put, :get, :post]
            match 'feed_blog'                               => 'feeds_api#get_blog',                          :via => [:put, :get, :post]
            match 'last_blog'                               => 'feeds_api#last_blog',                         :via => [:put, :get, :post]
            match 'notify_borrow'                           => 'feeds_api#notify_borrow',                          :via => [:put, :get, :post]
        end
    end
end