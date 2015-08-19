module AlgorithmHelper
	
	def self.get_sigmoid params
		x 			= params[:x]
		alpha 		= params[:alpha]
		limit_value = params[:limit_value]

		limit_value/(1 + 1/(alpha*x))
	end
end