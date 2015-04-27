module Api
	module V0
		class NewsApi

			def self.get_feed(user_id, params)
				#TODO: SATISH, Where is the Proper Code Structure?
				neo = Neography::Rest.new
				skip_count = params[:skip].present? ? params[:skip].to_i+1 : 0
    			clause = "MATCH (t:News) WHERE t.status = 1 RETURN t.name, ID(t), t.content, t.url, t.title, t.thumb, t.thumbnail_url, t.publisher_thumb, t.searched_words, t.timestamp ORDER BY t.timestamp DESC SKIP "+skip_count.to_s+" LIMIT 8"
    			# clause = "MATCH (t:News)-[:RelatedBooks]->(b:Book) WHERE t.status = 1 RETURN t.name, ID(t), t.content, t.url, t.title, t.thumb, t.thumbnail_url, t.publisher_thumb, t.searched_words, t.timestamp, COLLECT (b.isbn) ORDER BY t.timestamp DESC SKIP "+skip_count.to_s+" LIMIT 8"
    			puts clause.blue.on_red
    			trends = neo.execute_query(clause)["data"]
				trends
			end

		end
	end
end