module Api
	module V0
		class SearchApi

			def self.search(q, count, type)
				neo_init
				results = self._get_search_clause(q, count, type, nil).execute
				
				if results.present?
					results
				else
					results = self._get_search_clause(q, count, type, true).execute
					results.push({:fuzzy => true})
				end
				results
			end

			private
			def self.neo_init
                @neo = Neography::Rest.new
            end

            def self._get_search_clause(q, count, type, fuzzy=nil)
				q = q.search_ready

				connector = fuzzy.present? ? "~0.7" : "*"
				case type
				when 'BOOK'
					clause = Search.new(q, count, fuzzy).book_by_title
				when 'AUTHOR'
					clause = Search.new(q, count, fuzzy).author_by_name
				when 'READER'
					clause = Search.new(q, count, fuzzy).user_by_name
				when 'GENRE'
					clause = Search.new(q, count, fuzzy).genre_by_name
				else
					clause = Search.new(q, count, fuzzy).basic
				end
				clause
            end

		end
	end
end