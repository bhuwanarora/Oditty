class UsersLabel < Neo

	def set_bookmark_count
		" labelled.bookmark_count = CASE WHEN labelled.bookmark_count IS NULL THEN 1 ELSE toInt(labelled.bookmark_count) + 1 END "
	end
end