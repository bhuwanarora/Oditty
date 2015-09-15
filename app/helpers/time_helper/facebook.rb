module TimeHelper::Facebook

	#Example 		=> 2015-05-11T18:35:20+0000
	def self.unix fb_time
		fb_day_time = time_of_day fb_time
		fb_date = date fb_time
		output = Time.new(
			fb_date[:year],
			fb_date[:month],
			fb_date[:day],
			fb_day_time[:hr],
			fb_day_time[:min],
			fb_day_time[:sec]
			).to_i
		output
	end

	def self.time_of_day fb_time
		day_time = fb_time.split("T")[1].split("+")[0]
		output =
		{
			:min 	=> minute(day_time),
			:sec 	=> second(day_time),
			:hr 	=> hour(day_time)
		}
		output
	end

	def self.date fb_time
		fb_date = fb_time.split("T")[0]
		output =
		{
			:day 	=> day(fb_date),
			:month 	=> month(fb_date),
			:year	=> year(fb_date)
		}
		output
	end
	
	private

	def self.second day_time
		day_time.split(":")[2].to_i
	end

	def self.minute day_time
		day_time.split(":")[1].to_i
	end

	def self.hour day_time
		day_time.split(":")[0].to_i
	end

	def self.day fb_date
		fb_date.split("-")[2].to_i
	end

	def self.month fb_date
		fb_date.split("-")[1].to_i
	end

	def self.year fb_date
		fb_date.split("-")[0].to_i
	end

end