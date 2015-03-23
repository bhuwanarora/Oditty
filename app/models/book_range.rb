class BookRange < Neo
	Values = [
		{"name"=> "0-20"},
		{"name"=> "20-50"},
		{"name"=> "50-100"},
		{"name"=> "100-250"},
		{"name"=> "250+"}
	]

	def self.get_values
		Values
	end

	
end