puts "Enter Read Times.."
ReadTimes = [{:text => "Less than a Day"},
		   {:text => "With in a Week"},
		   {:text => "With in a Month"},
		   {:text => "Long Reads"}]

ReadTimes.each do |filter|
	country_group = ReadTime.find_or_create_by(:text => filter[:text])
end