module GenreHelper
	
	def self.convert_genre_to_category
		clause = ""\
				" MATCH (genre:Genre) "\
				" WHERE NOT genre:Category "\
				" SET genre.indexed_category_name = genre.indexed_genre_name"
		clause.execute
	end

	def self.convert_category_to_genre
		clause = ""\
				" MATCH (category:Category)<-[:FromCategory]-(books:Book) "\
				" WHERE NOT category:Genre "\
				" SET category.indexed_genre_name = category.indexed_category_name, "\
				" 	  category.books_count = COUNT(books) "
		clause.execute
		clause = ""\
				" MATCH (category:Category) "\
				" WHERE NOT (category)-[:FromCategory]-(:Book) "\
				" SET category.books_count = 0 "
		clause.execute
	end

	def self.merge_common_category_genre
		
	end

	def self.merge_category_genre
		UniqueSearchIndexHelper.set_search_indices Constant::NodeLabel::Genre
		UniqueSearchIndexHelper.set_search_indices Constant::NodeLabel::Category
		GenreHelper.merge_common_category_genre
		GenreHelper.convert_category_to_genre
		GenreHelper.convert_genre_to_category
	end
	
end