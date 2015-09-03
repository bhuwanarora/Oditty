class Testimonial < Neo

	def self.basic_info
		"testimonial.description AS description, testimonial.created_at AS created_at, testimonial.user_id AS user_id"
	end

	def self.get_all skip=0
		Testimonial.match + Testimonial.return_group("user.name AS name", "user.thumb AS image_url", Testimonial.basic_info) + Testimonial.order_desc "testimonial.created_at" + Testimonial.skip(skip) + Testimonial.limit(10)
	end

	def self.match
		" MATCH (testimonial: Testimonial)-[:WrittenBy]->(user:User) WITH testimonial, user "
	end

end