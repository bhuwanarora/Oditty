module AlgorithmHelper::CurvePartioning

	def self.partition_domain data, curve_type
		[{:start => 0, :end => 100}, {:start => 101, :end => data.length}]
	end
	
end