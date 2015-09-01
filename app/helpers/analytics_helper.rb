module AnalyticsHelper
	def self.neo_get_metrics book_era_label, gr_property_hash, step = 10
		prop = gr_property_hash.keys[0]
		value = gr_property_hash[prop]
		" MATCH (book:Book:" + book_era_label + ") "\
		" WHERE toInt(book." + prop + ") >= " + value.to_s + " AND toInt(book." + prop + ") < " + (value + step).to_s + " "\
		" RETURN "\
		" COUNT(book) AS count, "\
		" avg(toInt(book.gr_reviews_count)) AS review_count, "\
		" avg(toInt(book.gr_rating)) AS rating, "\
		" avg(toInt(book.gr_ratings_count)) AS rating_count "
	end

	def self.get_book_metrics
		puts "get_reviews_count"
		log_file_name = 'book_analytics_with_gr_reviews_count_as_basis'
		for time in Constant::NodeLabel::BookEraLabels
			ELogger.log_info(time, log_file_name)
			(0..10000).step(10).each do |index|
				puts "#{time}-----#{index}"
				 clause = AnalyticsHelper.neo_get_metrics(time, {"gr_reviews_count" => index })
				message = clause.execute[0].map{|prop,val| (prop + ":" + val.to_s )}.join(",")
				ELogger.log_info(message, log_file_name)
			end
		end
	end

	def self.handle_each_book_era era, era_data
		curve_type = Constant::Curves::Polynomial
		curve_instance = Constant::Curves::CurveBookRatingVsBookReview
		partitions = AlgorithmHelper::CurvePartioning.partition_domain era_data['review_count'], curve_type
		partitions.each do |partition|
			x_data = era_data['review_count'][partition[:start]..partition[:end]]
			y_data = era_data['rating_count'][partition[:start]..partition[:end]]
			fitted_curve = AlgorithmHelper::CurveFit.fit_polynomial({:x => x_data, :y => y_data })
			params = 
			{
				:x => x_data,
				:y => y_data,
				:coef => fitted_curve[:coef],
				:type => curve_type,
				:x_label => 'reviews_count',
				:y_label => 'rating_count',
				:title => era.to_s + ' reviews_count vs rating_count ' + partition[:start].to_s + "_" + partition[:end].to_s + " "
			}
			AlgorithmHelper::CurveFit.show_plot params
			params = 
			{
				:coef 		=> fitted_curve[:coef],
				:partition 	=> partition,
				:instance	=> curve_instance,
				:era 		=> era
			}
			AlgorithmHelper::CurveFit.store_curve curve_type, params
		end
	end

	def self.analyse_books log_file_name
		log_file_name = (Rails.root.to_s + "/" + log_file_name) if (log_file_name[0] != '/')
		data = FileParser::Analytics.book log_file_name, 1
		data.each do |era, era_data|
			puts ("Handling era: " + era).green
			AnalyticsHelper.handle_each_book_era era, era_data
		end
	end

	def self.get_book_reader_relationship_index_base reviews_count
		if reviews_count > 0
			max_index = 70/100.0*Constant::RatingIndices::MaxBookReaderRelationshipIndex
			output = [Math.log(reviews_count,2)/15, 1.0].min*max_index
		else
			output = 0
		end
		output
	end
	
	def self.handle_elite_books reviews_count, offset_value
		if reviews_count > 10000
			offset_value = [0.0, offset_value].max
		end
		offset_value
	end

	def self.get_book_reader_relationship_index_offset reviews_count, rating_count, era
		if reviews_count < 1000
			partition = {:start => 0, :end => 100}
		else
			partition = {:start => 101, :end => 1001}
		end
		params =
		{
			:instance 	=> Constant::Curves::CurveBookRatingVsBookReview,
			:era 		=> era,
			:partition 	=> partition
		}
		coef = AlgorithmHelper::CurveFit.get_curve_polynomial params
		expected_rating_count = AlgorithmHelper::CurveFit.get_value_polynomial_curve coef, reviews_count
		frac = (expected_rating_count - rating_count)/rating_count
		if frac > 0
			output = [frac*(1/0.4), 1.0].min
		else
			output = [frac*(1/2.0), -1.0].max
		end
		output = AnalyticsHelper.handle_elite_books reviews_count, output
		# output is in between [-1,1]
		output*(30/100.0)*Constant::RatingIndices::MaxBookReaderRelationshipIndex
	end

	def self.get_book_reader_relationship_index reviews_count, rating_count, era
		base = AnalyticsHelper.get_book_reader_relationship_index_base reviews_count.to_f
		offset = AnalyticsHelper.get_book_reader_relationship_index_offset reviews_count.to_f, rating_count.to_f, era
		(base + offset)
	end
end