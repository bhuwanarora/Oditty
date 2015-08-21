ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "popular_authors"                        => 'authors_api#get_popular_authors',              :via => [:put, :get, :post]
      match "get_similar_authors"                    => 'authors_api#get_similar_authors',              :via => [:put, :get, :post]
      match "author_details"                         => 'authors_api#get_details',                      :via => [:put, :get, :post]
      match "follow_author"                          => 'authors_api#follow',                           :via => [:put, :get, :post]
      match "author_interview"                       => 'authors_api#get_interview_details',            :via => [:put, :get, :post]
      match "author_basic_info"                      => 'authors_api#get_basic_info',                   :via => [:put, :get, :post]
      match "get_authors_interviewed"                => 'authors_api#get_authors_interviewed',          :via => [:put, :get, :post]
    end
  end
end