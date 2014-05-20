puts "Enter Time Groups..."
TimeGroups = [{:name => "Post World War I"},
		   {:name => "Post World War II"},
		   {:name => "Post Renaissance"},
		   {:name => "Post Birth of Islam"},
		   {:name => "Post Birth of Christ"},
		   {:name => "Post Industrial Revolution"},
		   {:name => "Post Cold War"},
		   {:name => "Post Medical Revolution"},
		   {:name => "Custom Time Filters"}
		]

TimeGroups.each do |filter|
	country_group = TimeGroup.find_or_create_by(:name => filter[:name])
end