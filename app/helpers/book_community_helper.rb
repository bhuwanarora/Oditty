module BookCommunityHelper

	def self.fetch_book_ids communityNames
		book_id_hash_set = []
		communityNames.each do |community|
			books_id_hash = CommunityHelper.fetch_book_id community
			debugger
			if(!books_id_hash[community].empty?)
				book_id_hash_set << books_id_hash
			end
		end
		book_id_hash_set
	end
	
	def self.fetch_existing_community_id communityName
		id = nil
		output = ( Community.search_by_name communityName + " RETURN ID(communityName) AS id").execute
		if(output.length>0)
			id = output[0]["id"]
		end
		id
		# Should call to Arjun's API checking for clusters.
		# query = Rails.application.config.nlp_service + "api/v0/parser?q=" + news_link 
		# puts query
		# uri = URI(query)
		# response = Net::HTTP.get(uri)
	end

	def self.merge_communities communityNames
		book_id_hash_set = BookCommunityHelper.fetch_book_id communityNames
		book_id_hash_set.each do |books_id_hash|
			id_community = BookCommunityHelper.fetch_existing_community_id books_id_hash.keys[0]
			clause = ""
			if id_community.present?
				begin_clause = FacebookLikesBooksHelper.match_node(id_community,"community")
			else
				begin_clause = Community.merge books_id_hash.keys[0]
			end
			books_id_hash[books_id_hash.keys[0]].each do |books_id_|
				clause += begin_clause +	FacebookLikesBooksHelper.match_node(books_id_hash)
			end
			clause.execute
		end
	end

end