puts "Enter Country Groups..."
CountryGroups = [{:text => "European"},
		   {:text => "Asian"},
		   {:text => "African"},
		   {:text => "Australian"},
		   {:text => "Latin American"},
		   {:text => "North American"},
		   {:text => "South American"},
		   {:text => "Japanese"},
		   {:text => "Indian"},
		   {:text => "Russian"},
		   {:text => "German"},
		]

CountryGroups.each do |filter|
	country_group = CountryGroup.find_or_create_by(:text => filter[:text])
end