module BooksGraphHelper

	def self.neo_init
		@neo = Neography::Rest.new
	end

	# ************************************************

	# MATCH (b:Book)-[:BookFeed*0..]->(news_feed)
	# WHERE ID(b)=BOOK_ID
	# RETURN labels(news_feed), news_feed

	# ************************************************
	
	def self.get_feed book_id
		@neo ||= self.neo_init
		clause = "MATCH (b:Book)-[:BookFeed*0..]->(news_feed) WHERE ID(b)="+book_id.to_s+" RETURN labels(news_feed), news_feed"
		puts clause.blue.on_red
		@neo.execute_query(clause)["data"]
	end
end