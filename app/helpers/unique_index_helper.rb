module UniqueIndexHelper
	UniqueIndices = {
		Constant::EntityLabel::Author 		=> ["search_index", "indexed_main_author_name"],
		Constant::EntityLabel::Book			=> [],
		Constant::EntityLabel::User 		=> []
	}

	UniqueIndexBasis = {
		Constant::EntityLabel::Author 		=> ["name"],
		Constant::EntityLabel::Book			=> ["title", "author_name"],
		Constant::EntityLabel::User 		=> []
	}

	LabelToNodeName = {
		Constant::EntityLabel::Author 		=> "author",
		Constant::EntityLabel::Book			=> "book",
		Constant::EntityLabel::User			=> "user"
	}

	ReplacementHash = {
		"-"		=> "",
		":"		=> "",
		"\'"	=> "",
		"!"		=> "",
		"["		=> "",
		"]"		=> "",
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
		"/"		=> "",
		" "		=> ""

	}

	def self.set_unique_indices_internal nodename, indices, indexbasis
		index_string = 	indexbasis.map{
			|basis| Neo.replace_string(
				ReplacementHash, nodename + "." + basis)
		}.join(" + ")
		" SET " + indices.map{|index| (nodename + "." + index + " = " + index_string)}.join(", ")
	end

	def self.set_unique_indices entity_label
		clause = ""
		case entity_label
		when Constant::EntityLabel::Author
			clause = UniqueIndexHelper.set_unique_indices_internal(
				LabelToNodeName[entity_label],
				UniqueIndices[entity_label],
				UniqueIndexBasis[entity_label] )
		end
		clause
	end

end