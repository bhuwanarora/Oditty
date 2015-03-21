class Category < Neo
	
	def self.basic_info
		" ID(category) AS category_id, category.icon AS category_icon, category.name AS category_name, category.category_aws_key AS category_aws_key"
	end

	def self.order_desc
		" ORDER BY likes.weight DESC"
	end

	def self.likes_weight
		", likes.weight AS likes_weight "
	end

end