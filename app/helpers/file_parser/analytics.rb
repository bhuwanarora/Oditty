module FileParser::Analytics
	MetricList = ['count', 'review_count', 'rating', 'rating_count']
	def self.book filename, skip_lines = 0
		output = {}
		current_era = nil
		File.readlines(filename).each_with_index do |line, index|
			next if index < skip_lines
			line = FileParser::Analytics.remove_log_prefix line
			era = FileParser::Analytics.get_era line
			if era.present?
				current_era = era
				FileParser::Analytics.intialize_bucket(output, current_era) if output[current_era].nil?
			else
				data = AlgorithmHelper.to_float(FileParser::Analytics.get_data line)
				if data.present?
					FileParser::Analytics::MetricList.each{ |metric| output[current_era][metric] += [data[metric]]}
				end
			end
		end
		output
	end

	def self.intialize_bucket(output_hash, current_era)
		output_hash[current_era] = {}
		FileParser::Analytics::MetricList.each{|metric| output_hash[current_era][metric] = []}
		output_hash
	end

	def self.get_era line
		(Constant::NodeLabel::BookEraLabels.include? line.strip) ? line.strip : nil
	end

	def self.get_data line
		output = {}
		line.split(",").each{|elem| output[elem.split(":")[0]] = elem.split(":")[1]}
		output
	end

	def self.remove_log_prefix line
		line.split("]  INFO -- :")[1].strip
	end
end