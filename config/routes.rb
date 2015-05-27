require 'resque/server'
require "sidekiq/web"
ReadersDoor::Application.routes.draw do
  root :to => "website#home"

  resources :facebooks

  # mount Resque::Server.new, :at => "/resque"
  mount SecureResqueServer.new, :at => '/resque'

  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'
  # devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    username == "readersdoor" && password == "admin@readersdoor"
  end 
  mount Sidekiq::Web => '/sidekiq'  

  resources :tags

  resources :categories

  resources :movies

  resources :prizes

  resources :books

  # resources :users

  # resources :authors

  resources :edges

  resources :human_profiles

  resources :chat_messages

  resources :website

  get 'jobs'                        => 'website#jobs',          :as => "jobs"
  get 'about'                       => 'website#about',         :as => "about"
  get 'privacy'                     => 'website#privacy',       :as => "privacy"
  get 'terms'                       => 'website#terms',         :as => "terms"
  get 'advertising'                 => 'website#advertising',   :as => "advertising"
  get 'landing_page'                => 'website#landing_page',  :as => 'landing_page'

  get 'recommended_books'     => "recommendations#books",    :as => "recommended_books"
  get 'recommendations'          => "recommendations#index",    :as => "recommendations"

  get 'random_quote'             => "website#random_quote",    :as => "random_quote"
  get 'coming_soon'              => "website#coming_soon",     :as => "coming_soon"
  get "invalid_user"             => "users#invalid_user",      :as => "invalid_user"
  post "books/find_by_isbn"      => "books#find_by_isbn",      :as => "find_book_by_isbn"
  post "books/remove_tag"        => "books#remove_tag",        :as => "remove_tag_for_book"
  post "books/add_tag"           => "books#add_tag",           :as => "add_tag_for_book"
  get "search_books"             => "books#search_book",       :as => "search_books"
  get "tags_by_chr"              => "tags#get_by_chr",         :as => "tags_by_chr"
  get "logs_by_tag"              => "logs#get_by_tag",         :as => "logs_by_tag"
  get "logs_by_user"             => "logs#get_by_user",        :as => "logs_by_user"
  get "logout"                   => "users#logout",            :as => "logout_user"
  get "add_tag_to_subcategory"   => "tags#map",                :as => "add_tag_to_subcategory"
  get "remove_tag_from_subcategory" => "tags#unmap",           :as => "remove_tag_from_subcategory"
  get "test"                     => "users#test",              :as => "test"
  get "activate"                 => "users#activate",          :as => "activate"
  

  get "new_child_category"      => "categories#new_child_category", :as => "new_child_category"
  post "add_child_category"     => "categories#add_child_category", :as => "add_child_category"
  post "email_subscription"     => "website#email_subscription",    :as => "email_subscription"

  get  "freebase"                => "tests#freebase",                  :as => "freebase"
  get  "freebase_search"         => "tests#freebase_search",           :as => "freebase_search"
  get  "freebase_resource"       => "tests#freebase_resource",         :as => "freebase_resource"
  get "horizontal_scroll"        => "tests#horizontal_scroll",         :as => "horizontal_scroll"
  get "angular_test"             => "tests#angular_test",              :as => "angular_test"

  get "verify"                   => "users#verify",                   :as => "verify"   
  get "book_count"               => "books#count",                    :as => "get_book_count"
  # root :to => "website#coming_soon"
  get 'dev'                       => "recommendations#index",         :as => "dev"
  get 'home'                      => "website#home",                  :as => "home"
  get 'infinity'                   => "website#infinity",             :as => "infinity"
  get 'search'                    => "website#search",                :as => "search"
  get 'profile'                    => "website#profile",              :as => "profile"
  get 'shelves'                     => "website#shelves",                  :as => "shelves"
  get 'book'                      => "website#book",                  :as => "dev_book"
  # get ':book/:id'                      => "website#book",             :as => "specific_book"
  get 'network'                   => "website#network",               :as => "network"
  get 'journey'                   => "website#journey",               :as => "journey"
  get 'customise'                 => "website#customise",             :as => "customise"
  get 'author'                    => "website#author",                :as => "author"
  get 'room'                 => "website#room",             :as => "room"
  get 'news'                      => "website#news",                  :as => "news"

  get 'tree'                      => "categories#show_tree",    :as => "show_tree"
  get 'search_tag'                => "tags#search_tag",         :as => "search_tag"
  get 'search_book'               => "books#search_book",       :as => "search_book"

  get "panel/feedbacks"                 => "users#feedbacks",                   :as => "feedbacks"   
  get "change_feedback_status"          => "users#change_feedback_status",      :as => "change_feedback_status"   
  
  get "panel/labels"                    => "books#labels",                      :as => "labels"   
  get "panel/trends"                    => "books#trends",                      :as => "trends"   
  get "panel/grids"                     => "books#grids",                       :as => "grids"   
  get "panel/thumbs"                    => "books#thumbs",                      :as => "thumbs"
  get "delete_grid"                     => "books#delete_grid",                 :as => "delete_grid"
  get "add_grid"                        => "books#add_grid",                    :as => "add_grid"
  get "update_grid"                     => "books#update_grid",                 :as => "update_grid"
  get "update_thumb_status"             => "books#update_thumb_status",         :as => "update_thumb_status"
  get "add_label"                       => "books#add_label",                   :as => "add_label"
  get "remove_label"                    => "books#remove_label",                :as => "remove_label"
  get "clear_data"                      => "users#clear_data",                  :as => "clear_data"
  get "reset_grid_links"                => "books#reset_grid_links",            :as => "reset_grid_links"
  get "book_detail"                     => "books#book_detail",                 :as => "book_detail"
  get "trending_new_books"              => "books#trending_new_books",          :as => "trending_new_books"
  get "cover_photos"                    => "books#cover_photos",                :as => "cover_photos"
  get "upload_cover_photo"              => "books#upload_cover_photo",          :as => "upload_cover_photo"
  get "set_active_cover_photo"          => "books#set_active_cover_photo",      :as => "set_active_cover_photo"
  
  get "recover_password"                => "users#recover_password",            :as => "recover_password"
  get "save_password"                   => "users#save_password",               :as => "save_password"
  get "all_users"                       => "users#all",                         :as => "all_users"
  get "update_user"                     => "users#update",                         :as => "update_user"
  get 'users'                           => "users#index",                       :as => "users"
  post "data"                           => "books#data",                        :as => "data"
  get "remove_trend"                    => "books#remove_trend",                :as => "remove_trend"

  get 'signup'                          => "website#signup",                    :as => "signup"

  get 'blogs'                           => "website#blogs",                     :as => "blogs"
  get 'communities'                     => "website#communities",               :as => "communities"
  get 'personalised_suggestions'        => "website#personalised_suggestions",  :as => "personalised_suggestions"

  get 'signup'                          => "website#signup",                    :as => "signurep"
  get 'news_group'                      => "website#news_group",                :as => "news_group"

  get "trending_community_books"        => "books#trending_community_books",     :as => "trending_community_books"
  get "delete_book_relationship"        => "books#delete_book_relationship",       :as => "delete_book_relationship"

  post 'webhooks'                        => "website#webhooks",                  :as => "webhooks"

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes"

  # You can have the root of your site routed with "root"..
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
