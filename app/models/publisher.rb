class Publisher < Neo
	def initialize id
		@id = id
	end

	def self.basic_info
		" publisher.name as name, ID(publisher) as id, publisher.image_url as image_url, publisher."
	end

	def get_info
	end

	def match
		" MATCH (publisher:Publisher) WHERE "
	end
end