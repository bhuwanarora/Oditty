class Label < Neo
	def initialize id
		@id = id
	end

	def self.basic_info
		" label.name AS label_name, ID(label) AS label_id, label.public as public_status, label.key AS label_key "
	end

	def match
		" MATCH (label) WHERE ID(label) = " + @id.to_s + "  WITH label "
	end

	def self.basic_info_user_label
		" user_label.name AS user_label_name, ID(user_label) AS user_label_id "
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET label.bookmark_count = TOINT(COALESCE(label.bookmark_count, 0)) + 1 "
		else
			" SET label.bookmark_count = TOINT(COALESCE(label.bookmark_count, 1)) - 1 "
		end
	end

	def self.create
		" CREATE UNIQUE (user)-[:Labelled]->(:Label) "
	end
	
	def self.match_primary
		" MATCH (label:Label{primary_label:true}) WITH label "
	end

	def self.match_public
		" MATCH (user)-[labelled:Labelled]->(label:Label) WHERE label.public = true WITH label "
	end

	def self.optional_match_books
		" OPTIONAL MATCH (label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(book:Book)
		WITH label, COLLECT({"+Book.grouped_basic_info+"}) as book, COUNT(label) AS label_count "
	end

	def self.optional_match_articles
		" OPTIONAL MATCH (label)-[bookmarked_on:BookmarkedOn]->(bookmark_node:BookmarkNode)-[bookmark_action:BookmarkAction]->(article) WHERE (article:News OR article:Blog) WITH label, COLLECT({"+Article.grouped_basic_info+"}) as article, COUNT(label) AS label_count "
	end

end