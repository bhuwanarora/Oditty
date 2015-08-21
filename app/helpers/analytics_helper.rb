module AnalyticsHelper
	def self.get_reviews_count
		times = ["PostModernLiterature", "Modernism", "Modernism", "VictorianLiterature", "Romanticism", "NeoClassicalPeriod", "EnglishRenaissance", "MiddleEnglishLiterature", "OldEnglishLiterature", "Contemporary"]
		for time in times
			ELogger.log_info(time)
			(0..10000).step(10).each do |index|
				clause = "MATCH (b:Book:#{time}) "\
				"WHERE toInt(b.gr_reviews_count) >= " + index.to_s + " AND toInt(b.gr_reviews_count) < (index + 10) "\
				"RETURN COUNT(b) AS count"
				count = clause.execute[0]["count"]
				ELogger.log_info(count)
			end
		end
	end
end