class Testimonial < Neo

	def self.basic_info
		"testimonial.description AS description, testimonial.created_at AS created_at, testimonial.user_id AS user_id"
	end

	def self.get_all
		Testimonial.match + Testimonial.return_group("user.name AS name", "user.image_url AS image_url", Testimonial.basic_info)
	end

	def self.match
		" MATCH (testimonial: Testimonial)-[:WrittenBy]->(user:User) WITH testimonial, user "
	end

end