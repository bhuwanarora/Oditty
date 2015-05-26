class Category::Root < Category

	def self.match_books_root
		" MATCH (book)-[:FromCategory]->(:Category)-[:HasRoot*0..1]->(root_category:Category{is_root:true}) WITH book, root_category "
	end

	def self.optional_match_books_root
		" OPTIONAL " + Category::Root.match_books_root 
	end

	def self.match
		" MATCH (root_category:Category{is_root:true}) WITH root_category "
	end

	def self.basic_info
		super("root_category")
	end

	def self.match_books
		super("root_category")
	end

	def self.match_books_in_list skip, length
		super("root_category", skip, length)
	end

	def self.books_for_user skip, length
		super("root_category", skip, length)
	end

	def self.get_all
		" MATCH (root_category:Category{is_root:true}) " + Category::Root.return_group(self.basic_info)
	end

	def self.grouped_basic_info
		super("root_category")
	end
end