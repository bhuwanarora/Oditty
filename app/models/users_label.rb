class UsersLabel < Neo

	def initialize user_id, label_id
		@user = User.new(user_id)
		@user_id = user_id
		@label = Label.new(label_id)
	end

	def self.set_bookmark_count
		" labelled.bookmark_count = CASE WHEN labelled.bookmark_count IS NULL THEN 1 ELSE toInt(labelled.bookmark_count) + 1 END "
	end

	def self.match
		" MATCH (user)-[bookmark_action:BookmarkAction]->(label:Label) WITH user, label "
	end

	def create(user_id, label)
		User.new(user_id).match + " CREATE (label:Label{name:\""+label+"\", public: true}), (user)-[:BookmarkAction]->(label)"
	end

end