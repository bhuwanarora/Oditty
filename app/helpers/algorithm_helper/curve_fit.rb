module AlgorithmHelper::CurveFit
	Directory = Rails.root.to_s + '/log/curves/'
	#y = exp(a2 + b2*x)
	def self.fit_exponential data
		x = GSL::Vector[data[:x]]
		y = GSL::Vector[data[:y]]
		a2, b2, = GSL::Fit.linear(x, GSL::Sf::log(y))
		alpha   = GSL::Sf::exp(a2)
		y_prediction = alpha*GSL::Sf::exp(b2*x)
	end

	def self.fit_polynomial data, order = 4	
		x = GSL::Vector[data[:x]]
		y = GSL::Vector[data[:y]]
		coef, err, chisq, status = GSL::MultiFit.polyfit(x, y, order)
		{:coef => coef, :err => err, :chisq => chisq, :status => status}
	end

	def self.get_directory curve_type
		directory = AlgorithmHelper::CurveFit::Directory + curve_type
		GenericHelper.recursively_create_directories directory unless File.exists?(directory)
		directory
	end

	def self.show_plot params
		x_vector 		= params[:x]
		y_vector		= params[:y]
		coef 			= params[:coef]
		curve_type	= params[:type]
		x_label 		= (params[:x_label].present?) ? params[:x_label] : "x_axis"
		y_label			= (params[:y_label].present?) ? params[:y_label] : "y_axis"
		title 			= (params[:title].present?) ? params[:title] : 'Plotting x-y curve'

		directory = AlgorithmHelper::CurveFit.get_directory curve_type
		Gnuplot.open do |gp|
			Gnuplot::Plot.new( gp ) do |plot|
				plot.title  title
				plot.xlabel x_label
				plot.ylabel y_label
    			plot.data = [
    				Gnuplot::DataSet.new([x_vector.to_a, y_vector.to_a]){ |ds|
    					ds.with = "points"
    					ds.title = 'Original data'
					},
					Gnuplot::DataSet.new([x_vector.to_a, coef.eval(x_vector).to_a]){ |ds|
						ds.with  = "points"
						ds.title = 'Fitted Curve'
						}
				]
				plot.terminal "pngcairo"
				plot.output (directory + "/" + title.gsub(" ","_") + ".pngcairo")
    		end
    	end
	end

	def self.get_file_polynomial curve_data
		partition 		= curve_data[:partition]
		curve_type 	= curve_data[:instance]
		book_era 		= curve_data[:era]
		directory = AlgorithmHelper::CurveFit.get_directory Constant::Curves::Polynomial
		filename = directory + "/" + curve_type + "_" + book_era + partition[:start].to_s + "_" + partition[:end].to_s + ".txt"
	end
	
	def self.store_curve_polynomial curve_data
		filename 	= AlgorithmHelper::CurveFit.get_file_polynomial curve_data
		coef 		= curve_data[:coef].to_a
		File.open(filename, 'w') { |file| file.write(coef.join(" ")) }
	end

	def self.get_curve_polynomial curve_data
		filename 	= AlgorithmHelper::CurveFit.get_file_polynomial curve_data
		output 		= []
		File.readlines(filename).each do |line|
			output << line.split(" ").map{|elem| elem.to_f}
		end
		output[0]
	end

	def self.get_value_polynomial_curve coef_array, x
		x_pow_value = 1.0
		output = 0.0
		coef_array.each do |coef|
			output += coef*x_pow_value
			x_pow_value *= x
		end
		output
	end

	def self.store_curve curve_type, curve_data
		case curve_type
		when Constant::Curves::Polynomial
			AlgorithmHelper::CurveFit.store_curve_polynomial curve_data
		end

	end

	def self.get_fitted_curve_filename curve, book_era_list = Constant::NodeLabel::BookEraLabels
		book_era_list = Constant::NodeLabel::BookEraLabels if book_era_list.nil?
		output = {}
		book_era_list.each{|era| output[era] = GenericHelper.get_files_in_directory(AlgorithmHelper::CurveFit::Directory,curve +"_" + era)}
		output
	end

	def self.load_curve filename

	end

	def self.get_fitted_curve params
		curve = params[:type]
		case curve
		when Constant::Curves::BookRatingVsBookReview
			book_era = params[:era]
			filename = AlgorithmHelper::CurveFit.get_fitted_curve_filename curve, book_era
		end
		AlgorithmHelper::CurveFit::load_curve filename
	end
end