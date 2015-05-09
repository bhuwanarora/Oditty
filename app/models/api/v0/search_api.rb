module Api
	module V0
		class SearchApi

			def self.search(params)
				q = params[:q]
            	count = params[:count]
            	type = params[:type]
				if(q && q.length >= 3)
					params.merge!(:fuzzy => nil)
					results = self._get_search_clause(params)
					
					if results.present?
						results
						puts "results present"
					else
						puts "results absent"
						params[:fuzzy] = true
						results = self._get_search_clause(params)
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
					response = Search.new(params).book_by_title
				when 'Author'
					response = Search.new(params).author_by_name
				when 'Person'
					response = Search.new(params).user_by_name
				when 'Genre'
					response = Search.new(params).category_by_name.execute
				when 'Community'
					response = Search.new(params).community_by_name
				when 'News'
					response = Search.new(params).news_by_title
				when 'Blog'
					response = Search.new(params).blog_by_title
				when 'Label'
					response = Search.new(params).label_by_name.execute
				else
					response = Search.new(params).basic
				end
				response
            end
		end
	end
end