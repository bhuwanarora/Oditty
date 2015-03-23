class UsersLabel

	def set_bookmark_count operation
		" labelled.bookmark_count = COALESCE(labelled.bookmark_count,0) " + operation + " 1 "
	end
end