module Api
	module V0
		class SearchApi

			def self.search(q, count, type)
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

            def self._get_search_clause(q, count, type, fuzzy=nil)
            	count ||= 0
				q = q.search_ready
 				case type
				when 'Book'
					clause = Search.new(q, count, fuzzy).book_by_title
				when 'Author'
					clause = Search.new(q, count, fuzzy).author_by_name
				when 'Person'
					clause = Search.new(q, count, fuzzy).user_by_name
				when 'Genre'
					clause = Search.new(q, count, fuzzy).category_by_name
				when 'Community'
					clause = Search.new(q, count, fuzzy).community_by_name
				when 'News'
					clause = Search.new(q, count, fuzzy).news_by_title
				when 'Blog'
					clause = Search.new(q, count, fuzzy).blog_by_title
				else
					clause = Search.new(q, count, fuzzy).basic
				end
				clause
            end

		end
	end
end