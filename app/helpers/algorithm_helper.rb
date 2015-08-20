module AlgorithmHelper
	
	def self.get_sigmoid params
		x 			= params[:x]
		alpha 		= params[:alpha]
		limit_value = params[:limit]

		(alpha*x)*limit_value/(1 + (alpha*x))
	end

	def self.round num, decimal_places = 2.0
		(num*(10**decimal_places)).round / ((10**decimal_places)*1.0)
	end
end