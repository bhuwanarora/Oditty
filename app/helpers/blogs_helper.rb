module BlogsHelper
	def self.handle
		duplicate = -1
		last_posted_time = Blog.get_latest_blog.execute[0]["posted_at"]
		response = Blog.get_posts last_posted_time
		duplicate_count = 0
		duplicate_limit = 10
		for post in response["posts"]
			output = (Blog.get_by_url post["short_URL"]).execute
			if output.present?
				duplicate_count += 1
				debugger
				next
			end
			clause = ""
			clause = Blog.create(post) + Blog.match_root + " ,blog " + Blog.create_next_post + Blog.create_timestamp(post["date"],"blog")   
			
			# author_tags = Blog.handle_authors post["tags"]
			# author_tags.each do |key, value|
			# 	post["tags"].delete(key)
			# 	clause += Blog.link_author(key.search_ready) + " WITH blog "
			# end

			# post["tags"].each do |key, value|
			# 	clause += Blog.link_community(key) + " WITH blog "
			# end
			clause += Blog.return_init + Blog.basic_info
			response = clause.execute[0]
			params = {:type => "Blog", :response => response["blog_id"]}
			IndexerWorker.perform_async(params)
		end
		if duplicate_count > duplicate_limit
			duplicate = 1
		end
		duplicate
	end
end