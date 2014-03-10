puts "Enter Filters..."
Filters = [{:name => "Must Reads"},
		   {:name => "Similar Reads"},
		   {:name => "Recommendation From Friends"},
		   {:name => "Indian Authors"},
		   {:name => "Book Of the Year"},
		   {:name => "Book Series"},
		   {:name => "Upcoming Books"},
		   {:name => "Quick Reads"},
		   {:name => "Sponsored Books"}]

Filters.each do |filter|
	filter = Filter.find_or_create_by(:name => filter[:name])
end