module Api
	module V0
		class SearchApi
			def search_book

			end

			def search_author
			end

			def search_reader

			end

			def self.search_genres filter
				neo_init
				match_clause = "MATCH (g:Genre) "
				return_clause = "RETURN g 
                                 ORDER BY g.gr_book_count DESC "
				if filter && filter.chop.present?
					where_clause = "WHERE g.name =~ '(?i)"+filter+".*'"
                    limit_clause = "LIMIT 5"
                	genres = @neo.execute_query(match_clause+where_clause+return_clause+limit_clause)
                else
                	limit_clause = "LIMIT 2"
                	genres = @neo.execute_query(match_clause+return_clause+limit_clause)
                end
			end

			def self.search(q, count, type)
				neo_init
				if (type.include? 'BOOK')
					results = GoodReadsBook.where("UPPER(title) LIKE ?", "#{q.upcase}%")
									   	   .select([:id, :author_name])
									   	   .select("title as name")
									       .limit(count)
					tester = {:name => "BOOK:"+q.upcase}
				elsif (type.include? 'AUTHOR') || (type.include? 'READER')
					q = "@"+q
					clause = "MATCH (author:Author) WHERE author.name =~ '(?i)"+q+".*' 
								RETURN author.name LIMIT "+count.to_s
					results = @neo.execute_query(clause)
					tester = {:name => "HUMAN:"+q.upcase}
				elsif (type.include? 'TAG')
					results = GoodReadsGenre.where("UPPER(name) LIKE ?", "#{q.upcase}%")
											.select([:id, :name])
											.limit(count)
					tester = {:name => "TAG:"+q.upcase}
				else
					results = @neo.execute_query("MATCH (book:Book) 
										WHERE book.title =~ '(?i)"+q+".*' 
										RETURN book.title as name, book.author_name
										ORDER BY book.gr_rating DESC
										LIMIT 5")
					tester = {:name => "RD:"+q.upcase}	
				end
				if results.present?
					results
					# results.push tester
				else
					results = []
					# results = did_you_mean(q, type)
				end
			end


			private
			def self.did_you_mean(q, type)
				results = [{:name => "No results found."}]
				if((type.include? 'AUTHOR') || (type.include? 'READER'))
					s = SpellingBee.new :source_text => 'authors.txt'
				 	did_you_mean = s.correct q
				 	if did_you_mean[0] != q
				 		did_you_mean = HumanProfile.where("UPPER(name) LIKE ?", "%#{did_you_mean[0].upcase}%")
				 								   .select([:id, :name])
				 								   .limit(1)

				 		results = [{:name =>  "Did you mean? "+did_you_mean[0].name,
									:id => did_you_mean[0].id}]
					end
				elsif type.include? 'TAG'
					s = SpellingBee.new :source_text => 'tags.txt'
					did_you_mean = s.correct q
					if did_you_mean[0] != q
						did_you_mean = GoodReadsGenre.where("UPPER(name) LIKE ?", "%#{did_you_mean[0].upcase}%")
													.select([:id, :name])
													.limit(1)
						results = [{:name =>  "Did you mean? "+did_you_mean[0].name,
									:id => did_you_mean[0].id}]
					end
				else
					s = SpellingBee.new :source_text => 'books.txt'
					did_you_mean = s.correct q
					if did_you_mean[0] != q
						did_you_mean = GoodReadsBook.where("UPPER(title) LIKE ?", "%#{did_you_mean[0].upcase}%")
													.select([:id, :author_name])
													.select("title as name")
													.limit(1)
						results = [{:name =>  "Did you mean? "+did_you_mean[0].name,
									:id => did_you_mean[0].id,
									:author_name => did_you_mean[0].author_name}]
					end
				end

				results
			end

			private
			def self.neo_init
                @neo = Neography::Rest.new
            end

		end
	end
end