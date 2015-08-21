module AlgorithmHelper::CurveFit
	def self.fit_exponential data
	end

	def self.fit_polynomial data, order = 3
		x = data[:x].to_vector(:scale)
		y = data[:y].to_vector(:scale)
		coef, err, chisq, status = MultiFit.polyfit(x, y, order)
		debugger
	end

	def self.show_poly_plot x_vector, y_vector, coef
		graph([x_vector, y_vector], [x_vector, coef.eval(x_vector)], "-C -g 3 -S 4")
	end

	def self.store_curve curve, book_era, curve_data
	end

	def self.get_fitted_curve_filename curve, book_era_list = Constant::NodeLabel::BookEraLabels
		book_era_list = Constant::NodeLabel::BookEraLabels if book_era_list.nil?
		output = {}
		book_era_list.each{|era| output[era] = GenericHelper.get_files_in_directory('log',curve +"_" + era)}
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