class ReadingTime < Neo
	def initialize id
		@id = id
	end
	def self.match_path 
		" MATCH ()-[]-() " 
	end
end