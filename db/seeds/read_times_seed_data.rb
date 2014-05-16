puts "Enter Read Times.."
ReadTimes = [{:text => "Within a Day"},
		   {:text => "Within a Week"},
		   {:text => "Within a Month"},
		   {:text => "Long Reads"}]

ReadTimes.each do |filter|
	country_group = ReadTime.find_or_create_by(:text => filter[:text])
end