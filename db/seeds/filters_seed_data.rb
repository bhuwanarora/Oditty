puts "Enter Filters..."
Filters = [{:name => "Must Reads", :priority => 100, :filter_type => "BOOK"},
		   {:name => "Similar Reads", :priority => 100, :filter_type => "BOOK"},
		   {:name => "Recommended By Friends", :priority => 100, :filter_type => "BOOK"},
		   {:name => "From Indian Authors", :priority => 1, :filter_type => "BOOK"},
		   {:name => "Movie Based", :priority => 1, :filter_type => "BOOK"},
		   {:name => "Series of Books", :priority => 10, :filter_type => "BOOK"},
		   {:name => "Upcoming Books", :priority => 11, :filter_type => "BOOK"},
		   {:name => "Quick Reads", :priority => 100, :filter_type => "BOOK"},
		   {:name => "Sponsored Books", :priority => 2, :filter_type => "BOOK"},
		   {:name => "Feeling Nomadic", :priority => 2, :filter_type => "BOOK"},
		   {:name => "From Female Authors", :priority => 2, :filter_type => "BOOK"},
		   {:name => "Serendipitous Reads", :priority => 2, :filter_type => "BOOK"},
		   {:name => "Serendipitous Authors", :priority => 100, :filter_type => "AUTHOR"},
		   {:name => "Similar Authors", :priority => 100, :filter_type => "AUTHOR"},
		   {:name => "Recommended By Friends", :priority => 100, :filter_type => "AUTHOR"},
		   {:name => "New to Writing", :priority => 100, :filter_type => "AUTHOR"},
		   {:name => "Sponsored Authors", :priority => 100, :filter_type => "AUTHOR"},
		   {:name => "Contemporary Authors", :priority => 100, :filter_type => "AUTHOR"},
		   {:name => "Similar Readers", :priority => 100, :filter_type => "READER"},
		   {:name => "Serendipitous Readers", :priority => 100, :filter_type => "READER"},
		   {:name => "Opposite Gender", :priority => 100, :filter_type => "READER"},
		   {:name => "Same Gender", :priority => 100, :filter_type => "READER"}
		]

Filters.each do |filter|
	filter_obj = Filter.find_or_create_by(:name => filter[:name])
	filter_obj.update_attributes(:priority => filter[:priority], :filter_type => filter[:filter_type])
end