class Infinity < Neo

	def initialize subject_id=nil, author_id=nil, time_id=nil, era_id=nil
		@subject_id = subject_id
		@author_id = author_id
		@time_id = time_id
		@era_id = era_id
	end

	def get_books
		clause = ""
		with_clause = " WITH "
		if @author_id.present?
			match_clause = Infinity::FilterAuthor.match
		end
		clause = clause + match_clause
		with_clause = with_clause + ", author "

		if @subject_id.present?
			match_clause = Infinity::FilterSubject.match
		end
		clause = clause + match_clause
		with_clause = with_clause + ", category "

		if @time_id.present?
			match_clause = Infinity::FilterTime.match
		end
		clause = clause + match_clause
		with_clause = with_clause + ", time "

		if @era_id.present?
			match_clause = Infinity::FilterEra.match
		end
		clause = clause + match_clause
		with_clause = with_clause + ", era "

		clause = clause + with_clause
		
	end
end