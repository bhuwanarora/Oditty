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

	def self.parse_elogger_file filename
		filename = (Rails.root.to_s + "/" + filename) if (filename[0] != '/')
		data = FileParser::Analytics.book filename, 1
		data.each do |era, era_data|
			debugger
			AlgorithmHelper::CurveFit.fit_polynomial({:x => era_data['review_count'], :y => era_data['rating_count']})
		end
		AlgorithmHelper::CurveFit.fit_polynomial data
	end
end