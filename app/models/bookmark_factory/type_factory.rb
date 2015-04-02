class BookmarkFactory::TypeFactory < BookmarkFactory

	def self.get_node node
		case node
		when "Listopia"
		when "Article"
		when "Book"
		end
	end

	def self.get_type type
	end
end