module TimeHelper
	
	Delimiters = [")", "(", " ",",", "."]


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
		debugger
		string_array = TimeHelper.get_delimited_array time_string	
		hyphen_separated_string = string_array.map{|elem| (elem if (elem.count("-") == 2)) }.delete_if(&:nil?)
		hyphen_separated_string.each do |elem|
			temp = elem.split("-").map{|num| num.to_i}
			output << {format[0] => temp[0], format[1] => temp[1], format[2] => temp[2]}
		end
		debugger
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
			nearby_elements[index][0] = (Months.index(string_array[m_index].capitalize) + 1) rescue (MonthsAbbreviated.index(string_array[m_index].capitalize) + 1) 
		end
		output = nearby_elements.map{|nearby_element| TimeHelper.get_date_from_filtered_date_array(nearby_element)}
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

	def self.get_date_from_filtered_date_array int_array, format = Constant::Time::Format_default
		output = {}
		if int_array.length == 5 && TimeHelper.isMonth(int_array[2].to_s)
			output[Constant::Time::Month] = int_array[2]
			if ((isYear int_array[3]) && (isDayInt int_array[4])) || ((isYear int_array[4]) && (isDayInt int_array[3]))
				val_year  = int_array[3] > int_array[4]? int_array[3]: int_array[4]
				val_date  = int_array[3] < int_array[4]? int_array[3]: int_array[4]
				output[Constant::Time::Date] = val_date
				output[Constant::Time::Year] = val_year
			end
			if ((isYear int_array[0]) && (isDayInt int_array[1])) || ((isYear int_array[1]) && (isDayInt int_array[0]))
				val_year  = int_array[0] > int_array[1]? int_array[0]: int_array[1]
				val_date  = int_array[0] < int_array[1]? int_array[0]: int_array[1]
				output[Constant::Time::Date] = val_date
				output[Constant::Time::Year] = val_year
			end
			if ((isYear int_array[3]) && (isDayInt int_array[1])) || ((isYear int_array[1]) && (isDayInt int_array[3]))
				val_year  = int_array[1] > int_array[3]? int_array[1]: int_array[3]
				val_date  = int_array[1] < int_array[3]? int_array[1]: int_array[3]
				output[Constant::Time::Date] = val_date
				output[Constant::Time::Year] = val_year
			end
		end
		output
	end

	def self.array_get_nearby_elements object_array,index, neighbourhood = 2
		nearby_elements = {}
		object_array.each_with_index do |object, index|
			nearby_elements = (-1*neighbourhood + index).step(index + neighbourhood,1){|index| nearby_elements[index] = object_array[index] rescue nil}
		end
		debugger
		nearby_elements
	end
	
	def self.convert_to_int object_hash
		output = {}
		object_hash.each do |key,value|
			output[key] = value.to_i rescue nil
		end
		output
	end

	def isYear year_sting
		year_sting.present? && (0 < year_sting.to_i < 2100)
	end

	def isMonth month_string
		month_string.present? && (Months.include? month_string.capitalize || ( 0 < month_string.to_i < 13))
	end

	def isDayInt day_string
		day_string.present? && (0 < day_string.to_i < 32)
	end

	def isDayString day_string
		day_string.present? && (Day.include? day_string.capitalize)
	end

	def isValidDate day, month, year
		true
	end
end
