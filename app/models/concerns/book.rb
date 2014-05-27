# module Book

# 	def self.init_neo
# 		@neo = Neography::Rest.new
# 	end

# 	def self.get_must_reads
# 		@neo ||= self.init_neo
# 		@neo.execute_query("MATCH (b:Book{gr_rating:5}) return "+self.get_info_level2+" limit 5")
# 	end

# 	def self.get_similar_reads
# 		@neo ||= self.init_neo
# 	end

# 	def self.get_serendipitous_reads
# 	end

# 	def self.get_sponsored_books
# 	end

# 	def self.get_info_level1
# 		"b.title, b.author_name, b.thumb_pic"
# 	end

# 	def self.get_info_level2
# 		"b.title, b.author_name, b.image_url"
# 	end

# 	def self.get_info_level3
# 		"b.title, b.author_name, b.image_url"
# 	end

# 	def self.get_info_level4
# 		"b.title, b.author_name, b.image_url"
# 	end

# 	def self.filter
# 	end

# 	def self.filter_by_year
# 	end

# 	def self.filter_by_genre
# 	end


# 	def self.recommendation_from_friends
# 	end


# 	def self.filter_by_country
# 	end

# end