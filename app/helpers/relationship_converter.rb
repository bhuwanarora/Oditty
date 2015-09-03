module RelationshipConverter

	def self.get_relation_key source_labels, type, destination_labels
		source_labels.sort.join(" ") + "__" + type + "__" + destination_labels.sort.join(" ")
	end

	def self.get_relationship_type relation_key, source_label
		output = ""
		mappings = RelationshipConverterHash[relation_key]
		mappings.each do |mapping|
			if mapping[:source] == source_label
				output = mapping[:type]
			end
		end
		output
	end

	def self.get_property relation_key, source_label
		output = ""
		mappings = RelationshipConverterHash[relation_key]
		mappings.each do |mapping|
			if mapping[:source] == source_label
				output = mapping[:property_mapping].clone
			end
		end
		output
	end

	def self.get_direction relation_key, source_label
		output = ""
		mappings = RelationshipConverterHash[relation_key]
		mappings.each do |mapping|
			if mapping[:source] == source_label
				output = mapping[:direction]
			end
		end
		output
	end

	private
	RelationshipConverterHash = 
	{
		'Genre__Belongs_to__Book' =>
		[
			{
				:source => 'Community',
				:type => 'RelatedBooks',
				:direction => Constant::LabelRelationships::Outgoing,
				:property_mapping => {'weight' => 'genre_relevance'}
			}
		]
	}
end