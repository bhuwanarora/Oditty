puts "Enter Time Groups..."
BookLists = [{:name => "Post World War I"},
		   {:name => "Post World War II"},
		   {:name => "Post Renaissance"},
		   {:name => "Post Birth of Islam"},
		   {:name => "Post Birth of Christ"},
		   {:name => "Post Industrial Revolution"},
		   {:name => "Post Cold War"},
		   {:name => "Post Medical Revolution"},
		   {:name => "Custom Time Filters"}
		]

BookLists.each do |filter|
	country_group = BookList.find_or_create_by(:name => filter[:name])
end