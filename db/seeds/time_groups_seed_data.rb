puts "Enter Time Groups..."
TimeGroups = [{:text => "Post World War I"},
		   {:text => "Post World War II"},
		   {:text => "Post Renaissance"},
		   {:text => "Post Birth Of Islam"},
		   {:text => "Post BC"},
		   {:text => "Post Industrial Revolution"},
		   {:text => "Post Cold War"},
		   {:text => "Post Medical Revolution"}
		]

TimeGroups.each do |filter|
	country_group = TimeGroup.find_or_create_by(:text => filter[:text])
end