puts "Enter Country Groups..."
CountryGroups = [{:text => "European Books"},
		   {:text => "Asian Books"},
		   {:text => "African Books"},
		   {:text => "Australian Books"},
		   {:text => "Latin American Books"},
		   {:text => "North American Books"},
		   {:text => "South American Books"},
		   {:text => "Japanese Books"},
		   {:text => "Indian Books"},
		   {:text => "Russian Books"},
		   {:text => "German Books"},
		]

CountryGroups.each do |filter|
	country_group = CountryGroup.find_or_create_by(:text => filter[:text])
end