module Api
	module V0
		class TestimonialsApiController < ApplicationController

			def add_testimonial
				user_id = session[:user_id]
				description = params[:data]
				Api::V0::TestimonialApi.create(user_id, description)
				RedisHelper::Testimonial.delete_all
				render :json => {:message => "Success"}, :status => 200
			end

			def get_testimonials
				skip = params[:skip]
				info = RedisHelper::Testimonial.get_all skip
				if info.nil?
					info = Api::V0::TestimonialApi.get_all skip
					RedisHelper::Testimonial.set_all skip
				end
				render :json => info, :status => 200
			end
		end
	end
end