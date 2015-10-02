class Infinity::FilterCommunity < Infinity
	def initialize id
		@community = Community.new(id)
		@id = id
	end

	def match
		@community.match + Community.match_books 
	end

	def get_books skip_count, limit
		match + Infinity::FilterCommunity.with_group("book") + Infinity::FilterCommunity.skip(skip_count) + Infinity::FilterCommunity.limit(10)
	end
end