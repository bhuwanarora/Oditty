class Era < Neo
	def initialize id
		@id = id
	end

	def init_match
		case @id
		when Constants::OldEnglishLiterature
			init_match_clause = "MATCH (book:OldEnglishLiterature) "
		when Constants::MiddleEnglishLiterature
			init_match_clause = "MATCH (book:MiddleEnglishLiterature) "
		when Constants::EnglishRenaissance
			init_match_clause = "MATCH (book:EnglishRenaissance) "
		when Constants::NeoClassicalPeriod
			init_match_clause = "MATCH (book:NeoClassicalPeriod) "
		when Constants::Romanticism
			init_match_clause = "MATCH (book:Romanticism) "
		when Constants::VictorianLiterature
			init_match_clause = "MATCH (book:VictorianLiterature) "
		when Constants::Modernism
			init_match_clause = "MATCH (book:Modernism) "
		when Constants::PostModernLiterature
			init_match_clause = "MATCH (book:PostModernLiterature) "
		when Constants::Contemporary
			init_match_clause = "MATCH (book:Contemporary) "
		end
		init_match_clause
	end

	def books
		case @id
		when Constants::OldEnglishLiterature
			label = ":OldEnglishLiterature"
		when Constants::MiddleEnglishLiterature
			label = ":MiddleEnglishLiterature"
		when Constants::EnglishRenaissance
			label = ":EnglishRenaissance"
		when Constants::NeoClassicalPeriod
			label = ":NeoClassicalPeriod"
		when Constants::Romanticism
			label = ":Romanticism"
		when Constants::VictorianLiterature
			label = ":VictorianLiterature"
		when Constants::Modernism
			label = ":Modernism"
		when Constants::PostModernLiterature
			label = ":PostModernLiterature"
		when Constants::Contemporary
			label = ":Contemporary"
		end
		" MATCH (book "+label+") WITH book "
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