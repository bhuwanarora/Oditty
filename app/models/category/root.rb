class Category::Root < Category
	def self.get_basic_info
		" ID(root_category) AS root_category_id, root_category.icon AS root_category_icon, root_category.name AS root_category_name, root_category.root_category_aws_key AS aws_key"
	end
end