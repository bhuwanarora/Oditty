puts "Enter Country Groups..."
CountryGroups = [{:name => "European"},
		   {:name => "Asian"},
		   {:name => "African"},
		   {:name => "Australian"},
		   {:name => "Latin American"},
		   {:name => "North American"},
		   {:name => "South American"},
		   {:name => "Japanese"},
		   {:name => "Indian"},
		   {:name => "Russian"},
		   {:name => "German"},
		]

CountryGroups.each do |filter|
	country_group = CountryGroup.find_or_create_by(:name => filter[:name])
end