puts "Enter Filters..."
Filters = [{:name => "Must Reads", :priority => 100, :filter_type => "BOOK"},
		   {:name => "Similar Reads", :priority => 100, :filter_type => "BOOK"},
		   {:name => "Recommendation From Friends", :priority => 100, :filter_type => "BOOK"},
		   {:name => "Indian Authors", :priority => 1, :filter_type => "BOOK"},
		   {:name => "Movie Based", :priority => 1, :filter_type => "BOOK"},
		   {:name => "Book Series", :priority => 10, :filter_type => "BOOK"},
		   {:name => "Upcoming Books", :priority => 11, :filter_type => "BOOK"},
		   {:name => "Quick Reads", :priority => 100, :filter_type => "BOOK"},
		   {:name => "Sponsored Books", :priority => 2, :filter_type => "BOOK"},
		   {:name => "Feeling Nomadic", :priority => 2, :filter_type => "BOOK"},
		   {:name => "Only Female Authors", :priority => 2, :filter_type => "BOOK"},
		   {:name => "Serendipitous Reads", :priority => 2, :filter_type => "BOOK"}
		]

Filters.each do |filter|
	filter_obj = Filter.find_or_create_by(:name => filter[:name])
	filter_obj.update_attributes(:priority => filter[:priority], :filter_type => filter[:filter_type])
end