module LocationHierarchyHelper
	
	CountryCityName = {"1" => "country", "2" => "city"}
	CountryStreetName = {"1" => "country", "2" => "street"}
	CityStreetName = {"1" => "city", "2" => "street"}

	def self.merge_country_to_city(country_node,city_node)
		merge_hierachy_links(country_node,city_node,Constant::FbDataNode::FbDataNodeToLabel["city"])
	end

	def self.merge_country_to_city_id(country_id, city_id)
		LocationHierarchyHelper.match_node_pair({"1" => country_id, "2" => city_id},CountryCityName) + LocationHierarchyHelper.merge_country_to_city(CountryCityName["1"],CountryCityName["2"])
	end

	def self.merge_city_to_street(city_node,street_node)
		merge_hierachy_links(city_node,street_node,Constant::FbDataNode::FbDataNodeToLabel["street"])
	end

	def self.merge_city_to_street_id(city_id, street_id)
		LocationHierarchyHelper.match_node_pair({"1" => city_id, "2" => street_id},CityStreetName) + LocationHierarchyHelper.merge_city_to_street(CityStreetName["1"],CityStreetName["2"])
	end

	def self.merge_country_to_street(country_node,street_node)
		merge_hierachy_links(country_node,street_node,Constant::FbDataNode::FbDataNodeToLabel["street"])
	end

	def self.merge_country_to_street_id(country_id, street_id)
		LocationHierarchyHelper.match_node_pair({"1" => country_id, "2" => street_id},CountryStreetName) + LocationHierarchyHelper.merge_country_to_city(CountryStreetName["1"],CountryStreetName["2"])
	end

	def self.get_relationship_type label
		"Has" + label.search_ready.camelize
	end

	def self.merge_hierachy_links(parent_node, child_node, child_label)
		" MERGE(" + parent_node + ")-[:" + LocationHierarchyHelper.get_relationship_type(child_label) + "]->(" + child_node + ") "
	end

	def self.match_node_pair(id_hash,name_hash = {"1" => "node1", "2" => "node2"})
		"MATCH (" + name_hash["1"] + "), (" + name_hash["2"] + ")"\
		"WHERE ID("+ name_hash["1"] + ") =" + id_hash["1"].to_s + " AND ID(" + name_hash["2"] + ") = " + id_hash["2"].to_s + " "\
		"WITH " + name_hash["1"] + ", " + name_hash["2"] + " "
	end
end