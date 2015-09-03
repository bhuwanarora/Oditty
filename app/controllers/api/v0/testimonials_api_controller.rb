module Api
	module V0
		class TestimonialsApiController < ApplicationController

			def add_testimonial
				user_id = session[:user_id]
				description = params[:data]
				Api::V0::TestimonialApi.create(user_id, description)
				render :json => {:message => "Success"}, :status => 200
			end

			def get_testimonials
				info = Api::V0::TestimonialApi.get_all
				render :json => info, :status => 200
			end
		end
	end
end