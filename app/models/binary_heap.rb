class BinaryHeap 
	def initialize user_id
		@user_id = user_id
		@user = User.new user_id
		@node = Node.new user_id
	end

	def insert info
		@node.get_root + @node.get_leaf + @node.link_leaf + @node.get_insertion_path + @node.interchange
	end

	def self.update id
		@node.get_root +  @node.get_node + " ,root_node, latest_feed " + @node.get_insertion_path + @node.interchange 
	end

	def get_top_nodes skip_count
		@node.get_root +  Node.get_feed(skip_count) 
	end

	def self.sort

	end

	def self.delete
		@node.get_node + @node.replace_node + @node.get_deletion_path + @node.interchange
	end
end