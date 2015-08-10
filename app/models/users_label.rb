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

	def self.match_public shelf=""
		" MATCH (user)-[labelled:Labelled]->(label:Label" + shelf + ") WHERE label.public = true WITH user, label, labelled "
	end

	def self.create_new(user_id, label, type)
		articles = ["community", "article", "blog"]
		if type.to_s.downcase == "book"
			type = "BookShelf"
		elsif articles.include? type.to_s.downcase
			type = "ArticleShelf"
		end
				
		User.new(user_id).match + " MERGE (label:Label{name:\""+label+"\", public:true}) ON CREATE SET label.indexed_label_name = \"" + label.search_ready + "\" MERGE (user)-[:Labelled]->(label) SET label: " + type
	end

	def self.create(user_id, label)
		User.new(user_id).match + " MERGE (label:Label{name:\""+label+"\", public:true}) MERGE (user)-[:Labelled]->(label) "
	end
end