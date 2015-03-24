class Category::Root < Category

	def self.basic_info
		super("root_category")
	end

	def self.get_books skip, length
		super("root_category", skip, length)
	end
end