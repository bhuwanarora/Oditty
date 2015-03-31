class Status::Mention::MentionsAuthor < Status::Mention
	def initialize author_id, user_id
		@author = Author.new(author_id)
		@user_id = user_id
		@node_variable = "author"
	end

	def create 
		@author.match(@node_variable) + ", status " + Status::Mention.new(@user_id).create(@node_variable)
	end

	def self.handle authors , user_id
		clause = ""
		unless authors.nil?
			authors.each{|author| clause += Status::Mention::MentionsAuthor.new(author, user_id).create}
		end
		clause
	end
end