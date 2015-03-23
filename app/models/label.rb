class Label < Neo
	def self.basic_info
		" label.name, ID(label) "
	end

	def self.basic_info_user_label
		" user_label.name, ID(user_label) "
	end

	def set_bookmark_count operation
		" label.bookmark_count = COALESCE(label.bookmark_count,0) " + operation.to_s + " 1 "
	end
end