class Search < Neo
	def initialize params, count=5, fuzzy=nil
		@params = params
		@count = ((count == 0) || count.nil?) ? 5 : count
		@fuzzy = fuzzy
	end

	def book_by_title
		connector = @fuzzy.present? ? "~0.7" : "*"
		"START book=node:node_auto_index('indexed_title:" + @params + connector + "') " + Search.return_group(" ID(book) AS id ", "book.isbn AS isbn", "book.title AS name") + Search.limit(@count)
	end

	def author_by_name
		connector = @fuzzy.present? ? "~0.7" : "*"
		"START author=node:node_auto_index('indexed_main_author_name:" + @params + connector + "') " + Search.return_group(" author.name AS name", "ID(author) AS id ") + Search.limit(@count)
	end

	def user_by_name
		connector = @fuzzy.present? ? "~0.7" : "*"
		"START user=node:node_auto_index('indexed_user_name:" + @params + connector + "') " + Search.return_group(" user.first_name AS first_name, user.last_name AS last_name, ID(user) AS id ") + Search.limit(@count)
	end

	def genre_by_name
		if @params.present?
			clause = "START category=node:node_auto_index('indexed_category_name:" + @params + "*') " + Search.return_group(" category.name AS name, ID(category) AS id ") + Search.limit(@count)
		else
			clause = " MATCH (root_category:Category{is_root:true}) RETURN ID(root_category) AS id, root_category.name AS name "
		end
		clause	
	end

	def basic
		connector = @fuzzy.present? ? "~0.7" : "*"
		clause = "START search_node=node:node_auto_index('search_index:" + @params + connector + "') RETURN CASE WHEN search_node.title IS NULL THEN search_node.name ELSE search_node.title END as name, search_node.author_name as author_name, ID(search_node) as id, labels(search_node) as labels " + Search.limit(@count)
		clause
	end
end