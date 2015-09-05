module Api
	module V0
		class FacebookApi
			def self.map params
				name = params["name"]
				author = params["written_by"]
				facebook_id = params["id"]
				original_book_id = Book.get_by_unique_index("#{name.to_s.search_ready.strip}#{author.to_s.search_ready.strip}").execute[0]['book_id'] rescue ""
				if original_book_id.present?
					relations = FacebookBook.get_relations(facebook_id).execute[0]
					(FacebookBook.new(facebook_id).handle_relations(original_book_id, relations) + Book.set_facebook_book(facebook_id) + " WITH book AS facebook_book " +  FacebookBook.new(facebook_id).map(params) + " RETURN ID(facebook_book) AS id ").execute 
				else
					(FacebookBook.new(facebook_id).match + FacebookBook.where_not_book + FacebookBook.new(facebook_id).map(params) + FacebookBook.set_book_label + " RETURN ID(facebook_book) AS id ").execute
					params_indexer = {:response => facebook_id, :type => "Book"}
					IndexerWorker.perform_async(params_indexer)  	
				end  
			end

			def self.test_
				json_string = "{
			  \"id\": \"106488369388190\", 
			  \"can_post\": false, 
			  \"category\": \"Book\", 
			  \"checkins\": 0, 
			  \"description\": \" test description \", 
			  \"has_added_app\": false, 
			  \"is_community_page\": true, 
			  \"is_published\": true, 
			  \"likes\": 39295, 
			  \"link\": \"https://www.facebook.com/pages/The-Twits/108160689204689\", 
			  \"name\": \"Sir Nigel and the White Company\", 
			  \"parking\": {
			    \"lot\": 0, 
			    \"street\": 0, 
			    \"valet\": 0
			  }, 
			  \"talking_about_count\": 60, 
			  \"were_here_count\": 0, 
			  \"written_by\": \"Arthur Conan Doyle\"
			}"
			params = JSON.parse(json_string)
			self.map params
			end
		end
	end
end