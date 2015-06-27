class GoodreadsBook < Neo
	def initialize id
		@id = id
	end

	def self.basic_info
		" book.title AS title, book.goodreads_url AS goodreads_url, book.id AS goodreads_id, ID(book) AS id "
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

	def self.set_goodreads_url goodreads_url
		goodreads_url = goodreads_url.gsub("http://", "https://")
		" SET book.goodreads_url = \""+goodreads_url.to_s+"\" "
	end

	def self.merge_by_url goodreads_url
		goodreads_url = goodreads_url.gsub("http://", "https://")
		" MERGE (book :Book{gr_url:"+goodreads_url.to_s+"}) WITH book "
	end

end