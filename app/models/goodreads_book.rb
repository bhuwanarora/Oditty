class GoodreadsBook < Neo
	def initialize id
		@id = id
	end

	def self.basic_info
		" book.title AS title, book.url AS url, book.id AS goodreads_id, ID(book) AS id "
	end

	def match
		" MATCH (book :GoodreadsBook) WHERE book.id = " + @id.to_s + " WITH book "
	end

	def self.merge_by_id id
		" MERGE (book :GoodreadsBook{id:"+id.to_s+"}) WITH book "
	end

	def self.set_title title
		" SET book.title = \""+title.to_s+"\" "
	end

	def self.set_url url
		" SET book.url = \""+url.to_s+"\" "
	end

end