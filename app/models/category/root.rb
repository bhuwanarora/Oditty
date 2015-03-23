class Category::Root < Category

	def self.basic_info
		Category.basic_info "root_category"
	end

	def self.get_books skip, length
		Category.get_books "root_category", skip, length
	end
end