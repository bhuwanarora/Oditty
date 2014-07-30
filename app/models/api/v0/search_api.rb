module Api
	module V0
		class SearchApi
			def self.search_books(q, user_id=nil)
				results = []
				neo_init
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "")
				unless user_id.present?
					clause = "START book=node:node_auto_index('indexed_title:"+q+"*') WITH book, toFloat(book.gr_rating) * toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) as weight RETURN book.isbn, ID(book), book.title as name, book.author_name, weight ORDER BY weight DESC LIMIT 10"
				else
					clause = "START book=node:node_auto_index('indexed_title:"+q+"*') WITH book, toFloat(book.gr_rating) * toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) as weight ORDER BY weight DESC OPTIONAL MATCH (book)<-[:MarkAsRead]-(:MarkAsReadNode)<-[m:MarkAsReadAction]-(user:User) WHERE ID(user)="+user_id.to_s+" RETURN book.isbn, ID(book), book.title as name, book.author_name, ID(m) LIMIT 10"
				end
				puts clause.blue.on_red
				if q.length >= 3
					results = @neo.execute_query(clause)["data"]
				end
				results
			end

			def self.search_authors(q)
				results = []
				neo_init
				q = "@"+q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "")
				clause = "START author=node:node_auto_index('indexed_main_author_name:"+q+"*') RETURN author.name LIMIT 10"
				puts clause.blue.on_red
				if q.length >= 4
					results = @neo.execute_query(clause)["data"]
				end
				results
			end

			def search_reader

			end

			def self.search_genres filter
				neo_init
				match_clause = "MATCH (g:Genre) "
				return_clause = "RETURN g.name, ID(g) 
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
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "")
				if (type.include? 'BOOK')
					clause = "START book=node:node_auto_index('indexed_title:"+q+"*') WITH book, toFloat(book.gr_rating) * toFloat(book.gr_ratings_count) * toFloat(book.gr_reviews_count) as weight RETURN book.title as name, book.author_name, ID(book), weight ORDER by weight DESC LIMIT "+count.to_s
					puts clause.blue.on_red
					tester = {:name => "BOOK:"+q.upcase}
				elsif (type.include? 'AUTHOR') || (type.include? 'READER')
					q = "@"+q
					clause = "START author=node:node_auto_index('indexed_main_author_name:"+q+"*') RETURN DISTINCT author.name as name, ID(author) LIMIT "+count.to_s
					puts clause.blue.on_red
					tester = {:name => "HUMAN:"+q.upcase}
				elsif (type.include? 'TAG')
					clause = "START genre=node:node_auto_index('indexed_genre_name:"+q+"*') RETURN genre.name as name, ID(genre) LIMIT "+count.to_s
					puts clause.blue.on_red
					tester = {:name => "TAG:"+q.upcase}
				else
					clause = "START search_node=node:node_auto_index('search_index:"+q+"*') RETURN search_node.title as name, search_node.author_name, ID(search_node) LIMIT "+count.to_s
					puts clause.blue.on_red
					tester = {:name => "RD:"+q.upcase}
				end
				results = @neo.execute_query clause
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