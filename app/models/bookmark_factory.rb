class BookmarkFactory
	include AbstractInterface

	def self.get_node node
		BookmarkFactory.api_not_implemented(self)
	end

	def self.get_type type
		BookmarkFactory.api_not_implemented(self)
	end
end