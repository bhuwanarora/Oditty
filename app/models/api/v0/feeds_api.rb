module Api
	module V0
		class FeedsApi

			def self.get_feed(user_id, params)
				# Api::V0::NewsApi.get_feed(user_id, params)
				#TODO: SATISH, Where is the Proper Code Structure?
				neo = Neography::Rest.new
				skip_count = params[:skip].present? ? params[:skip].to_i+1 : 0
    			clause = "MATCH (t:News) WHERE t.status = 1 RETURN t.name, ID(t), t.content, t.url, t.title, t.thumb, t.thumbnail_url, t.publisher_thumb, t.searched_words, t.created_at ORDER BY t.created_at DESC SKIP "+skip_count.to_s+" LIMIT 8"
    			# clause = "MATCH (t:News)-[:RelatedBooks]->(b:Book) WHERE t.status = 1 RETURN t.name, ID(t), t.content, t.url, t.title, t.thumb, t.thumbnail_url, t.publisher_thumb, t.searched_words, t.timestamp, COLLECT (b.isbn) ORDER BY t.timestamp DESC SKIP "+skip_count.to_s+" LIMIT 8"
    			puts clause.blue.on_red
    			trends = neo.execute_query(clause)["data"]
				trends
			end

			def self.get_news skip_count, day_skip_count, region
				News.get_feed(skip_count, day_skip_count, region)
			end

			def self.get_blog skip_count, multiple_blog
				Blog.get_blog skip_count, multiple_blog
			end

			def self.last_blog
				Blog.get_latest_blog
			end
		end
	end
end
