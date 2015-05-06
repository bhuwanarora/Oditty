module Api
	module V0
		class SearchApi

			def self.search(params)
				q = params[:q]
            	count = params[:count]
            	type = params[:type]
				if(q && q.length >= 3)
					params.merge!(:fuzzy => nil)
					results = self._get_search_clause(params).execute
					
					if results.present?
						results
					else
						params[:fuzzy] = true
						results = self._get_search_clause(params).execute
						results.push({:fuzzy => true})
					end
				else
					results = []
				end
				results
			end

			private

            def self._get_search_clause(params)
            	params[:q] = params[:q].search_ready
            	q = params[:q]
            	count = params[:count] || 4
            	type = params[:type]
            	fuzzy = params[:fuzzy]
            	skip = params[:skip]

 				case type
				when 'Book'
					clause = Search.new(params).book_by_title
				when 'Author'
					clause = Search.new(params).author_by_name
				when 'Person'
					clause = Search.new(params).user_by_name
				when 'Genre'
					clause = Search.new(params).category_by_name
				when 'Community'
					clause = Search.new(params).community_by_name
				when 'News'
					clause = Search.new(params).news_by_title
				when 'Blog'
					clause = Search.new(params).blog_by_title
				when 'Label'
					clause = Search.new(params).label_by_name
				else
					clause = Search.new(params).basic
				end
				clause
            end

		end
	end
end