module TimeHelper
	
	Delimiters = [")", "(", " ",",", "."]

	def self.same date_one, date_two
		begin
			output = (date_one[Constant::Time::Year]  == date_two[Constant::Time::Year]) &&
			(date_one[Constant::Time::Month] == date_two[Constant::Time::Month]) &&
			(date_one[Constant::Time::Date]  == date_two[Constant::Time::Date])
		rescue Exception => e
			output = false
		end
		output
	end

	def self.is_recent date_new, date_old
		output = true
		y_str = Constant::Time::Year
		m_str = Constant::Time::Month
		d_str = Constant::Time::Date

		if (date_new[y_str] < date_old[y_str])
			output = false
		elsif (date_new[y_str] == date_old[y_str] && date_new[m_str] < date_old[m_str])
			output = false
		elsif (date_new[y_str] == date_old[y_str] && date_new[m_str] == date_old[m_str] && date_new[d_str] < date_old[d_str])
			output = false
		end
		output
	end

	def self.is_old date_old, date_new
		TimeHelper.is_recent date_new, date_old
	end

	def self.is_in_between date_old, date_in_btw, date_new
		TimeHelper.is_recent(date_in_btw,date_old) && TimeHelper.is_old(date_in_btw, date_new)
	end

	def self.today
		date = Time.now.to_s.split(" ")[0].split("-")
		output = {
			Constant::Time::Year  => date[0].to_i,
			Constant::Time::Month => date[1].to_i,
			Constant::Time::Date  => date[2].to_i
		}
		output
	end

	def self.get_birthday born_string, entity_label
		case entity_label
		when Constant::EntityLabel::Author
			TimeHelper.get_author_birthday born_string
		end
	end

	def self.get_author_birthday born_string
		output = TimeHelper.extract_hyphen_separated_dates born_string
		if output.empty?
			output = TimeHelper.extract_month_name_based_dates born_string
		end
		output
	end


	def self.extract_hyphen_separated_dates time_string, format = Constant::Time::Format_default
		output = []
		string_array = TimeHelper.get_delimited_array time_string	
		hyphen_separated_string = string_array.map{|elem| (elem if (elem.count("-") == 2)) }.delete_if(&:nil?)
		hyphen_separated_string.each do |elem|
			temp = elem.split("-").map{|num| num.to_i}
			if !(temp[0] == 0 || temp[1] == 0 || temp[2] == 0)
				output << {format[0] => temp[0], format[1] => temp[1], format[2] => temp[2]}
			end
		end
		output
	end
	
	def self.extract_month_name_based_dates time_string
		output = []
		string_array = TimeHelper.get_delimited_array time_string
		month_indices = TimeHelper.get_month_indices string_array
		nearby_elements = month_indices.map{|index| TimeHelper.array_get_nearby_elements(string_array,index)}
		nearby_elements = nearby_elements.map{|nearby_element| TimeHelper.convert_to_int(nearby_element)}
		nearby_elements.each_with_index do |element,index|
			m_index = month_indices[index]
			nearby_elements[index][0] = (Constant::Time::Months.index(string_array[m_index].capitalize) + 1) rescue (Constant::Time::MonthsAbbreviated.index(string_array[m_index].capitalize) + 1) 
		end
		output = nearby_elements.map{|nearby_element| TimeHelper.get_date_from_filtered_date_hash(nearby_element)}
	end

	def self.get_delimited_array time_string
		regex = Delimiters.join
		string_array = time_string.split(/[#{regex}]/).delete_if(&:empty?)
	end

	def self.get_month_indices string_array
		month_indices = []
		string_array.each_with_index.map do |elem,index| 
			if (Constant::Time::Months.include? elem.capitalize) || (Constant::Time::MonthsAbbreviated.include? elem.capitalize)
				month_indices << index
			end
		end
		month_indices
	end
	


	private

	def self.get_date_from_filtered_date_hash date_hash, format = Constant::Time::Format_default
		output = {}
		if date_hash.length == 5 && TimeHelper.isMonth(date_hash[0].to_s)
			output[Constant::Time::Month] = date_hash[0]
			if ((isYear date_hash[1]) && (isDayInt date_hash[2])) || ((isYear date_hash[2]) && (isDayInt date_hash[1]))
				val_year  = date_hash[1] > date_hash[2]? date_hash[1]: date_hash[2]
				val_date  = date_hash[1] < date_hash[2]? date_hash[1]: date_hash[2]
				output[Constant::Time::Date] = val_date
				output[Constant::Time::Year] = val_year
			end
			if ((isYear date_hash[-2]) && (isDayInt date_hash[-1])) || ((isYear date_hash[-1]) && (isDayInt date_hash[-2]))
				val_year  = date_hash[-2] > date_hash[-1]? date_hash[-2]: date_hash[-1]
				val_date  = date_hash[-2] < date_hash[-1]? date_hash[-2]: date_hash[-1]
				output[Constant::Time::Date] = val_date
				output[Constant::Time::Year] = val_year
			end
			if ((isYear date_hash[1]) && (isDayInt date_hash[-1])) || ((isYear date_hash[-1]) && (isDayInt date_hash[1]))
				val_year  = date_hash[-1] > date_hash[1]? date_hash[-1]: date_hash[1]
				val_date  = date_hash[-1] < date_hash[1]? date_hash[-1]: date_hash[1]
				output[Constant::Time::Date] = val_date
				output[Constant::Time::Year] = val_year
			end
		end
		output
	end

	def self.array_get_nearby_elements object_array,index, neighbourhood = 2
		nearby_elements = {}
		(-1*neighbourhood).step(neighbourhood,1) do |num|
			nearby_elements[num] = nil
		end
		(-1*neighbourhood).step(neighbourhood,1) do |position|
			if position + index >=0
				nearby_elements[position] = object_array[position + index] rescue nil
			end
		end
		nearby_elements
	end
	
	def self.convert_to_int object_hash
		output = {}
		object_hash.each do |key,value|
			output[key] = value.to_i rescue nil
		end
		output
	end

	def self.isYear year_sting
		year_sting.present? && (0 < year_sting.to_i && year_sting.to_i < 2100)
	end

	def self.isMonth month_string
		month_string.present? && ((Constant::Time::Months.include? month_string.capitalize) || ( 0 < month_string.to_i && month_string.to_i < 13))
	end

	def self.isDayInt day_string
		day_string.present? && (0 < day_string.to_i && day_string.to_i < 32)
	end

	def self.isDayString day_string
		day_string.present? && (Constant::Time::Day.include? day_string.capitalize)
	end

	def self.isValidDate day, month, year
		true
	end
end
