module Api
	module V0
		class TestimonialApi
			def self.create user_id, description
				UsersTestimonial.new(user_id).create(description).execute
			end

			def self.get_all
				Testimonial.get_all.execute
			end
		end
	end
end