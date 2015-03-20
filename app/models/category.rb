class Category < Neo
	
	def self.get_basic_info
		" ID(root_category) AS id, root_category.icon AS icon, root_category.name AS name, root_category.aws_key AS aws"
	end

end