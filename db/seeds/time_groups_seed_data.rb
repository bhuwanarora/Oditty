puts "Enter Time Groups..."
TimeGroups = [{:name => "Old English Literature", :time_group => "658-1100"},
		   {:name => "Middle English Literature", :time_group => "1100-1500"},
		   {:name => "English Renaissance", :time_group => "1500-1660"},
		   {:name => "Neo Classical Period", :time_group => "1660-1798"},
		   {:name => "Romanticism", :time_group => "1798-1837"},
		   {:name => "Victorian Literature", :time_group => "1837-1901"},
		   {:name => "Modernism", :time_group => "1901-1939"},
		   {:name => "Post Modern Literature", :time_group => "1939-2000"},
		   {:name => "20th Century Genre Literature", :time_group => "2000-2014"}
		]

TimeGroups.each do |filter|
	country_group = TimeGroup.find_or_create_by(:name => filter[:name], :time_group => filter[:time_group])
end