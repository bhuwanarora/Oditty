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
		@bookmark_node_media_label_class = Bookmark::Node::BookLabel 
		self
	end

	def news
		@bookmark = @bookmark.news
		# @bookmark_node_media_label_class = Bookmark::Node::NewsLabel 
		self
	end

	def blog
		@bookmark = @bookmark.blog
		@bookmark_node_media_label_class = Bookmark::Node::BlogLabel
		self
	end
end