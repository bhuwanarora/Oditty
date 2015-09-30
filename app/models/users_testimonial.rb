class UsersTestimonial < Neo

	def initialize user_id
		@id = user_id
		@user = User.new(user_id)
	end

	def create description
		@user.match + " CREATE (testimonial: Testimonial) " + UsersTestimonial.set_description(description) + UsersTestimonial.set_created_at + UsersTestimonial.set_user_id + " CREATE UNIQUE (testimonial)-[:WrittenBy]->(user) "
	end

	def self.set_description description
		" SET testimonial.description = \"" + description + "\" "
	end

	def self.set_created_at
		" SET testimonial.created_at = " + Time.now.to_i.to_s + " "
	end

	def self.set_user_id
		" SET testimonial.user_id = ID(user) "
	end

end