class Era < Neo
	def initialize id
		@id = id
	end

	def init_match
		case @id
		when Constant::Id::OldEnglishLiterature
			init_match_clause = "MATCH (book:OldEnglishLiterature) "
		when Constant::Id::MiddleEnglishLiterature
			init_match_clause = "MATCH (book:MiddleEnglishLiterature) "
		when Constant::Id::EnglishRenaissance
			init_match_clause = "MATCH (book:EnglishRenaissance) "
		when Constant::Id::NeoClassicalPeriod
			init_match_clause = "MATCH (book:NeoClassicalPeriod) "
		when Constant::Id::Romanticism
			init_match_clause = "MATCH (book:Romanticism) "
		when Constant::Id::VictorianLiterature
			init_match_clause = "MATCH (book:VictorianLiterature) "
		when Constant::Id::Modernism
			init_match_clause = "MATCH (book:Modernism) "
		when Constant::Id::PostModernLiterature
			init_match_clause = "MATCH (book:PostModernLiterature) "
		when Constant::Id::Contemporary
			init_match_clause = "MATCH (book:Contemporary) "
		end
		init_match_clause + " WITH book "
	end

	def books
		case @id
		when Constant::Id::OldEnglishLiterature
			label = ":OldEnglishLiterature"
		when Constant::Id::MiddleEnglishLiterature
			label = ":MiddleEnglishLiterature"
		when Constant::Id::EnglishRenaissance
			label = ":EnglishRenaissance"
		when Constant::Id::NeoClassicalPeriod
			label = ":NeoClassicalPeriod"
		when Constant::Id::Romanticism
			label = ":Romanticism"
		when Constant::Id::VictorianLiterature
			label = ":VictorianLiterature"
		when Constant::Id::Modernism
			label = ":Modernism"
		when Constant::Id::PostModernLiterature
			label = ":PostModernLiterature"
		when Constant::Id::Contemporary
			label = ":Contemporary"
		end
		" MATCH (book"+label+") WITH book "
	end

	def match_books
		case @id
		when Constant::Id::OldEnglishLiterature
			label = ":OldEnglishLiterature"
		when Constant::Id::MiddleEnglishLiterature
			label = ":MiddleEnglishLiterature"
		when Constant::Id::EnglishRenaissance
			label = ":EnglishRenaissance"
		when Constant::Id::NeoClassicalPeriod
			label = ":NeoClassicalPeriod"
		when Constant::Id::Romanticism
			label = ":Romanticism"
		when Constant::Id::VictorianLiterature
			label = ":VictorianLiterature"
		when Constant::Id::Modernism
			label = ":Modernism"
		when Constant::Id::PostModernLiterature
			label = ":PostModernLiterature"
		when Constant::Id::Contemporary
			label = ":Contemporary"
		end
		" MATCH (book)-[]-() WHERE book"+label+" WITH book "
	end

	def self.most_popular user_id
		User.new(user_id).match + Bookmark::Node::BookLabel.match_path + ", (book)-[published_in:Published_in]-(year:Year)-[from_era:FromEra]->(era:Era) WITH user, era, COUNT(book) AS book_count, book ORDER BY book_count DESC LIMIT 1 "
	end

	def self.match_books
		" MATCH (book)-[published_in:Published_in]-(year:Year)-[from_era:FromEra]->(era:Era) WITH book, year, era "
	end

	def self.basic_info
		" era.name AS era_name, ID(era) AS era_id "
	end

end