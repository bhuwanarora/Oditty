puts "Enter Time Groups..."
TimeGroups = [{:name => "Old English Literature (658-1100)"},
		   {:name => "Middle English Literature (1100-1500)"},
		   {:name => "English Renaissance (1500-1660)"},
		   {:name => "Neo Classical Period (1660-1798)"},
		   {:name => "Romanticism (1798-1837)"},
		   {:name => "Victorian Literature (1837-1901)"},
		   {:name => "Modernism (1901-1939)"},
		   {:name => "Post Modern Literature"},
		   {:name => "20th Century Genre Literature"}
		]

TimeGroups.each do |filter|
	country_group = TimeGroup.find_or_create_by(:name => filter[:name])
end