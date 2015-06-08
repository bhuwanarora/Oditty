module BlogsHelper
	def self.handle
		last_posted_time = Blog.get_latest_blog.execute[0]["posted_at"]
		response = Blog.get_posts last_posted_time

		for post in response["posts"]
			clause = ""
			clause = Blog.create(post) + Blog.match_root + " ,blog " + Blog.create_next_post + Blog.create_timestamp(post["date"],"blog")   
			
			author_tags = Blog.handle_authors post["tags"]
			author_tags.each do |key, value|
				post["tags"].delete(key)
				clause += Blog.link_author(key.search_ready) + " WITH blog "
			end

			post["tags"].each do |key, value|
				clause += Blog.link_community(key) + " WITH blog "
			end
			clause += Blog.return_init + Blog.basic_info
			response = clause.execute[0]
			IndexerWorker.perform_async(response["blog_id"], "Blog")
		end					
	end
end