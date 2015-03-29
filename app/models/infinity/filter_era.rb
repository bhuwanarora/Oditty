class Infinity::FilterEra < Infinity
	def initialize id
		@id = id
	end

	def match
		Era.match_path + " WHERE ID(era) = " + @id.to_s 
	end
end