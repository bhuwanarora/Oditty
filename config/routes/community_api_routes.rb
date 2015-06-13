ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      # match "community_books"                                  => 'community_api#get_books',              :via => [:put, :get, :post]
      # match "communities"                                      => 'community_api#get_communities_chronologically',        :via => [:put, :get, :post]
      match "popular_communities"                    => 'community_api#popular_communities',              :via => [:put, :get, :post]
      match "suggest_communities"                    => 'community_api#suggest_communities',              :via => [:put, :get, :post]
      match "top_communities"                        => 'community_api#top_communities',                  :via => [:put, :get, :post]
      match 'detailed_community_info'                => 'community_api#detailed_community_info',          :via => [:put, :get, :post]
      match 'visited_news'                           => 'community_api#create_visited_news',              :via => [:post]
    end
  end
end