puts "Enter Read Times.."
ReadTimes = [{:name => "For a flight journey"},
			{:name => "For a weekend getaway"},
		   {:name => "For a week holiday"},
		   {:name => "For a month vacation"}]

ReadTimes.each do |filter|
	country_group = ReadTime.find_or_create_by(:name => filter[:name])
end