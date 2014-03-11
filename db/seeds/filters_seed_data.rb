puts "Enter Filters..."
Filters = [{:name => "Must Reads", :priority => 100},
		   {:name => "Similar Reads", :priority => 100},
		   {:name => "Recommendation From Friends", :priority => 100},
		   {:name => "Indian Authors", :priority => 1},
		   {:name => "Book Of the Year", :priority => 1},
		   {:name => "Book Series", :priority => 10},
		   {:name => "Upcoming Books", :priority => 11},
		   {:name => "Quick Reads", :priority => 100},
		   {:name => "Sponsored Books", :priority => 2},
		   {:name => "Feeling Nomadic", :priority => 2},
		   {:name => "Only Female Authors", :priority => 2},
		   {:name => "Serendipitous Reads", :priority => 2}
		]

Filters.each do |filter|
	filter_obj = Filter.find_or_create_by(:name => filter[:name])
	filter_obj.update_column(:priority, filter[:priority])
end