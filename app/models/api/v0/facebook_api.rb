module Api
	module V0
		class FacebookApi

			def self.handle_facebook_likes fb_id
				FacebookLikesWorker.perform_async(fb_id)
			end

			def self.handle_facebook_books fb_id, user_id
				FacebookBooksWorker.perform_async({"fb_id" => fb_id}, user_id, FacebookBooksWorker::WorkStartTheProcess)
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
					bookmark_params = {"book_id" => original_book_id}
				else
					if author.present?
						output = (FacebookBook.new(facebook_id).match + FacebookBook.where_not_book + FacebookBook.new(facebook_id).map(params) + FacebookBook.set_book_label + " RETURN ID(facebook_book) AS id ").execute
						params_indexer = {:response => output[0]["id"], :type => "Book"}
						IndexerWorker.new.perform(params_indexer)
					else
						output = (FacebookBook.new(facebook_id).match + FacebookBook.where_not_book + FacebookBook.new(facebook_id).map(params) + " RETURN ID(facebook_book) AS id ").execute
					end
					bookmark_params = {"book_id" => output[0]["id"]}
				end
				if author.present?
					FacebookBooksWorker.new.perform(bookmark_params,nil, FacebookBooksWorker::WorkAddBooksToBookMark)
				end
			end
		end
	end
end