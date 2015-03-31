class Category::Root < Category

	def self.basic_info
		super("root_category")
	end

	def self.books skip, length
		super("root_category", skip, length)
	end

	def self.books_for_user skip, length
		super("root_category", skip, length)
	end

	def self.get_all
		" MATCH (root_category:Category{is_root:true}) " + Category::Root.return_group(self.basic_info)
	end
end