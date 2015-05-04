class Infinity::FilterEra < Infinity
	def initialize id
		@id = id
		@era = Era.new(id)
	end

	def match
		@era.books
	end
end