module BookRecommendationHelper


	def self.neo_init
		@neo = Neography::Rest.new
	end

	def get_similar_books(book_id, user_id)
		#Add category 
		@neo.execute_query("MATCH (b:Book{id:"+book_id+"})-[h1:Has]->(t:Tag)<-[h2:Has]-(sb:Book), 
			(u:User{id:"+user_id+"})
			WHERE b <> sb AND
			NOT (u)-[:MarkAsReadAction]->(:MarkAsRead)-[:MarkAsRead]->(sb) AND
			NOT (u)-[:BookmarkAction]->(:Bookmark)-[:Bookmarked]->(sb)
			WITH SUM(h1.weight * h2.weight) AS xyDotProduct,
              SQRT(REDUCE(xDot = 0, a IN COLLECT(h1) | xDot + a.weight^2)) AS xLength,
              SQRT(REDUCE(yDot = 0, b IN COLLECT(h2) | yDot + b.weight^2)) AS yLength,
              b, sb
            RETURN xyDotProduct/(xLength*yLength) as similarity_index
			LIMIT 5 
			ORDER BY similarity_index DESC, sb.gr_rating DESC")
	end

	def get_books_belonging_to_category(category_id, user_id)
		@neo.execute_query("MATCH (c:Category{id:"+category_id+"})<-[:Belongs_to]-(b:Book) 
			WHERE NOT (u)-[:MarkAsReadAction]->(:MarkAsRead)-[:MarkAsRead]->(b) AND
			NOT (u)-[:BookmarkAction]->(:Bookmark)-[:Bookmarked]->(b)
			RETURN b 
			LIMIT 5
			ORDER BY b.gr_rating DESC")
	end

	def self.get_must_reads
		@neo.execute_query("MATCH (c:Category{id:"+category_id+"})<-[:Belongs_to]-(b:Book) 
			RETURN b 
			LIMIT 5
			ORDER BY sb.gr_rating DESC")
	end

	def self.apply_filter(category_id, country_id, starting_published_year, ending_published_year, author_id)
		@neo.execute_query("OPTIONAL MATCH (b:Book)-[:Published_in]->(c:Country{id:"+country_id+"}),
			(b)-[:Belongs_to]->(ca:Category{id:"+category_id+"}),
			(b)<-[:Wrote]-(a:Author{id:"+author_id+"}),
			(b)-[:Published_on]->(y:Year)
			WHERE y.year < "+ending_published_year+" AND y.year > "+starting_published_year+"
			RETURN b.title")
	end

	def self.get_serendipitous_books(user_id)
		@neo.execute_query("MATCH (b:Book{gr_rating=5})-[:Belongs_to]->(:Category)-[:Has_root]->(rc:Category), 
			(u:User{id:"+user_id+"})
			WHERE NOT (u)-[:Tendency_for]->(rc)
			RETURN DISTINCT(b)")
	end

	def self.get_serendipitous_categories(user_id)
		@neo.execute_query("MATCH (rc:Category), 
			(u:User{id:"+user_id+"})
			WHERE NOT (u)-[:Tendency_for]->(rc)
			RETURN DISTINCT(rc)")
	end

	def self.get_books_for_similar_users
		
	end


	def self.create_book
		@neo.execute_query("CREATE (b:Book{title:"+title+"})")
	end

end