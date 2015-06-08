class Blog < Neo
	
	def self.create post
		puts post.to_s.green
		" MERGE (blog:Blog{blog_url:\"" + post["short_URL"] + "\"}) " + Blog.set_excerpt(post["excerpt"]) + Blog.set_title(post["title"]) + Blog.set_image_url(post["attachments"]) + Blog.set_reblog_count(post["is_reblogged"]) + Blog.set_search_index(post["title"]) + Blog.set_indexed_title(post["title"]) + Blog.set_like_count(post["like_count"]) + Blog.set_created_at(post["date"]) + " WITH blog "
	end

	def self.set_indexed_title title
		" SET blog.indexed_title = \"" + title.to_s.search_ready + "\" "
	end

	def self.set_search_index title
		" SET blog.search_index = \"" + title.to_s.search_ready + "\" "
	end

	def self.set_created_at date
		" SET blog.posted_at = \"" + date.to_s + "\" "
	end

	def self.set_like_count count
		" SET blog.like_count = " + count.to_s
	end

	def self.set_share_count count
		" SET blog.share_count = " + count.to_s
	end

	def self.set_reblog_count count
		" SET blog.reblog_count = " + count.to_s 
	end

	def self.set_excerpt excerpt
		" SET blog.excerpt = \"" + excerpt + "\" "
	end

	def self.set_title title
		" SET blog.title = \"" + title  + "\" "
	end

	def self.set_image_url attachments
		image_present = attachments.first[1]["URL"].present? rescue false
		clause = ""
		if image_present
			clause = " SET blog.image_url = \"" + attachments.first[1]["URL"].to_s + "\" "
		end
		clause
	end

	def self.match_path skip_count = 0
		" OPTIONAL MATCH path = (blog)-[next_post:NextPost*" + skip_count.to_s + "]->(next_blog) WITH path "
	end

	def self.match_nth skip_count = 0
		" OPTIONAL MATCH path = (blog)-[next_post:NextPost*" + skip_count.to_s + "]->(old) WITH path, old, blog, next_post "
	end

	def self.match_root
		" MATCH (root_blog:Blog{is_root:true}) WITH root_blog "
	end

	def self.match_latest_blog
		Blog.match_root + " WITH root_blog AS blog " + Blog.match_nth(1) + " WITH old AS blog "
	end

	def self.get_blog skip_count=1, multiple_blog = false
		if multiple_blog
			multiple_blog_clause = Blog.match_nth(Constant::Count::BlogsShown) + " WITH " + Blog.extract_unwind("blog") + " WITH " + Blog.tail("blog")
		else
			multiple_blog_clause = ""
		end
		Blog.match_latest_blog + Blog.match_nth(skip_count) + " WITH old as blog " + multiple_blog_clause  + Blog.return_init + Blog.basic_info 
	end

	def self.get_latest_blog
		Blog.match_latest_blog + Blog.return_init + Blog.basic_info  
	end

	def self.create_is_about
		" MERGE (blog)-[is_about:IsAbout]->(author) WITH blog, author " 
	end

	def self.create_belongs_to
		" MERGE (blog)-[belongs_to:BelongsTo]->(community) WITH community, blog " 
	end

	def self.link_author indexed_name
		Author.search_by_indexed_name(indexed_name) + " , blog " + Blog.create_is_about   
	end

	def self.link_community name
		Community.search_by_name(name) + " , blog " + Blog.create_belongs_to   
	end

	def self.handle_authors tags
		tags.each do |key, value|
			author = Author.get_by_indexed_name(key.search_ready).execute[0]
			unless author.present?
				tags.delete(key)
			end
		end
		tags
	end

	def self.create_next_post
		" OPTIONAL MATCH (root_blog)-[relation:NextPost]->(old:Blog) FOREACH(ignoreMe IN CASE WHEN relation IS NOT NULL AND old <> blog THEN [1] ELSE [] END | MERGE (root_blog)-[:NextPost]->(blog)-[:NextPost]->(old) DELETE relation) FOREACH(ignoreMe IN CASE WHEN relation IS NULL AND old <> blog THEN [1] ELSE [] END | MERGE (root_blog)-[:NextPost]->(blog)) WITH blog  "
	end

	def self.get_posts last_posted_time
		last_posted_time = Date.iso8601(last_posted_time).strftime
		url = Rails.application.config.blog_url + last_posted_time
		puts url
		JSON.parse(Net::HTTP.get(URI.parse(url)))
	end

	def self.basic_info
		" ID(blog) AS blog_id, blog.title AS title, blog.image_url AS image_url , blog.posted_at AS posted_at, blog.like_count AS like_count, blog.blog_url AS blog_url, blog.excerpt AS excerpt, blog.reblog_count AS reblog_count, labels(blog) AS label "
	end
end