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

	def self.to_float object
		if object.is_a? Array
			output = object.map{|elem| elem.to_f}
		elsif object.is_a? Hash
			output = {}
			object.map{|key,value| output[key] = value.to_f}
		end
		output
	end

	def self.mean array
		len = (array.length).to_f
		sum = array.sum
		sum/len
	end
end