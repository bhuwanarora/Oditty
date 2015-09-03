module Api
	module V0
		class TestimonialApi
			def self.create user_id, description
				UsersTestimonial.new(user_id).create(description).execute
			end

			def self.get_all skip
				Testimonial.get_all(skip).execute
			end
		end
	end
end