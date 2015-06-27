class Publisher < Neo
	def initialize id
		@id = id
	end

	def self.basic_info
		" publisher.name as name, ID(publisher) as id, publisher.image_url as image_url, publisher.description as description "
	end

	def get_info
		match + Publisher.return_group(Publisher.basic_info)
	end

	def match
		" MATCH (publisher:Publisher) WHERE ID(publisher)="+@id+" WITH publisher "
	end

	def match_books
		" MATCH (publisher)-[:Published]->(:PublishingNode)-[:PublishedBook]->(book:Book) WITH book "
	end

	def get_books
		match + match_books + Publisher.return_group(Book.basic_info)
	end

end