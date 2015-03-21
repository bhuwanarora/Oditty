class Label < Neo
	def self.basic_info
		" label.name, ID(label) "
	end

	def self.basic_info_user_label
		" user_label.name, ID(user_label) "
	end

	def set_bookmark_count
		" label.bookmark_count = CASE WHEN label.bookmark_count IS NULL THEN 1 ELSE toInt(label.bookmark_count) + 1 END "
	end
end