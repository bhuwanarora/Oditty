class Label < Neo
	def self.basic_info
		" label.name AS label_name, ID(label) AS label_id, label.public as public_status, label.key AS label_key "
	end

	def self.basic_info_user_label
		" user_label.name AS user_label_name, ID(user_label) AS user_label_id "
	end

	def self.set_bookmark_count operation
		if operation == "+"
			" SET label.bookmark_count = TOINT(COALESCE(label.bookmark_count, 0)) + 1 "
		else
			" SET label.bookmark_count = TOINT(COALESCE(label.bookmark_count, 1)) - 1 "
		end
	end

	def self.match_primary
		" MATCH (label:Label{primary_label:true}) WITH label "
	end

end