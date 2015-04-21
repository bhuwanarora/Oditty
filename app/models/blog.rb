class Blog < Neo
	
	def self.create post
		puts post.to_s.green
		" MERGE (blog:Blog{blog_url:\"" + post["short_URL"] + "\"}) " + Blog.set_excerpt(post["excerpt"]) + Blog.set_title(post["title"]) + Blog.set_image_url(post["attachments"]) + Blog.set_reblog_count(post["is_reblogged"]) + Blog.set_like_count(post["like_count"]) + Blog.set_created_at(post["date"]) + " WITH blog "
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

	def self.find_nth skip_count = 1
		" OPTIONAL MATCH (new)-[next_post:NextPost*" + skip_count.to_s + "]->(old) WITH old, new, next_post "
	end

	def self.match_root
		" MERGE (root_blog:Blog{is_root:true}) WITH root_blog "
	end

	def self.get_latest_blog
		Blog.match_root + " WITH root_blog AS new " + Blog.find_nth + " WITH old AS blog " + Blog.return_init + Blog.basic_info  
	end

	def self.create_is_about
		" MERGE (blog)-[is_about:IsAbout]->(author) " 
	end

	def self.create_belongs_to
		" MERGE (blog)-[belongs_to:BelongsTo]->(community) " 
	end

	def self.link_author indexed_name
		Author.search_by_indexed_name(indexed_name) + Blog.create_is_about   
	end

	def self.link_community name
		Community.search(name) + Blog.create_belongs_to   
	end

	def self.handle_communities tags
		tags.each do |key, value|
			author = Community.get(key).execute[0]
			if author.present?
				tags.delete(key)
			end
		end
		tags			
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
		" OPTIONAL MATCH (root_blog)-[relation:NextPost]->(old:Blog) FOREACH(ignoreMe IN CASE WHEN relation IS NOT NULL THEN [1] ELSE [] END | MERGE (root_blog)-[:NextPost]->(blog)-[:NextPost]->(old) DELETE relation) FOREACH(ignoreMe IN CASE WHEN relation IS NULL THEN [1] ELSE [] END | MERGE (root_blog)-[:NextPost]->(blog)) WITH blog  "
	end

	def self.handle
		last_posted_time = Blog.get_latest_blog.execute[0]["posted_at"]
		puts last_posted_time.to_s
		if last_posted_time.present?
			uri_clause = "&after=" + last_posted_time
		else
			uri_clause = "&limit=100"
		end
		response = (Blog.get_posts uri_clause)

		for post in response["posts"]
			clause = ""
			clause = Blog.create(post) + Blog.match_root + " ,blog " + Blog.create_next_post + Blog.create_timestamp(post["date"],"blog")  
			
			author_tags = Blog.handle_authors post["tags"]
			author_tags.each do |key, value|
				post["tags"].delete(key)
				clause += Blog.link_author(key) + " WITH blog "
			end

			post["tags"].each do |key, value|
				clause += Blog.link_community(key) + " WITH blog "
			end
			clause.execute 
		end					
	end

	def self.get_posts clause
		url = Rails.application.config.blog_url + clause
		JSON.parse(Net::HTTP.get(URI.parse(url)))
	end

	def self.basic_info
		" ID(blog) AS blog_id, blog.title AS title, blog.published_year AS published_year, blog.created_at AS created_at , blog.posted_at AS posted_at, blog.image_url AS image_url, blog.blog_url AS blog_url "
	end
end