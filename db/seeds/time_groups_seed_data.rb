puts "Enter Time Groups..."
TimeGroups = [{:text => "Books Post World War I"},
		   {:text => "Books Post World War II"},
		   {:text => "Books Post Renaissance"},
		   {:text => "Books Post Birth of Islam"},
		   {:text => "Books Post Birth of Christ"},
		   {:text => "Books Post Industrial Revolution"},
		   {:text => "Books Post Cold War"},
		   {:text => "Books Post Medical Revolution"},
		   {:text => "Custom Time Filters"}
		]

TimeGroups.each do |filter|
	country_group = TimeGroup.find_or_create_by(:text => filter[:text])
end