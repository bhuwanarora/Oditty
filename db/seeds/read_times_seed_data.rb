puts "Enter Read Times.."
ReadTimes = [{:name => "for a flight journey"},
			{:name => "for a weekend getaway"},
		   {:name => "for a week holiday"},
		   {:name => "for a month vacation"}]

ReadTimes.each do |filter|
	country_group = ReadTime.find_or_create_by(:name => filter[:name])
end