class BookmarkFactory::NodeFactory < BookmarkFactory

	def self.get_node node
		
	end

	def self.get_type type
		case  type
		when "DidntFeelLikeReadingItAfterAPoint"
		when "HaveLeftAMarkOnMe"
		when "IntendToRead"
		when "PretendIHaveRead"
		when "Public"
		when "Read"
		when "Visited"
		end
	end	
end