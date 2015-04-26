class Article < Neo

	def self.basic_info
		" ID(article) AS id, article.title AS title, article.url AS URL, article.created_at AS created_at, article.description AS description, article.view_count AS view_count, article.image_url AS image_url"
	end

	def self.grouped_basic_info
		" id: ID(article), title: article.title, url: article.url, created_at: article.created_at, description: article.description, view_count: article.view_count, image_url: article.image_url "
	end
end