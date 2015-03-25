class Label < Neo
	def self.basic_info
		" label.name AS label_name, ID(label) AS label_id, label.public as public_status, label.key AS label_key "
	end

	def self.basic_info_user_label
		" user_label.name AS user_label_name, ID(user_label) AS user_label_id "
	end

	def set_bookmark_count
		" label.bookmark_count = CASE WHEN label.bookmark_count IS NULL THEN 1 ELSE toInt(label.bookmark_count) + 1 END "
	end
end