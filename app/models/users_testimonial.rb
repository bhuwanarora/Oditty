class UsersTestimonial < Neo

	def initialize user_id
		@id = user_id
		@user = User.new(user_id)
	end

	def create description
		User.match + " CREATE UNIQUE (testimonial: Testimonial)-[:WrittenBy]->(user) WITH testimonial, user " + UsersTestimonial.set_description(description) + UsersTestimonial.set_created_at + UsersTestimonial.set_user_id
	end

	def self.set_description description
		" SET testimonial.description = " + description + " "
	end

	def self.set_created_at
		" SET testimonial.created_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_user_id
		" SET testimonial.user_id = ID(user) "
	end

end