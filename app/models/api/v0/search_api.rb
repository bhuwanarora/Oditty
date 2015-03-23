module Api
	module V0
		class SearchApi
			def self.search_books(q, skip, user_id=nil)
				results = []
				neo_init
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("]", "").gsub("\\", "")
				unless user_id.present?
					clause = "START book=node:node_auto_index('indexed_title:"+q+"*') WITH book RETURN book.isbn as isbn, ID(book) as id, book.title as name, book.author_name as author_name ORDER BY book.total_weight DESC LIMIT 10"
				else
					clause = _search_with_details(q, "*", skip, user_id)
				end
				puts clause.blue.on_red
				if q.length >= 3
					results = @neo.execute_query(clause)
					if results.length == 0
						clause = _search_with_details(q, "~0.7", skip, user_id)
						results = @neo.execute_query(clause)
					end
				end
				results
			end

			def self.search_genres(q, limit)
				results = []
				neo_init
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("]", "").gsub("\\", "") rescue ""
				if q.present?
					clause = "START category=node:node_auto_index('indexed_category_name:" + q + "*') RETURN category.name as name, ID(category) as id ORDER BY category.books_count DESC LIMIT " + limit.to_s
				else
					clause = "MATCH (category:Category{is_root:true}) RETURN category.name as name, ID(category) as id, category.icon as icon ORDER BY category.books_count DESC"
				end
				
				puts clause.blue.on_red
				results = @neo.execute_query clause
				results
			end

			def self.search_authors(q, user_id, genre_id)
				results = []
				neo_init
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("]", "").gsub("\\", "")
				if q.present?
					clause = _get_search_clause_for_author(q, "*", 10)
					puts clause.blue.on_red
					results = @neo.execute_query(clause)
					unless results.present?
						clause = _get_search_clause_for_author(q, "~0.7", 10)
						puts clause.blue.on_red
						results = @neo.execute_query(clause)
					end
				else
					if genre_id.present? && genre_id != "0"
						clause = "MATCH (g:Genre)-[:Belongs_to]->(:Book)<-[:Wrote]-(author:Author) WHERE ID(g)="+genre_id.to_s+" WITH DISTINCT author as author RETURN author.name as name, ID(author) as id LIMIT 10"
						puts clause.blue.on_red
						results = @neo.execute_query(clause)
					else
						clause = "MATCH (author:Author) RETURN author.name as name, ID(author) as id LIMIT 10"
						puts clause.blue.on_red
						results = @neo.execute_query(clause)
					end
				end
				results
			end

			def search_reader

			end

			def self.search(q, count, type)
				neo_init
				count = 10 if count > 10
				clause = self._get_search_clause(q, count, type)
				results = @neo.execute_query clause
				if results["data"].present?
					results
					# results.push tester
				else
					clause = self._get_search_clause(q, count, type, true)
					results = @neo.execute_query clause
					results.merge({:fuzzy => true})
				end
			end

			private
			def self.neo_init
                @neo = Neography::Rest.new
            end

            def self._get_search_clause(q, count, type, fuzzy=nil)
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\\", "").gsub("@", "")

				connector = fuzzy.present? ? "~0.7" : "*"
				
				if (type.include? 'BOOK')
					clause = self._get_search_clause_for_book(q, connector, count)
				elsif type.include? 'AUTHOR'
					clause = self._get_search_clause_for_author(q, connector, count)
				elsif type.include? 'READER'
					clause = self._get_search_clause_for_reader(q, connector, count)
				elsif type.include? 'TAG'
					clause = self._get_search_clause_for_tag(q, connector, count)
				else
					clause = self._get_basic_search_clause(q, connector, count)
				end
				clause
            end

            def self._get_search_clause_for_book(q, connector, count)
				clause = "START book=node:node_auto_index('indexed_title:"+q+connector+"') RETURN book.title as name, book.author_name, ID(book) LIMIT "+count.to_s
				puts clause.blue.on_red
				clause
            end

            def self._get_search_clause_for_author(q, connector, count)
				clause = "START author=node:node_auto_index('indexed_main_author_name:"+q+connector+"') RETURN DISTINCT author.name as name, ID(author) as id LIMIT "+count.to_s
				puts clause.blue.on_red
				clause
            end

            def self._get_search_clause_for_reader(q, connector, count)
				clause = "START user=node:node_auto_index('indexed_user_name:"+q+connector+"') RETURN DISTINCT user.name as name, ID(user) as id LIMIT "+count.to_s
				puts clause.blue.on_red
				clause
            end

            def self._get_search_clause_for_tag(q, connector, count)
            	clause = "START genre=node:node_auto_index('indexed_genre_name:"+q+connector+"') RETURN genre.name as name, ID(genre) as id LIMIT "+count.to_s
				puts clause.blue.on_red
				clause
            end

            def self._get_basic_search_clause(q, connector, count)
				clause = "START search_node=node:node_auto_index('search_index:"+q+connector+"') RETURN CASE WHEN search_node.title IS NULL THEN search_node.name as name ELSE search_node.title as name END, search_node.author_name, ID(search_node) as id, labels(search_node) as labels LIMIT "+count.to_s
				puts clause.blue.on_red
            	clause
            end

            def self._search_with_details(q, connector, skip, user_id)
            	clause = "START book=node:node_auto_index('indexed_title:"+q+connector+"') WITH book ORDER BY book.total_weight DESC OPTIONAL MATCH (book)<-[:MarkAsRead]-(:MarkAsReadNode)<-[m:MarkAsReadAction]-(user:User) WHERE ID(user)="+user_id.to_s+" WITH user, book, m OPTIONAL MATCH (user)-[:RatingAction]->(z:RatingNode{book_id:ID(book), user_id:"+user_id.to_s+"})-[:Rate]->(book) RETURN book.isbn as isbn, ID(book) as id, book.title as name, book.author_name as author_name, ID(m) as status, z.rating as user_rating SKIP "+skip.to_s+" LIMIT 10"
            	clause
            end

		end
	end
end