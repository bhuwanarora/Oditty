class Facebook < Neo
	require 'fb_graph'

	def initialize id
		@id = id
	end

	def self.get_facebook_pages user_id
		access_token = FacebookUserAuthentication.where(:user_id => user_id).first.access_token
 		# page = FbGraph::Page.new('FbGraph').fetch(:access_token => access_token, :fields => :access_token)
 		me = FbGraph::User.me(access_token)
 		page = me.accounts.detect do |p|
			p.name == "Reader's Door"
		end
		post page
		pages = me.accounts
		pages
	end

	def match
		" MATCH (facebook_book :FacebookBook) WHERE facebook_book.fb_id = " + @id.to_s + " AND NOT facebook_book :Book WITH facebook_book "
	end

	def map data
		" SET book.facebook_id = " + data["id"].to_s + ", book.description = \"" data["description"] + "\", book.likes = \"" + data["likes"].to_s + ", book.url = \"" + data['link'] + "\", book.talking_about_count " + data['talking_about_count'].to_s
	end
	
	def handle_relations original_book_id, relations
		clause = Book.new(original_book_id).match + " WITH book "
		if relations.present? && relations["outgoing"].present?
			relations["outgoing"].each do |relation|
				clause += relation['node_id'].present? ? Facebook.link_relations(relation, original_book_id, outgoing = true) : ""
			end
		end

		if relations.present? && relations["incoming"].present?
			relations["incoming"].each do |relation|
				clause += relation['node_id'].present? ? Facebook.link_relations(relation, original_book_id) : ""
			end
		end
		clause + match + ", book MATCH (facebook_book)-[r]-() DELETE r, facebook_book " + Book.set_facebook_book(@id) 
	end

	def self.link_relations relation, original_book_id, outgoing=false
		clause = " MATCH (node) WHERE ID(node) = " + relation['node_id'].to_s 
		if outgoing
			clause += " MERGE (node)<-[:" + relation["type"] + "]-(book) "
		else
			clause += " MERGE (node)-[:" + relation["type"] + "]->(book) "
		end
		clause + " WITH book "
	end

	def self.get_relations id
		Facebook.new(id).match + " OPTIONAL MATCH (facebook_book)-[r]->(node), (facebook_book)<-[r]-(node) WITH COLLECT({ type: TYPE(r), node_id: ID(node)}) AS outgoing, COLLECT({ type: TYPE(r), node_id: ID(node)}) AS incoming RETURN outgoing, incoming "
	end

	def self.post page
		page.feed!(
		 	:message => 'TEST MESSAGE',
		 	:picture => 'https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-ash3/t1.0-9/1484250_456797414452875_5063887629065003432_n.png',
		 	:description => "TEST DESCRIPTION",
		 	:link => "http://readersdoor.com"
		)
	end
end