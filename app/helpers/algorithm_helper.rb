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

	def self.random lower_limit, upper_limit
		offset = rand(upper_limit - lower_limit + 1)
		lower_limit + offset
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

	def self.std_dev array
		x_2 = array.map { |elem| elem*elem  }
		exp_x_2 = AlgorithmHelper.mean(x_2)
		exp_x = AlgorithmHelper.mean(array)
		deviation = exp_x_2 - exp_x*exp_x
		output = Math.sqrt(deviation)
		output
	end
end