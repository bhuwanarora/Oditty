class Infinity::FilterReadTime < Infinity
	def initialize id
		@id = id
	end

	def match 
		ReadTime.match_path + " WHERE ID(read_time) = " + @id.to_s 
	end
end