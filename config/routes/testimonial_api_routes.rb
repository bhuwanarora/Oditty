ReadersDoor::Application.routes.draw do
    #############################################
    #API ROUTES
    #############################################
    namespace :api do
        namespace :v0 do
            match "get_testimonials"     => 'testimonials_api#get_testimonials',            :via => [:put, :get, :post]
            match "add_testimonial"      => 'testimonials_api#add_testimonial',             :via => [:put, :get, :post]
        end
    end
end