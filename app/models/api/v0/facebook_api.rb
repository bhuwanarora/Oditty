module Api
	module V0
		class FacebookApi

			def self.handle_facebook_likes fb_id
				FacebookLikesWorker.perform_async(fb_id)
			end

			def self.handle_facebook_books fb_id, user_id
				need_to_fetch = FacebookLike.need_to_fetch user_id
				if need_to_fetch
					id_likes = FacebookLike.new(fb_id, user_id).fetch
					FacebookLike.new(nil, user_id).set_info
				end
			end

			def self.handle_access_tokens params
				User::FacebookUser.new(params).set_access_token_when_expired
			end

			def self.map params
				name = params["name"]
				author = params["written_by"]
				to_be_labelled_as_book = !author.nil?
				facebook_id = params["id"]
				original_book_id = Book.get_by_unique_index("#{name.to_s.search_ready.strip}#{author.to_s.search_ready.strip}").execute[0]['book_id'] rescue ""
				if original_book_id.present?
					relations = FacebookBook.get_relations(facebook_id).execute[0]
					(FacebookBook.new(facebook_id).handle_relations(original_book_id, relations) + Book.set_facebook_book(facebook_id) + " WITH book AS facebook_book " +  FacebookBook.new(facebook_id).map(params) + " RETURN ID(facebook_book) AS id ").execute 
					FacebookBooksWorker.perform_async(nil, original_book_id, FacebookBooksWorker::WorkAddBooksToBookMark)
				else
					clause = FacebookBook.new(facebook_id).match +
							FacebookBook.where_not_book +
							FacebookBook.new(facebook_id).map(params)
					clause += FacebookBook.set_book_label if to_be_labelled_as_book
					clause += " RETURN ID(facebook_book) AS id "
					output = clause.execute
					if to_be_labelled_as_book
						bookmark_params = {"book_id" => output[0]["id"]}
						FacebookBooksWorker.perform_async(bookmark_params, nil, FacebookBooksWorker::WorkAddBooksToBookMark)
						params_indexer = {:response => output[0]["id"], :type => "Book"}
						IndexerWorker.perform_async(params_indexer)
					end
				end
			end

			# def self.test_
			# 	json_string = '{
			# 	  "id": "106488369388190", 
			# 	  "can_post": false, 
			# 	  "category": "Book", 
			# 	  "checkins": 0, 
			# 	  "description": "T abc", 
			# 	  "has_added_app": false, 
			# 	  "is_community_page": true, 
			# 	  "is_published": true, 
			# 	  "likes": 39295, 
			# 	  "link": "https://www.facebook.com/pages/The-Twits/108160689204689", 
			# 	  "name": "Sir Nigel and the White Company", 
			# 	  "parking": {
			# 	    "lot": 0, 
			# 	    "street": 0, 
			# 	    "valet": 0
			# 	  }, 
			# 	  "talking_about_count": 60, 
			# 	  "were_here_count": 0, 
			# 	  "written_by": "Arthur Conan Doyle"
			# 	}'
			# 	params = JSON.parse(json_string)
			# 	Api::V0::FacebookApi.map(params)
			# end
		end
	end
end