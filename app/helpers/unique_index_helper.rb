module UniqueIndexHelper
	UniqueIndices = {
		EntityLabel::Author 	=> ["search_index", "indexed_main_author_name"],
		EntityLabel::Book		=> [],
		EntityLabel::User 		=> []
	}

	UniqueIndexBasis = {
		EntityLabel::Author 	=> ["name"],
		EntityLabel::Book		=> ["title", "author_name"],
		EntityLabel::User 		=> []
	}

	LabelToNodeName = {
		EntityLabel::Author 	=> "author",
		EntityLabel::Book		=> "book",
		EntityLabel::User		=> "user"
	}

	ReplacementHash = {
		"-"		=> "",
		":"		=> "",
		"\'"	=> "",
		"!"		=> "",
		"["		=> "",
		"]"		=> "",
		"\\"	=> "",
		"@"		=> "",
		"\""	=> "",
		"~"		=> "",
		"{"		=> "",
		"}"		=> "",
		"("		=> "",
		")"		=> "",
		"." 	=> "",
		","		=> "",
		"_"		=> "",
		"/"		=> ""

	}

	def self.set_unique_indices_internal nodename, indices, indexbasis
		index_string = 	indexbasis.map{
			|basis| Neo.replace_string(
				ReplacementHash, nodename + "." + basis)
		}.join(" + ")
		" SET " + indices.map{|index| (nodename + "." + index + " = \'" + index_string + "\'")}.join(", ")
	end

	def self.set_unique_indices entity_label
		clause = ""
		case entity_label
		when EntityLabel::Author
			clause = UniqueIndexHelper.set_unique_indices_internal LabelToNodeName(
				entity_label,
				UniqueIndices(entity_label),
				UniqueIndexBasis(entity_label) )
		end
		clause
	end

end