class Label < Neo
	def self.basic_info
		" label.name AS label_name, ID(label) AS label_id, label.public as public_status, label.key AS label_key "
	end

	def self.basic_info_user_label
		" user_label.name AS user_label_name, ID(user_label) AS user_label_id "
	end

	def set_bookmark_count operation
		" label.bookmark_count = COALESCE(label.bookmark_count,0) " + operation.to_s + " 1 "
	end
end