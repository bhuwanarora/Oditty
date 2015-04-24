class Bookmark::Type < Bookmark
	include AbstractInterface

	def initialize user_id
		Bookmark::Type.api_not_implemented(self)
	end

	def match
		Bookmark::Type.api_not_implemented(self)
	end

	def add
		@bookmark.add
	end

	def remove
		@bookmark.remove
	end

	def book
		@bookmark = @bookmark.book
		self
	end

	def news
		@bookmark = @bookmark.news
		self
	end

	def blog
		@bookmark = @bookmark.blog
		self
	end
end