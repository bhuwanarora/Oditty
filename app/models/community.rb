class Community < Neo

	def initialize id
		@id = id
	end

	def match
		" MATCH (community:Community) WHERE ID(community) = " + @id.to_s + " WITH community "
	end

	def self.basic_info
		" community.view_count AS view_count, community.name AS name "
	end

	def self.grouped_basic_info
		"  view_count:community.view_count,  name:community.name "
	end


	def self.grouped_basic_info
		"  view_count:community.view_count ,  name:community.name  "
	end

	def self.match_books 
		" MATCH (community)-[:RelatedBooks]->(book:Book) WITH community, book "
	end

	def get_books
		match + Community.match_books + Book.order_desc + Community.limit(Constants::CommunityBooksCount.to_s) + Neo.return_init + Book.basic_info
	end

	def self.match_users
		" MATCH (community)<-[of_community:OfCommunity]-(follow_node:FollowNode)<-[follows:Follows]-(user:User) WITH community, follow_node, user "
	end

	def self.optional_match_users
		" OPTIONAL MATCH (community)<-[of_community:OfCommunity]-(follow_node:FollowNode)<-[follows:Follows]-(user:User) WITH community, follow_node, user "
	end

	def self.set_name

	end

	def self.set_importance
		" SET community.importance = COALESCE(community.importance, 0) + 1 "
	end

	def self.detailed_info
		
	end

	def get_users
		match + Community.match_users + Community.limit(Constants::CommunityUsersCount) + Community.return_init + User.basic_info
	end


	def self.get_news
		" MATCH (community)<-[:HasCommunity]-(news:News) WITH community, news "
	end



	def self.set_follow_count
		" SET community.follow_count = COALESCE(community.follow_count,0) + 1 "
	end

	def self.order_desc
		" ORDER BY community.importance DESC "
	end

	def self.match_grouped_books
		Community.match_books + Book.collect_map({"books_info" => Book.grouped_basic_info }) 
	end

	def self.get_google_books community
		community_books = {community => []}
		count = 0
		begin
			Google::Search::Book.new(:query => community).each do |book|
				count += 1
				if count == 10
					break
				end
				community_books[community] << book.title.search_ready
			end
		rescue Exception => e
			puts e.to_s.red
			community_books = {}
		end
		community_books
	end

	def self.most_important_category_info 
		", HEAD(COLLECT({" + Community.grouped_basic_info + "})) AS community_info "
	end
end