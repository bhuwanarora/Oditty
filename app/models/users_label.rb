class UsersLabel < Neo

	def initialize user_id, label_id
		@user = User.new(user_id)
		@user_id = user_id
		@label = Label.new(label_id)
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET labelled.bookmark_count = TOINT(COALESCE(labelled.bookmark_count, 0)) + 1 "
		else
			" SET labelled.bookmark_count = TOINT(COALESCE(labelled.bookmark_count, 1)) - 1 "
		end
	end

	def self.match
		" MATCH (user)-[labelled:Labelled]->(label:Label) WITH user, label, labelled "
	end

	def create(user_id, label)
		User.new(user_id).match + " CREATE (label:Label{name:\""+label+"\", public: true}), (user)-[:Labelled]->(label) "
	end

end