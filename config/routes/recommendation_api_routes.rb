ReadersDoor::Application.routes.draw do
  #############################################
  #API ROUTES
  #############################################
  namespace :api do
    namespace :v0 do
      match "grid"                                   => 'recommendations_api#grid',                     :via => [:put, :get, :post]
      match "recommended_books"                      => 'recommendations_api#books',                    :via => [:put, :get, :post]
      match "push_recommendations"                   => 'recommendations_api#push_recommendations',     :via => [:put, :get, :post]
      match "filters"                                => 'recommendations_api#filters',                  :via => [:put, :get, :post]
      match "recommendations"                        => 'recommendations_api#recommendations',          :via => [:put, :get, :post]
      match "random_books"                           => 'recommendations_api#random_books',             :via => [:put, :get, :post]
    end
  end
end