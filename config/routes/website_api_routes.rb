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
            match "add_new_label"                          => 'website_api#add_new_label',                    :via => [:put, :get, :post]
            match "add_label"                              => 'website_api#add_label',                        :via => [:put, :get, :post]
            match "read_times"                             => 'website_api#read_times',                       :via => [:put, :get, :post]
            match "notifications"                          => 'website_api#notifications',                    :via => [:put, :get, :post]
            match "latest_notification"                    => 'website_api#latest_notification',              :via => [:put, :get, :post]
            match "trends"                                 => 'website_api#trends',                           :via => [:put, :get, :post]
            match "save_feedback"                          => 'website_api#save_feedback',                    :via => [:put, :get, :post]
            match 'fb_books'                               => 'website_api#fb_books',                         :via => [:put, :get, :post]
            match "news_info"                              => 'website_api#news_info',                        :via => [:put, :get, :post]
            match 'chronological_news'                     => 'website_api#chronological_news',               :via => [:put, :get, :post]
            match 'detailed_community_info'                => 'website_api#detailed_community_info',          :via => [:put, :get, :post]
            match 'feed_community_info'                    => 'website_api#feed_community_info',          :via => [:put, :get, :post]
            match 'metadata'                               => 'website_api#get_metadata',                     :via => [:put, :get, :post]
            match 'basic_community_info'                   => 'website_api#basic_community_info',             :via => [:put, :get, :post]      
            match 'visited_news'                           => 'website_api#create_visited_news',              :via => [:post]  
            match "regions"                                => 'website_api#get_regions',                      :via => [:put, :get, :post]              
            match "suggest_communities"                    => 'website_api#suggest_communities',              :via => [:put, :get, :post]
            match "top_communities"                        => 'website_api#top_communities',                  :via => [:put, :get, :post]
            match "popular_communities"                    => 'website_api#popular_communities',              :via => [:put, :get, :post]

        end
    end
end