class Status::Mention::MentionsAuthor < Status::Mention
	def initialize author_id, user_id
		@author = Author.new(author_id)
		@user_id = user_id
	end

	def create 
		@author.match + ", status " + Status::Mention.new(@user_id).create("author")
	end

	def self.create_group authors_id , user_id
		clause = Author.match_group(authors_id) + Status::Mention::MentionsAuthor.create_for_user(user_id)
		clause
	end

	def self.create_for_user user_id
		" CREATE UNIQUE (status)-[mentions:Mentions{user_id: "+user_id.to_s+"}]->(author) WITH author, status "
	end
end