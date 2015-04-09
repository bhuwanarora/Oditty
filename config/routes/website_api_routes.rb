ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "fb_books_map"                           => 'website_api#fb_books_map',                     :via => [:put, :get, :post]
      match "book_lists"                             => 'website_api#book_lists',                       :via => [:put, :get, :post]
      match "genres"                                 => 'website_api#genres',                           :via => [:put, :get, :post]
      match "countries"                              => 'website_api#countries',                        :via => [:put, :get, :post]
      match "times"                                  => 'website_api#times',                            :via => [:put, :get, :post]
      match "labels"                                 => 'website_api#labels',                           :via => [:put, :get, :post]
      match "add_label"                              => 'website_api#add_label',                       :via => [:put, :get, :post]
      match "read_times"                             => 'website_api#read_times',                       :via => [:put, :get, :post]
      match "notifications"                          => 'website_api#notifications',                    :via => [:put, :get, :post]
      match "latest_notification"                    => 'website_api#latest_notification',              :via => [:put, :get, :post]
      match "trends"                                 => 'website_api#trends',                           :via => [:put, :get, :post]
      match "save_feedback"                          => 'website_api#save_feedback',                    :via => [:put, :get, :post]
      match 'fb_books'                               => 'website_api#fb_books',                         :via => [:put, :get, :post]
      match "news_info"                              => 'website_api#news_info',                        :via => [:put, :get, :post]
      match 'chronological_news'                     => 'website_api#chronological_news',           :via => [:put, :get, :post]
    end
  end
end