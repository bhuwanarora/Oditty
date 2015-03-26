class BinaryHeap 
	def initialize user_id
		@user_id = user_id
		@user = User.new user_id
		@node = Node.new user_id
	end

	def insert info
		@node.get_root + @node.get_leaf + @node.link_leaf + @node.set_position
	end

	def self.update id
		@node.get_root +  @node.get_node(id) + " ,root_node, latest_feed " + @node.set_position 
	end

	def get_top_nodes skip_count

	end

	def self.sort

	end

	def self.
		
	end

	def self.delete

	end
end