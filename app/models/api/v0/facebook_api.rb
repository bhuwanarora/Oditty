class FacebookApi
	def self.map params, facebook_id
		original_book_id = Book.get_by_unique_index("#{data["name"].to_s.search_ready.strip}#{data["written_by"].to_s.search_ready.strip}").execute[0]['book_id'] rescue ""
		if original_book_id.present?
			relations = Facebook.get_relations(facebook_id).execute[0]
			Facebook.new(facebook_id).handle_relations(original_book_id).execute 
		else
			Facebook.new(facebook_id)	
		end  
	end
end
