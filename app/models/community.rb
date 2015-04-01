class Community < Neo

	def initialize id
		@id = id
	end

	def match
		" MATCH (community:Tags) WHERE ID(community) = " + @id.to_s + " WITH community "
	end

	def self.basic_info
		" community.view_count AS view count, community.name AS name "
	end

	def match_books skip_count
		" MATCH (community)-[:RelatedBooks]->(book:Book) WITH community, book ORDER BY book.total_weight DESC LIMIT " + Constants::CommunityBooksCount.to_s + " WITH community, book "
	end

	def match_users
		" MATCH (community)<-[belongs_to:BelongsTo]-(user:User) WITH community, user ORDER BY belongs_to.weight DESC LIMIT " + Constants::CommunityUsersCount.to_s + " WITH community, user "
	end

	# def self.set_name

	# end

	def self.set_importance
		" SET community.importance = COALESCE(community.importance, 0) + 1 "
	end

	def self.detailed_info
	
	end
end