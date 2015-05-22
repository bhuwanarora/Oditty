class UsersBlog < Neo
	def initialize(blog, user_id)
		@blog = blog
		@user_id = user_id
	end

	def match 
		" MATCH (blog:Blog), (user:User) WHERE ID(blog)="+@blog.to_s+" AND ID(user)="+@user_id.to_s + " WITH user, blog "
	end
end