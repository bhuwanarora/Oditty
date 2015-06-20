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
		" MATCH (facebook_book :Book :FacebookBook) WHERE facebook_book.fb_id = " + @id.to_s + " WITH facebook_book "
	end

	def map data
		original_book_id = Book.get_by_unique_index("#{data["name"].to_s.search_ready.strip}#{data["written_by"].to_s.search_ready.strip]}").execute[0]['id']
		if original_book_id.exists?
			handle_relations(original_book_id).execute
		end  
	end

	def handle_relations original_book_id
		relations = get_relations.execute[0]
		clause = Book.new(original_book_id).match
		relations["outgoing"].each do |relation|
			clause += Facebook.link_relations(relation, original_book_id, outgoing = true)
		end

		relations["incoming"].each do |relation|
			clause += Facebook.link_relations(relation, original_book_id)
		end
		clause + match + " MATCH (facebook_book)-[r]-() DELETE r, facebook_book " 
	end

	def self.link_relations relation, original_book_id, outgoing=false
		clause = " MATCH (node) WHERE ID(node) = " + relation['id'] 
		if outgoing
			clause += " MERGE (node)<-[:" + relation["type"] + "]-(book) "
		else
			clause += " MERGE (node)-[:" + relation["type"] + "]-(book) "
		end
		clause + " WITH book "
	end

	def self.get_relations
		match + " MATCH (facebook_book)-[r]->(node) WITH COLLECT({ type: TYPES[r], node_id: ID(node)}) AS outgoing WITH outgoing, facebook_book MATCH (facebook_book)<-[r]-(node) WITH outgoing, WITH COLLECT({ type: TYPES[r], node_id: ID(node)}) AS incoming RETURN outgoing, incoming "
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